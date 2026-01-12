"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  UserIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal");
        setIsLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      router.push("/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300/10 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="w-32 h-32 bg-white rounded-full p-3 shadow-2xl mb-8">
            <div className="w-full h-full relative">
              <Image
                src="/logo.png"
                alt="Logo Desa"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-4">
            Sistem Administrasi Desa
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-6"></div>
          <h2 className="text-2xl font-semibold text-center mb-2">
            Desa Tirongan Atas
          </h2>
          <p className="text-blue-200 text-center">
            Kecamatan Bungku Utara
          </p>
          <p className="text-blue-200 text-center">
            Kabupaten Morowali Utara
          </p>
          <p className="text-blue-300 text-center text-sm mt-2">
            Provinsi Sulawesi Tengah
          </p>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">1247</div>
              <div className="text-xs text-blue-200 mt-1">Penduduk</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-400">342</div>
              <div className="text-xs text-blue-200 mt-1">Keluarga</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-400">4</div>
              <div className="text-xs text-blue-200 mt-1">Dusun</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-2 shadow-lg mb-4">
              <div className="w-full h-full bg-white rounded-full p-1">
                <div className="w-full h-full relative">
                  <Image
                    src="/logo.png"
                    alt="Logo Desa"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Sistem Administrasi Desa</h1>
            <p className="text-sm text-gray-600">Desa Tirongan Atas</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
              <p className="text-gray-500 text-sm mt-2">Silahkan login untuk melanjutkan</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800"
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/25 hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-gray-600 text-center mb-3 uppercase tracking-wide">Demo Login</p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <span className="text-gray-500">Username</span>
                  <div className="font-mono font-semibold text-blue-600 bg-white px-3 py-1 rounded-lg mt-1 shadow-sm">admin</div>
                </div>
                <div className="text-center">
                  <span className="text-gray-500">Password</span>
                  <div className="font-mono font-semibold text-blue-600 bg-white px-3 py-1 rounded-lg mt-1 shadow-sm">admin123</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            © 2026 Desa Tirongan Atas. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
