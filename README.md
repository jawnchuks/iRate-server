# iRate-server

A scalable, production-grade backend built with **NestJS**, **TypeScript**, and **Prisma**. Designed for reliability, security, and extensibility—ready for enterprise and FAANG-level applications.

---

## 🚀 Features
- Modular architecture (NestJS)
- Type-safe ORM (Prisma)
- JWT authentication (email, phone, Google OAuth)
- Onboarding and profile management
- Email/SMS verification (with test/dev support)
- Rate limiting, guards, and role-based access
- Swagger API docs
- Linting, formatting, and pre-commit hooks
- CI-ready (GitHub Actions)

---

## 🛠️ Tech Stack
- Node.js, TypeScript, NestJS
- Prisma ORM (PostgreSQL)
- Redis (optional)
- Nodemailer (email)
- Jest (testing)

---

## ⚡ Quick Start
```sh
# 1. Install dependencies
npm install

# 2. Copy and edit environment variables
cp .env.example .env

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Start the dev server
npm run start:dev
```

---

## ⚙️ Environment Variables
See `.env.example` for all required variables.

---

## 📜 Scripts
- `npm run start:dev` — Start in dev mode
- `npm run build` — Build for production
- `npm run start:prod` — Start in production
- `npm run test` — Run tests
- `npm run lint` — Lint code
- `npm run format` — Format code

---

## 🧪 Testing
- Uses **Jest** for unit and integration tests.
- Place tests in `*.spec.ts` files.

---

## 🧹 Linting & Formatting
- **ESLint** for code quality
- **Prettier** for formatting
- Pre-commit hooks via **Husky** and **lint-staged**

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch
3. Commit with clear messages
4. Open a PR

---

## 📄 License
[MIT](LICENSE) 