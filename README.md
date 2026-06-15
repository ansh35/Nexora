# Nexora

Nexora is a premium, scalable, and secure SaaS platform designed to supercharge team productivity with cutting-edge AI and seamless real-time collaboration.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js v5](https://authjs.dev/) with `bcryptjs` and JWT strategy
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Real-time Engine:** [Pusher](https://pusher.com/)
- **AI Infrastructure:** [Groq](https://groq.com/)

## ✨ Key Features

- **Premium Design System:** A cohesive, dark-themed `#070B14` aesthetic powered by deep glassmorphism (`backdrop-blur-xl`), highly refined glowing elements (`#22D3EE` cyan shadows), and fluid micro-animations spanning the entire dashboard.
- **Groq-Powered AI Assistant:** Instant, intelligent workflows including a *Project Planner, Task Breakdown, Sprint Generator, Meeting Notes Parser, Task Summaries,* and *Risk Detection*.
- **Real-time Collaboration:** Live Kanban board updates, instant activity feeds, and real-time push notifications seamlessly broadcasted via Pusher.
- **Scalable Architecture:** Clean separation of server actions, UI components, and API routes.
- **Multi-Tenant Organizations:** Workspaces deeply isolated by `organizationId`, preventing cross-organizational data leakage.
- **Role-Based Access:** First-class support for `OWNER`, `ADMIN`, and `MEMBER` roles.

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="mongodb+srv://..."
   AUTH_SECRET="your_generated_secret"
   GROQ_API_KEY="your_groq_api_key_here"
   PUSHER_APP_ID="your_pusher_app_id"
   NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
   PUSHER_SECRET="your_pusher_secret"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
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

## 🧪 Testing Credentials

After running `npm run seed`, use the following accounts to test multi-tenant behavior (Password: `password123`):

### Nexora Demo Workspace
- **OWNER**: `owner@nexora.dev`
- **ADMIN**: `admin@nexora.dev`
- **MEMBER**: `member1@nexora.dev`

## 🤖 AI Configuration (Groq)

Nexora leverages a **Groq-only** AI architecture to power its productivity features, primarily using the blazing-fast `llama-3.3-70b-versatile` model. AI usage is tracked and limited by the active subscription plan.

## 💳 Billing Configuration (Developer Mode)

Nexora currently operates in **Developer Billing Mode**. 
- **Upgrades/Downgrades**: Simulated via `DeveloperBillingProvider`. The architecture is fully abstracted within `src/services/billing`, making it trivial to swap back to Stripe or Razorpay by simply implementing the `BillingProvider` interface.

---
*Built for speed, elegance, and extreme productivity.*
