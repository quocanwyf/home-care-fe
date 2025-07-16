const GradientText = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <span
      className={`from-text-linear1 via-text-linear2 to-text-linear3 bg-gradient-to-b bg-clip-text text-transparent ${className}`}
    >
      <span className="font-bold"> {content}</span>
    </span>
  );
};

export default GradientText;
