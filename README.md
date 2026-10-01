# 🌾 AgriBandhu 2.0

> **An AI-assisted digital agriculture platform for managing farms, crop health, disease reports, farmer profiles, and agricultural activities from a single dashboard.**

AgriBandhu 2.0 is a full-stack agricultural management platform designed to help farmers organize their farm information, maintain crop and soil records, detect crop diseases through an extensible analysis pipeline, and manage farming activities through a smart agricultural calendar.

The project is built as a **TypeScript monorepo**, with a Next.js web application, an Express REST API, Prisma ORM, SQLite for local development, and reusable shared packages.

---

## ✨ Features

### 👨‍🌾 Farmer Management

* Farmer registration and authentication
* Secure password hashing using `bcryptjs`
* JWT-based authentication
* HTTP-only authentication cookies
* Remember-me login sessions
* Farmer profile management
* Agricultural profile information
* Preferred language and location details
* Farm size and farming experience tracking

### 🌱 Farm Management

Farmers can create and manage multiple farms with:

* Farm name
* Farm type
* Area
* Acres / hectares
* State
* District
* Village
* Address
* Latitude and longitude
* Crop information
* Soil information
* Farm activity history

The backend also supports:

* Creating farms
* Updating farms
* Deleting farms
* Duplicating farms
* Managing crop information
* Managing soil information
* Uploading farm images
* Maintaining farm activity timelines

Farm ownership is checked before performing protected operations.

---

## 🌾 Crop & Soil Management

Each farm can maintain structured crop and soil information.

### Crop information

* Crop name
* Variety
* Sowing date
* Expected harvest date
* Growth stage

### Soil information

* Soil type
* pH
* Nitrogen
* Phosphorus
* Potassium
* Organic carbon

This information is also used by the agricultural scheduling system to generate farming activities.

---

## 🦠 Crop Disease Analysis

AgriBandhu includes a disease-analysis pipeline for uploaded crop/leaf images.

The current pipeline consists of:

```text
Image Upload
     ↓
Image Validation
     ↓
Image Processing
     ↓
Disease Classification Layer
     ↓
Confidence Evaluation
     ↓
Disease Report Generation
     ↓
Database Persistence
     ↓
Farm Activity Timeline
```

The API accepts JPG, JPEG, PNG and WEBP images, with a maximum upload size of 10 MB for disease analysis.

### Current disease knowledge base

The current report generator contains structured information for:

* 🍅 Tomato Late Blight
* 🌾 Paddy Rice Blast
* 🌱 Cotton Leaf Curl
* 🌾 Wheat Leaf Rust
* ✅ Healthy Crop Leaf

Each generated report can contain:

* Disease prediction
* Severity
* Summary
* Visible symptoms
* Hidden symptoms
* Causes
* Treatment
* Organic remedies
* Prevention recommendations

The disease report and detection metadata are persisted in the database.

> **Current implementation note:** The disease-classification layer is presently a prototype implementation rather than a trained computer-vision model. The classifier currently uses filename hints to select supported disease categories. The architecture is intentionally separated into processing, classification, confidence, and report-generation services so that a real vision model can be integrated later.

---

## 📅 Smart Agricultural Calendar

AgriBandhu provides an agricultural activity management system for planning farm operations.

Supported activity types include:

* Seeding
* Irrigation
* Fertilizer application
* Pesticide application
* Herbicide application
* Pruning
* Harvest
* Land preparation
* Field cleaning
* Soil testing
* Inspection
* AI recommendations
* Custom activities

Calendar events support:

* Priority
* Status
* Start/end dates
* Start/end times
* Recurrence
* Notes
* Farm association
* Crop association
* Attachments
* Reminders

The backend also includes an **AI schedule generation endpoint** that generates farming tasks based on the selected farm's crop, growth stage, and soil type.

---

## 🔐 Authentication & Authorization

AgriBandhu uses a cookie-based JWT authentication architecture.

### Authentication flow

```text
Register
   ↓
Zod Validation
   ↓
Password Hashing
   ↓
User + Profile Creation
   ↓
JWT Generation
   ↓
HTTP-only Cookie
```

For login:

```text
Email + Password
       ↓
Zod Validation
       ↓
Database Lookup
       ↓
bcrypt Password Verification
       ↓
JWT
       ↓
HTTP-only Cookie
```

The application supports three user roles:

```text
FARMER
ADMIN
OFFICER
```

Protected routes use authentication middleware and verify that resources such as farms and disease reports belong to the authenticated user.

---

## 🏗️ Architecture

AgriBandhu 2.0 follows a monorepo architecture:

