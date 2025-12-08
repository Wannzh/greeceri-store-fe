import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react"

export default function LoginPage() {
    const { login } = useAuth()

    // Form field
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        await new Promise(r => setTimeout(r, 1000))

        const res = await login(email, password)

        if (!res.success) {
            setError(res.message)
        }

        setLoading(false)
    }

    return (
<div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* Bagian Kiri: Form Login */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    
                    {/* Header Logo & Judul */}
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <ShoppingBag size={24} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Selamat Datang
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Masukan kredensial Anda untuk mengakses Greeceri Store
                        </p>
                    </div>

                    {/* Alert Error */}
                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        
                        {/* Input Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@gmail.com"
                                    className="pl-10" // Padding kiri agar teks tidak menabrak ikon
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-xs text-primary hover:underline font-medium">
                                    Lupa password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="•••••••••"
                                    className="pl-10 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {/* Toggle Show/Hide Password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Login */}
                        <Button disabled={loading} type="submit" className="w-full h-11 font-medium text-md transition-all hover:scale-[1.01]">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk ke Akun"
                            )}
                        </Button>
                    </form>

                    {/* Footer Kecil */}
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Belum memiliki akun?{" "}
                        <a href="/register" className="underline underline-offset-4 hover:text-primary font-medium">
                            Daftar sekarang
                        </a>
                    </p>
                    
                    <div className="mt-8 text-center text-xs text-muted-foreground/60">
                         © {new Date().getFullYear()} Greeceri Store. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Bagian Kanan: Gambar / Banner (Hanya muncul di Layar Besar) */}
            <div className="hidden lg:block relative bg-muted">
                {/* Gambar Background - Saya pakai Unsplash source random tema grocery/supermarket */}
                <div className="absolute inset-0">
                     <img 
                        src="https://plus.unsplash.com/premium_photo-1683984171269-04c84ee23234?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Greeceri Background" 
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay Gelap agar tulisan terbaca */}
                    <div className="absolute inset-0 bg-zinc-900/60 mix-blend-multiply" />
                    {/* Overlay Gradient Halus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                </div>

                <div className="relative z-20 flex h-full flex-col justify-end p-10 text-white">
                    <div className="mb-6">
                        <ShoppingBag size={48} className="mb-4 text-primary-foreground/90" />
                        <blockquote className="space-y-2">
                            <p className="text-lg font-medium leading-relaxed">
                                &ldquo;Greeceri Store membantu kami mengelola inventaris toko dengan lebih efisien. Sistem yang cepat, modern, dan sangat mudah digunakan.&rdquo;
                            </p>
                            <footer className="text-sm font-semibold opacity-80">
                                Ama — Store Manager
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}
