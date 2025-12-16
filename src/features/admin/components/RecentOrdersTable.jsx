import { Card, CardContent } from "@/components/ui/card";

export default function RecentOrdersTable({ orders }) {
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-semibold mb-3">Order Terbaru</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada order</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b">
                  <td className="py-2">{o.id}</td>
                  <td>{o.userName}</td>
                  <td>Rp {o.total.toLocaleString("id-ID")}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
