import { useEffect, useState } from "react";

import {
    FaFolderOpen,
    FaCode,
    FaBriefcase,
    FaGraduationCap,
    FaCertificate,
    FaEnvelope,
} from "react-icons/fa";
import { HiOutlineHandRaised } from "react-icons/hi2";

import dashboardService from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardButton from "../../components/dashboard/DashboardButton";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentMessages from "../../components/dashboard/RecentMessages";

const stats = [
    { key: "totalProjects", title: "Projects", icon: FaFolderOpen, accent: "bg-blue-50 text-blue-600", to: "/dashboard/projects" },
    { key: "totalSkills", title: "Skills", icon: FaCode, accent: "bg-cyan-50 text-cyan-600", to: "/dashboard/skills" },
    { key: "totalExperiences", title: "Experience", icon: FaBriefcase, accent: "bg-violet-50 text-violet-600", to: "/dashboard/experience" },
    { key: "totalEducations", title: "Education", icon: FaGraduationCap, accent: "bg-amber-50 text-amber-600", to: "/dashboard/education" },
    { key: "totalCertificates", title: "Certificates", icon: FaCertificate, accent: "bg-emerald-50 text-emerald-600", to: "/dashboard/certificates" },
    { key: "totalMessages", title: "Messages", icon: FaEnvelope, accent: "bg-rose-50 text-rose-600", to: "/dashboard/messages" },
];

function Dashboard() {
    const { user } = useAuth();
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const data = await dashboardService.getOverview();
                setOverview(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            }
        };

        fetchOverview();
    }, []);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-sm">
                {error}
            </div>
        );
    }

    if (!overview) {
        return (
            <div>
                <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse mb-8" />

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>

            <PageHeader
                title="Dashboard"
                subtitle={
                    <span className="inline-flex items-center gap-1.5">
                        {`Welcome back, ${user?.username || "Admin"}`}
                        <HiOutlineHandRaised className="text-blue-500" />
                    </span>
                }
                action={
                    <DashboardButton to="/dashboard/projects">
                        + Add Project
                    </DashboardButton>
                }
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

                {stats.map((stat) => (
                    <StatCard
                        key={stat.key}
                        title={stat.title}
                        value={overview[stat.key]}
                        icon={stat.icon}
                        accent={stat.accent}
                        to={stat.to}
                    />
                ))}

            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-6">

                <div className="lg:col-span-2">

                    <RecentMessages
                        messages={overview.latestMessages}
                    />

                </div>

                <QuickActions />

            </div>

        </div>
    );
}

export default Dashboard;
