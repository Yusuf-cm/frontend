import InfoPageLayout from &apo:@/components/InfoPageLayout&apo:;

export default function ShippingPage() {
  return (
    <InfoPageLayout title="Shipping & Returns Policy">
      <h2>Shipping Policy</h2>
      <p>We are committed to delivering your order accurately, in good condition, and always on time.</p>
      
      <h3>Shipping Rates & Times</h3>
      <ul>
        <li><strong>Standard Shipping:</strong> Ksh 300 (3-5 business days). Free for orders over Ksh 5,000.</li>
        <li><strong>Express Shipping:</strong> Ksh 800 (1-2 business days).</li>
        <li><strong>Large Items & Furniture:</strong> Shipping costs for oversized items will be calculated at checkout based on size, weight, and destination.</li>
      </ul>
      <p>Please note that business days do not include weekends or public holidays.</p>
      
      <h2>Returns & Exchanges</h2>
      <p>We want you to be completely satisfied with your purchase. If you&apo:re not, we&apo:re here to help.</p>

      <h3>30-Day Return Policy</h3>
      <p>You may return most new, unopened items within 30 days of delivery for a full refund. Items should be returned in their original product packaging. We&apo:ll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).</p>

      <h3>How to Initiate a Return</h3>
      <p>To start a return, please contact our support team at <a href="mailto:support@ronohsdecor.com">support@ronohsdecor.com</a> with your order number and details about the product you would like to return. We will respond quickly with instructions on how to return items from your order.</p>
    </InfoPageLayout>
  );
}