'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="#home" 
            className="flex items-center transition-transform duration-300 hover:-translate-y-1 z-[1001]"
            onClick={closeMenu}
          >
            <Image
              src="/logo-full.svg"
              alt="StationByte Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer z-[1001] ${isMenuOpen ? 'fixed right-8' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`block h-[3px] w-full bg-[var(--primary)] rounded-sm transition-all duration-300 ${isMenuOpen ? 'translate-y-[9px] rotate-45' : ''}`} />
            <span className={`block h-[3px] w-full bg-[var(--primary)] rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[3px] w-full bg-[var(--primary)] rounded-sm transition-all duration-300 ${isMenuOpen ? '-translate-y-[9px] -rotate-45' : ''}`} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex gap-8">
              <li><Link href="#home" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">Home</Link></li>
              <li><Link href="#services" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">Services</Link></li>
              <li><Link href="#portfolio" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">Portfolio</Link></li>
              <li><Link href="#features" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">Why Us</Link></li>
              <li><Link href="#about" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">About</Link></li>
              <li><Link href="#contact" className="text-gray-900 font-medium relative transition-colors duration-300 hover:text-[var(--primary)] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:after:w-full">Contact</Link></li>
            </ul>
          </nav>

          {/* Desktop CTA Button */}
          <Link 
            href="#contact" 
            className="hidden md:inline-block px-6 py-3 btn-gradient text-white rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed top-0 ${isMenuOpen ? 'right-0' : '-right-full'} w-4/5 max-w-sm h-screen bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-center items-center z-[1000]`}>
        <ul className="flex flex-col gap-8 items-center mb-8">
          <li><Link href="#home" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">Home</Link></li>
          <li><Link href="#services" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">Services</Link></li>
          <li><Link href="#portfolio" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">Portfolio</Link></li>
          <li><Link href="#features" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">Why Us</Link></li>
          <li><Link href="#about" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">About</Link></li>
          <li><Link href="#contact" onClick={closeMenu} className="text-gray-900 font-medium text-lg transition-colors duration-300 hover:text-[var(--primary)]">Contact</Link></li>
        </ul>
        <Link 
          href="#contact" 
          onClick={closeMenu}
          className="inline-block px-6 py-3 btn-gradient text-white rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)]"
        >
          Get Started
        </Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-[999]" 
          onClick={closeMenu}
        />
      )}

      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
};

export default Header; 