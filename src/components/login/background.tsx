const Background = () => {
  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0 z-[1] bg-cover bg-center bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,rgba(0,234,255,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 z-0 bg-bg-primary bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(0,37,206,0.3),rgba(255,255,255,0))]" />
    </div>
  );
};

export default Background;
