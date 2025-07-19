const GradientText = ({
  content,
  className,
  type = 'default',
  classNameSpan,
}: {
  content: string;
  className?: string;
  type?: string;
  classNameSpan?: string;
}) => {
  return (
    <span
      className={`from-text-linear1 via-text-linear2 to-text-linear3 bg-gradient-to-b bg-clip-text text-transparent ${className} ${type === 'bounce' ? 'animate__animated animate__bounce animate__infinite animate__slow animate__delay-2s' : ''}`}
    >
      <span className={`font-bold ${classNameSpan}`}> {content}</span>
    </span>
  );
};

export default GradientText;
