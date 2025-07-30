import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Eye } from 'lucide-react'
import apiService from '../services/api'

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback projects for when API is not available
  const fallbackProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Full-Stack",
      description: "Modern e-commerce solution with React, Node.js, and Stripe integration",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "TailwindCSS"],
      features: ["Payment Processing", "Admin Dashboard", "Inventory Management", "Order Tracking"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Built for a growing retail business, this platform increased online sales by 300% within the first quarter." }
    },
    {
      id: 2,
      title: "Creative Agency Portfolio",
      category: "Frontend",
      description: "Beautiful portfolio website with smooth animations and CMS integration",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
      technologies: ["React", "Framer Motion", "Sanity CMS", "Vercel"],
      features: ["Dynamic Content", "Smooth Animations", "Contact Forms", "SEO Optimized"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Helped a creative agency showcase their work and attract high-value clients with a 40% increase in inquiries." }
    },
    {
      id: 3,
      title: "SaaS Dashboard",
      category: "Full-Stack", 
      description: "Analytics dashboard with real-time data visualization and user management",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["Vue.js", "Express", "PostgreSQL", "Chart.js", "Socket.io"],
      features: ["Real-time Updates", "Data Visualization", "User Authentication", "Role Management"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Empowered a startup to better understand their user data, leading to improved product decisions and 25% user retention increase." }
    },
    {
      id: 4,
      title: "Restaurant Management",
      category: "Full-Stack",
      description: "Complete restaurant management system with ordering and inventory features",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      features: ["Online Ordering", "Table Management", "Inventory Tracking", "Staff Portal"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Streamlined operations for a restaurant chain, reducing order processing time by 60% and improving customer satisfaction." }
    },
    {
      id: 5,
      title: "Real Estate Platform",
      category: "Full-Stack",
      description: "Property listing platform with advanced search and virtual tours",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Mapbox", "AWS S3"],
      features: ["Property Search", "Virtual Tours", "Mortgage Calculator", "Agent Portal"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Modernized a real estate agency's online presence, resulting in 50% more qualified leads and faster property sales." }
    },
    {
      id: 6,
      title: "Fitness Tracking App",
      category: "Mobile",
      description: "React Native app for fitness tracking with social features",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      features: ["Workout Tracking", "Social Feed", "Progress Analytics", "Challenges"],
      links: { live: "#", github: "#" },
      metrics: { impact: "Built for a fitness startup, achieving 10k+ downloads in the first month and 85% user retention rate." }
    }
  ]

  // Load projects and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Try to load from API first
        const [projectsResponse, categoriesResponse] = await Promise.all([
          apiService.getProjects(),
          apiService.getProjectCategories()
        ])
        
        setProjects(projectsResponse.data || [])
        setCategories(categoriesResponse.data?.map(cat => cat._id) || ['All'])
        
        // If no projects from API, use fallback
        if (!projectsResponse.data || projectsResponse.data.length === 0) {
          setProjects(fallbackProjects)
          setCategories(['All', 'Full-Stack', 'Frontend', 'Mobile'])
        }
        
      } catch (error) {
        console.error('Error loading portfolio data:', error)
        // Use fallback data on error
        setProjects(fallbackProjects)
        setCategories(['All', 'Full-Stack', 'Frontend', 'Mobile'])
        setError('Using demo data - API not available')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter projects based on active category
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="portfolio" className="py-24 bg-gray-50 dark:bg-slate-800">
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
            Our Work
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of successful projects. Each one tells a story 
            of innovation, creativity, and measurable business impact.
          </p>
          {error && (
            <p className="text-yellow-600 dark:text-yellow-400 mt-4 text-sm">
              {error}
            </p>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-2 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id || project._id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || (project.images && project.images[0]?.url) || 'https://via.placeholder.com/600x400'}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                        <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {(project.links?.live || project.liveUrl) && (
                          <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        {(project.links?.github || project.githubUrl) && (
                          <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Github className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies || []).length > 3 && (
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          +{(project.technologies || []).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No projects found in this category.
            </p>
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div>
                    <img
                      src={selectedProject.image || (selectedProject.images && selectedProject.images[0]?.url) || 'https://via.placeholder.com/600x400'}
                      alt={selectedProject.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedProject.category}
                      </span>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {selectedProject.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {selectedProject.description}
                    </p>

                    {/* Features */}
                    {(selectedProject.features && selectedProject.features.length > 0) && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {selectedProject.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {(selectedProject.technologies && selectedProject.technologies.length > 0) && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Impact/Case Study */}
                    {(selectedProject.metrics?.impact || selectedProject.caseStudy) && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Impact</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedProject.metrics?.impact || selectedProject.caseStudy}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-4">
                      {(selectedProject.links?.live || selectedProject.liveUrl) && (
                        <a
                          href={selectedProject.links?.live || selectedProject.liveUrl}
                          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Live</span>
                        </a>
                      )}
                      {(selectedProject.links?.github || selectedProject.githubUrl) && (
                        <a
                          href={selectedProject.links?.github || selectedProject.githubUrl}
                          className="flex items-center space-x-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's create something amazing together. Every project starts with a conversation.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio
