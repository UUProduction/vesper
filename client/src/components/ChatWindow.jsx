import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  return (
    <div ref={containerRef} style={styles.window}>
      <div style={styles.inner}>
        {messages.map((msg, i) => (
          <Message key={msg.id} message={msg} index={i} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
}

const styles = {
  window: {
    flex: 1,
    overflowY: "auto",
    padding: "0 16px",
  },
  inner: {
    maxWidth: "100%",
    margin: "0 auto",
    paddingTop: "24px",
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
};
