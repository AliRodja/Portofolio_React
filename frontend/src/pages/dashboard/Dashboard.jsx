import { useEffect, useState } from "react";

import dashboardService from "../../services/dashboardService";

import PageHeader from "../../components/dashboard/PageHeader";
import DashboardButton from "../../components/dashboard/DashboardButton";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import ActivityCard from "../../components/dashboard/ActivityCard";
import RecentMessages from "../../components/dashboard/RecentMessages";

function Dashboard() {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const data = await dashboardService.getOverview();
                setOverview(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOverview();
    }, []);

    if (!overview) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <PageHeader
                title="Dashboard Overview"
                subtitle="Welcome back 👋"
                action={
                    <DashboardButton>
                        + Add Project
                    </DashboardButton>
                }
            />

            <div className="grid lg:grid-cols-4 gap-6">

                <StatCard
                    title="Projects"
                    value={overview.totalProjects}
                />

                <StatCard
                    title="Skills"
                    value={overview.totalSkills}
                />

                <StatCard
                    title="Certificates"
                    value={overview.totalCertificates}
                />

                <StatCard
                    title="Messages"
                    value={overview.totalMessages}
                />

            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-8">

                <div className="lg:col-span-2">

                    <RecentMessages
                        messages={overview.latestMessages}
                    />

                </div>

                <ActivityCard
                    overview={overview}
                />

            </div>

            <div className="mt-8">

                <QuickActions />

            </div>

        </div>
    );
}

export default Dashboard;