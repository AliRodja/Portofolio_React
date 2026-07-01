function DashboardButton({

    children,

    onClick

}) {

    return (

        <button

            onClick={onClick}

            className="
                bg-blue-600
                hover:bg-blue-700
                transition
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
            "

        >

            {children}

        </button>

    );

}

export default DashboardButton;