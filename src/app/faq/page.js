import InfoPageLayout from &apo:@/components/InfoPageLayout&apo:;
import { FiChevronDown } from &apo:react-icons/fi&apo:;

const faqs = [
  {
    question: "What are your shipping options?",
    answer: "We offer standard shipping (3-5 business days) and express shipping (1-2 business days) within Kenya. Shipping costs are calculated at checkout. Orders above Ksh 5,000 qualify for free standard shipping."
  },
  {
    question: "What is your return policy?",
    answer: "You can return most new, unopened items within 30 days of delivery for a full refund. We&apo:ll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.)."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within Kenya. We are working on expanding our services to other East African countries in the near future. Please subscribe to our newsletter for updates."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with your tracking number and a link to the courier&apo:s website where you can track your package."
  },
  {
    question: "Do you offer interior design services?",
    answer: "Yes, we do! We offer a range of services from simple consultations to full-scale project management. Please visit our &apo:Services&apo: page or contact us for more information."
  },
];

export default function FAQPage() {
  return (
    <InfoPageLayout title="Frequently Asked Questions">
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <details key={index} className="group p-4 bg-gray-50 rounded-lg">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>{faq.question}</span>
              <span className="transition group-open:rotate-180">
                <FiChevronDown />
              </span>
            </summary>
            <p className="text-gray-700 mt-3 group-open:animate-fadeIn">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </InfoPageLayout>
  );
}