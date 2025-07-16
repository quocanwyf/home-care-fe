const Overlay = ({ className }: { className?: string }) => {
  return (
    <div
      className={`bg-overlay-slider fixed inset-0 z-10 h-[36vh] ${className}`}
    ></div>
  );
};

export default Overlay;
