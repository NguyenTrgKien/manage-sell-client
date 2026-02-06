import Banner from "../../../components/Banner";
import PopularProduct from "../../../components/PopularProduct";
import SectionBestSell from "../../../components/BestSellSection";
import FlashSaleSection from "../../../components/FlashSaleSection";
import CategoriesSection from "../../../components/CategoriesSection";
import SuggestSection from "../../../components/SuggestSection";

function Main() {
  return (
    <>
      <Banner />
      <FlashSaleSection />
      <CategoriesSection />
      <PopularProduct />
      <SectionBestSell />
      <SuggestSection />
    </>
  );
}

export default Main;
