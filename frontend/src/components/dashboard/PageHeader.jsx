function PageHeader({

    title,

    subtitle,

    action

}) {

    return (

        <div
            className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-8
            "
        >

            <div className="min-w-0">

                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        lg:text-4xl
                        font-bold
                        truncate
                    "
                >

                    {title}

                </h1>

                <p
                    className="
                        text-slate-500
                        mt-2
                    "
                >

                    {subtitle}

                </p>

            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}

        </div>

    );

}

export default PageHeader;