&apo:use client&apo:;

import { createContext, useState, useEffect, useCallback } from &apo:react&apo:;
import { useRouter } from &apo:next/navigation&apo:;
import { jwtDecode } from &apo:jwt-decode&apo:;

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
        localStorage.removeItem(&apo:authTokens&apo:);
        router.push(&apo:/login&apo:);
    }, [router]);

    const loginUser = useCallback(async (username, password, nextUrl = null) => {
        const response = await fetch(`${API_URL}/auth/token/`, {
            method: &apo:POST&apo:,
            headers: { &apo:Content-Type&apo:: &apo:application/json&apo: },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            setAuthTokens(data);
            localStorage.setItem(&apo:authTokens&apo:, JSON.stringify(data));
            setUser(jwtDecode(data.access));
            router.push(nextUrl || &apo:/account&apo:);
        } else {
            throw new Error(data.detail || &apo:Failed to login&apo:);
        }
    }, [router, API_URL]);
    
    const registerUser = useCallback(async (userData) => {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: &apo:POST&apo:,
            headers: { &apo:Content-Type&apo:: &apo:application/json&apo: },
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
            const storedTokens = localStorage.getItem(&apo:authTokens&apo:);
            
            if (storedTokens) {
                try {
                    const tokens = JSON.parse(storedTokens);
                    const decodedToken = jwtDecode(tokens.access);
                    const isExpired = decodedToken.exp * 1000 < Date.now();

                    if (isExpired) {
                        const refreshResponse = await fetch(`${API_URL}/auth/token/refresh/`, {
                            method: &apo:POST&apo:,
                            headers: { &apo:Content-Type&apo:: &apo:application/json&apo: },
                            body: JSON.stringify({ refresh: tokens.refresh }),
                        });
                        const newTokens = await refreshResponse.json();
                        if (!refreshResponse.ok) throw new Error(&apo:Refresh token invalid&apo:);
                        
                        localStorage.setItem(&apo:authTokens&apo:, JSON.stringify(newTokens));
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