# A MINI-PROJECT REPORT ON
# PASSIONX: A LOCALITY-BASED PASSION DISCOVERY AND REAL-TIME COMMUNITY PLATFORM

---

### SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE DEGREE OF
### BACHELOR OF TECHNOLOGY / ENGINEERING
### IN
### INFORMATION TECHNOLOGY / COMPUTER ENGINEERING

---

**Submitted by:**  
**Aditya Bhore**  
*(Roll No. / Seat No. / PRN: [Insert Roll No.])*

**Under the Guidance of:**  
**Prof. [Faculty Mentor Name]**

---

### DEPARTMENT OF INFORMATION TECHNOLOGY / COMPUTER ENGINEERING
### [COLLEGE / INSTITUTE NAME]
### [UNIVERSITY NAME]
### ACADEMIC YEAR: 2026 – 2027

<div style="page-break-after: always;"></div>

---

# CERTIFICATE

This is to certify that the Full Stack Development Mini-Project entitled **"PassionX: A Locality-Based Passion Discovery and Real-Time Community Platform"** is a bonafide work carried out by **Aditya Bhore** in partial fulfillment of the requirements for the award of Bachelor's Degree in **Information Technology / Computer Engineering** during the academic year 2026–2027.

---

<br><br>
**Prof. [Mentor Name]**  
Project Guide  

<br><br>
**Dr. [HOD Name]**  
Head of Department  

<br><br>
**Dr. [Principal Name]**  
Principal / Director  

---

<div style="page-break-after: always;"></div>

---

# ACKNOWLEDGEMENT

I express my deepest gratitude to my project guide, **Prof. [Mentor Name]**, for invaluable guidance, encouragement, and technical suggestions throughout the development of this full-stack web application.

I would also like to express my sincere thanks to **Dr. [HOD Name]**, Head of the Department, and **Dr. [Principal Name]**, Principal, for providing the necessary laboratory infrastructure and state-of-the-art computational facilities to build, containerize, and deploy this application.

Finally, I extend my heartfelt thanks to my family, friends, and peers who supported me during the development and testing of this project.

**Aditya Bhore**  
Department of Information Technology / Computer Engineering

<div style="page-break-after: always;"></div>

---

# TABLE OF CONTENTS

1. **Chapter 1: Introduction and Objectives**
   - 1.1 Project Overview & Background
   - 1.2 Problem Statement
   - 1.3 Key Objectives
   - 1.4 Scope of the Project

2. **Chapter 2: Technologies Used and System Design**
   - 2.1 Technology Stack Architecture
   - 2.2 System Architecture Diagram
   - 2.3 Database Design & Data Modeling (MongoDB)
   - 2.4 Data Flow and Request Lifecycle

3. **Chapter 3: Implementation & Key Modules**
   - 3.1 Module 1: JWT Authentication & Authorization (AuthN & AuthZ)
   - 3.2 Module 2: Member Discovery & Dynamic Multi-Filter Engine
   - 3.3 Module 3: Profile Customization & Editorial Liquid Glass UI
   - 3.4 Module 4: Real-Time Bidirectional WebSockets Messaging
   - 3.5 Module 5: Role-Based Access Control (RBAC) & Administrative Privileges

4. **Chapter 4: Deployment and DevOps**
   - 4.1 Multi-Stage Docker Containerization
   - 4.2 Multi-Container Orchestration with Docker Compose
   - 4.3 Automated CI/CD Pipeline using GitHub Actions
   - 4.4 Cloud Production Deployment (Render & Vercel)

5. **Chapter 5: Conclusion and Future Scope**
   - 5.1 Project Summary
   - 5.2 Key Learnings
   - 5.3 Future Enhancements

6. **Chapter 6: References & Repository Links**
   - 6.1 GitHub Repository
   - 6.2 Live Production URL
   - 6.3 References

<div style="page-break-after: always;"></div>

---

# CHAPTER 1: INTRODUCTION AND OBJECTIVES

## 1.1 Project Overview & Background
In the contemporary social media landscape, platforms prioritize engagement algorithms, superficial follower counts, and vanity metrics over authentic human connection. Consequently, individuals with niche creative, scientific, philosophical, or artistic passions find it increasingly difficult to locate and collaborate with like-minded peers within their immediate locality.

