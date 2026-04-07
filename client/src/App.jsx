import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBar from "./components/InputBar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content:
    "Vesper. Ask me anything — I'll give you a straight answer.\n\nCode, concepts, opinions, rabbit holes. What do you need?",
  timestamp: Date.now(),
};

export default function App() {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;
      setError(null);

      const userMsg = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome" || m.role !== "assistant")
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      // Always include the welcome as first assistant message context
      const apiMessages = messages
        .concat(userMsg)
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error ${res.status}`);
        }

        const data = await res.json();

        const assistantMsg = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [messages, loading]
  );

  const handleClear = () => {
    setMessages([WELCOME]);
    setError(null);
  };

  return (
    <div style={styles.shell}>
      <Header onClear={handleClear} />
      <main style={styles.main}>
        <ChatWindow messages={messages} loading={loading} />
      </main>
      <footer style={styles.footer}>
        {error && (
          <div style={styles.errorBanner}>
            <span style={styles.errorIcon}>⚠</span>
            {error}
            <button style={styles.errorDismiss} onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}
        <InputBar onSend={sendMessage} loading={loading} />
      </footer>
    </div>
  );
}

function Header({ onClear }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <Avatar />
        <div>
          <div style={styles.headerName}>Vesper</div>
          <div style={styles.headerSub}>Direct answers. No filler.</div>
        </div>
      </div>
      <button style={styles.clearBtn} onClick={onClear} title="New conversation">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-4.6"/>
        </svg>
        New chat
      </button>
    </header>
  );
}

function Avatar() {
  return (
    <div style={styles.avatar}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16.5L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
          fill="none"
          stroke="#c8a97e"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    background: "var(--bg)",
    maxWidth: "820px",
    margin: "0 auto",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1a1a28 0%, #252535 100%)",
    border: "1px solid var(--border-strong)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerName: {
    fontFamily: "var(--font-display)",
    fontSize: "1.15rem",
    color: "var(--text)",
    letterSpacing: "0.01em",
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: "0.72rem",
    color: "var(--text-faint)",
    fontWeight: 300,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginTop: "1px",
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "1px solid var(--border-strong)",
    color: "var(--text-muted)",
    fontSize: "0.8rem",
    padding: "7px 12px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    transition: "all var(--transition)",
    letterSpacing: "0.02em",
  },
  main: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  footer: {
    flexShrink: 0,
    borderTop: "1px solid var(--border)",
    background: "var(--surface)",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "rgba(224, 112, 112, 0.08)",
    borderBottom: "1px solid rgba(224, 112, 112, 0.2)",
    color: "var(--danger)",
    fontSize: "0.85rem",
    fontFamily: "var(--font-mono)",
  },
  errorIcon: {
    fontSize: "0.9rem",
  },
  errorDismiss: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "var(--danger)",
    cursor: "pointer",
    fontSize: "0.8rem",
    padding: "2px 6px",
    opacity: 0.7,
  },
};
