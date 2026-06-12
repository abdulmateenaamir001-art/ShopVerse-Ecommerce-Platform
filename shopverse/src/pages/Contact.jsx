import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiChevronDown, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const faqs = [
  {
    question: "How long does shipping usually take?",
    answer: "For standard shipping, expect your order to arrive within 3-5 business days. Expedited shipping takes 1-2 business days. International orders may take up to 2 weeks."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day, no-questions-asked return policy for all unused items in their original packaging. Simply contact our support team to get a return label."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times will be calculated at checkout based on your location."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive a confirmation email with a tracking link. You can also view your tracking status directly in your ShopVerse account dashboard."
  }
];

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! We will get back to you within 24 hours.");
      e.target.reset(); // Clear the form
    }, 1500);
  };

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="bg-indigo-900 dark:bg-dark-card py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
            className="text-indigo-200 text-lg max-w-2xl mx-auto"
          >
            Have a question about an order, a product, or just want to say hi? We are always here to help.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Contact Info & Map */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <FiMapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Our Headquarters</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">123 Innovation Drive<br/>Tech Valley, CA 94043</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <FiMail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Email Us</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">support@shopverse.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">+1 (800) 123-4567<br/>Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Google Map Embed */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6392906210703!2d-122.08624618469247!3d37.421999879825215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425def3d%3A0x83f62858b97d1912!2sGoogleplex!5e0!3m2!1sen!2sus!4v1684345229643!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Order Number (Optional)</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="#SV-123456" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea required rows="5" className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? 'Sending...' : <><FiSend /> Send Message</>}
                </button>
              </form>
            </div>
          </motion.div>

        </div>

        {/* FAQ Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">Can't find the answer you're looking for? Reach out to our customer support team.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-gray-900 dark:text-white focus:outline-none"
                >
                  {faq.question}
                  <FiChevronDown className={`transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`} size={20} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      // --- NEW: High contrast text colors! ---
                      className="px-6 pb-5 text-gray-800 dark:text-gray-200 font-medium leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}