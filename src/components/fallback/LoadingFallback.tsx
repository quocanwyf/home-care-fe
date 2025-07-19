const LoadingFallback = () => {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 text-gray-600">
        <img
          src="/bg-imgage/loading-picture.gif"
          alt="Loading..."
          className="h-1/3 w-1/6"
        />
        <div className="flex items-center justify-center space-x-4">
          <span className="ml-3 animate-pulse text-lg">Đang tải</span>

          <div className="flex space-x-1">
            <div className="bg-text-linear1 h-3 w-3 animate-bounce rounded-full"></div>
            <div
              className="bg-text-linear2 h-3 w-3 animate-bounce rounded-full"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="bg-text-linear3 h-3 w-3 animate-bounce rounded-full"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingFallback;
