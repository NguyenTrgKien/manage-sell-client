import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

function CustomerLayout() {
  return (
    <div className="overflow-hidden">
      <Header />
      <div className="flex gap-[2rem] px-[12rem] mt-[18rem]">
        <Sidebar />
        <div className="w-[80%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;
