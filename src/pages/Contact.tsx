import React, { useState } from "react";
import { useApp } from "../context/AppContext.js";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Contact: React.FC = () => {
  const { settings, addToast } = useApp();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (res.ok) {
        addToast("Message sent successfully! Our artisans will reply via email shortly.", "success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        addToast("Failed to send message. Please try again.", "error");
      }
    } catch (err) {
      addToast("Failed to send message.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Block */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Connect with Us</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">Artisan Consultation</h1>
        <p className="text-stone-600 text-sm mt-3 leading-relaxed">
          Have an empty wall or a unique gifting idea? Message our workshop artisans directly, or submit a query form below for custom size pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
        
        {/* Left Side: Contact Information Cards */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Direct Workshop Details</h3>
            <p className="text-stone-600 text-sm leading-relaxed font-sans">
              We operate an open-studio workspace in Jaipur. Drop in to browse physical resin draft collections, explore wood frames, or finalize customized color palettes with our creators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Address */}
            <div className="p-6 glass-card border border-stone-200 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 text-sm block">Artisan Workshop</span>
                <span className="text-stone-600 text-xs leading-relaxed block">{settings.businessAddress}</span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 glass-card border border-stone-200 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 text-sm block">WhatsApp Hotline</span>
                <a
                  href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-600 hover:text-amber-800 text-xs break-all leading-relaxed block"
                >
                  {settings.whatsAppNumber}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 glass-card border border-stone-200 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 text-sm block">Artisan Mail</span>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-stone-600 hover:text-amber-800 text-xs break-all leading-relaxed block"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* Operating hours */}
            <div className="p-6 glass-card border border-stone-200 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 text-sm block">Studio Hours</span>
                <span className="text-stone-600 text-xs leading-relaxed block">Mon - Sat: 10:00 AM - 7:00 PM</span>
              </div>
            </div>

          </div>

          {/* WhatsApp Direct Chat Banner */}
          <div className="p-8 bg-stone-900 border border-stone-950 rounded-3xl relative overflow-hidden flex flex-col justify-between h-48 sm:h-52 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-stone-100">Have an Immediate Question?</h4>
              <p className="text-stone-300 text-xs max-w-sm leading-relaxed">
                Send our head designers a WhatsApp text message to start customized drafting immediately!
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, "")}?text=Hello%20Dr.Decors,%20I%20have%20a%20question%20about%20your%20handcrafted%2520pieces.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Launch WhatsApp Chat</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Right Side: Message Submission Form */}
        <div className="glass-card border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">Send an Inquiry Mail</h3>
            <p className="text-stone-600 text-xs leading-relaxed">Fill out your design specifications below. Our response time is typically within 12 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1.5">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1.5">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1.5">Your Custom Message</label>
              <textarea
                required
                rows={5}
                placeholder="Describe your wall dimensions, preferred colors, or frame concepts..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              <span>Submit Inquiry</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
