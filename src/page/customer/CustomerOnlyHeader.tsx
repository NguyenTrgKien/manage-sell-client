import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useVoucherContext } from "../../contexts/VoucherContext";

function CustomerOnlyHeader() {
  const location = useLocation();
  const { hasVoucher } = useVoucherContext();

  return (
    <div>
      <Header />
      <div
        className={`w-full h-auto ${
          !location.pathname.includes("/customer")
            ? hasVoucher
              ? "mt-[20rem] md:mt-[17rem]"
              : "mt-[17rem] md:mt-[14rem]"
            : "mt-[2.5rem]"
        }`}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default CustomerOnlyHeader;