**PassionX** is an end-to-end full-stack web application engineered to solve this dilemma. It connects creators, deep thinkers, and builders across major metropolitan hubs (such as Mumbai, Bengaluru, Delhi, and Pune) based strictly on **shared genuine passions** (e.g., classical dance, acoustic guitar, stoic philosophy, astrophysics, oil painting, AI ethics) combined with **geographic proximity**.

## 1.2 Problem Statement
To design, implement, containerize, and deploy a secure, responsive, full-stack MERN application that provides:
1. Cryptographically secure user authentication using JSON Web Tokens (JWT) and Bcrypt.
2. Dynamic, real-time discovery of members filterable by passion tags and metropolitan cities.
3. Bidirectional real-time private messaging using WebSockets (Socket.io) without page reloads.
4. Robust Role-Based Access Control (RBAC) and object ownership validation protecting against unauthorized modifications (IDOR).
5. Production-grade containerization with Docker, multi-container orchestration with Docker Compose, and automated CI/CD pipeline automation via GitHub Actions.

## 1.3 Key Objectives
- **Secure Authentication & Authorization:** Implement stateless JWT authentication with encrypted passwords and granular role separation (`user` vs `admin`).
- **Responsive & Accessible Frontend:** Deliver a responsive, modern editorial UI utilizing Tailwind CSS, fluid typography (`clamp()`), and CSS Grid auto-fill layouts that adapt seamlessly from mobile devices to high-resolution desktop displays.
- **Low-Latency Communication:** Implement real-time WebSocket communication for 1-on-1 private messaging, online status tracking, and instant toast alerts.
- **Enterprise DevOps Pipeline:** Containerize client (Nginx) and server (Node.js) into multi-stage Docker images, automate build validation in GitHub Actions, and deploy to modern cloud infrastructure (Render & Vercel).

## 1.4 Scope of the Project
PassionX serves as a comprehensive demonstration of modern Full Stack Web Development and DevOps engineering, covering database design, RESTful API development, WebSocket server architecture, reactive UI engineering, containerization, and cloud continuous deployment.

<div style="page-break-after: always;"></div>

---

# CHAPTER 2: TECHNOLOGIES USED AND SYSTEM DESIGN

## 2.1 Technology Stack Architecture

| Layer | Technology | Version | Purpose in PassionX |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | 19.x | Component-based reactive user interface with hooks |
| **Build Tooling** | Vite | 7.x | High-speed Hot Module Replacement (HMR) and bundle compilation |
| **Styling & Design** | Tailwind CSS & Lucide Icons | 4.x | Utility-first responsive CSS, glassmorphism, fluid typography |
| **Backend Runtime** | Node.js | 20.x (Alpine) | Asynchronous event-driven JavaScript server environment |
| **Web Framework** | Express.js | 5.x | RESTful API routing, middleware chaining, and HTTP request handling |
| **Real-Time Engine** | Socket.io | 4.8.x | Full-duplex WebSocket connections for live 1-on-1 messaging |
| **Database** | MongoDB Atlas | 7.x / Jammy | Cloud-native NoSQL document database with Mongoose ODM |
| **Security & Tokens** | JSON Web Tokens & BcryptJS | 9.x / 3.x | Stateless Bearer token verification and salted password hashing |
| **Containerization** | Docker & Docker Compose | Latest | Multi-stage image assembly, container isolation, volume management |
| **Web Server / Proxy** | Nginx | Alpine | Static production bundle serving and reverse proxying `/api/` |
| **CI/CD Pipeline** | GitHub Actions | v4 / v5 | Automated syntax checks, bundle builds, and Docker build tests |
| **Cloud Hosting** | Render & Vercel | Production | Production Node web service hosting and edge frontend distribution |

---

