import DashboardCard from "./DashboardCard";
import DashboardButton from "./DashboardButton";

function QuickActions() {
    return (
        <DashboardCard>

            <h2 className="text-xl font-bold mb-6">

                Quick Actions

            </h2>

            <div className="flex flex-col gap-4">

                <DashboardButton>

                    + New Project

                </DashboardButton>

                <DashboardButton>

                    + New Skill

                </DashboardButton>

                <DashboardButton>

                    View Messages

                </DashboardButton>

            </div>

        </DashboardCard>
    );
}

export default QuickActions;