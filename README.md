# 🛍️ Fashion Book – Full-Stack Ecommerce Platform  
**Modern, scalable ecommerce web application built for real-world business needs and professional portfolio demonstration.**

Fashion Book is a fully custom-built ecommerce platform developed for a real clothing & fashion retail store as well as for engineering learning + portfolio demonstration.  
It features a complete shopping flow, admin panel APIs, advanced order pipeline, real-time notifications, wishlist & cart management, address book, checkout, authentication, and more.


## 🚀 Live Demo
- Check this out: https://fashionbook-ecommerce.vercel.app


## 🧩 Tech Stack

### **Frontend (Next.js 15)**
- Next.js (Pages Router)
- React 18
- TailwindCSS 3
- Axios Client for API calls
- React Context for: Auth, Cart, Wishlist, Notifications, UI
- SSR + CSR hybrid rendering
- Vercel deployment friendly

### **Backend (Node.js + Express)**
- Node.js / Express architecture
- MongoDB (Atlas)
- Mongoose ODM
- JWT Authentication (Access Tokens)
- Multer + Cloudinary for image storage
- Nodemailer (Emails)
- Rate limiting, CORS, Security headers
- Role-based access (Admin / User)
- Modular controllers, services, utils

### **Additional Services**
- Cloudinary for image hosting
- MongoDB Atlas for database
- Render / Railway for backend deployment
- Vercel for frontend hosting

---

# 🏛️ Architecture Overview

```
    Root/
    │── backend/            →     Node.js + Express REST API
    │── frontend-user/      →     Next.js customer-facing ecommerce site
    │── All Documentations/ →     Technical docs
    └── README.md
    
    
```


# 📁 Folder Structure (Detailed)

## **Backend**
```
backend/
│── src/
│ ├── config/      # Database config, env setup
│ ├── controllers/ # Route controllers (User, Product, Cart…)
│ ├── middlewares/ # Auth, Admin check, error handling, upload
│ ├── models/      # MongoDB Models
│ ├── routes/      # API Routes
│ ├── services/    # Business logic (Email, Orders, Notifications)
│ ├── utils/       # Helper utilities
│ ├── validations/ # Joi / custom validations
│ └── scripts/     # One-time migration utilities
│
│── app.js
│── server.js
│── package.json
└── .env
```


## **Frontend (Next.js)**
```
frontend-user/
│── src/
│ ├── components/     # UI Components
│ ├── contexts/       # Auth, Cart, Wishlist, Notifications, UI
│ ├── pages/          # Next.js routes
│ ├── services/       # API service wrappers
│ ├── styles/
│ └── utils/
│
│── public/
│── package.json
└── .env.local
```



# ⭐ Features (Complete List)

## 👤 **User Features**
- Email-based Registration & Login
- JWT Auth (Auto-refresh and persistent sessions)
- Profile Management
- Address Book (Add / Edit / Delete)
- Change Password
- View Orders & Order Details
- Order Cancellation Request Flow
- Wishlist (Add, Remove, Move to Cart)
- Cart with size, color, variant support
- Quantity update, remove items
- Full Checkout System
  - Address selection
  - Price summary
  - Payment method
  - Order confirmation UI
- Notifications Hub
  - Order Placed
  - Cancellation Approved/Rejected
  - Status Updates (Packed, Shipped, Delivered)
- Sidebar quick panel

---

## 🛒 **Product Features**
- Category-based filtering
- Sort (Price low-high, latest, trending)
- Product detail page with:
  - Variants (size, color)
  - Dynamic stock display
  - Wishlist button
  - Add to cart
  - Buy now
  - Image zoom/gallery

---

## 🛍️ **Admin Features (API Implemented)**
- Add, update, delete categories
- Add/edit/delete products
- Upload images to Cloudinary
- Stock management (variants or simple)
- Update order status:
  - Order Placed
  - Packed
  - Shipped
  - Out For Delivery
  - Delivered
  - Cancelled
- Notification sending to users
- Refund logic (COD / prepaid handling)
- Order Reports (Daily/Monthly)

*(Admin panel frontend will come later)*

---

## 🔔 **Notification System**
Based on events:
- Order Placed
- Order Cancelled (User)
- Cancellation Approved (Admin)
- Cancellation Rejected (Admin)
- Order Status Progress (Packed → Delivered)
- Refund eligibility info
- Priority levels
- Delivered via email + app notification center

---

# 🛠️ Local Development Setup

### **1. Clone Repository**
```
git clone https://github.com/yourusername/FashionBook.git
cd FashionBook

```

### **2. Install Dependencies**
```
cd backend
npm install
```
### **3. Create .env**
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:3000

```

### **4. Run Backend**
```
npm run dev
```
Runs on: http://localhost:5000

---
# 🎨 Frontend Setup (Next.js)


### **1. Install Dependencies**
```
cd frontend-user
npm install
```
### **2. Create .env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### **3. Run Frontend**
```
npm run dev
```
Runs on: http://localhost:3000


# 🧭 Roadmap (Future Enhancements)

- Admin Dashboard UI (Next.js or React)

- Real payment integration (Razorpay / Stripe)

- SMS notifications

- Real-time socket-based notifications

- Delivery partner panel

- Reviews & Ratings

- Inventory analytics dashboard

- PWA mobile app

- Loyalty points, coupons, referrals

# 📜 License

This project is © **Satya’s Fashion Book** — internal business + personal portfolio use.

Commercial reuse is not permitted without permission.

# ❤️ Credits

Built with love for:

- Family Business – Satya’s Fashion Book, Rajahmundry

- Career growth (Skill Development, Tech interviews)

- A real-world scalable ecommerce solution
