import Banner from "../../components/Banner";
import FeatureProduct from "../../components/FeatureProduct";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

function HomePage() {
    return (  
        <div className="overflow-hidden">
            <Header/>
            <div className="flex gap-[2rem] px-[12rem] mt-[2rem]">
                <Sidebar/>
                <div className="w-[80%]">
                    <Banner/>
                    <FeatureProduct/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;