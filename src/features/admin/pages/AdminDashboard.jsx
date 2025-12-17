import React, { useCallback, useEffect, useState, useMemo } from "react";
import { adminDashboardService } from "@/services/adminDashboardService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminOrderService } from "@/services/adminOrderService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { STATUS_LABEL } from "@/features/admin/orders/constants";
import {
  Package,
  Tags,
  ShoppingCart,
  DollarSign,
  LayoutDashboard,
  Calendar,
} from "lucide-react";

const DEFAULT_DASHBOARD = {
  totalOrders: 0,
  totalRevenue: 0,
  statusCount: {},
  recentOrders: [],
};

const DATE_RANGE_OPTIONS = [
  { value: "7", label: "7 Hari Terakhir" },
  { value: "30", label: "30 Hari Terakhir" },
  { value: "90", label: "90 Hari Terakhir" },
  { value: "365", label: "1 Tahun Terakhir" },
  { value: "all", label: "Semua Waktu" },
];

export default function AdminDashboard() {

  const [data, setData] = useState(DEFAULT_DASHBOARD);
  const [dashboardError, setDashboardError] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // Default 30 days


  const loadDashboard = useCallback(async () => {
    try {
      const res = await adminDashboardService.getDashboard();
      setData(res ?? DEFAULT_DASHBOARD);
    } catch (err) {
      console.error("Gagal load dashboard", err);
      setDashboardError("Gagal memuat data dashboard");
      setData(DEFAULT_DASHBOARD);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await adminOrderService.getAllOrders();
      setOrders(res || []);
    } catch (err) {
      console.error("Gagal load orders for analytics", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    if (dateRange === "all") return orders;

    const days = parseInt(dateRange, 10);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= cutoffDate;
    });
  }, [orders, dateRange]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders
      .filter((o) => ["PAID", "SHIPPED", "DELIVERED"].includes(o.status))
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const paidOrders = filteredOrders.filter((o) => o.status === "PAID").length;
    const cancelledOrders = filteredOrders.filter((o) => o.status === "CANCELLED").length;

    return { totalOrders, totalRevenue, paidOrders, cancelledOrders };
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" /> Dashboard
        </h1>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {dashboardError ? (
        <div className="pt-3">
          <Alert variant="destructive">
            <AlertDescription>{dashboardError}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      {/* STATS - Using filtered data */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={filteredStats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          label="Total Revenue"
          value={`Rp ${filteredStats.totalRevenue.toLocaleString("id-ID")}`}
          icon={DollarSign}
        />
        <StatCard
          label="Paid Orders"
          value={filteredStats.paidOrders}
          icon={Package}
        />
        <StatCard
          label="Cancelled Orders"
          value={filteredStats.cancelledOrders}
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
                <td className="p-2">{o.id?.slice(0, 8)}...</td>
                <td className="p-2 text-center">{o.userName}</td>
                <td className="p-2 text-center">
                  Rp {(o.totalPrice || 0).toLocaleString("id-ID")}
                </td>
                <td className="p-2 text-center">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ANALYTICS - Using filtered data */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-medium mb-3">Orders by Status</h3>
            <div className="h-64">
              {loadingOrders ? (
                <div className="flex h-full items-center justify-center">Loading chart...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">No order data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getStatusChartData(filteredOrders)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getStatusChartData(filteredOrders).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Orders"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-medium mb-3">Revenue per Month</h3>
            <div className="h-64">
              {loadingOrders ? (
                <div className="flex h-full items-center justify-center">Loading chart...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">No revenue data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getRevenueChartData(filteredOrders)}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      width={110}
                      tickFormatter={(v) => formatCompactNumber(v)}
                      tick={{ fontSize: 12, fill: "#374151" }}
                      label={{ value: "Rp", angle: -90, position: "insideLeft", offset: 0 }}
                    />
                    <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

const STATUS_COLORS = {
  PENDING_PAYMENT: "#F59E0B",
  PAID: "#3B82F6",
  SHIPPED: "#8B5CF6",
  DELIVERED: "#10B981",
  CANCELLED: "#EF4444",
};

function getStatusChartData(orders = []) {
  const statusKeys = Object.keys(STATUS_LABEL);
  const counts = statusKeys.map((s) => ({
    status: s,
    name: STATUS_LABEL[s] || s,
    value: orders.filter((o) => o.status === s).length,
  }));
  return counts.filter((c) => c.value > 0);
}

function getRevenueChartData(orders = []) {
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
  const map = {};
  for (const o of orders) {
    const d = new Date(o.createdAt);
    if (isNaN(d)) continue;
    const key = fmt.format(d);
    map[key] = (map[key] || 0) + (Number(o.totalPrice) || 0);
  }
  const arr = Object.keys(map).map((k) => ({ month: k, revenue: Math.round(map[k]) }));
  // Sort by date parsed from month label (approximate by Date parsing)
  arr.sort((a, b) => new Date(a.month) - new Date(b.month));
  return arr;
}

function formatCompactNumber(value) {
  try {
    const n = Number(value) || 0;
    // Use compact notation for readability (e.g., 80 jt)
    return new Intl.NumberFormat("id-ID", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    return value;
  }
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
        {icon ? React.createElement(icon, { className: "h-6 w-6" }) : null}
      </div>
    </div>
  );
}
