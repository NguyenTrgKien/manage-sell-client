import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">403</h1>
      <p className="text-xl mb-6">Bạn không có quyền truy cập trang này</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}

export default Unauthorized;
