import React, { useState, useRef, useEffect } from "react";

export default function InputBar({ onSend, loading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    resize();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const canSend = value.trim().length > 0 && !loading;

  return (
    <div style={styles.bar}>
      <div style={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={1}
          disabled={loading}
          style={{
            ...styles.textarea,
            opacity: loading ? 0.5 : 1,
          }}
        />
        <button
          onClick={submit}
          disabled={!canSend}
          aria-label="Send"
          style={{
            ...styles.sendBtn,
            background: canSend
              ? "var(--accent)"
              : "var(--surface-3)",
            color: canSend ? "#0c0c0e" : "var(--text-faint)",
            cursor: canSend ? "pointer" : "not-allowed",
            transform: canSend ? "scale(1)" : "scale(0.95)",
          }}
        >
          {loading ? (
            <span style={styles.loadingRing} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
      <div style={styles.hint}>
        <kbd style={styles.kbd}>⏎</kbd> send · <kbd style={styles.kbd}>⇧⏎</kbd> newline
      </div>
    </div>
  );
}

const styles = {
  bar: {
    padding: "12px 16px 14px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    background: "var(--surface-2)",
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--radius)",
    padding: "10px 12px",
    transition: "border-color var(--transition)",
  },
  textarea: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    fontWeight: 300,
    lineHeight: 1.55,
    resize: "none",
    maxHeight: "160px",
    overflowY: "auto",
    padding: 0,
  },
  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all var(--transition)",
    fontWeight: 600,
  },
  loadingRing: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(12,12,14,0.3)",
    borderTopColor: "#0c0c0e",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  hint: {
    fontSize: "0.7rem",
    color: "var(--text-faint)",
    textAlign: "center",
    marginTop: "8px",
    letterSpacing: "0.03em",
  },
  kbd: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    background: "var(--surface-3)",
    border: "1px solid var(--border-strong)",
    borderRadius: "3px",
    padding: "1px 4px",
  },
};
