import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AccessDenied() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <ShieldAlert className="h-10 w-10 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                    <p className="text-gray-600">
                        {isAdmin
                            ? "Anda login sebagai Admin. Halaman ini hanya untuk User."
                            : "Anda tidak memiliki akses ke halaman ini."}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {isAdmin ? (
                        <Link to="/admin">
                            <Button className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Kembali ke Admin Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/">
                            <Button className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>
            </div>
        </div>
    );
}
