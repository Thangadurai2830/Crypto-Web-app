import { useEffect, useRef, useState } from "react";
import type { PriceRecord } from "../../types/api";
import { getWsURL } from "../api/config";

const WS_RECONNECT_MS = 5000;

/**
 * Connect to backend /ws?symbol=X for real-time price updates (proxied via Vite in dev).
 * Returns the latest price record received (or null). Parent can merge this into chart data.
 */
export function useWebSocketPrice(symbol: string | null, enabled = true) {
  const [lastUpdate, setLastUpdate] = useState<PriceRecord | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !symbol) {
      setLastUpdate(null);
      return;
    }

    const url = `${getWsURL("/ws")}?symbol=${encodeURIComponent(symbol)}`;

    const connect = () => {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string);
            if (data.error) return;
            setLastUpdate({
              symbol: data.symbol,
              price: data.price,
              volume: data.volume ?? null,
              timestamp: data.timestamp,
            });
          } catch {
            // ignore parse errors
          }
        };
        ws.onclose = () => {
          wsRef.current = null;
          if (enabled && symbol)
            reconnectRef.current = setTimeout(connect, WS_RECONNECT_MS);
        };
        ws.onerror = () => {
          ws.close();
        };
      } catch {
        reconnectRef.current = setTimeout(connect, WS_RECONNECT_MS);
      }
    };

    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setLastUpdate(null);
    };
  }, [symbol, enabled]);

  return { lastUpdate };
}
