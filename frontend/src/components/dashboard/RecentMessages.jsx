import DashboardCard from "./DashboardCard";

function RecentMessages({ messages }) {
    return (
        <DashboardCard>

            <h2 className="text-xl font-bold mb-6">

                Recent Messages

            </h2>

            {messages.length === 0 ? (

                <p className="text-slate-500">

                    No messages available.

                </p>

            ) : (

                messages.map((message) => (

                    <div
                        key={message.id}
                        className="py-4 border-b last:border-none"
                    >

                        <h3 className="font-semibold">

                            {message.name}

                        </h3>

                        <p className="text-sm text-slate-500">

                            {message.email}

                        </p>

                        <p className="mt-2 text-slate-700">

                            {message.subject}

                        </p>

                    </div>

                ))

            )}

        </DashboardCard>
    );
}

export default RecentMessages;