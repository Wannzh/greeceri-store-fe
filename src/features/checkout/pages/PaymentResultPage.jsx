import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentResultPage({ status }) {
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      {isSuccess ? (
        <>
          <CheckCircle className="h-20 w-20 text-green-500" />
          <h1 className="text-2xl font-bold mt-4">Pembayaran Berhasil 🎉</h1>
          <p className="text-gray-500 mt-2">Pesanan Anda sedang diproses</p>
        </>
      ) : (
        <>
          <XCircle className="h-20 w-20 text-red-500" />
          <h1 className="text-2xl font-bold mt-4">Pembayaran Gagal</h1>
          <p className="text-gray-500 mt-2">Silakan coba lagi</p>
        </>
      )}

      <Link to="/orders/my">
        <Button className="mt-6">Lihat Pesanan Saya</Button>
      </Link>
    </div>
  );
}
