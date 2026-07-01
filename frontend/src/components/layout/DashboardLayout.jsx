import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import { Outlet } from "react-router-dom";

function DashboardLayout() {

    return (

        <div className="min-h-screen flex bg-slate-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Navbar />

                <main className="flex-1 p-10 overflow-auto">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;