"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, Shield, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type LoginTab = 'customer-login' | 'customer-register' | 'admin-login';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<LoginTab>('customer-login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminId, setAdminId] = useState('');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'admin-login') {
      // Authenticate against the database via API
      try {
        const response = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email || undefined,
            employeeId: adminId || undefined,
            password,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSuccessMsg(`Welcome, ${result.data.name}! Redirecting to Executive Console...`);
          // Store administrative user session details
          localStorage.setItem('kumara_admin_user', JSON.stringify(result.data));
          setTimeout(() => {
            router.push('/admin');
          }, 1000);
        } else {
          setErrorMsg(result.error || 'Invalid Admin credentials.');
          setIsLoading(false);
        }
      } catch (err) {
        setErrorMsg('Unable to connect to authentication server. Please try again.');
        setIsLoading(false);
      }
    } else if (activeTab === 'customer-login') {
      // Simulate API delay for customer login (mock)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (email && password.length >= 6) {
        setSuccessMsg('Sign in successful. Welcome back!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setErrorMsg('Invalid email address or password (min 6 characters).');
        setIsLoading(false);
      }
    } else {
      // Mock Register Account
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (name && email && phone && password.length >= 6) {
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setErrorMsg('Please fill in all fields correctly (password min 6 characters).');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Login Background"
          className="object-cover w-full h-full filter brightness-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian via-transparent to-black/20" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-luxury-obsidian-card/85 backdrop-blur-lg border border-luxury-obsidian-border rounded-xl p-8 shadow-2xl space-y-6"
      >
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-white tracking-wide">
            {activeTab === 'admin-login' ? 'Staff Portal' : 'Member Sanctuary'}
          </h1>
          <p className="text-xs text-luxury-silver-muted font-light">
            {activeTab === 'admin-login' 
              ? 'Access executive controls & operational logs' 
              : 'Unlock exclusive member rates and custom concierge services'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-luxury-obsidian border border-white/5 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('customer-login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs tracking-wider font-sans rounded transition-all duration-300 ${
              activeTab === 'customer-login'
                ? 'bg-luxury-gold text-black font-semibold'
                : 'text-luxury-silver-muted hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('customer-register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs tracking-wider font-sans rounded transition-all duration-300 ${
              activeTab === 'customer-register'
                ? 'bg-luxury-gold text-black font-semibold'
                : 'text-luxury-silver-muted hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'customer-register' && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email / Admin ID Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold">
              {activeTab === 'admin-login' ? 'Admin Email / Employee ID' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (activeTab === 'admin-login') setAdminId(e.target.value);
                }}
                required
                placeholder={activeTab === 'admin-login' ? "admin@kumarahotels.com or ADMIN001" : "name@domain.com"}
                className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-semibold">Password</label>
              {activeTab === 'customer-login' && (
                <a href="#" className="text-[9px] text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-200">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
              />
            </div>
          </div>

          {/* Error and Success Banners */}
          {errorMsg && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-luxury-gold/15 mt-2 animate-shine"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <span>{activeTab === 'admin-login' ? 'Access Console' : activeTab === 'customer-login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Portal Switching Link at bottom */}
        <div className="pt-4 border-t border-white/5 text-center">
          {activeTab === 'admin-login' ? (
            <button
              onClick={() => {
                setActiveTab('customer-login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-300 flex items-center justify-center space-x-1 mx-auto"
            >
              <span>Back to Member Stays Login</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTab('admin-login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-300 flex items-center justify-center space-x-1.5 mx-auto"
            >
              <Shield className="h-3.5 w-3.5 text-luxury-gold" />
              <span>Admin & Staff Console</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
