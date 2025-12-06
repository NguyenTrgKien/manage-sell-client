import { Outlet } from "react-router-dom";

function CustomerNoSidebar() {
  return (
    <div className="overflow-hidden">
      <Outlet />
    </div>
  );
}

export default CustomerNoSidebar;
