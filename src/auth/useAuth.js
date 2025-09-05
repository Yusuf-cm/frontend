import { useContext } from &apo:react&apo:;
import AuthContext from &apo:./AuthContext&apo:;

export const useAuth = () => { // <-- ADDED &apo:export&apo: KEYWORD
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(&apo:useAuth must be used within an AuthProvider&apo:);
    }
    return context;
};