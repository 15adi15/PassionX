# Assignment: Vulnerability Assessment of a React and Node.js Web Application
## Topic: Broken Access Control (IDOR – Insecure Direct Object Reference)

**Student Name:** Aditya Bhore  
**Course:** Full Stack Development Lab  
**Application:** PassionX (MERN Stack: React + Vite, Node.js + Express, MongoDB Atlas)  
**Date:** November 17, 2026  

---

## 1. Objective
To identify whether an authenticated user can access, modify, or delete another user's private resources without proper authorization (IDOR vulnerability), demonstrate the exploit before remediation, implement server-side access control, and verify that unauthorized requests are blocked.

---

## 2. Introduction to Broken Access Control (IDOR)
**Broken Access Control** ranks **#1** in the **OWASP Top 10 (A01:2021)** security risks. It occurs when an application fails to enforce proper server-side authorization restrictions, permitting users to act outside of their intended permissions.

**Insecure Direct Object Reference (IDOR)** is a subcategory of access control vulnerability that arises when an application uses client-supplied input (such as database primary keys, MongoDB `_id` values, or filename parameters) to directly access objects in backend databases without verifying that the requesting session owns or is authorized to access that specific record.

In a secure application:
- **Authentication (AuthN)** verifies identity (*"Is this a valid logged-in user?"*).
- **Authorization (AuthZ)** verifies resource privileges (*"Does this authenticated user have permission to modify this specific database record?"*).

---

## 3. Testing Environment
- **Application Name:** PassionX
- **Frontend URL:** `http://localhost:5173` (React 19 + Vite)
- **Backend URL:** `http://localhost:5001` (Node.js + Express 5)
- **Database:** MongoDB Atlas (Mongoose ORM)
- **API Resource Tested:** Member Profile / Passion Resource (`/api/users/manage/:id` and `/api/users/vulnerable-update/:id`)
- **Testing Tools:** Google Chrome Developer Tools (F12 Network panel) and Postman
- **Test Accounts:**
  - **User A (Attacker):** `user.a@example.test` (Role: Standard Member)
  - **User B (Victim):** `user.b@example.test` (Role: Standard Member)

---

## 4. Testing Procedure Followed

1. **Local Server Execution:** Started both the PassionX Node.js backend on port `5001` and Vite frontend on port `5173`.
2. **Account Creation:** Registered two distinct dummy user accounts via the API:
   - **User A:** Represents the authenticated attacker (`user.a@example.test`).
   - **User B:** Represents the legitimate resource owner (`user.b@example.test`).
3. **Session Establishment:** Authenticated both accounts to obtain their respective JWT Bearer tokens. Recorded User B's unique resource ID (`_id`).
4. **Browser Network Analysis:** Used Chrome DevTools (`F12 -> Network -> Fetch/XHR`) to inspect the frontend API request parameters, payload shape, and HTTP headers.
5. **Pre-Fix IDOR Demonstration:** Sent a `PUT` request in Postman targeting User B's resource ID while supplying **User A's Bearer token** against the unverified update endpoint. The server returned **`200 OK`**, proving the application was vulnerable to IDOR.
6. **Backend Remediation:** Implemented object-level access control middleware (`authorizeOwnership`) in Node.js/Express, validating that `req.params.id === req.user.toString()` before allowing database modifications.
7. **Post-Fix Verification:** Re-sent the identical unauthorized `PUT` and `DELETE` requests in Postman using User A's token against User B's resource ID. The server rejected both requests with **`403 Forbidden`** (or **`404 Not Found`**), confirming the vulnerability is successfully mitigated.

---

## 5. Pre-Fix vs. Post-Fix Source Code Comparison

### Pre-Fix Implementation (VULNERABLE to IDOR)
```javascript
// Pre-Fix Route: Missing Object-Level Ownership Verification
router.put('/vulnerable-update/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    // Directly updates any record matching the URL parameter ID!
    // No check to verify if the requesting user (req.user) owns this resource.
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```
*Vulnerability Explanation:* Any authenticated user who captures another user's ID can submit this request and overwrite the victim's data.

---

### Post-Fix Implementation (SECURE - IDOR Mitigated)
```javascript
// 1. Reusable Ownership Verification Middleware
const authorizeOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    const targetId = req.params[paramName];
    // Enforces that the target record ID matches the authenticated user's ID
    if (targetId && targetId !== req.user.toString() && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Authorization denied (Forbidden)',
        message: "Forbidden: You are only authorized to modify your own resources, not another user's.",
      });
    }
    next();
  };
};

// 2. Protected Route with Ownership Middleware
router.put(
  '/manage/:id',
  auth,
  validateObjectId('id'),
  authorizeOwnership('id'), // <-- Blocks unauthorized object access
  validateProfileUpdate,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ success: true, message: 'Resource ownership authorized: Profile updated.', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);
```

