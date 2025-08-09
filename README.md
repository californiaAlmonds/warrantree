# WarranTree 🌳

> **Never lose track of warranties and important documents again**

WarranTree is a modern, full-stack warranty and document management application that helps families and individuals organize their purchases, track expiry dates, and receive timely reminders - all while sharing access with family members.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

## 🚀 Features

### ✨ Core Functionality
- **Smart Item Tracking**: Add appliances, electronics, insurance policies, and more
- **Automatic Expiry Calculation**: Just enter purchase date and warranty period
- **Document Storage**: Upload receipts, warranty cards, and manuals securely
- **Email Reminders**: Get notified 30, 7, and 1 day before expiry
- **Family Sharing**: Share vaults with family members with role-based permissions

### 🛡️ Advanced Features
- **Claim Kit Generation**: Auto-generate PDFs with all relevant documents
- **Category Management**: Organize items by type, room, or priority
- **Search & Filter**: Find items quickly with advanced search
- **Activity Logs**: Track who made changes and when
- **Export Options**: Download your data in CSV or PDF format

### 📱 User Experience
- **Mobile Responsive**: Works perfectly on all devices
- **Intuitive UI**: Clean, modern interface built with Tailwind CSS
- **Real-time Updates**: See changes instantly across all devices
- **Secure Authentication**: JWT-based auth with refresh tokens

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Query** for efficient server state management
- **React Hook Form + Zod** for robust form handling
- **React Router** for seamless navigation

### Backend
- **Spring Boot 3.2** with Java 17+
- **Spring Security** with JWT authentication
- **PostgreSQL** with JPA/Hibernate
- **Spring Scheduler** for automated reminders
- **OpenAPI 3** for API documentation

### Infrastructure
- **Cloudinary** for secure file storage and optimization
- **Resend** for reliable email delivery
- **Render** for backend hosting (free tier)
- **Vercel/Netlify** for frontend hosting (free tier)
- **Neon/Supabase** for PostgreSQL database (free tier)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Java** 17+ and Maven
- **PostgreSQL** 15+ (or use cloud database)
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/warrantree.git
cd warrantree
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your database and service credentials
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 📖 Documentation

- **[📋 SPECIFICATION.md](./SPECIFICATION.md)** - Complete technical specification and architecture
- **[🗺️ ROADMAP.md](./ROADMAP.md)** - Development roadmap and feature tracking
- **[🔧 API Documentation](http://localhost:8080/swagger-ui.html)** - Interactive API docs (when running)

## 🏃‍♂️ Development

### Project Structure
```
WarranTree/
├── README.md              # Project overview and setup
├── SPECIFICATION.md       # Technical specification
├── ROADMAP.md            # Development roadmap
├── backend/              # Spring Boot application
│   ├── src/main/java/    # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml           # Maven dependencies
└── frontend/             # React application
    ├── src/              # React source code
    ├── public/           # Static assets
    └── package.json      # Node dependencies
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/warrantree
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@warrantree.com
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=WarranTree
```

### Available Scripts

#### Backend
```bash
mvn spring-boot:run     # Start development server
mvn test               # Run tests
mvn clean package      # Build for production
```

#### Frontend
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run test           # Run tests
npm run lint           # Lint code
```

## 🚀 Deployment

### Free Tier Deployment
1. **Database**: Deploy to Neon or Supabase (free PostgreSQL)
2. **Backend**: Deploy to Render (free web service)
3. **Frontend**: Deploy to Vercel or Netlify (free static hosting)
4. **Files**: Use Cloudinary free tier (25GB storage)
5. **Email**: Use Resend free tier (3,000 emails/month)

### Production Deployment
See detailed deployment instructions in [SPECIFICATION.md](./SPECIFICATION.md#deployment-architecture).

## 🤝 Contributing

We welcome contributions! Please see our development phases in [ROADMAP.md](./ROADMAP.md).

### Current Development Status
- ✅ **Planning**: Complete
- ⏳ **Phase 1**: Foundation (In Progress)
- 📋 **Phase 2**: Enhancement (Planned)
- 🚀 **Phase 3**: Polish & Deploy (Planned)

### How to Contribute
1. Check the [ROADMAP.md](./ROADMAP.md) for current priorities
2. Look for unchecked items in the development phases
3. Create a feature branch from `main`
4. Submit a pull request with clear description

## 📊 Project Status

| Feature | Status |
|---------|--------|
| 🔐 Authentication | 📋 Planned |
| 📦 Item Management | 📋 Planned |
| 📁 File Upload | 📋 Planned |
| ⏰ Reminders | 📋 Planned |
| 👨‍👩‍👧‍👦 Family Sharing | 📋 Planned |
| 📱 Mobile Responsive | 📋 Planned |
| 🎨 UI/UX Polish | 📋 Planned |
| 🚀 Deployment | 📋 Planned |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern warranty management needs
- **Tech Stack**: React, Spring Boot, and PostgreSQL communities
- **Free Tier Providers**: Render, Vercel, Cloudinary, and Resend for making development accessible

## 📞 Support

- **Documentation**: Check [SPECIFICATION.md](./SPECIFICATION.md) for technical details
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Development**: See [ROADMAP.md](./ROADMAP.md) for development status

---

**Built with ❤️ for families who want to stay organized**

*Never miss another warranty claim or important renewal again!* 