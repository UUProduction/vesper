import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ message, index }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        ...styles.row,
        justifyContent: isUser ? "flex-end" : "flex-start",
        animationDelay: `${Math.min(index * 0.03, 0.2)}s`,
      }}
      className="msg-row"
    >
      {!isUser && (
        <div style={styles.assistantDot}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16.5L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
              fill="#c8a97e"
              stroke="none"
            />
          </svg>
        </div>
      )}
      <div
        style={{
          ...styles.bubble,
          ...(isUser ? styles.userBubble : styles.assistantBubble),
        }}
      >
        {isUser ? (
          <span style={styles.userText}>{message.content}</span>
        ) : (
          <div className="message-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <time style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = {
  row: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    animation: "fadeUp 0.22s ease both",
    marginBottom: "8px",
  },
  assistantDot: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "flex-end",
    marginBottom: "18px",
  },
  bubble: {
    maxWidth: "72%",
    padding: "12px 16px",
    borderRadius: "var(--radius-lg)",
    position: "relative",
    wordBreak: "break-word",
  },
  userBubble: {
    background: "var(--user-bubble)",
    border: "1px solid var(--border-strong)",
    borderBottomRightRadius: "4px",
    color: "var(--text)",
  },
  assistantBubble: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderBottomLeftRadius: "4px",
    color: "var(--text)",
  },
  userText: {
    fontSize: "0.95rem",
    lineHeight: 1.55,
    display: "block",
    marginBottom: "4px",
    fontWeight: 300,
  },
  timestamp: {
    display: "block",
    fontSize: "0.68rem",
    color: "var(--text-faint)",
    marginTop: "6px",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.02em",
  },
};
