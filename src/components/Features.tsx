const Features = () => {
  const features = [
    {
      icon: '☁️',
      title: 'Cloud-Based',
      description: 'Access your data anytime, anywhere with our secure cloud-based solutions. No installations required.',
    },
    {
      icon: '🛡️',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures and regular backups.',
    },
    {
      icon: '🚀',
      title: 'Scalable Solutions',
      description: 'Our products grow with your business, from startups to enterprise-level organizations.',
    },
    {
      icon: '⏰',
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you with any questions or issues.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 relative pb-4">
          Why Choose Us
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-6 text-white text-2xl">
                {feature.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 