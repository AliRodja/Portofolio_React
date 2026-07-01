function DashboardCard({

    children

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-slate-200
                p-6
            "
        >

            {children}

        </div>

    );

}

export default DashboardCard;