```text
agribandhu2.0/
│
├── apps/
│   │
│   ├── web/                 # Next.js frontend
│   │   └── src/
│   │
│   └── api/                 # Express REST API
│       ├── src/
│       │   ├── middlewares/
│       │   ├── routes/
│       │   ├── services/
│       │   │   └── ai/
│       │   └── server.ts
│       └── public/
│           └── uploads/
│
├── packages/
│   │
│   ├── config/              # Shared configuration
│   ├── types/               # Shared TypeScript types
│   └── ui/                  # Shared UI components
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── dev.db               # Local SQLite database
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── tsconfig.json
```

The workspace is configured around `apps/*` and `packages/*`, allowing the frontend, backend and shared packages to be developed together.

---

## 🧰 Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS 3
* Framer Motion
* React Hook Form
* Zod
* Lucide React

The web application uses reusable workspace packages such as `@agribandhu/ui` and `@agribandhu/types`.

### Backend

* Node.js
* Express.js
* TypeScript
* JWT
* bcryptjs
* Zod
* Multer
* Cookie Parser
* CORS

The API exposes dedicated route modules for authentication, profiles, farms, disease analysis and agricultural calendar operations.

### Database

* Prisma ORM
* SQLite
* Prisma Client

The current development schema contains entities for users, profiles, farms, crops, soil records, activities, farm images, disease reports, detection history, calendar events, reminders, attachments and authentication tokens.

### Development

* pnpm
* TypeScript
* Prettier
* ESLint
* Nodemon
* TSX

The repository requires Node.js `>=22` and uses pnpm `11.15.1`.

---

## 🗄️ Database Architecture

The core data model follows this relationship:

```text
User
 │
 ├── Profile
 │
 ├── Farms
 │    │
 │    ├── Crop
 │    ├── Soil
 │    ├── FarmActivity
 │    ├── FarmImage
 │    ├── DiseaseReport
 │    │      └── DetectionHistory
 │    │
 │    └── CalendarEvent
 │           ├── EventReminder
 │           └── EventAttachment
 │
 └── Authentication Sessions / Tokens
```

Prisma relations use cascading deletes where appropriate so that dependent records are removed when their parent farm or user is deleted.

---

## 🔌 API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Profile

```http
GET    /api/profile
PUT    /api/profile
```

### Farms

```http
GET    /api/farms
GET    /api/farms/:id
POST   /api/farms
PUT    /api/farms/:id
DELETE /api/farms/:id

POST   /api/farms/:id/duplicate
```

### Disease Analysis

```http
POST   /api/disease/upload
POST   /api/disease/analyze

GET    /api/disease/history
GET    /api/disease/:id
DELETE /api/disease/:id
```

### Agricultural Calendar

```http
GET    /api/calendar
POST   /api/calendar
POST   /api/calendar/generate-ai-schedule
GET    /api/calendar/:id
PUT    /api/calendar/:id
DELETE /api/calendar/:id
```

The disease analysis endpoint persists the resulting report, detection history and a corresponding farm activity in a database transaction.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js 22+
* pnpm 11+
* Git

Check your versions:

```bash
node --version
pnpm --version
```

---

### 1. Clone the repository

```bash
git clone https://github.com/anujmishra03/agribandhu2.0.git
cd agribandhu2.0
```

---

### 2. Install dependencies

```bash
pnpm install
```

---

### 3. Configure environment variables

Create an environment file for the API:

```text
apps/api/.env
```

Example:

```env
PORT=5000
JWT_SECRET=your_secure_secret_here
NODE_ENV=development
```

For production, use a long, random JWT secret and never commit `.env` files.

---

### 4. Configure Prisma

Generate the Prisma client:

```bash
pnpm prisma generate
```

For a fresh local database:

```bash
pnpm prisma db push
```

The development database uses SQLite through:

```text
file:./dev.db
```

---

### 5. Start the development environment

From the repository root:

```bash
pnpm dev
```

The root workspace runs development commands across the monorepo.

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

The web application runs using Next.js on its development server, typically:

```text
http://localhost:3000
```

The API currently allows the local frontend origin `http://localhost:3000` for credentialed CORS requests.

---

## 🏭 Production Build

Build all workspace applications:

```bash
pnpm build
```

Run linting:

```bash
pnpm lint
```

Format the repository:

```bash
pnpm format
```

For the API specifically:

```bash
pnpm --filter @agribandhu/api build
pnpm --filter @agribandhu/api start
```

For the web application:

```bash
pnpm --filter @agribandhu/web build
pnpm --filter @agribandhu/web start
```

---

## 🔄 Example Disease Detection Flow

```text
Farmer
  │
  │ Uploads crop image
  ▼
Next.js Web App
  │
  │ multipart/form-data
  ▼
Express API
  │
  ├── Authentication
  │
  ├── File validation
  │
  ├── Farm ownership verification
  │
  ▼
Disease Detection Service
  │
  ├── Image processing
  ├── Classification layer
  ├── Confidence calculation
  └── Report generation
  │
  ▼
Prisma Transaction
  │
  ├── DiseaseReport
  ├── DetectionHistory
  └── FarmActivity
  │
  ▼
Farmer Dashboard
```

