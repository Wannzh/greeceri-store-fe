import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FullScreenLoader from "../common/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
  const { loading } = useAuth();

  if (loading) return <FullScreenLoader />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
