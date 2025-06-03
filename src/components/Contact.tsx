import Link from 'next/link';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 relative pb-4">
          Contact Us
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="p-10 bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-6">
              Get in Touch
            </h3>
            
            <div className="mb-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-lg">
                ✉️
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Email</h4>
                <Link 
                  href="mailto:contact@stationbyte.com"
                  className="text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
                >
                  contact@stationbyte.com
                </Link>
                <p className="text-sm text-[var(--secondary)] italic mt-1">
                  Email is our preferred method of communication
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-5 bg-[var(--primary)]/5 border-l-4 border-[var(--primary)] rounded-r-md">
              <p className="text-gray-600 mb-4 leading-relaxed">
                We value your feedback and inquiries. Our team is dedicated to providing timely responses to all emails within 24-48 hours.
              </p>
              <p className="text-gray-600 leading-relaxed">
                For product support, feature requests, or partnership opportunities, please include relevant details in your email to help us serve you better.
              </p>
            </div>
          </div>
          
          {/* Email Highlight */}
          <div className="p-10 bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-6">
              Email Us Directly
            </h3>
            
            <div className="flex items-center bg-[var(--primary)]/5 p-6 rounded-lg mb-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(67,97,238,0.1)]">
              <div className="text-[var(--primary)] mr-5 text-5xl">
                📧
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Our Email Address
                </h4>
                <Link 
                  href="mailto:contact@stationbyte.com"
                  className="block text-xl font-semibold text-[var(--primary)] mb-2 hover:text-[var(--secondary)] transition-colors duration-300 break-all"
                >
                  contact@stationbyte.com
                </Link>
                <p className="text-gray-600 text-sm">
                  The quickest way to reach our team
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                When contacting us, please include:
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-3 mt-1">✓</span>
                  <span className="text-gray-600">Your name and company (if applicable)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-3 mt-1">✓</span>
                  <span className="text-gray-600">The product or service you&apos;re interested in</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-3 mt-1">✓</span>
                  <span className="text-gray-600">Details of your inquiry or feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-3 mt-1">✓</span>
                  <span className="text-gray-600">Best time to respond (if needed)</span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="mailto:contact@stationbyte.com"
              className="inline-block w-full text-center px-8 py-4 btn-gradient text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]"
            >
              Send Email Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 