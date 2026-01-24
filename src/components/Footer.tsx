import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faInstagram,
  faSquareFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-[12rem] py-8 bg-gray-700 text-white mt-20">
      <div className="flex items-start sm:items-center justify-between gap-4 pb-5 border-b border-b-gray-400 mb-8">
        <Logo isFooter={true} />

        <div className="flex items-center gap-3">
          <Link
            to="https://www.facebook.com/profile.php?id=100029756161612&locale=vi_VN"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FontAwesomeIcon
              icon={faSquareFacebook}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary transition-colors shadow-app-footer"
            />
          </Link>
          <Link
            to="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary transition-colors shadow-app-footer"
            />
          </Link>
          <Link to="#" aria-label="Twitter">
            <FontAwesomeIcon
              icon={faTwitter}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary transition-colors shadow-app-footer"
            />
          </Link>
          <Link to="#" aria-label="Google">
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-white text-[2rem] md:text-[3rem] hover:text-primary transition-colors shadow-app-footer"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold mb-3">Về Shop</h3>
          <p className="text-gray-300 text-[1.4rem]">
            Chuyên cung cấp thời trang chất lượng cao với giá cả hợp lý
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold mb-3">Hỗ trợ khách hàng</h3>
          <ul className="text-gray-300 space-y-4 text-[1.4rem]">
            <li>
              <Link to="/huong-dan-mua-hang" className="hover:text-primary">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link to="/chinh-sach-doi-tra" className="hover:text-primary">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link to="/phuong-thuc-thanh-toan" className="hover:text-primary">
                Phương thức thanh toán
              </Link>
            </li>
            <li>
              <Link to="/van-chuyen" className="hover:text-primary">
                Vận chuyển
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold mb-3">Chính sách</h3>
          <ul className="text-gray-300 space-y-4 text-[1.4rem]">
            <li>
              <Link to="/chinh-sach-bao-mat" className="hover:text-primary">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/dieu-khoan-su-dung" className="hover:text-primary">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="/quy-dinh-chung" className="hover:text-primary">
                Quy định chung
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold mb-3 ">Liên hệ</h3>
          <p className="text-gray-300 text-[1.4rem]">
            <strong>Hotline:</strong> 0357 124 853
          </p>
          <p className="text-gray-300 text-[1.4rem]">
            <strong>Email:</strong> nguyentrungkien040921@gmail.com
          </p>
          <p className="text-gray-300 text-[1.4rem]">
            <strong>Giờ làm việc:</strong> 8:00 - 22:00
          </p>
        </div>
      </div>

      <div className=" mt-8 pt-6 border-t border-gray-400 text-center text-gray-300 text-[1.4rem]">
        <p>© 2025 Shop Quần Áo. Được phát triển bởi Nguyễn Trung Kiên</p>
      </div>
    </footer>
  );
}

export default Footer;
