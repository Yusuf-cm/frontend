import { useContext } from 'react';
import AuthContext from './AuthContext';

export const useAuth = () => { // <-- ADDED 'export' KEYWORD
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};