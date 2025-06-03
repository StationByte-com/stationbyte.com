import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Company Info */}
          <div>
            <Link href="#" className="text-2xl md:text-3xl font-bold text-white mb-5 inline-block">
              Station<span className="text-[var(--accent)]">Byte</span>
            </Link>
            <p className="text-white/70 leading-relaxed mt-5">
              Innovative SaaS solutions designed to help businesses streamline operations and boost productivity.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold mb-5 text-white relative pb-3">
              Quick Links
              <div className="absolute left-0 bottom-0 w-10 h-0.5 bg-[var(--primary)]" />
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#home" 
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="#products" 
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="#features" 
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="#about" 
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact" 
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold mb-5 text-white relative pb-3">
              Products
              <div className="absolute left-0 bottom-0 w-10 h-0.5 bg-[var(--primary)]" />
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="https://eazyclock.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                >
                  EazyClock
                </Link>
              </li>
              <li>
                <span className="text-white/70 block">Coming Soon</span>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold mb-5 text-white relative pb-3">
              Contact Us
              <div className="absolute left-0 bottom-0 w-10 h-0.5 bg-[var(--primary)]" />
            </h4>
            <p className="text-white/70 leading-relaxed mb-4">
              Have questions or suggestions? We&apos;d love to hear from you!
            </p>
            <Link 
              href="mailto:contact@stationbyte.com"
              className="inline-flex items-center gap-3 bg-white/10 px-4 py-3 rounded-lg text-white text-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
            >
              <span className="text-lg">✉️</span>
              contact@stationbyte.com
            </Link>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            &copy; 2025 StationByte LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 