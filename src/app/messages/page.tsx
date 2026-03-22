"use client";

import { useEffect, useState } from "react";
import { Conversation } from "@/lib/types";
import ConversationList from "@/components/ConversationList";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Change the URL below to your real backend endpoint.
    // Example: fetch("https://your-api.com/messages")

    //hecho

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, []);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading messages…</div>;

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-3.5rem)] lg:h-screen border-x border-gray-200 bg-white">
      <ConversationList conversations={conversations} />
    </div>
  );
}
