import BottomNav from "@/components/layout/bottom-nav";
import Header from "@/components/layout/header";
import { AppProvider } from "@/contexts/app-context";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto p-4 md:p-6 pb-24">
          {children}
        </main>
        <BottomNav />
      </div>
    </AppProvider>
  );
}
