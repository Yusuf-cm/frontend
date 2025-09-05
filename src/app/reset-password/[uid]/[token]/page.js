// src/app/reset-password/[uid]/[token]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiLock, FiCheck } from 'react-icons/fi';
import PasswordStrengthBar from 'react-password-strength-bar';

export default function ResetPasswordConfirmPage({ params }) {
    const { uid, token } = params;
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        newPassword1: '',
        newPassword2: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState([false, false]);
    const [passwordScore, setPasswordScore] = useState(0);
    const [expiredToken, setExpiredToken] = useState(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        // Check token expiration on mount
        const checkTokenValidity = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/password-reset/validate-token/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid, token }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    if (data.code === 'token_expired') {
                        setExpiredToken(true);
                        setError('This password reset link has expired. Please request a new one.');
                    }
                }
            } catch (err) {
                console.error('Token validation error:', err);
            }
        };

        checkTokenValidity();
    }, [uid, token, API_BASE_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (index) => {
        setShowPasswords(prev => {
            const newVisibility = [...prev];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (formData.newPassword1 !== formData.newPassword2) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (passwordScore < 2) {
            setError("Password is too weak. Please choose a stronger password.");
            setIsLoading(false);
            return;
        }
        
        try {
            const res = await fetch(`${API_BASE_URL}/auth/password-reset/confirm/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    uid, 
                    token, 
                    new_password1: formData.newPassword1, 
                    new_password2: formData.newPassword2 
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                // Handle specific errors
                if (data.new_password2) {
                    throw new Error(data.new_password2.join(' '));
                }
                throw new Error(data.detail || 'Something went wrong');
            }
            
            setMessage(data.detail);
            setTimeout(() => router.push('/login'), 3000);

        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (expiredToken) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <FiLock className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Password Reset Expired</h1>
                    <p className="text-gray-600 mb-6">
                        This password reset link has expired. Please request a new password reset.
                    </p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Request New Reset Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <FiLock className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold">Set a New Password</h1>
                <p className="mt-2 text-gray-600">
                    Create a strong, secure password for your account
                </p>
            </div>
            
            {message ? (
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <FiCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-700 text-lg font-medium mb-2">Password Reset Successful!</p>
                    <p className="text-gray-600 mb-6">
                        {message} Redirecting to login...
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Go to Login Now
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="newPassword1" className="block text-sm font-medium text-gray-700 flex items-center">
                                <FiLock className="mr-2" /> New Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="newPassword1"
                                    name="newPassword1"
                                    type={showPasswords[0] ? "text" : "password"} 
                                    placeholder="Create a strong password" 
                                    value={formData.newPassword1} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility(0)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords[0] ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                </button>
                            </div>
                            
                            {formData.newPassword1 && (
                                <PasswordStrengthBar 
                                    password={formData.newPassword1} 
                                    minLength={8}
                                    onChangeScore={(score) => setPasswordScore(score)}
                                    className="mt-2"
                                />
                            )}
                            
                            <div className="text-xs text-gray-500 mt-2">
                                Use at least 8 characters with a mix of letters, numbers & symbols
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="newPassword2" className="block text-sm font-medium text-gray-700 flex items-center">
                                <FiLock className="mr-2" /> Confirm New Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="newPassword2"
                                    name="newPassword2"
                                    type={showPasswords[1] ? "text" : "password"} 
                                    placeholder="Confirm your password" 
                                    value={formData.newPassword2} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility(1)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords[1] ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || passwordScore < 2}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center
                            ${isLoading || passwordScore < 2
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                    
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-indigo-600 hover:underline font-medium text-sm"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}