import { useEffect, useRef, useState } from "react";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
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
};

const log = (...args) => console.log("[WS]", ...args);
const warn = (...args) => console.warn("[WS]", ...args);

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
        log(`🟡 effect RUN  patientId=${patientId} medecinId=${medecinId}`);

        const clearReconnectTimer = () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
                log("⏱ reconnect timer cleared");
            }
        };

        const stopHeartbeat = () => {
            if (heartbeatTimer.current) {
                clearInterval(heartbeatTimer.current);
                heartbeatTimer.current = null;
                log("💓 heartbeat stopped");
            }
        };

        const startHeartbeat = (ws) => {
            stopHeartbeat();
            log(`💓 heartbeat started (every ${HEARTBEAT_INTERVAL}ms)`);
            heartbeatTimer.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    try {
                        ws.send(JSON.stringify({ type: "ping" }));
                        log("💓 ping sent");
                    } catch (e) {
                        warn("💓 ping failed:", e.message);
                    }
                } else {
                    warn(`💓 ping skipped — readyState=${ws.readyState}`);
                }
            }, HEARTBEAT_INTERVAL);
        };

        const connect = () => {
            if (stale) {
                log("🚫 connect() called but generation is stale — aborting");
                return;
            }

            const url = `${WS_BASE}/ws/queue?patientId=${patientIdRef.current}&medecinId=${medecinIdRef.current}`;
            log(`🔌 opening socket  attempt=${reconnectAttempt.current}  url=${url}`);

            const ws = new WebSocket(url);
            socketRef.current = ws;
            log(`📦 readyState after new WebSocket() = ${ws.readyState}`); // expect 0 = CONNECTING

            ws.onopen = () => {
                log(`✅ onopen  stale=${stale}  readyState=${ws.readyState}`);
                if (stale) {
                    log("🚫 stale onopen — closing immediately");
                    ws.close(1000, "stale");
                    return;
                }
                reconnectAttempt.current = 0;
                setState(prev => ({ ...prev, connected: true, loading: false, error: null }));
                startHeartbeat(ws);
            };

            ws.onmessage = (event) => {
                log(`📩 onmessage  stale=${stale}  raw="${event.data}"`);
                if (stale) return;
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "ping" || data.type === "pong") {
                        log("🏓 pong/ping received — ignored");
                        return;
                    }
                    if (data.error) {
                        warn("⚠️ server error payload:", data.error);
                        setState(prev => ({ ...prev, error: data.error, loading: false }));
                        return;
                    }
                    log("📊 queue update:", data);
                    setState({
                        position: data.position,
                        calledNow: data.calledNow ?? false,
                        waitMinutes: data.waitMinutes ?? null,
                        status: data.status ?? null,
                        connected: true,
                        loading: false,
                        error: null,
                    });
                } catch (e) {
                    warn("❌ JSON parse error:", e.message, "raw:", event.data);
                }
            };

            ws.onerror = (e) => {
                warn(`❌ onerror  stale=${stale}  readyState=${ws.readyState}`, e);
                stopHeartbeat();
            };

            ws.onclose = (event) => {
                log(`🔴 onclose  code=${event.code}  reason="${event.reason}"  wasClean=${event.wasClean}  stale=${stale}`);
                stopHeartbeat();
                socketRef.current = null;

                if (stale) {
                    log("🚫 stale onclose — no reconnect");
                    return;
                }

                if (event.code === 1000 && event.reason !== "reconnecting") {
                    log("✋ intentional close — no reconnect");
                    return;
                }

                const attempt = reconnectAttempt.current;
                log(`🔁 scheduling reconnect  attempt=${attempt}/${MAX_RECONNECT_ATTEMPTS}`);

                if (attempt >= MAX_RECONNECT_ATTEMPTS) {
                    warn("💀 max reconnect attempts reached");
                    setState(prev => ({
                        ...prev,
                        connected: false,
                        loading: false,
                        error: "Connexion perdue. Rechargez la page.",
                    }));
                    return;
                }

                const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
                log(`⏳ reconnect in ${delay}ms`);
                reconnectAttempt.current += 1;

                setState(prev => ({ ...prev, connected: false, loading: attempt === 0 }));
                reconnectTimer.current = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            log(`🧹 cleanup  patientId=${patientId}  medecinId=${medecinId}`);
            stale = true;
            clearReconnectTimer();
            stopHeartbeat();

            const ws = socketRef.current;
            if (ws) {
                log(`🔌 closing socket on cleanup  readyState=${ws.readyState}`);
                ws.onclose = null;
                if (ws.readyState === WebSocket.CONNECTING) {
                    log("⏳ socket still CONNECTING — will close on onopen");
                    ws.onopen = () => {
                        log("🔌 deferred close (was CONNECTING during cleanup)");
                        ws.close(1000, "stale");
                    };
                } else {
                    ws.close(1000, "component unmounted");
                }
                socketRef.current = null;
            } else {
                log("🔌 no socket to close");
            }

            setState(INITIAL_STATE);
        };
    }, [patientId, medecinId]);

    return state;
}