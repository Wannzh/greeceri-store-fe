import AppLayout from "@/components/layout/AppLayout"
import HomePage from "@/pages/HomePage"
import NotFound from "@/pages/NotFound"
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AppLayout>
        </BrowserRouter>
    )
}