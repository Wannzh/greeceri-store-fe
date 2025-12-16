import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}
