// app/login/page.tsx
'use client';

import { useState } from 'react';
import { login, signup } from '@/app/login/action';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<'login' | 'signup' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('login');
        setError(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setIsLoading(null);
        }
        // nếu không có lỗi → server action đã redirect rồi
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('signup');
        setError(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const result = await signup(formData);
        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setError('Đã gửi email xác nhận! Vui lòng kiểm tra hộp thư (và mục Spam).');
        }
        setIsLoading(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Chào mừng bạn</h2>
                    <p className="mt-2 text-gray-600">Đăng nhập hoặc tạo tài khoản mới</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Thông báo lỗi hoặc thành công */}
                        {error && (
                            <div className={`text-sm text-center p-3 rounded-lg ${error.includes('kiểm tra email') || error.includes('Đã gửi') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {error}
                            </div>
                        )}

                        {/* Nút Đăng nhập & Đăng ký */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading !== null}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition shadow-lg disabled:cursor-not-allowed"
                            >
                                {isLoading === 'login' ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <LogIn size={20} />
                                )}
                                {isLoading === 'login' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSignup}
                                disabled={isLoading !== null}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 font-semibold transition shadow-lg disabled:cursor-not-allowed"
                            >
                                {isLoading === 'signup' ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <UserPlus strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                )}
                                {isLoading === 'signup' ? 'Đang tạo...' : 'Đăng ký'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-xs text-gray-500 mt-6">
                        Sau khi đăng ký, vui lòng kiểm tra email (bao gồm mục <strong>Spam/Promotions</strong>) để xác nhận tài khoản.
                    </div>
                </div>
            </div>
        </div>
    );
}