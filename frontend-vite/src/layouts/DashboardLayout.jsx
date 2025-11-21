import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-900 text-gray-100">
      <Navbar />
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle />
      </div>
      <main className="mt-20 px-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
