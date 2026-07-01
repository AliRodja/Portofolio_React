import DashboardCard from "./DashboardCard";

function ActivityCard({ overview }) {
    return (
        <DashboardCard>

            <h2 className="text-xl font-bold mb-6">

                Portfolio Summary

            </h2>

            <div className="space-y-5">

                <div className="flex justify-between">

                    <span>Projects</span>

                    <strong>{overview.totalProjects}</strong>

                </div>

                <div className="flex justify-between">

                    <span>Skills</span>

                    <strong>{overview.totalSkills}</strong>

                </div>

                <div className="flex justify-between">

                    <span>Experience</span>

                    <strong>{overview.totalExperiences}</strong>

                </div>

                <div className="flex justify-between">

                    <span>Certificates</span>

                    <strong>{overview.totalCertificates}</strong>

                </div>

            </div>

        </DashboardCard>
    );
}

export default ActivityCard;