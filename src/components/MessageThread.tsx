"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation, DirectMessage } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock-data";
import { formatDistanceToNow } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { UploadButton } from "@/lib/uploadthing";

import { toast } from "sonner";

interface Props {
  initialConversation: Conversation;
}

export default function MessageThread({ initialConversation }: Props) {
  const [messages, setMessages] = useState(initialConversation.messages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(messageText: string, mediaUrl?: string) {
    // Optimistic update — add message locally right away
    const optimistic: DirectMessage = {
      id: `msg_optimistic_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: messageText,
      mediaUrl,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);

    // TODO: Change the URL below to your real backend endpoint.
    // Example: fetch("https://your-api.com/messages", { method: "POST", ... })
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: initialConversation.id,
        text: messageText,
        mediaUrl,
      }),
    });

    showToast("Mensaje enviado con éxito");
    //toast("Mensaje enviado con éxito");
    
    setSending(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const messageText = text.trim();
    setText("");
    await sendMessage(messageText);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={initialConversation.participant.avatar}
          alt={initialConversation.participant.username}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{initialConversation.participant.username}</p>
          <p className="text-xs text-gray-400">{initialConversation.participant.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
              >
                {msg.mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.mediaUrl} alt="media" className="rounded-lg mb-1 max-w-full" />
                )}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                  {formatDistanceToNow(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
        {/* TODO: Add a file picker here for media messages.
            After picking a file, upload it with UploadThing and pass the returned URL
            as `mediaUrl` in the fetch body above. */}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              sendMessage("Sent a photo", res[0].ufsUrl);
            }
          }}
          onUploadError={(err) => {
            showToast(`Error: ${err.message}`);
          }}
          appearance={{
            button: "!bg-transparent !text-blue-500 hover:!text-blue-700 w-8 h-8 p-0",
            allowedContent: "hidden",
          }}
          content={{
            button: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            ),
          }}
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="text-sm font-semibold text-blue-500 disabled:opacity-40"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
