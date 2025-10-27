import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faCartPlus,  faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header() {
    return (  
        <header
            className={`w-full h-[12rem] bg-white px-[12rem]`}
        >
            <div className="flex items-center justify-between h-[30%]">
                <div className="flex items-center gap-[1rem]">
                    <div>Giới thiệu</div>
                    <span className="h-[1.5rem] border border-gray-400"></span>
                    <div className="flex items-center gap-[.2rem]">
                        <span>Kết nối</span>
                        <a href="/">
                            <FontAwesomeIcon icon={faFacebook} className="text-[2rem] text-blue-800"/>
                        </a>
                        <a href="/">
                            <FontAwesomeIcon icon={faInstagram} className="text-[2rem] text-red-400"/>
                        </a>
                    </div>
                </div>
                <nav>
                    <ul className="flex items-center gap-[3rem]">
                        <li className="hover:text-red-500 hover-linear cursor-pointer">
                            <a href="/">
                                Hỗ trợ
                            </a>
                        </li>
                        <li className="hover:text-red-500 hover-linear cursor-pointer">
                            <a href="/">
                                Thông báo
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center gap-[1rem]">
                                <a href="/" className="hover:text-red-500 hover-linear">Đăng nhập</a>/
                                <a href="/" className="hover:text-red-500 hover-linear">Đăng ký</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex items-center justify-between w-full h-[70%]">
                <div className="w-[15%] flex items-center gap-[1rem]">
                    <span className="text-[3.5rem] font-bold">NTK.</span>
                </div>
                <div className="w-[70%] h-[5rem] border rounded-[.5rem] flex items-center">
                    <input 
                        type="text" 
                        className="w-[90%] h-[5rem] rounded-[.5rem] pl-[2rem] outline-none"
                        placeholder="Nhập tìm kiếm"
                    />
                    <button className="w-[10%] h-[5rem] cursor-pointer rounded-tr-[.5rem] rounded-br-[.5rem] flex items-center justify-center bg-red-400 ">
                        <FontAwesomeIcon icon={faSearch} className="text-white"/>
                    </button>
                </div>
                <div className="w-[15%] text-center">
                    <FontAwesomeIcon icon={faCartPlus} className="text-[2.5rem] text-gray-700 cursor-pointer"/>
                </div>
            </div>
        </header>
    );
}

export default Header;