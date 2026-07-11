import { useEffect, useMemo, useState } from "react";
import {
    FaSearch,
    FaTrash,
    FaEnvelopeOpenText,
    FaCheckCircle,
    FaExclamationCircle,
    FaReply,
    FaChevronDown,
} from "react-icons/fa";

import messageService from "../../services/messageService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const fetchMessages = async () => {
        try {
            const response = await messageService.getAll();

            setMessages(response.data);
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to load messages." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function loadMessages() {
            await fetchMessages();
        }

        loadMessages();
    }, []);

    useEffect(() => {
        if (!feedback) return;

        const timer = setTimeout(() => setFeedback(null), 4000);

        return () => clearTimeout(timer);
    }, [feedback]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");

        if (!confirmDelete) return;

        try {
            await messageService.delete(id);

            setFeedback({ type: "success", message: "Message deleted successfully." });

            fetchMessages();
        } catch (error) {
            console.error(error);

            setFeedback({ type: "error", message: "Failed to delete message." });
        }
    };

    const toggleExpand = (id) => {
        setExpandedId((current) => (current === id ? null : id));
    };

    const filteredMessages = useMemo(() => {
        return messages.filter((message) =>
            message.name.toLowerCase().includes(search.toLowerCase()) ||
            message.email.toLowerCase().includes(search.toLowerCase()) ||
            (message.subject || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [messages, search]);

    return (
        <div>

            <PageHeader
                title="Messages"
                subtitle="Messages sent through your portfolio's contact form."
            />

            {feedback && (
                <div
                    className={`
                        flex items-center gap-2 mb-6 px-4 py-3 rounded-xl text-sm font-medium
                        ${feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }
                    `}
                >
                    {feedback.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {feedback.message}
                </div>
            )}

            <DashboardCard>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                    <h2 className="text-lg font-bold">
                        Inbox
                        {!loading && (
                            <span className="ml-2 text-sm font-normal text-slate-400">
                                ({messages.length})
                            </span>
                        )}
                    </h2>

                    <div className="relative sm:w-72">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputClass} pl-9`}
                        />
                    </div>

                </div>

                {loading ? (

                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>

                ) : filteredMessages.length === 0 ? (

                    <div className="flex flex-col items-center py-14 text-slate-400">
                        <FaEnvelopeOpenText className="text-4xl mb-3" />
                        <p>No messages found.</p>
                    </div>

                ) : (

                    <div className="space-y-3">

                        {filteredMessages.map((message) => {
                            const isExpanded = expandedId === message.id;

                            return (

                                <div
                                    key={message.id}
                                    className="rounded-xl border border-slate-100 overflow-hidden"
                                >

                                    <button
                                        onClick={() => toggleExpand(message.id)}
                                        className="w-full flex items-start gap-4 p-4 text-left hover:bg-slate-50 transition"
                                    >

                                        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold shrink-0">
                                            {message.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h3 className="font-semibold text-slate-800 truncate">
                                                    {message.name}
                                                </h3>

                                                <span className="text-xs text-slate-400 shrink-0">
                                                    {formatDate(message.created_at)}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500 truncate">
                                                {message.email}
                                            </p>

                                            <p className="text-sm text-slate-700 font-medium mt-1 truncate">
                                                {message.subject || "(No subject)"}
                                            </p>

                                            {!isExpanded && (
                                                <p className="text-sm text-slate-400 mt-1 truncate">
                                                    {message.message}
                                                </p>
                                            )}

                                        </div>

                                        <FaChevronDown className={`text-slate-400 text-sm mt-2 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />

                                    </button>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 pl-[76px]">

                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-4">
                                                {message.message}
                                            </p>

                                            <div className="flex gap-2 mt-4">

                                                <a
                                                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || ""}`)}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition"
                                                >
                                                    <FaReply className="text-xs" />
                                                    Reply via Email
                                                </a>

                                                <button
                                                    onClick={() => handleDelete(message.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                                                >
                                                    <FaTrash className="text-xs" />
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                </div>

                            );
                        })}

                    </div>

                )}

            </DashboardCard>

        </div>
    );
}

export default Messages;
