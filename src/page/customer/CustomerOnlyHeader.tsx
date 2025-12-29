import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";

function CustomerOnlyHeader() {
  const location = useLocation();
  return (
    <div>
      <Header />
      <div
        className={`w-full h-auto ${!location.pathname.includes("/customer") ? "mt-[17rem]" : "mt-[2.5rem]"}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerOnlyHeader;
