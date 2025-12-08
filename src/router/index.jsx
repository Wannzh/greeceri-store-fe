import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";

import AppLayout from "@/components/layout/AppLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
