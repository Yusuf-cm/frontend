'use client';

import { useState } from 'react';
import { FiSend, FiCheckCircle, FiAlertCircle, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic'; // <-- FIX #1: IMPORT DYNAMIC

// Define the Map component outside the main component to avoid re-creating it on every render.
const Map = dynamic(() => import('@/components/Map'), { 
    ssr: false, // This component will only be rendered on the client side
    loading: () => <div className="animate-pulse bg-gray-200 w-full h-full"></div>
});

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(''); // 'success', 'error', 'loading'
    const [isSubmitted, setIsSubmitted] = useState(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        else if (formData.message.trim().length < 10) newErrors.message = 'Message should be at least 10 characters';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStatus('loading');
        
        try {
            // --- FIX #2: CORRECT THE FETCH URL ---
            const response = await fetch(`${API_BASE_URL}/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const handleReset = () => {
        setStatus('');
        setIsSubmitted(false);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl font-serif"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 max-w-2xl mx-auto text-xl text-gray-600"
                    >
                        We'd love to hear about your project or answer any questions
                    </motion.p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Details */}
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"><FiMapPin className="h-6 w-6 text-indigo-600" /></div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Our Location</h3>
                                <p className="mt-1 text-base text-gray-600">123 Design Street, Westlands<br />Nairobi, Kenya</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"><FiPhone className="h-6 w-6 text-indigo-600" /></div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                                <p className="mt-1 text-base text-gray-600">+254 712 345 678<br />Mon-Fri, 9am-5pm</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"><FiMail className="h-6 w-6 text-indigo-600" /></div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Email</h3>
                                <p className="mt-1 text-base text-gray-600">info@ronohsdecor.com<br />support@ronohsdecor.com</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"><FiClock className="h-6 w-6 text-indigo-600" /></div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
                                <p className="mt-1 text-base text-gray-600">Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm<br />Sunday: Closed</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-8">
                            <div className="bg-gray-100 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">We're Here to Help</h3>
                                <p className="text-gray-600">Our team typically responds within 24 hours during business days. For urgent matters, please call us directly.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form and Map */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                        {isSubmitted && status === 'success' ? (
                            <div className="mt-8 bg-green-50 rounded-xl p-6 text-center">
                                <div className="flex justify-center"><FiCheckCircle className="h-12 w-12 text-green-500" /></div>
                                <h3 className="mt-4 text-xl font-bold text-green-800">Message Sent Successfully!</h3>
                                <p className="mt-2 text-green-700">Thank you for contacting us. We'll get back to you as soon as possible.</p>
                                <button onClick={handleReset} className="mt-6 bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700">Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`mt-1 block w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`} />
                                    {errors.name && <p className="mt-1 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1" /> {errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={`mt-1 block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`} />
                                    {errors.email && <p className="mt-1 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1" /> {errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                    <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} placeholder="How can we help you?" className={`mt-1 block w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}></textarea>
                                    {errors.message && <p className="mt-1 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1" /> {errors.message}</p>}
                                </div>
                                <div>
                                    <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                                        {status === 'loading' ? 'Sending...' : <><FiSend className="mr-2" />Send Message</>}
                                    </button>
                                </div>
                                {status === 'error' && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded"><p className="text-sm text-red-700">Something went wrong. Please try again later.</p></div>}
                            </form>
                        )}
                        <div className="mt-12 bg-gray-100 rounded-xl overflow-hidden h-64 border border-gray-200">
                            <Map position={[-1.267, 36.802]} zoom={15} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;