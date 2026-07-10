import DashboardCard from "./DashboardCard";
import DashboardButton from "./DashboardButton";

function QuickActions() {
    return (
        <DashboardCard>

            <h2 className="text-xl font-bold mb-6">

                Quick Actions

            </h2>

            <div className="flex flex-col gap-3">

                <DashboardButton to="/dashboard/projects">
                    + New Project
                </DashboardButton>

                <DashboardButton to="/dashboard/skills" variant="secondary">
                    + New Skill
                </DashboardButton>

                <DashboardButton to="/dashboard/messages" variant="secondary">
                    View Messages
                </DashboardButton>

                <DashboardButton to="/dashboard/profile" variant="secondary">
                    Edit Profile
                </DashboardButton>

            </div>

        </DashboardCard>
    );
}

export default QuickActions;
