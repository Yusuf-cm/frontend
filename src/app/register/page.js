'use client';
import { useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import Link from 'next/link';
import FormError from '@/components/FormError';
import { FiEye, FiEyeOff, FiCheck, FiUser, FiMail, FiLock } from 'react-icons/fi';
import PasswordStrengthBar from 'react-password-strength-bar';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usernameSuggestions, setUsernameSuggestions] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { registerUser } = useAuth();

    const checkUsernameAndSuggest = async (currentUsername) => {
        if (!currentUsername) return;
        try {
            const res = await fetch(`${API_BASE_URL}/auth/username/suggest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUsername }),
            });
            if (!res.ok) return;
            const data = await res.json();
            setUsernameSuggestions(data.suggestions || []);
        } catch (err) {
            console.error("Failed to fetch username suggestions:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'username') {
            setUsernameSuggestions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        setUsernameSuggestions([]);

        // Client-side validation
        if (!acceptedTerms) {
            setError('You must accept the terms and conditions');
            setIsLoading(false);
            return;
        }

        if (passwordScore < 2) {
            setError('Password is too weak. Please choose a stronger password.');
            setIsLoading(false);
            return;
        }

        try {
            await registerUser({ 
                username: formData.username, 
                password: formData.password, 
                email: formData.email, 
                first_name: formData.firstName, 
                last_name: formData.lastName 
            });
            
            setSuccessMessage('Account created successfully! Redirecting to login...');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } catch (err) {
            const errorMessage = err.message || 'An error occurred during registration.';
            setError(errorMessage);

            if (errorMessage.toLowerCase().includes('username')) {
                checkUsernameAndSuggest(formData.username);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData(prev => ({ ...prev, username: suggestion }));
        setUsernameSuggestions([]);
    };

    return (
        <div className="max-w-md mx-auto mt-10 mb-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <FiUser className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold font-serif text-gray-900">Create an Account</h1>
                <p className="mt-2 text-gray-600">
                    Join our community and start your journey
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 flex items-center">
                            <FiUser className="mr-2" /> First Name
                        </label>
                        <input 
                            id="firstName" 
                            name="firstName"
                            type="text" 
                            placeholder="John" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 flex items-center">
                            <FiUser className="mr-2" /> Last Name
                        </label>
                        <input 
                            id="lastName" 
                            name="lastName"
                            type="text" 
                            placeholder="Doe" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiMail className="mr-2" /> Email
                    </label>
                    <input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="your@email.com" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiUser className="mr-2" /> Username
                    </label>
                    <input 
                        id="username" 
                        name="username"
                        type="text" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    />
                    
                    {usernameSuggestions.length > 0 && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 flex items-center">
                                <FiCheck className="mr-2" /> That username is taken. How about one of these?
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {usernameSuggestions.map((s) => (
                                    <button 
                                        key={s} 
                                        type="button" 
                                        onClick={() => handleSuggestionClick(s)} 
                                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiLock className="mr-2" /> Password
                    </label>
                    <div className="relative">
                        <input 
                            id="password" 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a strong password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                    </div>
                    
                    {formData.password && (
                        <PasswordStrengthBar 
                            password={formData.password} 
                            minLength={8}
                            onChangeScore={(score) => setPasswordScore(score)}
                            className="mt-2"
                        />
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                        Use at least 8 characters with a mix of letters, numbers & symbols
                    </div>
                </div>
                
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                            I agree to the <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                </div>
                
                {successMessage && (
                    <div className="p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                        <p className="flex items-center">
                            <FiCheck className="mr-2 h-5 w-5" /> {successMessage}
                        </p>
                    </div>
                )}
                
                <FormError message={error} />
                
                <button 
                    type="submit" 
                    disabled={isLoading || !acceptedTerms || passwordScore < 2}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center
                        ${isLoading || !acceptedTerms || passwordScore < 2
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
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            </svg>
                            <span className="ml-2">Facebook</span>
                        </button>
                        
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                            </svg>
                            <span className="ml-2">Twitter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}