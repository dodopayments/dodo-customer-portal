import Background from "@/components/login/background";

const Loginlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-screen w-full">
      <Background />
      {children}
    </main>
  );
};

export default Loginlayout;
