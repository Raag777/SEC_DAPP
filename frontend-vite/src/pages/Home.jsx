import Card from "@/components/ui/Card";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><h3 className="text-sm text-gray-500">Total SECs</h3><div className="text-2xl font-bold">—</div></Card>
        <Card><h3 className="text-sm text-gray-500">Active Producers</h3><div className="text-2xl font-bold">—</div></Card>
        <Card><h3 className="text-sm text-gray-500">Certificates in Circulation</h3><div className="text-2xl font-bold">—</div></Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <div className="flex gap-3 mt-3">
          <Link to="/producers" className="px-3 py-2 bg-sky-600 text-white rounded">Producers</Link>
          <Link to="/companies" className="px-3 py-2 bg-green-600 text-white rounded">Companies</Link>
          <Link to="/admin" className="px-3 py-2 bg-gray-600 text-white rounded">Admin</Link>
        </div>
      </Card>
    </div>
  );
}
