import { Route, Routes } from "react-router-dom";
import HeaderDashboard from "./components/HeaderDashboard";
import SidebarDashboard from "./components/SidebarDashboard";
import dashboardRoute from "../../routers/dashboardRoutes";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <HeaderDashboard />
      <div className="flex">
        <SidebarDashboard />
        <main className="flex-1 ml-[15%] p-[3rem] mt-[6rem]">
          <Routes>
            {dashboardRoute.map((route, index) => {
              const Element = route.element;
              return (
                <Route key={index} path={route.path} element={<Element />} />
              );
            })}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
