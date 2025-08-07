const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Rapid Development',
      description: 'Agile development methodology with quick iterations and fast time-to-market for your projects.',
    },
    {
      icon: '🎯',
      title: 'Custom Solutions',
      description: 'Tailored software solutions designed specifically for your business needs and requirements.',
    },
    {
      icon: '🛠️',
      title: 'Full-Stack Expertise',
      description: 'End-to-end development capabilities from frontend design to backend infrastructure.',
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Applications that work seamlessly across web, mobile, and desktop platforms.',
    },
    {
      icon: '🤖',
      title: 'AI Integration',
      description: 'Cutting-edge AI and machine learning capabilities to enhance your business operations.',
    },
    {
      icon: '🔧',
      title: 'Ongoing Maintenance',
      description: 'Continuous support, updates, and maintenance to keep your software running smoothly.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative pb-4">
            Why Choose StationByte
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our development studio combines technical excellence with business understanding to deliver solutions that drive results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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