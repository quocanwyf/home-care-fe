import { useAppNavigate } from '@/hooks/common/useAppNavigate';

const Logo = ({
  className,
  classNameImg,
}: {
  className?: string;
  classNameImg?: string;
}) => {
  const navigateTo = useAppNavigate();

  return (
    <div
      className={`from-text-linear1 via-text-linear2 to-text-linear3 flex h-10 w-10 cursor-pointer items-center rounded-full bg-gradient-to-l ${className}`}
      onClick={() => {
        navigateTo('/', {
          delay: 1000,
          toast: {
            message: 'Navigating to home...',
            type: 'success',
          },
        });
      }}
    >
      <img
        src="/icon-image/shell.png"
        alt="Logo"
        className={`mx-auto h-4 w-4 rounded-full object-cover ${classNameImg}`}
      />
    </div>
  );
};

export default Logo;
