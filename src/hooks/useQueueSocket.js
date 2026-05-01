import { useEffect, useRef, useState } from "react";

let globalSocket = null;

export function useQueueSocket(patientId, medecinId) {
    const [state, setState] = useState({
        position: null,
        calledNow: false,
        waitMinutes: null,
        status: null,
        connected: false,
        loading: true,
    });

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        if (!patientId || !medecinId) return;

        const url = `ws://localhost:8080/ws/queue?patientId=${patientId}&medecinId=${medecinId}`;

        console.log("🚀 INIT WS:", url);

        // 🔥 PREVENT MULTIPLE SOCKETS (IMPORTANT FIX)
        if (
            globalSocket &&
            (globalSocket.readyState === WebSocket.OPEN ||
                globalSocket.readyState === WebSocket.CONNECTING)
        ) {
            console.log("⛔ USING EXISTING SOCKET");
            return;
        }

        globalSocket = new WebSocket(url);

        globalSocket.onopen = () => {
            console.log("✅ WS OPENED");

            if (!mounted.current) return;

            setState((s) => ({
                ...s,
                connected: true,
                loading: false,
            }));
        };

        globalSocket.onmessage = (event) => {
            if (!mounted.current) return;

            console.log("📩 MESSAGE:", event.data);

            const data = JSON.parse(event.data);

            setState({
                position: data.position,
                calledNow: data.calledNow,
                waitMinutes: data.waitMinutes,
                status: data.status,
                connected: true,
                loading: false,
            });
        };

        globalSocket.onerror = (e) => {
            console.log("❌ WS ERROR", e);
        };

        globalSocket.onclose = (e) => {
            console.log("⚠️ WS CLOSED", e.code);

            globalSocket = null;
        };

        return () => {
            console.log("🧹 CLEANUP (IGNORED SOCKET CLOSE)");

            mounted.current = false;

            // 🚨 IMPORTANT: DO NOT CLOSE SOCKET IN STRICT MODE DEV
            // only close if truly needed:
            // globalSocket?.close();
        };
    }, [patientId, medecinId]);

    return state;
}