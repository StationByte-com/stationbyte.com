import Link from 'next/link';
import Image from 'next/image';

const Portfolio = () => {
  const projects = [
    {
      title: "EazyClock",
      category: "Scheduling Platform",
      description: "A next-generation intelligent scheduling platform that streamlines appointment management for businesses. Features smart scheduling, client management, and comprehensive analytics dashboard.",
      image: "/eazyclock-logo.png",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
      features: ["Smart Scheduling", "Client Management", "Analytics Dashboard", "Automated Reminders"],
      link: "https://eazyclock.com",
      status: "Live Product"
    },
    {
      title: "Custom E-commerce Platform",
      category: "Web Application",
      description: "Full-stack e-commerce solution with advanced inventory management, payment processing, and analytics dashboard for retail businesses.",
      image: "/ecommerce.png",
      technologies: ["Next.js", "Stripe", "MongoDB", "Redis"],
      features: ["Inventory Management", "Payment Processing", "Analytics", "Mobile Responsive"],
      link: "#contact",
      status: "Client Project"
    },
    {
      title: "AI-Powered Analytics Dashboard",
      category: "Data Analytics",
      description: "Machine learning-powered business intelligence platform that provides predictive analytics and automated reporting for enterprise clients.",
      image: "/ai.jpg",
      technologies: ["Python", "TensorFlow", "React", "D3.js"],
      features: ["Predictive Analytics", "Real-time Data", "Custom Reports", "AI Insights"],
      link: "#contact",
      status: "Enterprise Solution"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative pb-4">
            Our Portfolio
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our latest projects and see how we've helped businesses transform their ideas into successful digital solutions.
          </p>
        </div>
        
        <div className="space-y-12">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(67,97,238,0.15)]"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}>
                <div className="w-full lg:w-1/2 p-8">
                  <div className="relative">
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {project.status}
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                  <div className="mb-4">
                    <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, featureIndex) => (
                        <span 
                          key={featureIndex}
                          className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[var(--primary)]/20 hover:-translate-y-1"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href={project.link}
                      target={project.link.startsWith('http') ? "_blank" : "_self"}
                      rel={project.link.startsWith('http') ? "noopener noreferrer" : ""}
                      className="inline-flex items-center justify-center px-8 py-3 btn-gradient text-white rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]"
                    >
                      {project.link.startsWith('http') ? 'View Live Site' : 'Discuss Your Project'}
                      <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to See Your Project Here?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Join our portfolio of successful projects. Let's work together to create something amazing for your business.
            </p>
            <Link 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Start Your Project
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio; 