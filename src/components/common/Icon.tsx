const AvatarMenu = ({
  src = '/icon-image/avatar-1.png',
  alt = 'avatar',
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) => {
  return (
    <div className={`relative h-8 w-8 cursor-pointer ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
};

export default AvatarMenu;
