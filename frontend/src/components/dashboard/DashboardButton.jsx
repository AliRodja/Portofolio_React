import { Link } from "react-router-dom";

const variants = {
    primary:
        "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5",
    secondary:
        "bg-slate-100 text-slate-700 hover:bg-slate-200",
};

function DashboardButton({

    children,

    onClick,

    to,

    variant = "primary",

    type = "button",

    disabled = false,

}) {

    const className = `
        inline-flex
        items-center
        justify-center
        gap-2
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-200
        ${variants[variant]}
    `;

    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
            </Link>
        );
    }

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={disabled}

            className={`${className} ${disabled ? "opacity-60 cursor-not-allowed hover:translate-y-0" : ""}`}

        >

            {children}

        </button>

    );

}

export default DashboardButton;