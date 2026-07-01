function DashboardTable({

    headers,

    children

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                overflow-hidden
            "
        >

            <table className="w-full">

                <thead>

                    <tr
                        className="
                            bg-slate-100
                        "
                    >

                        {

                            headers.map(

                                (header) => (

                                    <th

                                        key={header}

                                        className="
                                            text-left
                                            p-5
                                        "
                                    >

                                        {header}

                                    </th>

                                )

                            )

                        }

                    </tr>

                </thead>

                <tbody>

                    {children}

                </tbody>

            </table>

        </div>

    );

}

export default DashboardTable;