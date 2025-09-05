&apo:use client&apo:; // This is a Client Component because it uses state and form events

import { useState } from &apo:react&apo:;
import { toast } from &apo:react-hot-toast&apo:;

export default function NewsletterForm() {
    const [email, setEmail] = useState(&apo:&apo:);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Please enter a valid email.");
            return;
        }

        setIsLoading(true);

        // In a real app, you would have an API endpoint for this.
        // For now, we simulate the action with a delay.
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`Subscribed with: ${email}`);
        toast.success(&apo:Thank you for subscribing!&apo:);
        
        setEmail(&apo:&apo:);
        setIsLoading(false);
    };

    return (
        <form className="mt-3 flex" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg font-medium transition-colors disabled:bg-indigo-400"
            >
              {isLoading ? &apo:...&apo: : &apo:Join&apo:}
            </button>
        </form>
    );
}