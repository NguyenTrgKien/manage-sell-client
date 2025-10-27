function Sidebar() {
    return (  
        <div className="w-[20%] bg-white px-[1rem] py-[1rem] rounded-[.5rem]">
            <h4 className="font-bold mb-[1rem] pl-[1rem]">Danh mục</h4>
            <div>
                <ul>
                    <li className="flex items-center gap-[1rem] hover:bg-gray-200 cursor-pointer hover-linear py-[.8rem] px-[1.5rem] rounded-[.5rem]">
                        <img 
                            src="https://dayve.vn/wp-content/uploads/2022/11/Ve-quyen-sach-Buoc-16.jpg"         
                            alt="Danh mục"
                            className="w-[3rem] h-[3rem] rounded-[.4rem] object-cover" 
                        />
                        <span>Sách</span>
                    </li>
                    <li className="flex items-center gap-[1rem] hover:bg-gray-200 cursor-pointer hover-linear py-[.8rem] px-[1.5rem] rounded-[.5rem]">
                        <img 
                            src="https://dayve.vn/wp-content/uploads/2022/11/Ve-quyen-sach-Buoc-16.jpg"         
                            alt="Danh mục"
                            className="w-[3rem] h-[3rem] rounded-[.4rem] object-cover" 
                        />
                        <span>Sách</span>
                    </li>
                    <li className="flex items-center gap-[1rem] hover:bg-gray-200 cursor-pointer hover-linear py-[.8rem] px-[1.5rem] rounded-[.5rem]">
                        <img 
                            src="https://dayve.vn/wp-content/uploads/2022/11/Ve-quyen-sach-Buoc-16.jpg"         
                            alt="Danh mục"
                            className="w-[3rem] h-[3rem] rounded-[.4rem] object-cover" 
                        />
                        <span>Sách</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;