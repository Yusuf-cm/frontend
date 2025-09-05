&apo:use client&apo:;

import { useState, useCallback } from &apo:react&apo:;
import { useAuth } from &apo:@/auth/useAuth&apo:;
import Link from &apo:next/link&apo:;
import { useRouter, useSearchParams } from &apo:next/navigation&apo:;
import FormError from &apo:@/components/FormError&apo:;
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiLogIn, FiMail } from &apo:react-icons/fi&apo:;
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from &apo:framer-motion&apo:;
import { toast } from &apo:react-hot-toast&apo:;

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: &apo:&apo:,
        password: &apo:&apo:
    });
    const [error, setError] = useState(&apo:&apo:);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { loginUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get(&apo:next&apo:);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.password.trim()) {
            setError(&apo:Please fill in all fields&apo:);
            return;
        }
        
        setError(&apo:&apo:);
        setIsLoading(true);
        
        try {
            await loginUser(formData.username, formData.password, nextUrl);
            toast.success(&apo:Login successful!&apo:);
        } catch (err) {
            setError(err.message || &apo:An unknown error occurred. Please try again.&apo:);
            toast.error(&apo:Login failed. Please check your credentials.&apo:);
        } finally {
            setIsLoading(false);
        }
    }, [formData, nextUrl, loginUser]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(&apo:&apo:);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600">
                    <div className="bg-white rounded-xl p-6 sm:p-8">
                        <div className="flex justify-center mb-6">
                            <motion.div 
                                className="bg-indigo-100 p-3 rounded-full"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiLogIn className="h-8 w-8 text-indigo-600" />
                            </motion.div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 text-center mb-8">
                            Sign in to your account to continue
                        </p>
                        
                        <form 
                            onSubmit={handleSubmit} 
                            className="flex flex-col space-y-6"
                            noValidate
                        >
                            <div className="space-y-2">
                                <label 
                                    htmlFor="username" 
                                    className="block text-sm font-medium text-gray-700 flex items-center"
                                >
                                    <FiUser className="mr-2" /> Username or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Your username or email"
                                        value={formData.username}
                                        onChange={handleChange}
                                        autoComplete="username"
                                        disabled={isLoading}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 disabled:opacity-75 disabled:cursor-not-allowed"
                                        aria-required="true"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label 
                                        htmlFor="password" 
                                        className="block text-sm font-medium text-gray-700 flex items-center"
                                    >
                                        <FiLock className="mr-2" /> Password
                                    </label>
                                    <div className="text-sm">
                                        <Link 
                                            href="/forgot-password" 
                                            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                                            tabIndex={isLoading ? -1 : 0}
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 disabled:opacity-75 disabled:cursor-not-allowed"
                                        aria-required="true"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none disabled:opacity-50"
                                        disabled={isLoading}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={isLoading ? -1 : 0}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <FiEye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-75 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                />
                                <label 
                                    htmlFor="remember-me" 
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>
                            
                            <FormError message={error} />
                            
                            <motion.button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center
                                    ${isLoading
                                        ? &apo:bg-gray-300 text-gray-500 cursor-not-allowed&apo:
                                        : &apo:bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg&apo:
                                    }`}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                aria-busy={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg 
                                            className="animate-spin h-5 w-5 text-white mr-3" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    &apo:Sign In&apo:
                                )}
                            </motion.button>
                        </form>
                        
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <motion.button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                tabIndex={isLoading ? -1 : 0}
                            >
                                <FcGoogle className="h-5 w-5" />
                                <span className="ml-2">Google</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                tabIndex={isLoading ? -1 : 0}
                            >
                                <FaFacebook className="h-5 w-5 text-blue-600" />
                                <span className="ml-2">Facebook</span>
                            </motion.button>
                        </div>
                        
                        <p className="text-center mt-8 text-gray-600">
                            Don&apo:t have an account?{&apo: &apo:}
                            <Link 
                                href="/register" 
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                                tabIndex={isLoading ? -1 : 0}
                            >
                                Register now
                            </Link>
                        </p>
                        
                        <div className="mt-6 text-center">
                            <Link 
                                href="/" 
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors focus:outline-none focus:underline"
                                tabIndex={isLoading ? -1 : 0}
                            >
                                <FiArrowLeft className="mr-1" />
                                Back to homepage
                            </Link>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                By signing in, you agree to our{&apo: &apo:}
                                <a 
                                    href="#" 
                                    className="text-indigo-600 hover:underline focus:outline-none focus:underline"
                                    tabIndex={isLoading ? -1 : 0}
                                >
                                    Terms of Service
                                </a>{&apo: &apo:}
                                and{&apo: &apo:}
                                <a 
                                    href="#" 
                                    className="text-indigo-600 hover:underline focus:outline-none focus:underline"
                                    tabIndex={isLoading ? -1 : 0}
                                >
                                    Privacy Policy
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}