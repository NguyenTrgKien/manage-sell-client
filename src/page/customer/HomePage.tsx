import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatboxAI from "../../components/ChatboxAI";
import { useVoucherContext } from "../../contexts/VoucherContext";

function HomePage() {
  const { hasVoucher } = useVoucherContext();

  return (
    <div className="overflow-hidden">
      <Header />
      <div
        className={`${
          hasVoucher ? "mt-[20rem] md:mt-[17rem]" : "mt-[17rem] md:mt-[14rem]"
        } px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem]`}
      >
        <Outlet />
        <ChatboxAI />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
