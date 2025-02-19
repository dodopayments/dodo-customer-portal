const AnimatedIconButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <div
      className={`relative bg-bg-secondary p-3 py-[10px] rounded-lg hover:bg-bg-secondary/90 transition-colors ${className}`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <div className="transform transition-transform duration-200 ease-in-out group-hover:scale-125 hover:scale-110">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedIconButton;
