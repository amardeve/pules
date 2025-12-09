# pules
# Pulse API — Project Description

Pulse API is a modular, scalable backend built with **Node.js**, **Express**, and **MongoDB**.  
It is designed to power a content-driven platform where administrators can publish and manage dynamic data such as news, projects, programs, partners, and user messages.

The system includes a secure authentication mechanism, role-based access control, image uploading, and structured validation to maintain consistent and clean data.

---

## 🚀 Core Features

### **🔐 Authentication & Authorization**
- Secure login using **JWT tokens**
- Every protected endpoint requires `Authorization: Bearer <token>`
- Role-based authorization (e.g., only `admin` can create/update/delete content)

---

## 📰 News Management
A full CRUD module that supports:
- Creating news with:
  - Title  
  - Content  
  - Categories (list or comma-separated)  
  - Multiple images  
- Updating news with optional image replacement  
- Searching through titles & content  
- Pagination & sorting  
- Public read access, admin write access

---

## 🧩 Project Management
Projects support:
- Title, content, categories  
- Auto-generated URL slug  
- Multiple images & optional logo  
- Search, category filtering, sorting  
- Text indexing for efficient search  
- Admin-only creation and editing

---

## 🎓 Programs Module
A simple CRUD module for:
- Program title  
- Content/description  
- Optional logo or image  
- Public read / admin write

---

## 🤝 Partners Management
Manages organization partners:
- Name  
- Content  
- Logo or image upload  
- Public list / admin CRUD

---

## 📩 Contact Messages
Visitors can submit messages without authentication:
- First name  
- Last name  
- Email  
- Message text

Admins can:
- List messages  
- View individual messages  
- Update or delete messages

---

## 🖼️ Image Uploading
- Image uploads handled with **Multer**
- Only valid image types allowed
- Files stored in `/uploads/`
- File URLs returned in API responses

---

## 🧪 Validation & Error Handling
- All create/update requests validated with **Joi**
- Standardized error response structure
- Centralized error handler ensures consistent API output

---

## 🗂️ Organized Architecture
The project follows a clean, scalable folder structure:
- `models/` for Mongoose schemas  
- `controllers/` for business logic  
- `routes/` for endpoints  
- `middlewares/` for auth, validation, file uploads  
- `validators/` for Joi schemas  
- `utils/` for helper functions  

This separation makes the API easy to maintain, extend, and test.

---

## 📦 Ready for Production Enhancements
Although built with local file storage and basic JWT auth, the architecture supports:
- Switching image storage to S3 / Cloudinary  
- Adding rate limiting or caching  
- Docker deployment  
- CI/CD pipelines  
- Advanced logging  

---

## 🏁 Summary

Pulse API is a flexible backend designed for content-rich platforms.  
It combines authentication, content management, image uploading, and validation into one reliable backend system, making it ideal for news portals, project showcases, and organizational websites.

It is clean, modular, secure, and ready for future expansion.

---


/// //// /// all end point 

Login User

URL: /api/auth/login

Method: POST

Access: Public this admin user

Body:

{

  "email": "b@ex.com",
  "password": "bbb123"

}


Description: Logs in a user and returns a JWT token.

📰 News Endpoints
Create News

URL: /api/news

Method: POST

Access: Admin

Headers: Authorization: Bearer <token>

Body/Form-Data:

title (string)

content (string)

images (file) - multiple allowed

categories (string array)

Description: Creates a news post.

Get All News

URL: /api/news

Method: GET

Access: Public

Query Parameters:

page (optional, number)

limit (optional, number)

search (optional, string)

category (optional, string)

Description: Returns paginated list of news with optional search/filter.

Get Single News

URL: /api/news/:id

Method: GET

Access: Public

Description: Retrieves a single news post by ID.

Update News

URL: /api/news/:id

Method: PUT

Access: Admin

Headers: Authorization: Bearer <token>

Body/Form-Data: Same as create

Description: Updates a news post by ID.

Delete News

URL: /api/news/:id

Method: DELETE

Access: Admin

Headers: Authorization: Bearer <token>

Description: Deletes a news post.

🏗️ Projects Endpoints
Create Project

URL: /api/projects

Method: POST

Access: Admin

Body/Form-Data:

title (string)

content (string)

images (file, multiple)

categories (string array, optional)

Get All Projects

URL: /api/projects

Method: GET

Access: Public

Query Parameters: page, limit, search, category

Get Single Project

URL: /api/projects/:id

Method: GET

Access: Public

Update Project

URL: /api/projects/:id

Method: PUT

Access: Admin

Headers: Authorization: Bearer <token>

Delete Project

URL: /api/projects/:id

Method: DELETE

Access: Admin

Headers: Authorization: Bearer <token>

🎓 Programs Endpoints

Create Program: POST /api/programs — Admin only

Get All Programs: GET /api/programs — Public

Get Single Program: GET /api/programs/:id — Public

Update Program: PUT /api/programs/:id — Admin only

Delete Program: DELETE /api/programs/:id — Admin only

🤝 Partners Endpoints

Create Partner: POST /api/partners — Admin only

Get All Partners: GET /api/partners — Public

Get Single Partner: GET /api/partners/:id — Public

Update Partner: PUT /api/partners/:id — Admin only

Delete Partner: DELETE /api/partners/:id — Admin only

📩 Contact Messages Endpoints

Create Message: POST /api/contact — Public

Get All Messages: GET /api/contact — Admin only

Get Single Message: GET /api/contact/:id — Admin only

Update Message: PUT /api/contact/:id — Admin only

Delete Message: DELETE /api/contact/:id — Admin only

🖼️ File Upload Notes

All images should be sent via multipart/form-data.

Only image MIME types are accepted.

Multiple files allowed for projects and news.
