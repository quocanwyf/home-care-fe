const LoadingFallback = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-gray-600">
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
      <span className="ml-3 animate-pulse text-lg">Đang tải...</span>
    </div>
  );
};

export default LoadingFallback;
