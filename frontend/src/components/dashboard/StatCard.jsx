import { Link } from "react-router-dom";

function StatCard({ title, value, icon: Icon, accent = "bg-blue-50 text-blue-600", to }) {

    const content = (
        <>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${accent}`}>
                {Icon && <Icon />}
            </div>

            <h2 className="text-3xl font-bold mt-4">
                {value}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
                {title}
            </p>
        </>
    );

    const className = "bg-white rounded-2xl shadow-sm p-5 border border-slate-200 transition hover:shadow-md hover:-translate-y-0.5 block";

    if (to) {
        return (
            <Link to={to} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <div className={className}>
            {content}
        </div>
    );
}

export default StatCard;
