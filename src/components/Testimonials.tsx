'use client';

import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      quote: "StationByte delivered our e-commerce platform ahead of schedule and exceeded all our expectations. Their attention to detail and technical expertise is outstanding.",
      name: "Sarah Mitchell",
      role: "CEO, RetailFlow Co.",
      initials: "SM",
      color: "#4361ee"
    },
    {
      quote: "The mobile app StationByte developed for us has received incredible user feedback. Their full-stack development capabilities are truly impressive.",
      name: "Michael Chen",
      role: "CTO, FitnessTech",
      initials: "MC",
      color: "#7209b7"
    },
    {
      quote: "Working with StationByte on our AI analytics dashboard was seamless. They translated our complex requirements into an intuitive, powerful solution.",
      name: "Dr. Amanda Rodriguez",
      role: "Data Science Director, HealthMetrics",
      initials: "AR",
      color: "#4cc9f0"
    },
    {
      quote: "From concept to deployment, StationByte handled everything professionally. Their expertise in web development and cloud infrastructure saved us months of work.",
      name: "James Thompson",
      role: "Product Manager, CloudSync",
      initials: "JT",
      color: "#560bad"
    },
    {
      quote: "The custom CRM system StationByte built for us has revolutionized our sales process. Their understanding of business needs sets them apart.",
      name: "Lisa Park",
      role: "Sales Director, Enterprise Solutions",
      initials: "LP",
      color: "#3a0ca3"
    },
    {
      quote: "StationByte's ongoing support and maintenance has been exceptional. They're not just developers, they're true technology partners.",
      name: "Robert Davis",
      role: "IT Director, Manufacturing Plus",
      initials: "RD",
      color: "#f72585"
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative pb-4">
            Client Success Stories
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how we&apos;ve helped businesses transform their ideas into successful digital solutions.
          </p>
        </div>
        
        <div className="relative overflow-hidden py-5 max-w-5xl mx-auto">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (350 + 30)}px)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[350px] mx-4 p-8 bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(67,97,238,0.15)]"
              >
                <div className="text-center">
                  <p className="text-lg text-gray-900 mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: testimonial.color }}
                    >
                      {testimonial.initials}
                    </div>
                    
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-lg mb-1">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-[var(--primary)] border-2 border-[var(--primary-dark)]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mt-5">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border-none shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:-translate-y-1 flex items-center justify-center text-lg"
            >
              &#10094;
            </button>
            
            <button
              onClick={togglePause}
              className="w-10 h-10 rounded-full bg-white border-none shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:-translate-y-1 flex items-center justify-center text-sm"
            >
              {isPaused ? '▶' : '⏸'}
            </button>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border-none shadow-[0_5px_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:-translate-y-1 flex items-center justify-center text-lg"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 