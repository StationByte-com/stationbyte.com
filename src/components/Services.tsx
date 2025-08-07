'use client';

import { useState } from 'react';

const Services = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: '🌐',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Next.js, and Node.js.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Scalable Architecture'],
      technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL']
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: ['Native Performance', 'Cross-Platform', 'App Store Ready', 'Push Notifications'],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']
    },
    {
      icon: '🤖',
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by artificial intelligence and machine learning.',
      features: ['Custom AI Models', 'Data Analytics', 'Automation', 'Predictive Analytics'],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'Langchain']
    },
    {
      icon: '📊',
      title: 'Custom Dashboards',
      description: 'Data visualization and business intelligence dashboards for informed decision making.',
      features: ['Real-time Data', 'Interactive Charts', 'Custom Reports', 'Mobile Responsive'],
      technologies: ['D3.js', 'Chart.js', 'Tableau', 'Power BI', 'React']
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces that provide exceptional user experiences.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'Framer']
    },
    {
      icon: '☁️',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions for modern applications.',
      features: ['Auto Scaling', 'CI/CD Pipelines', 'Monitoring', 'Security'],
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes']
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative pb-4">
            Our Development Services
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From concept to deployment, our development studio provides comprehensive software services to bring your ideas to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 cursor-pointer group hover:-translate-y-2 hover:shadow-2xl ${
                activeService === index ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''
              }`}
              onMouseEnter={() => setActiveService(index)}
            >
              {/* Service Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              {/* Service Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--primary)] transition-colors duration-300">
                {service.title}
              </h3>
              
              {/* Service Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              {/* Service Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Key Features</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Technologies */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--secondary)]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Let's discuss how we can help you build the perfect solution for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <span>Get Free Consultation</span>
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#portfolio" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                View Our Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
