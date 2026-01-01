import {
  faAngleDown,
  faAngleUp,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { menuItems } from "../../../../constants/menuItems";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SidebarDashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<{
    id: number | null;
    subId?: number;
  }>(() => {
    const saved = sessionStorage.getItem("sidebarSelected");
    return saved ? JSON.parse(saved) : { id: 1, subId: undefined };
  });

  const handleSelectItem = (item: any) => {
    if (item.children) {
      const newState = {
        id: selectedMenuItem?.id === item.id ? null : item.id,
      };
      setSelectedMenuItem(newState);
      sessionStorage.setItem("sidebarSelected", JSON.stringify(newState));
    } else {
      const newState = { id: item.id };
      setSelectedMenuItem(newState);
      sessionStorage.setItem("sidebarSelected", JSON.stringify(newState));
      navigate(`/dashboard/${item.path}`);
    }
  };

  const navigate = useNavigate();
  if (menuItems.length == 0) {
    return null;
  }

  const handleNavigateChild = (parentId: number, child: any) => {
    const newState = { id: parentId, subId: child.id };
    setSelectedMenuItem(newState);
    sessionStorage.setItem("sidebarSelected", JSON.stringify(newState));
    navigate(`/dashboard/${child.path}`);
  };

  if (menuItems.length === 0) return null;

  return (
    <aside className="fixed top-[6rem] left-0 w-[15%] h-[calc(100vh-6rem)] bg-white shadow-xl overflow-auto hide-scrollbar border-r border-gray-200">
      <div className="p-[2rem] border-b border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-[2rem] py-[1.2rem] rounded-xl text-center shadow-lg">
          <h3 className="text-white font-bold text-[1.6rem]">👨‍💼 Admin Panel</h3>
        </div>
      </div>

      <nav className="p-[1.6rem]">
        <div className="space-y-[0.8rem]">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                className={`w-full flex items-center gap-[1.2rem] p-[1.2rem] rounded-xl text-left transition-all duration-100 group ${
                  selectedMenuItem?.id === item.id
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-amber-900 shadow-md border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                }`}
                onClick={() => handleSelectItem(item)}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="font-medium text-[1.4rem]">
                    {item.label}
                  </span>
                  {item?.children && (
                    <FontAwesomeIcon
                      icon={
                        selectedMenuItem?.id === item.id
                          ? faAngleUp
                          : faAngleDown
                      }
                    />
                  )}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  selectedMenuItem?.id === item.id
                    ? "max-h-[20rem] pb-2"
                    : "max-h-0"
                }`}
              >
                {item?.children?.map((child) => {
                  return (
                    <div key={child.id} className="pl-[1rem] pt-4">
                      <button
                        key={child.id}
                        onClick={() => handleNavigateChild(item.id, child)}
                        className={`w-full text-left text-[1.4rem] ${selectedMenuItem.subId === child.id ? "bg-gray-100 text-gray-900 shadow-sm" : ""} text-gray-600 px-[1rem] py-[1.2rem] rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm`}
                      >
                        {child.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[3rem] pt-[2rem] border-t border-gray-200">
          <button className="w-full flex items-center gap-[1.2rem] p-[1.2rem] rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 group">
            <div className="w-[3.2rem] h-[3.2rem] rounded-lg flex items-center justify-center transition-all duration-200 bg-red-100 text-red-500 group-hover:bg-red-200">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-[1.4rem]" />
            </div>
            <span className="font-medium text-[1.4rem]">Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarDashboard;
