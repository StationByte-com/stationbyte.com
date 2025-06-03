import Link from 'next/link';
import Image from 'next/image';

const Products = () => {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 relative pb-4">
          Our Products
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
        </h2>
        
        <div className="bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(67,97,238,0.15)] mb-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 p-8">
              <Image 
                src="/eazyclock-logo.png" 
                alt="EazyClock"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] mix-blend-multiply"
              />
            </div>
            
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-4">
                EazyClock
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                A powerful and intuitive time tracking solution designed to help businesses of all sizes manage employee time, streamline payroll processing, and improve productivity.
              </p>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                With EazyClock, you can easily track working hours, manage shifts, generate reports, and integrate with your existing tools.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)]/20 hover:-translate-y-1">
                  Time Tracking
                </span>
                <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)]/20 hover:-translate-y-1">
                  Payroll Integration
                </span>
                <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)]/20 hover:-translate-y-1">
                  Reporting
                </span>
                <span className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)]/20 hover:-translate-y-1">
                  Team Management
                </span>
              </div>
              
              <Link 
                href="https://eazyclock.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 btn-gradient text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products; 