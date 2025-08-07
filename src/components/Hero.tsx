import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/30 rotate-45 animate-float-shape" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500/30 rotate-12 animate-float-shape" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-cyan-500/30 rounded-full animate-float-shape" style={{ animationDelay: '-6s' }} />
        <div className="absolute bottom-1/4 right-1/6 w-5 h-5 bg-pink-500/30 rotate-45 animate-float-shape" style={{ animationDelay: '-8s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-32">
          
          {/* Left side - Text content */}
          <div className="text-center lg:text-left space-y-8 order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-[fadeIn_0.8s_ease-out_0.2s_both]">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Full-Stack Development Services
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-[slideInUp_0.8s_ease-out_0.4s_both]">
              <span className="block text-gray-900">Your Complete</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Development Studio
              </span>
              <span className="block text-gray-900">Partner</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-[fadeIn_0.8s_ease-out_0.6s_both]">
              From <span className="font-semibold text-blue-600">web & mobile apps</span> to 
              <span className="font-semibold text-purple-600"> AI solutions</span> and 
              <span className="font-semibold text-cyan-600"> custom dashboards</span> - we build everything your business needs to succeed.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[slideInUp_0.8s_ease-out_0.8s_both]">
              <Link 
                href="#services" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <span>View Our Services</span>
                <svg className="ml-2 -mr-1 w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                href="#about" 
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-full transition-all duration-300 hover:bg-white hover:border-gray-300 hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                <span>Learn More</span>
                <svg className="ml-2 -mr-1 w-5 h-5 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 animate-[fadeIn_0.8s_ease-out_1s_both]">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Bank-level Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Development showcase */}
          <div className="relative order-2 animate-[slideInRight_0.8s_ease-out_0.6s_both]">
            {/* Background gradient for image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-6 scale-105"></div>
            
            {/* Main development showcase */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                <Image 
                  src="/dashboard.jpg"
                  alt="StationByte Development Services - Custom Software Solutions"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* StationByte logo overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Service badges */}
              <div className="absolute -top-4 -right-4 space-y-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  💻 Custom Development
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  🎨 Full Design
                </div>
              </div>
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 animate-float">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-xs text-gray-600">Projects Delivered</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-1 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Link href="#services" className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors">
          <span className="text-xs mb-2">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default Hero; 