import { useEffect, useState } from "react";
import { adminDashboardService } from "@/services/adminDashboardService";
import {
  Package,
  Tags,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminDashboardService.getDashboard();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={data.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          label="Total Revenue"
          value={`Rp ${data.totalRevenue.toLocaleString("id-ID")}`}
          icon={DollarSign}
        />
        <StatCard
          label="Paid Orders"
          value={data.statusCount.PAID || 0}
          icon={Package}
        />
        <StatCard
          label="Cancelled Orders"
          value={data.statusCount.CANCELLED || 0}
          icon={Tags}
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.id}</td>
                <td className="p-2 text-center">{o.userName}</td>
                <td className="p-2 text-center">
                  Rp {o.totalPrice.toLocaleString("id-ID")}
                </td>
                <td className="p-2 text-center">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
