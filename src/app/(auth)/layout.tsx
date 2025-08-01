export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[hsl(220,20%,97%)] to-[hsl(210,30%,95%)]">
      {children}
    </div>
  );
}
