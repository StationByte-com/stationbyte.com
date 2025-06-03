import Link from 'next/link';

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 relative pb-4">
          About StationByte
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
        </h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Animated Shape */}
          <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative w-full pb-[100%] overflow-hidden rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 p-[5%]">
                <div className="animate-morphing w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex justify-center items-center overflow-hidden relative">
                  {/* Background pattern */}
                  <div className="absolute -inset-1/2 w-[200%] h-[200%] opacity-20">
                    <div 
                      className="w-full h-full animate-spin"
                      style={{ 
                        background: `repeating-linear-gradient(
                          45deg,
                          rgba(255, 255, 255, 0.05),
                          rgba(255, 255, 255, 0.05) 10px,
                          rgba(255, 255, 255, 0.08) 10px,
                          rgba(255, 255, 255, 0.08) 20px
                        )`,
                        animationDuration: '40s'
                      }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center text-white relative z-10 animate-[float-content_6s_ease-in-out_infinite]">
                    <div className="text-2xl font-black mb-4 text-shadow-lg tracking-tight relative bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm border-2 border-white/30 shadow-lg transform perspective-500 rotateX-10">
                      StationByte
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 max-w-64">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105">
                        Innovation
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105">
                        Quality
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105">
                        Trust
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Transforming Businesses Through Technology
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              StationByte LLC is a forward-thinking SaaS company dedicated to creating innovative solutions that help businesses streamline their operations and boost productivity.
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded by a team of passionate developers and business experts, our mission is to provide user-friendly software that solves real-world problems for organizations of all sizes.
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              We believe in creating products that are not only powerful and feature-rich but also intuitive and enjoyable to use. Our commitment to quality, security, and customer satisfaction drives everything we do.
            </p>
            
            {/* Company Stats */}
            <div className="flex flex-wrap justify-between gap-5 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center flex-1 min-w-[120px] p-5 rounded-lg bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(67,97,238,0.1)]"
                >
                  <span className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.number}
                  </span>
                  <span className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            
            <Link 
              href="#contact" 
              className="inline-block px-8 py-3 btn-gradient text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 