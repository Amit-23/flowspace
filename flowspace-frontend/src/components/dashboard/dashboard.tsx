import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsCard from "../taskstatuscards/projectscard/project";
import TasksCard from "../taskstatuscards/taskcard/taskcard";
import CompletedCard from "../taskstatuscards/completedtaskscard/completedtaskcard";
import OverdueCard from "../taskstatuscards/overduecard/overduecard";

type DashboardData = {
  email: string;
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
};
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    getDashboard();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {dashboardData && (
            <p className="text-gray-600 mt-1">
              Welcome back, {dashboardData.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData && (
            <>
              <ProjectsCard count={dashboardData.total_projects ?? 0} />
              <TasksCard count={dashboardData.total_tasks ?? 0} />
              <CompletedCard count={dashboardData.completed_tasks ?? 0} />
              <OverdueCard count={dashboardData.overdue_tasks ?? 0} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
