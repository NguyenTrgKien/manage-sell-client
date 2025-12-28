import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

function HomePage() {
  return (
    <div className="overflow-hidden">
      <Header />
      <div className="mt-[15rem] md:mt-[17rem] lg:mt-[17rem] xl:mt-[17rem] px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem]">
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;