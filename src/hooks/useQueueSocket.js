import { useEffect, useRef, useState } from "react";

const WS_BASE = import.meta.env.VITE_WS_URL;
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];
const HEARTBEAT_INTERVAL = 25000;
const MAX_RECONNECT_ATTEMPTS = 10;

const INITIAL_STATE = {
    position: null,
    calledNow: false,
    waitMinutes: null,
    status: null,
    connected: false,
    loading: true,
    error: null,
    message: null,   // ← ajouté
};

const log = (...args) => console.log("[WS]", ...args);
const warn = (...args) => console.warn("[WS]", ...args);

// ── Calcul du message lisible selon status + position ──
const computeMessage = (data) => {
    const { status, position, calledNow } = data;

    if (calledNow || status === "EN_COURS") {
        return "🟢 C'est votre tour ! Entrez chez le médecin.";
    }
    if (status === "ON_HOLD") {
        return "⏸ Vous êtes en pause. Attendez d'être rappelé.";
    }
    if (status === "PAID" || status === "EN_ATTENTE") {
        if (position === 0) {
            return "⏳ Vous êtes le prochain dans la file.";
        }
        if (position > 0) {
            return `⏳ ${position} patient${position > 1 ? "s" : ""} avant vous.`;
        }
    }
    if (status === "ANNULE") {
        return "❌ Votre rendez-vous a été annulé.";
    }
    if (status === "COMPLETED") {
        return "✅ Votre consultation est terminée.";
    }
    return "Connecté à la file d'attente.";
};

export function useQueueSocket(patientId, medecinId) {
    const [state, setState] = useState(INITIAL_STATE);

    const socketRef = useRef(null);
    const reconnectAttempt = useRef(0);
    const reconnectTimer = useRef(null);
    const heartbeatTimer = useRef(null);
    const patientIdRef = useRef(patientId);
    const medecinIdRef = useRef(medecinId);
    patientIdRef.current = patientId;
    medecinIdRef.current = medecinId;

    useEffect(() => {
        if (!patientId || !medecinId) {
            log("⏭ skipped — no patientId or medecinId");
            setState(INITIAL_STATE);
            return;
        }

        let stale = false;

        const clearReconnectTimer = () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
        };

        const stopHeartbeat = () => {
            if (heartbeatTimer.current) {
                clearInterval(heartbeatTimer.current);
                heartbeatTimer.current = null;
            }
        };

        const startHeartbeat = (ws) => {
            stopHeartbeat();
            heartbeatTimer.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    try { ws.send(JSON.stringify({ type: "ping" })); }
                    catch (e) { warn("💓 ping failed:", e.message); }
                }
            }, HEARTBEAT_INTERVAL);
        };

        const connect = () => {
            if (stale) return;

            const url = `${WS_BASE}/ws/queue?patientId=${patientIdRef.current}&medecinId=${medecinIdRef.current}`;
            log(`🔌 opening socket attempt=${reconnectAttempt.current}`);

            const ws = new WebSocket(url);
            socketRef.current = ws;

            ws.onopen = () => {
                if (stale) { ws.close(1000, "stale"); return; }
                reconnectAttempt.current = 0;
                setState(prev => ({ ...prev, connected: true, loading: false, error: null }));
                startHeartbeat(ws);
            };

            ws.onmessage = (event) => {
                if (stale) return;
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "ping" || data.type === "pong") return;

                    if (data.error) {
                        setState(prev => ({ ...prev, error: data.error, loading: false }));
                        return;
                    }

                    // ── Calcul du message ici ──
                    const message = computeMessage(data);

                    setState({
                        position: data.position,
                        calledNow: data.calledNow ?? false,
                        waitMinutes: data.waitMinutes ?? null,
                        status: data.status ?? null,
                        connected: true,
                        loading: false,
                        error: null,
                        message,     // ← ajouté
                    });
                } catch (e) {
                    warn("❌ JSON parse error:", e.message);
                }
            };

            ws.onerror = () => { stopHeartbeat(); };

            ws.onclose = (event) => {
                stopHeartbeat();
                socketRef.current = null;

                if (stale) return;
                if (event.code === 1000 && event.reason !== "reconnecting") return;

                const attempt = reconnectAttempt.current;
                if (attempt >= MAX_RECONNECT_ATTEMPTS) {
                    setState(prev => ({
                        ...prev,
                        connected: false,
                        loading: false,
                        error: "Connexion perdue. Rechargez la page.",
                    }));
                    return;
                }

                const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
                reconnectAttempt.current += 1;
                setState(prev => ({ ...prev, connected: false, loading: attempt === 0 }));
                reconnectTimer.current = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            stale = true;
            clearReconnectTimer();
            stopHeartbeat();

            const ws = socketRef.current;
            if (ws) {
                ws.onclose = null;
                if (ws.readyState === WebSocket.CONNECTING) {
                    ws.onopen = () => ws.close(1000, "stale");
                } else {
                    ws.close(1000, "component unmounted");
                }
                socketRef.current = null;
            }

            setState(INITIAL_STATE);
        };
    }, [patientId, medecinId]);

    return state;
}
