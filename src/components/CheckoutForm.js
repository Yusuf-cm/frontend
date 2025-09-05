// src/components/CheckoutForm.js

&apo:use client&apo:;

import { useState } from &apo:react&apo:;
import { PaymentElement, useStripe, useElements } from &apo:@stripe/react-stripe-js&apo:;
import { toast } from &apo:react-hot-toast&apo:;

// --- START OF FIX ---
// The component no longer needs its own form tag or onSubmit handler passed in.
// We pass the handleSubmit function directly to the button&apo:s onClick handler.
export default function CheckoutForm({ orderId }) { 
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !orderId) {
      toast.error("Payment details are not ready yet. Please try again.");
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-status?order_id=${orderId}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during payment.");
      }
    }
    
    // This part is only reached if there&apo:s an immediate error.
    setIsLoading(false);
  };

  // Note: The <form> tag is removed. We return a React Fragment <>...</> instead.
  return (
    <> 
      <PaymentElement id="payment-element" />
      <button 
        onClick={handleSubmit} // We now use onClick for the button
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        <span id="button-text">
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </span>
          ) : (
            &apo:Pay now&apo:
          )}
        </span>
      </button>
    </>
  );
  // --- END OF FIX ---
}