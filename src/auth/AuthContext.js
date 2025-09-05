'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- START OF FIX: Prevent hydration mismatch ---
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    // --- END OF FIX ---

    const router = useRouter();
    const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        router.push('/login');
    }, [router]);

    const loginUser = useCallback(async (username, password, nextUrl = null) => {
        const response = await fetch(`${API_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            setAuthTokens(data);
            localStorage.setItem('authTokens', JSON.stringify(data));
            setUser(jwtDecode(data.access));
            router.push(nextUrl || '/account');
        } else {
            throw new Error(data.detail || 'Failed to login');
        }
    }, [router, API_URL]);
    
    const registerUser = useCallback(async (userData) => {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            const data = await response.json();
            let errorMessage = "Failed to register.";
            if (data.username) errorMessage = `Username: ${data.username[0]}`;
            else if (data.email) errorMessage = `Email: ${data.email[0]}`;
            else if (data.password) errorMessage = `Password: ${data.password[0]}`;
            else if (data.detail) errorMessage = data.detail;
            throw new Error(errorMessage);
        }
    }, [API_URL]);

    useEffect(() => {
        const verifyAndSetUser = async () => {
            const storedTokens = localStorage.getItem('authTokens');
            
            if (storedTokens) {
                try {
                    const tokens = JSON.parse(storedTokens);
                    const decodedToken = jwtDecode(tokens.access);
                    const isExpired = decodedToken.exp * 1000 < Date.now();

                    if (isExpired) {
                        const refreshResponse = await fetch(`${API_URL}/auth/token/refresh/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refresh: tokens.refresh }),
                        });
                        const newTokens = await refreshResponse.json();
                        if (!refreshResponse.ok) throw new Error('Refresh token invalid');
                        
                        localStorage.setItem('authTokens', JSON.stringify(newTokens));
                        setAuthTokens(newTokens);
                        setUser(jwtDecode(newTokens.access));
                    } else {
                        setAuthTokens(tokens);
                        setUser(decodedToken);
                    }
                } catch (error) {
                    console.error("Token verification/refresh failed:", error.message);
                    logoutUser();
                }
            }
            setLoading(false);
        };
        verifyAndSetUser();
    }, [logoutUser, API_URL]);

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        registerUser,
        logoutUser,
        loading,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {/* --- START OF FIX: Conditional rendering based on client mount --- */}
            {(loading || !isClient) ? <div>Loading...</div> : children}
            {/* --- END OF FIX --- */}
        </AuthContext.Provider>
    );
};

export default AuthContext;