
import BottomNav from "@/components/layout/bottom-nav";
import Header from "@/components/layout/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto p-3 md:p-6 pt-4 md:pt-6 pb-20 md:pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
