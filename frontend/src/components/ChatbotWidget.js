"use client";
import { useState } from "react";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999,
            }}
        >
            {/* Tombol Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                >
                    💬
                </button>
            )}

            {/* Chatbox */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "350px",
                        height: "500px",
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "#2563eb",
                            color: "white",
                            padding: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>Chatbot</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "white",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            ✖
                        </button>
                    </div>

                    {/* Iframe Botpress */}
                    <iframe
                        src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/20/00/20250820005146-DK0ZBCFD.json"
                        style={{ width: "100%", height: "calc(100% - 50px)", border: "none", display: "block" }}
                    />
                </div>
            )}
        </div>
    );
}
