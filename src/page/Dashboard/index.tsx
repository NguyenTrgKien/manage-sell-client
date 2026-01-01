import { Outlet } from "react-router-dom";
import HeaderDashboard from "./components/HeaderDashboard";
import SidebarDashboard from "./components/SidebarDashboard";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <HeaderDashboard />
      <div className="flex">
        <SidebarDashboard />
        <main className="flex-1 ml-[15%] p-[2rem] mt-[6rem]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
