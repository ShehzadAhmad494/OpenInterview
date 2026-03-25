
# 📝 NestJS JWT Authentication - Refresh Token Flow

## 1️⃣ Project Overview

NestJS + TypeORM + PostgreSQL backend with:

* ✅ User Signup & Login
* ✅ Password hashing (bcrypt)
* ✅ JWT Authentication (Access & Refresh Tokens)
* ✅ Protected routes using JWT Guard

---

## 2️⃣ Key Concepts 🔑

**Access Token** 🔑

* Short-lived (e.g., 15 min)
* Sent in **JSON**
* Used for accessing protected routes

**Refresh Token** 🔄

* Long-lived (e.g., 7 days)
* Sent in **HttpOnly Cookie** → prevents XSS
* Stored in **DB hashed** (bcrypt)
* Used to generate new access tokens without re-login

**Token Rotation** 🔁

* Each refresh request:

  1. Verify old refresh token ✅
  2. Generate new access + refresh token
  3. Hash & replace refresh token in DB
* Prevents token reuse by attackers

**HttpOnly Cookies** 🍪

* Cannot be accessed via JavaScript
* Store refresh tokens securely

---

## 3️⃣ Implementation Steps 🔧

### Signup Flow 🛠️

1. Client sends `{ email, password, name }`
2. Check if user exists → throw error if yes
3. Hash password with bcrypt
4. Save new user in DB
5. Return user id & email

### Login Flow 🔑

1. Validate email & password
2. Generate **Access Token** & **Refresh Token**
3. Hash refresh token → save in DB
4. Return **access token in JSON** & **refresh token in HttpOnly cookie**

### Refresh Flow 🔄

1. Receive refresh token from cookie (or body for testing)
2. Verify JWT & extract user id
3. Compare hashed refresh token with DB
4. Generate new access + refresh token
5. Hash new refresh token → save in DB
6. Return new **access token** (JSON) & set new cookie

---

## 4️⃣ Controller & DTO Tips ✨

* Use `RefreshDto` with `@IsString()` and `@IsNotEmpty()`
* ValidationPipe ensures `"property should not exist"` errors are prevented
* Keep refresh endpoint `/auth/refresh` separate from login

---

## 5️⃣ Security Layers 🛡️

1. HttpOnly cookie for refresh token
2. Secure cookie (production)
3. Hash token in DB
4. Token rotation
5. Reuse detection

---

## 6️⃣ Testing Flow 🧪

1. Signup → `/auth/signup`
2. Login → `/auth/login` → get access + refresh tokens
3. Access protected route → `/users/me` → Authorization header: `Bearer <access_token>`
4. Refresh tokens → `/auth/refresh` → get new access token
5. Logout → clear cookie + remove refresh token from DB

---

✅ **Outcome:**
Secure JWT Authentication with **refresh token rotation** implemented and tested.