---

## 6. Step-by-Step Postman Execution & Screenshots Checklist

### Screenshot 1: Backend Server Running Locally
- **Location:** Terminal
- **Command:** `cd server && node index.js`
- **Shows:** `Server running on port 5001 (with WebSockets enabled)` and `MongoDB Connected`.

---

### Screenshot 2: Browser Developer Tools Network Inspection
- **Location:** Chrome Browser (`F12 -> Network -> Fetch/XHR`)
- **Action:** Load `http://localhost:5173/discover` and view network traffic.
- **Shows:** API request name (`discover`), method (`GET`), status (`200 OK`), and response preview without revealing raw JWT secret.

---

### Screenshot 3: User A Registration in Postman
- **Endpoint:** `POST http://localhost:5001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "User A (Attacker)",
    "email": "user.a@example.test",
    "password": "password123",
    "passions": ["cybersecurity", "testing"],
    "location": { "city": "Mumbai", "state": "Maharashtra" },
    "role": "user"
  }
  ```
- **Response:** `201 Created` with generated token and `_id`.

---

### Screenshot 4: User B Registration in Postman
- **Endpoint:** `POST http://localhost:5001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "User B (Victim)",
    "email": "user.b@example.test",
    "password": "password123",
    "passions": ["music", "photography"],
    "location": { "city": "Bengaluru", "state": "Karnataka" },
    "role": "user"
  }
  ```
- **Response:** `201 Created` with User B's `_id` (e.g. `6afc73...`).

---

### Screenshot 5: Pre-Fix IDOR Attack (VULNERABLE – 200 OK)
- **Endpoint:** `PUT http://localhost:5001/api/users/vulnerable-update/<USER_B_ID>`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_A_TOKEN>`
- **Request Body:**
  ```json
  {
    "name": "Hacked by User A",
    "bio": "Your profile has been altered due to missing authorization checks."
  }
  ```
- **Response:** **`HTTP 200 OK`**
- **Outcome:** Proves that User A was able to overwrite User B's database record despite not owning the resource.

---

### Screenshot 6: Post-Fix IDOR Update Rejection (PROTECTED – 403 Forbidden)
- **Endpoint:** `PUT http://localhost:5001/api/users/manage/<USER_B_ID>`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_A_TOKEN>`
- **Request Body:**
  ```json
  {
    "name": "Attempted Hack by User A"
  }
  ```
- **Response:** **`HTTP 403 Forbidden`**
  ```json
  {
    "success": false,
    "error": "Authorization denied (Forbidden)",
    "message": "Forbidden: You are only authorized to modify your own resources, not another user's."
  }
  ```
- **Outcome:** Confirms the backend server-side ownership check blocked User A.

---

### Screenshot 7: Post-Fix IDOR Unauthorized Deletion Rejection (PROTECTED – 403 Forbidden)
- **Endpoint:** `DELETE http://localhost:5001/api/users/manage/<USER_B_ID>`
- **Headers:** `Authorization: Bearer <USER_A_TOKEN>`
- **Response:** **`HTTP 403 Forbidden`**
- **Outcome:** Proves unauthorized deletion is prevented.

---

## 7. Security Measures to Prevent IDOR

### Measure 1: Enforce Server-Side Object-Level Authorization Checks
Never rely solely on client-side routing guards or authentication tokens. For every state-changing request (`GET`, `PUT`, `DELETE`) involving an object ID, the server must query the database with both the target resource ID **and** the session user ID:
```javascript
// Secure Query Pattern:
const resource = await Resource.findOne({ _id: req.params.id, userId: req.user.id });
if (!resource) {
  return res.status(403).json({ message: "Access denied: Unauthorized access to resource." });
}
```

### Measure 2: Use Cryptographically Random Identifiers (UUIDv4) or Indirect Reference Maps
Avoid exposing sequential integer IDs or predictable identifiers in URLs. Instead:
- Use **UUIDv4** (universally unique identifiers) with high entropy, making brute-force ID guessing infeasible.
- Implement **Indirect Reference Maps** (per-session temporary mapping hashes) where the server translates a transient session key to the real database ID internally, preventing users from directly manipulating backend primary keys.

---

## 8. Final Result
- **Pre-Fix Status:** **VULNERABLE** (User A successfully updated User B's data with HTTP 200 OK).
- **Post-Fix Status:** **NOT VULNERABLE / PROTECTED** (Unauthorized operations blocked with HTTP 403 Forbidden).

---

## 9. Conclusion
This vulnerability assessment demonstrated how the absence of object-level authorization allows authenticated attackers to bypass intended access boundaries via Insecure Direct Object References (IDOR). By implementing centralized server-side ownership verification (`authorizeOwnership`), PassionX successfully enforces the principle of least privilege, ensuring users can only interact with their own resources.
