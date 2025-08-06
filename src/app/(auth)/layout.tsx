export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 p-4 bg-background">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
