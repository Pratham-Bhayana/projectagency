# Bureau Engine

> **Engineering Digital Success**

A modern, full-stack web application for Bureau Engine - a digital agency specializing in building and managing websites and digital solutions for businesses.

## 🚀 Features

### Frontend
- **Modern React Application** - Built with React 18, Vite, and TailwindCSS
- **Responsive Design** - Mobile-first approach with beautiful animations
- **Smooth Animations** - Powered by Framer Motion for engaging user experiences
- **Dark Mode Support** - Toggle between light and dark themes
- **Contact Form** - Interactive form with validation and submission
- **Portfolio Showcase** - Dynamic project gallery with filtering
- **SEO Optimized** - Meta tags and semantic HTML structure

### Backend
- **RESTful API** - Built with Node.js and Express
- **MongoDB Database** - Flexible document storage with Mongoose ODM
- **Email Integration** - Automated email notifications with Nodemailer
- **Security** - Rate limiting, CORS, Helmet for security headers
- **Input Validation** - Joi validation for all API endpoints
- **Admin Authentication** - JWT-based auth system for admin panel

### Sections
1. **Hero Section** - Animated background with compelling headline
2. **Services** - Showcasing development offerings with feature cards
3. **About** - Company story and mission with statistics
4. **Tech Stack** - Technologies and tools used
5. **Portfolio** - Project showcase with filtering and modals
6. **Contact** - Advanced contact form with project details
7. **Footer** - Links, contact info, and newsletter signup

## �️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Nodemailer** - Email sending
- **JWT** - Authentication (optional)

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bureau-engine
```

2. Install all dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

4. Start development servers
```bash
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:3001) concurrently.

## 📁 Project Structure

```
bureau-engine/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── assets/
│   └── public/
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   └── uploads/
└── shared/           # Shared types and utilities
```

## 🌟 Features

- **Hero Section** - Animated background with compelling CTAs
- **Services** - Interactive service cards with animations
- **About** - Founder story and company highlights
- **Tech Stack** - Modern technology showcase
- **Portfolio** - Dynamic project grid with case studies
- **Contact** - Animated form with validation
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme toggle (optional)
- **Admin Dashboard** - Project and lead management (optional)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
# Deploy to your preferred platform
```

## 📝 License

MIT License - see LICENSE file for details.

---

**Designed & Developed by Bureau Engine** 🚀
