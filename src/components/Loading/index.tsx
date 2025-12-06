function Loading() {
  return (
    <div className="fixed w-full h-[100vh] top-0 left-0 flex items-center justify-center bg-[#4a4a4a52] z-[999]"> 
      <div className=" flex justify-center items-center space-x-2 p-4">
        <div className="animate-bounce w-4 h-4 bg-blue-500 rounded-full"></div>
        <div
          className="animate-bounce w-4 h-4 bg-blue-500 rounded-full"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="animate-bounce w-4 h-4 bg-blue-500 rounded-full"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
}

export default Loading;
