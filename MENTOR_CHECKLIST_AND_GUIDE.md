# 🎓 PassionX: Mentor Technical Documentation

This guide provides the exact breakdown of **Responsiveness**, **Data Validation**, **WebSockets**, **`useState` Hooks**, and **REST API Endpoints** for your project review.

---

## 1. Responsiveness Across Devices (Phones, iPads & Desktops)

The application has been engineered to dynamically adapt across all viewports:
- **Mobile Phones (360px – 480px)**:
  - **Navbar**: Desktop links automatically collapse into an accessible hamburger drawer (`nav-mobile-toggle` & `nav-mobile-menu`) in [Navbar.jsx](client/src/components/Navbar.jsx).
  - **Hero Landing**: Headline scales smoothly using CSS `clamp(2.2rem, 5.5vw, 4.4rem)`; buttons wrap vertically or horizontally with comfortable touch targets.
  - **Directory Filters**: Filter inputs wrap into full-width touch rows in [FilterBar.jsx](client/src/components/FilterBar.jsx). Quick city/passion pills scroll with overflow prevention.
  - **Profile Layout**: Transitions from multi-column grid into a single-column stacked view with touch-friendly tabs in [Profile.jsx](client/src/pages/Profile.jsx).
  - **Liquid Glass Login**: Clamped to `max-w-[400px] w-full px-4` with pointer-capture boundaries preventing dragging off-screen.
- **iPads / Tablets (768px – 1024px)**:
  - 2-column card grid in Discover Directory (`gridTemplateColumns: repeat(auto-fill, minmax(270px, 1fr))`).
  - Balanced split-screen layout for Profile and Community stats.
- **Desktop (1024px – 1920px+)**:
  - Full horizontal editorial layout with floating testimonials marquee, multi-column photo grid, and persistent top navigation.

---

## 2. Pinpoint: Where `useState` is Used in the Application

Here is the exact file-by-file breakdown of every `useState` hook and its role:

| Component / File | State Variable & Setter | Initial Value | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **`client/src/pages/Landing.jsx`** | `[isVideoLoaded, setIsVideoLoaded]` | `false` | Tracks whether the background hero video has buffered enough frames so opacity fades in cleanly. |
| **`client/src/components/Navbar.jsx`** | `[mobileMenuOpen, setMobileMenuOpen]` | `false` | Controls the open/closed visibility of the mobile hamburger menu drawer on phone and tablet viewports. |
| **`client/src/pages/Home.jsx`** | `[filters, setFilters]` | `{ search, passion, city, state }` | Holds active search text, passion query, and city filter selections. Synced with URL search params. |
| **`client/src/pages/Home.jsx`** | `[users, setUsers]` | `[]` | Stores the array of community members fetched from `GET /api/users/discover`. |
| **`client/src/pages/Home.jsx`** | `[loading, setLoading]` | `true` | Toggles the loading spinner while directory data is being fetched over the network. |
| **`client/src/components/UserCard.jsx`** | `[connecting, setConnecting]` | `false` | Disables the "Connect" button and shows "Updating..." while `POST /api/users/connect/:id` executes. |
| **`client/src/pages/Auth.jsx`** | `[isLogin, setIsLogin]` | `true` or `false` | Toggles between "Sign In" and "Sign Up" form modes. Synced with `?mode=signup` search params. |
| **`client/src/pages/Auth.jsx`** | `[error, setError]` | `''` | Stores validation or server error messages to display alerts to the user. |
| **`client/src/components/ui/liquid-glass-login.tsx`** | `[showPassword, setShowPassword]` | `false` | Toggles password visibility (text vs password mask) with Eye icon. |
| **`client/src/components/ui/liquid-glass-login.tsx`** | `[pending, setPending]` | `null` | Tracks whether the submit button or social login is currently in progress. |
| **`client/src/pages/Profile.jsx`** | `[activeTab, setActiveTab]` | `'profile'` | Toggles between the `'profile'` view and the `'people'` ("My People" connections) view. |
| **`client/src/pages/Profile.jsx`** | `[editing, setEditing]` | `false` | Controls whether the profile edit modal / inputs are active. |
| **`client/src/pages/Profile.jsx`** | `[saving, setSaving]` | `false` | Disables save button and displays loading state during profile update. |
| **`client/src/pages/Profile.jsx`** | `[error, setError]` | `''` | Holds error messages from backend validation on profile update. |
| **`client/src/pages/Profile.jsx`** | `[showPhotoModal, setShowPhotoModal]` | `false` | Controls visibility of the photo upload & avatar preset selector modal. |
| **`client/src/pages/Profile.jsx`** | `[form, setForm]` | `{ name, bio, aboutMe, lookingFor, passions, ... }` | Controlled form state for user profile editing. |
| **`client/src/pages/Profile.jsx`** | `[newInterest, setNewInterest]` | `''` | Controlled input value for adding a new custom interest tag. |
| **`client/src/context/AuthContext.jsx`** | `[user, setUser]` | `null` | Stores the globally authenticated user object (ID, name, email, avatar, connections, passions). |
| **`client/src/context/AuthContext.jsx`** | `[loading, setLoading]` | `true` | Keeps app in loading state while rehydrating token on initial page load. |
| **`client/src/context/SocketContext.jsx`** | `[socket, setSocket]` | `null` | Stores the active Socket.io client instance. |
| **`client/src/context/SocketContext.jsx`** | `[connected, setConnected]` | `false` | Tracks live WebSocket connection status. |
| **`client/src/context/SocketContext.jsx`** | `[onlineUsers, setOnlineUsers]` | `[]` | List of currently online user IDs broadcasted over WebSockets. |
| **`client/src/context/SocketContext.jsx`** | `[toastNotification, setToastNotification]` | `null` | Active real-time toast alert (new connection or message). |
| **`client/src/context/SocketContext.jsx`** | `[activeChatUser, setActiveChatUser]` | `null` | Active partner for the real-time chat modal. |
| **`client/src/context/SocketContext.jsx`** | `[messages, setMessages]` | `{}` | Message stream mapped by partner ID. |
| **`client/src/components/ChatModal.jsx`** | `[inputText, setInputText]` | `''` | Controlled chat input text for sending live messages. |

