import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen w-full bg-white py-12 px-4 sm:px-6 lg:px-8 xl:px-[12rem] text-[1.4rem] md:text-[1.6rem]">
      <div className="mb-10">
        <h1 className="text-[1.6rem] sm:text-[2.2rem] font-bold text-pink-600">
          Giới thiệu
        </h1>
        <p className="text-gray-500 mt-2 ">Về dự án của chúng tôi</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-8 space-y-4">
          <h2 className="font-bold text-gray-800">
            Chào mừng bạn đến với Shop của chúng tôi!
          </h2>
          <p className=" text-gray-600 leading-relaxed">
            Chúng tôi là nền tảng mua sắm quần áo và giày dép trực tuyến, được
            xây dựng với mục tiêu mang đến trải nghiệm mua sắm đơn giản, nhanh
            chóng và đáng tin cậy.
          </p>
          <p className=" text-gray-600 leading-relaxed">
            Với hàng trăm sản phẩm đa dạng từ trang phục hàng ngày đến các mẫu
            thời trang mới nhất, chúng tôi cam kết mang đến cho bạn những sản
            phẩm chất lượng với mức giá hợp lý nhất.
          </p>
        </div>

        {[
          {
            icon: "🏷️",
            title: "Chất lượng đảm bảo",
            desc: "Tất cả sản phẩm đều được kiểm định kỹ trước khi đến tay khách hàng.",
          },
          {
            icon: "🚚",
            title: "Giao hàng nhanh",
            desc: "Đơn hàng được xử lý và giao đến bạn trong thời gian sớm nhất có thể.",
          },
          {
            icon: "🔄",
            title: "Đổi trả dễ dàng",
            desc: "Chính sách đổi trả linh hoạt, hỗ trợ khách hàng 24/7.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-sm p-6 flex gap-4 items-start"
          >
            <span className="text-[2.8rem]">{item.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-800 text-[1.6rem] mb-1">
                {item.title}
              </h3>
              <p className="text-[1.4rem] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-8">
          <h2 className="font-bold text-gray-800 mb-4">Liên hệ</h2>
          <div className="flex flex-wrap gap-6 text-gray-600">
            <span>📧 nguyentrungkien040921@gmail.com</span>
            <span>📞 035 7124 853</span>
            <span>📍 Cần Thơ, Việt Nam</span>
          </div>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-[1.4rem] font-medium transition-colors"
            >
              Mua sắm ngay →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
