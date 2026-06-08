# Nexora

Nexora is a premium, scalable, and secure SaaS foundation built with modern web technologies. 

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js v5](https://authjs.dev/) with `bcryptjs` and JWT strategy
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## ✨ Key Features (Phase 1-3)

- **Scalable Architecture:** Clean separation of server actions, UI components, and lib utilities.
- **Robust Database Layer:** Singleton Prisma client integrated with MongoDB Atlas.
- **Secure Authentication:** Full registration, login, logout, and session persistence flows.
- **Strict Validation:** Input validation using Zod on both client and server boundaries.
- **Premium Design System:** Glassmorphism UI, `#070B14` dark aesthetic, and tailored accent colors (`#22D3EE`).

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file based on `.env.example` (or configure your own):
   ```env
   DATABASE_URL="mongodb+srv://..."
   AUTH_SECRET="your_generated_secret"
   ```

3. **Sync Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Route Protection

Unauthenticated access to restricted areas (like `/dashboard`) is actively intercepted by Next.js Middleware and gracefully redirected to the `/login` portal.

---
*Developed as a foundation for the Nexora SaaS platform.*
