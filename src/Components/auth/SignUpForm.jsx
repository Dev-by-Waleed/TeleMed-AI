"use client";

import React, { useState } from "react";
import Link from "next/link";
import createClient from "@/lib/supabase/client";
import { User, Mail, Lock, KeyRound, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const supabase = createClient(); // Instantiate browser client with cookie handling


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validate terms agreement
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    // 2. Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "doctor",
          },
        },
      });

      if (signUpError) throw signUpError;

      console.log("Registration successful:", data);

    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-10 antialiased">
      <main className="w-full max-w-[440px] mx-auto">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-2">
            TeleMed AI
          </h1>
          <p className="text-lg text-on-surface-variant">
            Create your patient account
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-card border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold tracking-wide text-on-surface"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-3 py-2 bg-surface rounded-lg border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-base"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold tracking-wide text-on-surface"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-3 py-2 bg-surface rounded-lg border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-base"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold tracking-wide text-on-surface"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-3 py-2 bg-surface rounded-lg border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-base"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold tracking-wide text-on-surface"
              >
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-3 py-2 bg-surface rounded-lg border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant text-base"
                />
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-2 mt-1">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface cursor-pointer"
                />
              </div>
              <div className="text-xs">
                <label htmlFor="agreeTerms" className="text-on-surface-variant leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline font-semibold"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-semibold"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="mt-2 w-full py-2.5 px-6 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 flex justify-center items-center gap-2 cursor-pointer shadow-sm"
            >
              Register
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline ml-1 transition-all"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}