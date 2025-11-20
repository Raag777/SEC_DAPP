import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="mt-20 px-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
