import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function RecentMessages({ messages }) {
    return (
        <DashboardCard>

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold">
                    Recent Messages
                </h2>

                <Link
                    to="/dashboard/messages"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    View all
                </Link>

            </div>

            {messages.length === 0 ? (

                <p className="text-slate-500 text-sm">

                    No messages available.

                </p>

            ) : (

                messages.map((message) => (

                    <Link
                        to="/dashboard/messages"
                        key={message.id}
                        className="flex gap-3 py-4 border-b last:border-none hover:bg-slate-50 -mx-2 px-2 rounded-lg transition"
                    >

                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm shrink-0">
                            {message.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-2">

                                <h3 className="font-semibold truncate">
                                    {message.name}
                                </h3>

                                <span className="text-xs text-slate-400 shrink-0">
                                    {formatDate(message.created_at)}
                                </span>

                            </div>

                            <p className="text-sm text-slate-500 truncate">
                                {message.email}
                            </p>

                            <p className="mt-1 text-sm text-slate-700 truncate">
                                {message.subject}
                            </p>

                        </div>

                    </Link>

                ))

            )}

        </DashboardCard>
    );
}

export default RecentMessages;
