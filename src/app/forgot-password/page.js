'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiLock, FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');
        
        try {
            const res = await fetch(`${API_BASE_URL}/auth/password-reset/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to send reset link. Please try again later.');
            
            setMessage(data.detail || 'Password reset link sent successfully!');
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setEmail('');
        setMessage('');
        setError('');
        setIsSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600">
                    <div className="bg-white rounded-xl p-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <FiLock className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Reset Your Password
                        </h1>
                        
                        <p className="text-gray-600 text-center mb-8">
                            {isSubmitted 
                                ? "Check your inbox for reset instructions" 
                                : "Enter your email to receive a password reset link"}
                        </p>
                        
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    <FiCheckCircle className="h-12 w-12 text-green-500" />
                                </div>
                                <p className="text-green-700 font-medium mb-6">{message}</p>
                                
                                <div className="space-y-4">
                                    <button
                                        onClick={handleReset}
                                        className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Resend Reset Link
                                    </button>
                                    
                                    <Link 
                                        href="/login" 
                                        className="inline-flex items-center justify-center w-full text-gray-700 hover:text-indigo-600 transition-colors"
                                    >
                                        <FiArrowLeft className="mr-2" />
                                        Back to Login
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                                    >
                                        <div className="flex items-start">
                                            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <p className="ml-3 text-sm text-red-700">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                                
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            type="email" 
                                            id="email"
                                            placeholder="your.email@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError('');
                                            }}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-75"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                                
                                <div className="text-center pt-4">
                                    <Link 
                                        href="/login" 
                                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                                    >
                                        <FiArrowLeft className="mr-1" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                For security reasons, password reset links expire after 1 hour.
                                If you don't receive an email, please check your spam folder.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}