## 2.2 System Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (React + Vite)                        |
|   - Liquid Glass UI & Responsive Layouts (Desktop / Tablet / Mobile)          |
|   - React Router v7, AuthContext, SocketContext, Axios HTTP Client            |
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 | HTTP / HTTPS REST                   | WebSocket (ws://)
                 v                                     v
+-------------------------------------------------------------------------------+
|                            REVERSE PROXY / NGINX                              |
|   - Serves Production Static SPA Bundle (index.html, dist/)                   |
|   - Reverse Proxies /api/ requests to Node.js Backend Container               |
|   - Reverse Proxies /socket.io/ persistent WebSocket connections              |
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 | Port 5001                           | Port 5001
                 v                                     v
+-------------------------------------------------------------------------------+
|                         SERVER TIER (Node.js + Express 5)                     |
|   - REST API Routes: /api/auth, /api/users, /api/health                       |
|   - Security Middlewares: auth (JWT), authorize (RBAC), authorizeOwnership   |
|   - Socket.io Server: JWT Handshake, Private Rooms (user:id), Live Messaging  |
+---------------------------------------+---------------------------------------+
                                        |
                                        | Mongoose ODM (TLS 1.3)
                                        v
+-------------------------------------------------------------------------------+
|                         DATABASE TIER (MongoDB Atlas)                         |
|   - User Collection: Credentials, Passions, City, Role, Connections           |
|   - Persistent Storage Volumes in Docker (mongo-data)                         |
+-------------------------------------------------------------------------------+
```

---

## 2.3 Database Design & Data Modeling (MongoDB)

The data model uses a schema-backed **User** document designed in Mongoose:

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  lookingFor: { type: String, default: '' },
  passions: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  location: {
    city: { type: String, default: '' },
    state: { type: String, default: '' }
  },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
```

### Key Schema Features:
1. **Pre-Save Encryption Hook:** Uses `bcrypt.genSalt(10)` and `bcrypt.hash` to salt and hash plain-text passwords before storing to disk.
2. **Normalized Passions Array:** Enables high-performance case-insensitive substring queries (`$regex`) for fast filtering.
3. **Self-Referencing Graph:** The `connections` array stores ObjectIds referencing other `User` records, enabling direct networking without foreign-key join bottlenecks.
4. **Role Enforcement:** Hardened enum (`['user', 'admin']`) enforced at the schema validation layer.

<div style="page-break-after: always;"></div>

---

# CHAPTER 3: IMPLEMENTATION & KEY MODULES

## 3.1 Module 1: JWT Authentication & Registration
The authentication module provides secure, stateless user onboarding and session management:
- **Registration (`POST /api/auth/register`):** Validates email format, minimum password length (≥ 6 characters), captures initial passions and city, and assigns the user's role (`user` or `admin`).
- **Login (`POST /api/auth/login`):** Validates credentials, executes `bcrypt.compare`, and issues a cryptographically signed JWT with a 30-day expiry.
- **Client Guard (`<ProtectedRoute>`):** Intercepts unauthorized navigation to protected routes (`/discover`, `/profile`) and automatically redirects unauthenticated users to `/auth`.

---

## 3.2 Module 2: Member Discovery & Dynamic Multi-Filter Engine
The discovery engine allows users to explore community members through dynamic, composable filters:
- **Instant Search:** Full-text search matching member names and bios with debounced server queries (300ms).
- **Passion Pill Filters:** Quick-toggle filters for popular passions (*Music, Dance, Philosophy, Science, Art, AI*).
- **City Filters:** Metropolitan geographic filtering (*Mumbai, Bengaluru, Delhi, Pune*).
- **Responsive Layout:** Automatically scales from a single vertical column on mobile screens to a 3-column / 4-column responsive grid on desktop screens via CSS Grid auto-fill.

---

## 3.3 Module 3: Profile Customization & Editorial Liquid Glass UI
Users manage their community identity through an editorial, glassmorphic profile dashboard:
- **Liquid Glass Theme:** Built with translucent backdrop filters (`backdrop-filter: blur(20px)`), soft radial fire gradients, and crisp sans-serif/serif typography.
- **Editable Attributes:** Dynamic inline updating of Bio, Detailed About Me, Collaborative Goals ("What I'm Looking For"), and Passion Tags.
- **Avatar Management:** Supports direct URL inputs, file uploads, and creative curated preset avatars.

---

## 3.4 Module 4: Real-Time Bidirectional WebSockets Messaging
Live communication is achieved via Socket.io over WebSockets:
- **Handshake Authentication:** During connection initialization, the client passes its JWT in `socket.handshake.auth.token`. The server decodes the token and extracts `socket.userId`.
- **Private User Rooms:** Each connected socket automatically joins an isolated room: `socket.join('user:' + socket.userId)`.
- **Message Dispatch:** Direct messages sent via `send_direct_message` are emitted exclusively to the recipient's room (`io.to('user:' + recipientId).emit(...)`), completely preventing message leaking.
- **Interactive Chat Modal:** A floating modal enables instant chatting, real-time message feeds, and toast notifications (`RealtimeToast.jsx`) without disrupting the active page context.

---

## 3.5 Module 5: Role-Based Access Control (RBAC) & Administrative Privileges
Access control is enforced strictly on the server:
- **Role Verification Middleware (`authorize('admin')`):** Verifies the decoded token role against required access permissions. Unprivileged users requesting admin routes receive an immediate **`HTTP 403 Forbidden`**.
- **Resource Ownership Middleware (`authorizeOwnership('id')`):** Enforces that a standard user can only update or delete their own database record (`targetId === req.user`), preventing Insecure Direct Object Reference (IDOR) attacks.
- **Administrator Elevation:** Administrators receive an elevated badge (`🛡️ System Administrator`), access to system analytics, and cross-user modification rights (`✏️ Edit (Admin)`), enabling platform moderation.

---

## 3.6 Screenshots Checklist for the Report

*(Insert high-resolution screenshots captured during testing into these sections)*

| Figure # | Screenshot Description | Verification Purpose |
| :---: | :--- | :--- |
| **Fig 3.1** | **Landing Page (`/`)** | Demonstrates brand presentation, video background, and guest navigation. |
| **Fig 3.2** | **Liquid Glass Authentication (`/auth`)** | Shows login/registration form with Admin role selector. |
| **Fig 3.3** | **Discover People Page (`/discover`)** | Shows responsive user cards grid with passion pills and city filters. |
| **Fig 3.4** | **Member Profile Page (`/profile`)** | Shows profile header, member badge, and "Edit Profile" actions. |
| **Fig 3.5** | **Real-Time WebSocket Chat Modal** | Shows live 1-on-1 messaging between two active users without page reload. |
| **Fig 3.6** | **Chrome DevTools WS Network Frame** | Shows active binary/JSON frames over the `socket.io` WebSocket tunnel. |
| **Fig 3.7** | **RBAC 403 Forbidden Demonstration** | Shows in-app modal rejecting unauthorized admin access for standard users. |
| **Fig 3.8** | **Admin Cross-User Profile Editor** | Shows Administrator modifying a member's record with elevated privileges. |

<div style="page-break-after: always;"></div>

---

# CHAPTER 4: DEPLOYMENT AND DEVOPS

## 4.1 Multi-Stage Docker Containerization
To eliminate the *"it works on my machine"* problem, PassionX is containerized using Docker:

### Frontend Multi-Stage Build ([client/Dockerfile](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/client/Dockerfile)):
- **Stage 1 (Builder):** Uses `node:20-alpine` to install dependencies and compile the production Vite React bundle (`dist/`).
- **Stage 2 (Production Runner):** Uses lightweight `nginx:alpine`, copies the compiled static assets into `/usr/share/nginx/html`, and configures Nginx to handle client-side Single Page Application (SPA) routing and reverse-proxy API calls.

### Backend Production Build ([server/Dockerfile](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/server/Dockerfile)):
- Uses `node:20-alpine`, caches production dependencies (`npm install --omit=dev`), exposes port `5001`, and executes Express with WebSocket support enabled.

---

## 4.2 Multi-Container Orchestration with Docker Compose
The multi-container stack is defined in [docker-compose.yml](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/docker-compose.yml):
- **`backend` Service:** Runs Express API on port `5001:5001`. Depends on `mongo` being healthy.
- **`frontend` Service:** Runs Nginx on port `3000:80`. Reverse proxies `/api/` and `/socket.io/` internally to `http://backend:5001`.
- **`mongo` Service:** Runs `mongo:7-jammy` on port `27017:27017` with persistent named volume `mongo-data` and healthcheck ping commands.

```bash
# Start all containers in background
docker compose up -d

# Verify container health
docker compose ps
```

---

## 4.3 Automated CI/CD Pipeline using GitHub Actions
A continuous integration pipeline is configured at [.github/workflows/ci.yml](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/.github/workflows/ci.yml). On every `push` or `pull_request` to `main`, GitHub Actions automatically:
1. Checks out the repository code on an Ubuntu cloud runner.
2. Sets up Node.js 20 with dependency caching (`package-lock.json`).
3. Installs client and server dependencies.
4. Compiles the React client bundle to ensure zero typing or compilation errors.
5. Verifies backend Node.js route syntax (`node -c`).
6. Builds Docker images for both backend and frontend using Docker Buildx to confirm container deployability.

---

## 4.4 Cloud Production Deployment
- **Render Web Service:** Hosts the Node.js backend connected to MongoDB Atlas with auto-deployments linked to the GitHub `main` branch.
- **Vercel Edge Platform:** Configured via [client/vercel.json](file:///Users/adityasanjaybhore/Documents/FSD_PROJECT/PassionX/client/vercel.json) to distribute the static React frontend with automatic `/api/*` rewrites routed to the Render backend service, avoiding cross-origin CORS latency.

<div style="page-break-after: always;"></div>

---

# CHAPTER 5: CONCLUSION AND FUTURE SCOPE

## 5.1 Project Summary
The **PassionX** mini-project successfully demonstrates a complete, production-ready Full Stack Web Application engineered with the MERN stack. The project fulfills all functional requirements:
- Robust user authentication and cryptographic password protection.
- High-performance, mobile-responsive UI with editorial typography and glassmorphic aesthetics.
- Real-time bidirectional messaging powered by WebSockets.
- Enforced server-side Role-Based Access Control (RBAC) preventing unauthorized resource tampering (IDOR).
- Production DevOps automation via Docker, Docker Compose, and GitHub Actions CI/CD workflows.

## 5.2 Key Learnings
1. **Separation of AuthN and AuthZ:** Gained deep architectural understanding of isolating authentication token verification from object-level resource ownership checks.
2. **WebSocket Lifecycle Management:** Mastered persistent TCP connection handling, room-based message multiplexing, and reconnection state synchronization in React.
3. **Container Optimization:** Learned how multi-stage Docker builds reduce image size by excluding devDependencies, build tools, and source compilers from production images.
4. **CI/CD Automation:** Implemented declarative GitHub Actions workflows to shift testing left and prevent broken code from reaching production.

## 5.3 Future Enhancements
- **WebRTC Audio/Video Jams:** Implement peer-to-peer real-time audio and video sessions for musicians, dancers, and debaters to practice remotely.
- **AI-Powered Passion Matching:** Integrate vector embeddings (e.g. Gemini / Vertex AI) to compute semantic similarity between member bios and collaborative interests.
- **Geo-Radius Distance Calculation:** Leverage MongoDB `$near` geospatial indexing to filter community members within a customizable radius (e.g., within 5 km or 10 km).
- **Group Community Circles:** Expand beyond 1-on-1 messaging to support topic-based public community channels and event meetups.

<div style="page-break-after: always;"></div>

---

# CHAPTER 6: REFERENCES & REPOSITORY LINKS

## 6.1 GitHub Repository
- **Repository URL:** [https://github.com/15adi15/PassionX.git](https://github.com/15adi15/PassionX.git)
- **CI/CD Actions Status:** [https://github.com/15adi15/PassionX/actions](https://github.com/15adi15/PassionX/actions)

## 6.2 Live Production URL
- **Live Cloud Deployment:** [https://passionx.onrender.com/](https://passionx.onrender.com/)

## 6.3 References
1. **React Documentation:** *React 19 Hooks and Component Architecture*, [https://react.dev](https://react.dev)
2. **Express.js Documentation:** *Express 5 Routing and Middleware Guide*, [https://expressjs.com](https://expressjs.com)
3. **MongoDB Documentation:** *Mongoose v9 Data Modeling and Indexing*, [https://mongoosejs.com](https://mongoosejs.com)
4. **Socket.io Documentation:** *Full-Duplex Real-Time Engine*, [https://socket.io/docs/v4](https://socket.io/docs/v4)
5. **Docker Documentation:** *Multi-stage Builds and Docker Compose v2 Specification*, [https://docs.docker.com](https://docs.docker.com)
6. **OWASP Foundation:** *OWASP Top 10:2021 – A01: Broken Access Control & IDOR Vulnerabilities*, [https://owasp.org](https://owasp.org)
