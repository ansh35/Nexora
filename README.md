# Nexora

Nexora is a premium, scalable, and secure SaaS foundation built with modern web technologies. 

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js v5](https://authjs.dev/) with `bcryptjs` and JWT strategy
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## ✨ Key Features (Phases 1-4)

- **Scalable Architecture:** Clean separation of server actions, UI components, and lib utilities.
- **Robust Database Layer:** Singleton Prisma client integrated with MongoDB Atlas.
- **Secure Authentication:** Full registration, login, logout, and session persistence flows.
- **Strict Validation:** Input validation using Zod on both client and server boundaries.
- **Multi-Tenant Organizations:** Workspaces isolated by `organizationId`, preventing cross-organizational data access.
- **Role-Based Access:** First-class support for `OWNER`, `ADMIN`, and `MEMBER` roles within organizations.
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

## 🧪 Testing Credentials

After running `npm run seed`, you can use the following accounts to test multi-tenant behavior. The password for all accounts is `password123`.

### Nexora Demo Workspace
- **OWNER**: `owner@nexora.dev`
- **ADMIN**: `admin@nexora.dev`
- **MEMBER**: `member1@nexora.dev` (or `member2@nexora.dev`, `member3@nexora.dev`)

### Acme Workspace
- **OWNER**: `owner@acme.com`
- **ADMIN**: `admin@acme.com`
- **MEMBER**: `member@acme.com`

## 🤖 AI Configuration (Groq)

Nexora leverages a **Groq-only** AI architecture to power its productivity features (Task Breakdown, Project Planner, Meeting Notes Parser, Task Summaries, Risk Detection, and Sprint Generator). The primary model used is `llama-3.3-70b-versatile`.

1. **Environment Variables**:
   You must set `GROQ_API_KEY` in your `.env` file to use AI features. *No OpenAI keys are required.*
   ```env
   GROQ_API_KEY="your_groq_api_key_here"
   ```

2. **AI Usage Limits**:
   AI usage is strictly tracked per discrete request and limited by organization subscription plans:
   - **Free Plan**: 100 AI requests per month.
   - **Pro Plan**: 500 AI requests per month.
   - **Enterprise Plan**: Unlimited AI requests.

## 💳 Billing Configuration (Developer Mode)

Due to Stripe onboarding limitations in India, the current Nexora billing implementation operates in **Developer Billing Mode**. 

- **Payment Processing**: No real payments are processed.
- **Upgrades/Downgrades**: Simulated via `DeveloperBillingProvider`. When upgrading, the subscription is activated instantly.
- **Future Migration Strategy**: The architecture is fully abstracted within `src/services/billing`. To migrate back to Stripe, Razorpay, or PayPal in the future, developers only need to implement the `BillingProvider` interface (`checkout`, `portal`, `upgrade`, `downgrade`) without modifying feature gates or usage logic.
- **Provider Abstraction Architecture**: 
  - `provider.ts`: Contract.
  - `developer-billing-provider.ts`: Current simulator.
  - `subscription-service.ts`: Exposes active plan details.
  - `usage-service.ts`: Tracks real-world limits against simulated quotas.

---
*Developed as a foundation for the Nexora SaaS platform.*
