// features/admin/pages/AdminDashboard.jsx
import {
  Package,
  Tags,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

const stats = [
  {
    label: "Total Produk",
    value: 128,
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Kategori",
    value: 12,
    icon: Tags,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Total Order",
    value: 342,
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Revenue",
    value: "Rp 12.500.000",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-600",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* PLACEHOLDER SECTION */}
      <div className="bg-white rounded-xl border shadow-sm p-6 text-gray-500">
        Grafik & aktivitas admin akan ditampilkan di sini
      </div>

    </div>
  );
}