---

## 🧠 Extensible AI Architecture

The disease-analysis system is deliberately separated into independent services:

```text
services/ai/
│
├── diseaseDetection.ts
├── imageProcessing.ts
├── confidenceCalculator.ts
├── reportGenerator.ts
└── scheduleGenerator.ts
```

This separation makes it possible to replace the current prototype classifier with a real computer-vision model without redesigning the entire API.

For example, a future implementation could follow:

```text
Uploaded Image
      ↓
Preprocessing
      ↓
CNN / Vision Transformer
      ↓
Disease Classification
      ↓
Probability Distribution
      ↓
Confidence Threshold
      ↓
Agricultural Knowledge Base
      ↓
Farmer-Friendly Report
```

---

## 🛡️ Security Considerations

Current security mechanisms include:

* Password hashing with bcrypt
* HTTP-only authentication cookies
* JWT authentication
* Zod request validation
* Authenticated route middleware
* Farm ownership checks
* Disease-report ownership checks
* File type validation
* File-size limits
* Basic IP-based request limiting
* Parameterized database access through Prisma

The API currently implements a simple in-memory rate limiter allowing up to 300 requests per IP during a 15-minute window.

### Production hardening planned

For a production deployment, consider:

* Strong mandatory JWT secret
* Persistent rate limiting such as Redis
* CSRF protection where appropriate
* More restrictive CORS configuration
* Cloud object storage for uploaded images
* Database backups
* Structured logging
* API monitoring
* Automated tests
* CI/CD
* Real ML inference service
* Secure password-reset email delivery

---

## 🗺️ Roadmap

### Phase 1 — Core Platform

* [x] Authentication
* [x] Farmer profiles
* [x] Farm management
* [x] Crop records
* [x] Soil records
* [x] Farm activity timeline

### Phase 2 — Crop Health

* [x] Image upload
* [x] Disease analysis pipeline
* [x] Disease reports
* [x] Confidence handling
* [x] Disease history

### Phase 3 — Farm Planning

* [x] Agricultural calendar
* [x] Recurring activities
* [x] Task priorities
* [x] Farm-specific scheduling
* [x] AI schedule generation

### Phase 4 — Intelligence

* [ ] Real computer-vision disease model
* [ ] Model confidence calibration
* [ ] Crop recommendation engine
* [ ] Soil-based recommendations
* [ ] Weather integration
* [ ] Pest detection
* [ ] Yield prediction
* [ ] Government scheme information
* [ ] Multilingual agricultural assistant

### Phase 5 — Production

* [ ] PostgreSQL production database
* [ ] Cloud image storage
* [ ] Background jobs
* [ ] Redis caching
* [ ] Automated testing
* [ ] CI/CD
* [ ] Observability
* [ ] Production deployment

---

## 📊 Current Project Status

AgriBandhu 2.0 currently provides a functional foundation for an agricultural management platform:

| Area                   | Status       |
| ---------------------- | ------------ |
| Monorepo               | ✅            |
| Next.js Web App        | ✅            |
| Express REST API       | ✅            |
| TypeScript             | ✅            |
| Authentication         | ✅            |
| Farmer Profiles        | ✅            |
| Farm Management        | ✅            |
| Crop Records           | ✅            |
| Soil Records           | ✅            |
| Disease Reports        | ✅            |
| Image Uploads          | ✅            |
| Agricultural Calendar  | ✅            |
| AI Schedule Generation | ✅            |
| Disease Classifier     | 🧪 Prototype |
| Real ML Model          | 🚧 Planned   |
| Production Database    | 🚧 Planned   |
| Automated Tests        | 🚧 Planned   |
| CI/CD                  | 🚧 Planned   |

---

## 🤝 Contributing

Contributions are welcome.

### Development workflow

```bash
git checkout -b feature/your-feature
pnpm install
pnpm dev
```

After making changes:

```bash
pnpm lint
pnpm build
pnpm format
```

Then commit your changes:

```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Open a pull request with:

* A clear description
* The problem being solved
* Implementation details
* Screenshots for UI changes
* Testing information

---

## 👨‍💻 Author

**Anuj Mishra**

GitHub: [@anujmishra03](https://github.com/anujmishra03)

LinkedIn: [Anuj Mishra](https://linkedin.com/in/anuj-mishra-680042295)

---

## 📄 License

This project currently does not specify a license.

If you intend to make AgriBandhu open source for external contributions, add an appropriate license such as MIT before presenting it as an open-source project.

---

## 🌾 Vision

AgriBandhu aims to evolve into a unified digital assistant for agriculture where farmers can manage their farms, understand crop health, plan farming activities, and access intelligent agricultural recommendations from one platform.

> **From farm records to intelligent decisions — AgriBandhu brings agricultural workflows into one place.**
