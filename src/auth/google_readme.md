# 📝 Google OAuth Authentication - NestJS (Short Guide)

## 1️⃣ Setup & Packages

* Installed packages:

  * `passport`
  * `passport-google-oauth20`
  * `@nestjs/passport`
* `.env` variables:

  * `GOOGLE_CLIENT_ID`
  * `GOOGLE_CLIENT_SECRET`

---

## 2️⃣ Strategy (`google.strategy.ts`)

* **Purpose:** Google se user profile fetch karna aur NestJS me authenticate karna
* Key points:

  * `scope: ['email', 'profile']` → required fields from Google
  * `callbackURL` → Google redirects here after login
  * `validate()` method → profile ka data return karta hai

**Important:**

```ts
const email = profile.emails?.[0]?.value ?? 'no-email@google.com';
```

* Optional chaining se TypeScript errors avoid hote hain
* Default values handle incomplete profile data

---

## 3️⃣ Guard (`GoogleAuthGuard`)

* **Purpose:** Route ko protect karna aur strategy bind karna
* Use in Controller:

```ts
@Get('google')
@UseGuards(GoogleAuthGuard)
async googleLogin() {
  // request is redirected to Google
}
```

---

## 4️⃣ Controller (`auth.controller.ts`)

* `/auth/google` → user ko Google login page pe redirect
* `/auth/google/callback` → handle Google response
* Console me profile check kar sakte ho:

```ts
console.log('Google Profile:', profile);
```

---

## 5️⃣ Next Steps (Logic Implementation)

* Profile se data DB me check/create karna
* JWT Access & Refresh Tokens generate karna
* Refresh token **HttpOnly cookie** me bhejna
* Redirect ya JSON response client ko dena

---

## 6️⃣ Notes / Tips 🔹

* Console me **`Google Profile: undefined`** ka matlab hai `scope` ya permissions missing hai
* Always handle **optional chaining** in `validate()`
* JWT & refresh token logic same rehti hai jaise local login me

---

✅ Ye ab ready hai **login + DB save + JWT + refresh token** implement karne ke liye.

