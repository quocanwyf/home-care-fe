import TooltipInfo from './TooltipInfo';

const Icon = ({
  src = '',
  alt = '',
  className,
  contentTooltip = '',
}: {
  src?: string;
  alt?: string;
  className?: string;
  contentTooltip?: string;
}) => {
  return (
    <TooltipInfo content={contentTooltip}>
      <div className={`relative h-8 w-8 cursor-pointer ${className}`}>
        <img src={src} alt={alt} />
      </div>
    </TooltipInfo>
  );
};

export default Icon;