---

## 3. Pinpoint: REST API Endpoints

The backend follows RESTful architecture. Here is the complete list of endpoints, their controller files, and where they are called:

| Method | URL Path | Server Handler File | Validation Middleware | Client Caller | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`POST`** | `/api/auth/register` | `server/routes/auth.js` | `validateRegister` | `AuthContext.jsx` (`register()`) | Creates new user with hashed password, passions, location; returns JWT token & user. |
| **`POST`** | `/api/auth/login` | `server/routes/auth.js` | `validateLogin` | `AuthContext.jsx` (`login()`) | Authenticates email and password; returns signed JWT token. |
| **`GET`** | `/api/auth/me` | `server/routes/auth.js` | `auth` (JWT header) | `AuthContext.jsx` (on mount) | Verifies JWT and returns current authenticated user profile & connections. |
| **`GET`** | `/api/users/discover` | `server/routes/users.js` | `optionalAuth` | `Home.jsx` (`fetchUsers()`) | Searches & filters community members by passion, city, state, or name keyword. |
| **`GET`** | `/api/users/:id` | `server/routes/users.js` | `auth`, `validateObjectId` | Individual Profile lookups | Retrieves single user profile by 24-character hexadecimal MongoDB ID. |
| **`PUT`** | `/api/users/profile` | `server/routes/users.js` | `auth`, `validateProfileUpdate` | `AuthContext.jsx` (`updateProfile()`) | Updates user details (name, bio, aboutMe, lookingFor, passions, avatar). |
| **`POST`** | `/api/users/connect/:id` | `server/routes/users.js` | `auth`, `validateObjectId` | `UserCard.jsx` (`handleToggleConnect`) | Mutual connection: adds target user to current user's connections and vice versa. |
| **`POST`** | `/api/users/disconnect/:id` | `server/routes/users.js` | `auth`, `validateObjectId` | `UserCard.jsx` / `Profile.jsx` | Removes mutual connection between two users. |
| **`GET`** | `/api/users/connections` | `server/routes/users.js` | `auth` | `Profile.jsx` ("My People" tab) | Fetches full populated list of all connected members. |
| **`GET`** | `/api/health` | `server/index.js` | None | Render health checks / monitors | Health-check endpoint returning server uptime status. |

---

## 4. Data Validation Implementation

Data validation is enforced on both **backend** (secure gatekeeper) and **frontend** (user experience):

### Backend Validation (`server/middleware/validate.js`):
1. **`validateRegister`**:
   - `name`: Must be trimmed string between 2 and 50 characters.
   - `email`: Enforces RFC 5322 standard regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) and converts to lowercase.
   - `password`: Enforces minimum length of 6 characters and maximum of 128 characters.
   - `passions`: Maximum 15 passions, validates string array.
   - `location.city` & `state`: String length max 60 chars.
2. **`validateLogin`**:
   - Verifies valid email structure and non-empty password before querying database.
3. **`validateProfileUpdate`**:
   - Validates length of `bio` (max 300), `aboutMe` (max 1500), `lookingFor` (max 800), and `avatar` payload (max 5MB).
4. **`validateObjectId`**:
   - Validates that URL parameter IDs are 24-character hexadecimal MongoDB ObjectIds using `mongoose.Types.ObjectId.isValid()`. Returns HTTP 400 Bad Request if malformed.
5. **Standardized Error Responses**:
   - Returns HTTP 400 with `{ success: false, message: '...', errors: { [field]: 'reason' } }`.

---

## 5. WebSocket Implementation (`socket.io`)

### Architecture:
- **Server ([server/socket.js](server/socket.js))**:
  - Bound to Node's HTTP server via `socket.io`.
  - **JWT Authentication Handshake**: Verifies client token upon connection and binds `socket.userId`.
  - **Room-Based Architecture**: Each user automatically joins their private room `user:<userId>`.
  - **Online Status Tracking**: In-memory `Map` mapping user IDs to active sockets, broadcasting `online_users` to all connected clients.
- **Client ([client/src/context/SocketContext.jsx](client/src/context/SocketContext.jsx))**:
  - Maintains persistent WebSocket connection across routes.
  - Automatically handles reconnects.

### Real-Time Features:
1. **Live 1-on-1 Direct Messaging ([ChatModal.jsx](client/src/components/ChatModal.jsx))**:
   - Connected members can click **"Chat 💬"** on any card to open a real-time messaging window.
   - Messages are delivered instantly over `send_direct_message` and received via `receive_direct_message`.
   - Includes real-time typing indicators (`user_typing`).
2. **Instant Connection Notification Toast ([RealtimeToast.jsx](client/src/components/RealtimeToast.jsx))**:
   - When User A connects with User B, User B receives an instant popup alert: *"🎉 Diya Sen just connected with you on PassionX!"* without refreshing the page.
3. **Live Online Status Indicator**:
   - Green glowing dot appears on user cards when that member is actively online.

---

## 6. Background Video Autoplay Fix

The hero video is fully optimized for production:
- Added `defaultMuted`, `muted`, `playsInline`, and `preload="auto"` attributes.
- Used `videoRef` with programmatic `video.play().catch(...)` on mount.
- Added high-resolution poster image fallback (`poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop"`) so low-bandwidth or battery-saver devices always display a rich background.
