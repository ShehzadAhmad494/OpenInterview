# 📝 NestJS JWT Authentication Project - Summary & Guide

## 1️⃣ Project Overview

Ye project ek **NestJS + TypeORM + PostgreSQL backend** hai jisme humne **User Signup, Login, JWT authentication, aur protected routes** implement kiye hain.

Key Features:

* ✅ User Signup (email, password, name)
* ✅ Password hashing with bcrypt
* ✅ Login with email & password
* ✅ JWT Access Token (15 min expiry) & Refresh Token
* ✅ Protected routes using JWT Guard

---

## 2️⃣ Steps Followed (Signup & Login Flow)

### Signup Flow 🛠️

1. Client signup request bhejta hai → `{ email, password, name }`
2. Backend check karta hai agar **email already exists**
3. Agar email available → password ko **bcrypt** se hash kiya jata hai
4. Naya user **database me save** hota hai
5. Response me **user id aur email** return hoti hai

### Login Flow 🔑

1. Client login request bhejta hai → `{ email, password }`
2. Backend check karta hai **email exist karta hai ya nahi**
3. Password ko **bcrypt compare** karta hai
4. Agar match ho → **JWT Access Token** generate hota hai
5. Client token ko **Authorization header** me use karke protected routes access kar sakta hai

---

## 3️⃣ Problems Faced & Solutions 🐞➡️💡

### 3.1 JWT Secret Key Not Loaded ❌

* **Error:** `Error: secretOrPrivateKey must have a value`
* **Cause:** Circular dependency ki waja se `.env` ka `JWT_SECRET` load nahi ho raha tha
* **Solution:**

  * `forwardRef(() => UserModule)` use kiya **circular dependency break karne ke liye**
  * AuthModule ke `JwtModule.register({ secret: process.env.JWT_SECRET })` me secret ab load ho gaya ✅

### 3.2 Circular Dependency 🔄

* **Definition:** Jab **Module A import karta hai Module B** aur **Module B import karta hai Module A**, NestJS me ye circular dependency kehlata hai
* **Problem:** Ye backend me token secret ya services ko resolve nahi kar pata
* **Fix:** `forwardRef(() => ModuleName)` use karna hota hai

### 3.3 Route Conflicts - Static vs Dynamic 🚦

* **Error:** `invalid input syntax for type uuid: "me"`
* **Cause:**

  * `/users/me` route define kiya
  * Lekin pehle `/users/:id` dynamic route define tha → NestJS `me` ko `:id` samajh raha tha
* **Solution:**

  * **Static routes ko pehle define karo**
  * Dynamic routes ko baad me rakho

```ts
@Get('me') // static route first
@Get(':id') // dynamic route after
```

---

## 4️⃣ JWT Tokens - How They Work 🔑

* **Access Token:**

  * Short-lived (15 min)
  * Client har protected request me Authorization header me bhejta hai
* **Refresh Token:**

  * Long-lived (optional)
  * Access token expire hone pe new access token generate karne ke liye use hota hai

**Testing Tip:** Postman me:

* Signup → Login → Copy Access Token → Authorization Header: `Bearer <token>` → Access protected route `/users/me`

---

## 5️⃣ JWT Guard - Protecting Routes 🛡️

* Guard check karta hai ki **Authorization header me valid token hai ya nahi**
* Agar token valid → `req.user` me payload attach hota hai
* Protected route me use:

```ts
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Req() req) {
  return { message: 'Protected route accessed', user: req.user };
}
```

* **Static vs Dynamic Route Issue:** Ensure `/me` route **dynamic `/users/:id` ke pehle** ho

---

## 6️⃣ Key Learnings ✨

* NestJS me **module dependencies** ka order aur circular references ka handling bohot important hai
* JWT ke liye **secret key** environment variable me hona chahiye
* Password hashing with bcrypt is a must
* Route order matters: static routes pehle, dynamic routes baad me

---

✅ **Ready for Testing in Postman:**

1. Signup → `/auth/signup`
2. Login → `/auth/login` → get JWT token
3. Protected Route → `/users/me` → header: `Authorization: Bearer <token>`