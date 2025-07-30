import React from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Palette, 
  Settings, 
  Database, 
  Users, 
  ArrowRight 
} from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Business Website Development",
      description: "Custom websites built with modern technologies, optimized for performance and conversions.",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile First"]
    },
    {
      icon: Palette,
      title: "Portfolio Sites for Creators",
      description: "Stunning portfolio websites that showcase your work and attract ideal clients.",
      features: ["Creative Design", "Gallery Systems", "Client Management", "Brand Integration"]
    },
    {
      icon: Settings,
      title: "Website Maintenance & Hosting",
      description: "Reliable hosting and ongoing maintenance to keep your website running smoothly.",
      features: ["24/7 Monitoring", "Security Updates", "Performance Optimization", "Regular Backups"]
    },
    {
      icon: Database,
      title: "Full-Stack API & Database",
      description: "Complete backend solutions with APIs, databases, and integrations for complex applications.",
      features: ["RESTful APIs", "Database Design", "Third-party Integration", "Scalable Architecture"]
    },
    {
      icon: Users,
      title: "Digital Consultation",
      description: "Strategic guidance on technology choices, development roadmaps, and digital transformation.",
      features: ["Tech Stack Advisory", "Project Planning", "Performance Audit", "Growth Strategy"]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From concept to launch, we provide end-to-end digital solutions 
            that help your business thrive in the digital landscape.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-cyan">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="group flex items-center text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-8 text-white glow-blue">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Let's discuss your project and create something amazing together. 
              Get a free consultation and project estimate.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
