'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-20 mt-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--primary)]/10 rounded-full animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[var(--secondary)]/10 rounded-full animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-[var(--accent)]/10 rounded-full animate-blob animation-delay-4000"></div>
          </div>

          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] animate-float">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-[var(--primary)]/5 -z-10 translate-x-2 translate-y-2">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              The page you&apos;re looking for seems to have wandered off into the digital void. 
              Don&apos;t worry, even the best explorers get lost sometimes!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 btn-gradient text-white rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_15px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_20px_rgba(67,97,238,0.4)] group"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">🏠</span>
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--primary)] hover:text-white shadow-[0_4px_15px_rgba(67,97,238,0.1)] hover:shadow-[0_6px_20px_rgba(67,97,238,0.2)] group"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-1">←</span>
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Looking for something specific?
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/#products" 
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]/20 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚀</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary)] transition-colors duration-300">Products</span>
              </Link>
              
              <Link 
                href="/#features" 
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]/20 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⭐</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary)] transition-colors duration-300">Features</span>
              </Link>
              
              <Link 
                href="/#about" 
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]/20 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏢</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary)] transition-colors duration-300">About</span>
              </Link>
              
              <Link 
                href="/#contact" 
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--primary)]/20 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary)] transition-colors duration-300">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 