import React from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Lightbulb, 
  Shield, 
  Zap, 
  Users, 
  Award 
} from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "Every project is built with your business goals in mind, focusing on measurable outcomes."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We use cutting-edge technologies and creative solutions to stay ahead of the curve."
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Your projects are built with security best practices and long-term reliability in mind."
    }
  ]

  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "50+", label: "Projects Completed" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About Bureau Engine
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6"></div>
            </div>

            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="text-gray-900 dark:text-white">
                  Founded by a solo developer with a passion for digital transformation,
                </strong>{' '}
                Bureau Engine was created to empower businesses with modern, scalable web solutions 
                that drive real results.
              </p>
              
              <p>
                We specialize in building custom websites and applications using the latest 
                technologies. Our approach combines technical excellence with creative design 
                to deliver digital experiences that not only look great but perform exceptionally.
              </p>

              <p>
                From startups to established businesses, we've helped companies across various 
                industries establish their digital presence and achieve their growth objectives 
                through strategic web development.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-purple-600" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Modern tech stack with React, Node.js, and cloud technologies
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Scalable applications built for growth
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-purple-600" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Clean UI/UX design focused on user experience
                </span>
              </div>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-lg"
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              To bridge the gap between ambitious ideas and digital reality by creating 
              exceptional web experiences that drive business growth and user engagement. 
              We believe that great technology should be accessible to every business, 
              regardless of size.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
