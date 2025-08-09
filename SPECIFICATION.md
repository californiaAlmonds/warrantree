# WarranTree - Warranty & Expiry Vault

> **📋 Technical Specification Document**  
> For project overview and setup instructions, see [README.md](./README.md)  
> For development progress tracking, see [ROADMAP.md](./ROADMAP.md)

## Project Overview
WarranTree is a full-stack application that helps users track warranties, expiry dates, and important documents. The app provides automated reminders, family sharing capabilities, and claim assistance to ensure users never miss important deadlines.

## Problem Statement
- People lose track of warranties, bills, and expiry dates (IDs, insurance, AMCs)
- Claims fail due to missing documentation or expired deadlines
- No centralized system to manage family/household items
- Manual tracking is unreliable and time-consuming

## Solution
A digital vault that automatically tracks purchase dates, warranty periods, and expiry dates with smart reminders and family sharing capabilities.

## Target Users
- **Primary**: Families and individuals managing household warranties and documents
- **Secondary**: Small business owners tracking equipment warranties
- **Tertiary**: Property managers handling multiple units/appliances

## Core Use Cases

### 1. Item Management
- Add new items (appliances, electronics, insurance policies, etc.)
- Upload and attach receipts, warranty cards, manuals
- Automatically calculate expiry dates
- Categorize items by type, room, or priority
- Edit/update item details and extend warranties

### 2. Reminder System
- Email notifications before expiry (30, 7, 1 day)
- Customizable reminder schedules per item
- Smart reminders based on item category (e.g., earlier for insurance)
- Mark items as renewed, expired, or claimed

### 3. Family Sharing
- Create family vaults with multiple members
- Role-based permissions (owner, editor, viewer)
- Share specific items or entire categories
- Activity logs for transparency

### 4. Document Management
- Secure file upload and storage
- Image optimization and compression
- Receipt/document viewer with zoom
- Multiple attachments per item
- Document search within vault

### 5. Claim Assistance
- Generate claim kits with all relevant documents
- Warranty status checker
- Seller/manufacturer contact information
- Step-by-step claim guidance

## Technical Features & Implementation

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Zod validation
- **File Upload**: react-dropzone with preview
- **Routing**: React Router v6
- **Charts**: Recharts for analytics
- **UI Components**: Headless UI + custom components

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with JPA/Hibernate
- **File Storage**: Cloudinary for images/documents
- **Email**: Resend for notifications
- **Scheduling**: Spring @Scheduled for reminders
- **API Documentation**: OpenAPI 3 (Swagger)
- **Validation**: Bean Validation (JSR-303)

### Database Schema
```sql
-- Core tables
users (id, email, password_hash, name, created_at, updated_at)
vaults (id, owner_user_id, name, description, created_at)
vault_members (vault_id, user_id, role, joined_at)

-- Item management
categories (id, name, icon, reminder_days_default)
items (id, vault_id, title, category_id, brand, model, serial_number, 
       purchase_date, price, warranty_months, expiry_date, notes, 
       status, created_at, updated_at)

-- File management
attachments (id, item_id, file_url, file_name, file_size, file_type, 
            uploaded_at, uploaded_by_user_id)

-- Reminder system
reminder_schedules (id, item_id, reminder_days, is_active)
reminder_logs (id, item_id, reminder_date, channel, status, sent_at)

-- Activity tracking
activity_logs (id, vault_id, user_id, action, target_type, target_id, 
               details, created_at)
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

#### Vaults
- `GET /api/vaults` - List user's vaults
- `POST /api/vaults` - Create new vault
- `GET /api/vaults/{id}` - Get vault details
- `PUT /api/vaults/{id}` - Update vault
- `DELETE /api/vaults/{id}` - Delete vault
- `POST /api/vaults/{id}/members` - Add vault member
- `DELETE /api/vaults/{id}/members/{userId}` - Remove member

#### Items
- `GET /api/items?vaultId&filter&category&search` - List/search items
- `POST /api/items` - Create new item
- `GET /api/items/{id}` - Get item details
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item
- `POST /api/items/{id}/renew` - Renew warranty/extend expiry
- `POST /api/items/{id}/claim` - Mark as claimed

#### Attachments
- `POST /api/upload/signed-url` - Get signed upload URL
- `POST /api/items/{id}/attachments` - Add attachment to item
- `GET /api/items/{id}/attachments` - List item attachments
- `DELETE /api/attachments/{id}` - Delete attachment

#### Reminders
- `GET /api/reminders/upcoming?days=30` - Get upcoming reminders
- `POST /api/items/{id}/reminders` - Configure item reminders
- `POST /api/admin/reminders/send` - Manual reminder trigger (admin)

#### Analytics & Reports
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/items/{id}/claim-kit` - Generate claim kit PDF
- `GET /api/export/vault/{id}?format=csv|pdf` - Export vault data

### Security Implementation
- JWT tokens with 15min access + 7day refresh
- Password hashing with BCrypt
- CORS configuration for frontend domain
- Rate limiting on auth endpoints
- File upload validation (size, type, virus scan)
- SQL injection protection via JPA
- XSS protection with proper headers

### Deployment Architecture
- **Frontend**: Vercel/Netlify (static hosting)
- **Backend**: Render (free web service)
- **Database**: Neon/Supabase (free PostgreSQL)
- **File Storage**: Cloudinary (free tier)
- **Email**: Resend (free tier)
- **Domain**: Custom domain optional

### Performance Considerations
- Database indexing on frequently queried fields
- Image compression and resizing via Cloudinary
- Pagination for large item lists
- Lazy loading for attachments
- Client-side caching with React Query
- CDN for static assets

### Monitoring & Analytics
- Error tracking with Sentry (optional)
- Application metrics via provider dashboards
- User analytics for feature usage
- Performance monitoring with Web Vitals

## MVP Feature Priority

### Phase 1 (Core MVP - 2 days)
1. User authentication (signup/login)
2. Basic item CRUD operations
3. File upload and attachment
4. Expiry date calculation
5. Simple reminder system (email only)
6. Basic vault sharing

### Phase 2 (Enhanced MVP - 1 day)
1. Categories and filtering
2. Dashboard with expiring items
3. Improved UI/UX
4. Mobile responsive design
5. Basic analytics

### Phase 3 (Polish - 1 day)
1. Claim kit generation
2. Advanced reminders
3. Activity logs
4. Export functionality
5. Demo data and onboarding

## Success Metrics
- User registration and retention
- Items added per user
- Reminder email open rates
- Claim kit downloads
- Family sharing adoption
- Time to value (first item added)

## Future Enhancements
- Mobile app (React Native)
- OCR for automatic receipt parsing
- AI-powered categorization
- Integration with e-commerce platforms
- Barcode scanning
- Push notifications
- Advanced analytics and insights
- API for third-party integrations 