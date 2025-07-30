import React from 'react'
import { motion } from 'framer-motion'

const TechStack = () => {
  const technologies = [
    {
      category: "Frontend",
      techs: [
        { name: "React", logo: "⚛️", description: "Modern UI library for building interactive interfaces" },
        { name: "Vue.js", logo: "🔧", description: "Progressive framework for building user interfaces" },
        { name: "TailwindCSS", logo: "🎨", description: "Utility-first CSS framework for rapid development" },
        { name: "Vite", logo: "⚡", description: "Fast build tool and development server" }
      ]
    },
    {
      category: "Backend",
      techs: [
        { name: "Node.js", logo: "🟢", description: "JavaScript runtime for server-side development" },
        { name: "Express", logo: "🚀", description: "Fast, minimalist web framework for Node.js" },
        { name: "Python", logo: "🐍", description: "Versatile language for web development and automation" },
        { name: "FastAPI", logo: "⚡", description: "Modern, fast Python web framework" }
      ]
    },
    {
      category: "Database",
      techs: [
        { name: "MongoDB", logo: "🍃", description: "Flexible NoSQL database for modern applications" },
        { name: "PostgreSQL", logo: "🐘", description: "Powerful open-source relational database" },
        { name: "Firebase", logo: "🔥", description: "Google's mobile and web application platform" },
        { name: "Supabase", logo: "⚡", description: "Open source Firebase alternative" }
      ]
    },
    {
      category: "DevOps & Cloud",
      techs: [
        { name: "AWS", logo: "☁️", description: "Comprehensive cloud computing platform" },
        { name: "Vercel", logo: "▲", description: "Platform for frontend frameworks and static sites" },
        { name: "Docker", logo: "🐳", description: "Containerization platform for application deployment" },
        { name: "Git", logo: "📚", description: "Version control system for tracking changes" }
      ]
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

  const categoryVariants = {
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

  const techVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="tech-stack" className="py-24 bg-white dark:bg-slate-900">
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
            Tech Stack
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Built with technologies that power the future. We use modern, 
            battle-tested tools to create scalable and maintainable solutions.
          </p>
          
          {/* Subtitle */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold">Modern • Scalable • Reliable</span>
          </div>
        </motion.div>

        {/* Tech Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {technologies.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={categoryVariants}
              className="text-center"
            >
              {/* Category Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {category.category}
              </h3>

              {/* Tech Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.techs.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    variants={techVariants}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 h-full">
                      {/* Logo */}
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {tech.logo}
                      </div>

                      {/* Name */}
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {tech.name}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-3xl font-bold mb-6">
                Always Learning, Always Evolving
              </h3>
              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                Technology moves fast, and so do we. We stay up-to-date with the latest 
                frameworks, tools, and best practices to ensure your project is built 
                with future-proof technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Performance Optimized
                </span>
                <span className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  SEO Friendly
                </span>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Mobile First
                </span>
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Secure by Design
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack
