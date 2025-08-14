const LoadingFallback = ({ content }: { content: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      <span className="ml-2">{content}</span>
    </div>
  );
};

export default LoadingFallback;
