import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatboxAI from "../../components/ChatboxAI";

function HomePage() {
  return (
    <div className="overflow-hidden">
      <Header />
      <div className="mt-[20rem] md:mt-[17rem] px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem]">
        <Outlet />
        <ChatboxAI />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
