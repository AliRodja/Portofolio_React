import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import { Outlet } from "react-router-dom";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-100">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-72">

                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-8">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;