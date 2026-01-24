import { Link } from "react-router-dom";

function Logo({ isFooter = false }: { isFooter?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-pink-500 to-red-600 text-white w-14 h-14 md:w-[3.5rem] md:h-[3.5rem] rounded-lg flex items-center justify-center font-bold text-lg md:text-xl">
        K
      </div>
      <div className="block">
        <div className="text-[1.8rem] md:text-[2.2rem] font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          NTK.
        </div>
        <div
          className={`text-[1rem] md:text-[1.2rem] ${isFooter ? "text-white" : "text-gray-500"}  -mt-1`}
        >
          Style Your Life
        </div>
      </div>
    </Link>
  );
}

export default Logo;
