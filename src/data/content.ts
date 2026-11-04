export const profile = {
  name: "Shuxrat Mahmadaliev",
  shortName: "Shuxrat",
  role: "Backend Developer",
  level: "Middle",
  experience: "4,7 года",
  location: "Самарканд · Remote",
  tagline:
    "Проектирую REST API, модели данных и серверную бизнес-логику — от схемы данных и API-контракта до фоновой обработки и тестов.",
  about: [
    "Backend-разработчик с 4,7 годами опыта в веб-разработке и проектной практике; основной стек — Node.js/TypeScript, PostgreSQL и React/Next.js. Проектирую REST API, модели данных и серверную бизнес-логику, создаю платёжные сервисы, мультитенантные платформы и AI-инструменты. В PayForge реализовал платёжные state machine, целочисленный денежный учёт, ledger, идемпотентность, очереди и подписанные webhooks.",
    "Работаю с PostgreSQL/Prisma, Redis, RabbitMQ/BullMQ, Docker, GitHub Actions и автоматизированными тестами. Могу вести backend-функцию от схемы данных и API-контракта до фоновой обработки, тестов и воспроизводимого окружения; при необходимости закрываю интерфейс на React/Next.js. Ищу роль Backend Developer в команде, где важны надёжность API, безопасность и сопровождаемость.",
  ],
  resume: {
    ru: "/resume/Resume_Shuxrat_Mahmadaliev_RU.pdf",
    en: "/resume/Resume_Shuxrat_Mahmadaliev_EN.pdf",
  },
  contacts: {
    phone: "+998 (95) 000-57-86",
    phoneHref: "tel:+998950005786",
    email: "shuxe06@gmail.com",
    telegram: "shukhrat_dev",
    telegramHref: "https://t.me/shukhrat_dev",
    github: "Shuxrat-dat",
    githubHref: "https://github.com/Shuxrat-dat",
  },
};

export const focusAreas = [
  {
    title: "API и данные",
    text: "REST API с OpenAPI, идемпотентность, блокировки строк и модели данных под денежный домен.",
  },
  {
    title: "Фоновая обработка",
    text: "RabbitMQ и BullMQ с retry/DLQ, schedulers и Redis locks.",
  },
  {
    title: "Безопасность",
    text: "RBAC/ACL, изоляция тенантов, HMAC-подпись webhooks и audit trail.",
  },
  {
    title: "Тесты и окружение",
    text: "Unit, integration и E2E-тесты, Docker Compose, Nginx и GitHub Actions CI.",
  },
];

export const skillGroups = [
  {
    title: "Backend",
    items: ["Node.js", "TypeScript", "Python", "REST API", "JWT", "FastAPI"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "UI/UX implementation"],
  },
  {
    title: "Data & Infra",
    items: ["PostgreSQL", "Prisma", "Redis", "Docker", "DevOps basics"],
  },
  {
    title: "Практика",
    items: ["Clean Code", "RBAC", "Валидация", "Обработка ошибок", "Production support"],
  },
];

export const domains = [
  "Платёжные сервисы",
  "Мультитенантные платформы",
  "AI-инструменты",
  "E-commerce",
  "Telegram-боты",
];

export const education = [
  {
    title: "Самостоятельная подготовка",
    meta: "Инженерная подготовка и проектная практика",
    text: "Backend, базы данных, тестирование, распределённые workflows и AI-интеграции.",
  },
  {
    title: "Языки",
    meta: "Русский · Английский",
    text: "Открыт к удалённой работе.",
  },
];

export const workExperience = [
  {
    title: "PayForge",
    meta: "Backend payment-gateway sandbox | 2026",
    text: "Архитектура, API, тесты и инфраструктура песочницы платёжного шлюза без движения реальных денег.",
  },
  {
    title: "AI Trading Agent",
    meta: "Локальный AI/automation MVP | 2026",
    text: "Сервисы, интеграции, safety и тесты Python-монорепозитория из 11 сервисов.",
  },
  {
    title: "CompanyOS",
    meta: "Ранний MVP мультитенантной SaaS-платформы | 2026",
    text: "Full-stack архитектура: NestJS API, Next.js web, BullMQ worker и cron-scheduler.",
  },
  {
    title: "SwitchLab / Switchyard",
    meta: "Full-stack e-commerce demo | 2026",
    text: "Rust API, React UI, тестирование и CI для магазина механических клавиатур.",
  },
];

export const techStackCards = [
  {
    name: "Node.js",
    text: "Основной backend-стек: Express и NestJS, REST API и фоновые процессы.",
  },
  {
    name: "TypeScript",
    text: "Основной язык серверной логики и интерфейсов.",
  },
  {
    name: "PostgreSQL",
    text: "Модели данных, транзакции и блокировки строк через SELECT FOR UPDATE.",
  },
  {
    name: "Prisma",
    text: "Схемы и миграции: 32 модели в PayForge, 96 в CompanyOS.",
  },
  {
    name: "Redis",
    text: "Fraud scoring в PayForge, очереди и блокировки.",
  },
  {
    name: "RabbitMQ / BullMQ",
    text: "Асинхронные процессы с retry/DLQ и schedulers.",
  },
  {
    name: "Docker",
    text: "Воспроизводимые окружения через Docker Compose и Nginx.",
  },
  {
    name: "React / Next.js",
    text: "Интерфейсы, когда их нужно закрыть вместе с backend.",
  },
  {
    name: "Python · Rust",
    text: "FastAPI и AI-сервисы; транзакционный API на Rust/Axum.",
  },
];

export const skillMeters = [
  { name: "Backend / API", value: 92 },
  { name: "Frontend / UI", value: 85 },
  { name: "Базы данных", value: 88 },
  { name: "Архитектура", value: 86 },
  { name: "Soft skills", value: 90 },
];

export const projects = [
  {
    id: "01",
    slug: "payforge",
    title: "PayForge",
    subtitle: "Песочница платёжного шлюза",
    summary:
      "Песочница платёжного шлюза без движения реальных денег: payment intents, кошельки и ledger, подписки, счета, refunds, disputes, hosted checkout и webhooks.",
    description:
      "21 feature-модуль, 32 модели Prisma, 65 Jest/Supertest тестов и OpenAPI 3 примерно для 74 API paths.",
    features: [
      "BigInt-деньги и guarded state transitions",
      "Ledger под SELECT FOR UPDATE",
      "Idempotency-Key и fraud scoring на Redis",
      "Worker: RabbitMQ retry/DLQ, clearing, dunning",
      "JWT refresh rotation с reuse detection",
      "API keys и HMAC-подпись webhooks",
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "RabbitMQ",
      "Jest",
      "Docker",
      "GitHub Actions",
    ],
    href: "https://github.com/Shuxrat-dat/PayForge",
    accent: "#e4e4e7",
    image: "/projects/payforge.png",
  },
  {
    id: "02",
    slug: "ai-agent",
    title: "AI Trading Agent",
    subtitle: "Локальный AI/automation MVP",
    summary:
      "Python-монорепозиторий из 11 сервисов (~6K LOC): RAG по Obsidian, анализ рынка, Telegram, voice operator, PyQt6 HUD и управление MetaTrader 5 через MQL5 JSON-bridge.",
    description:
      "133 pytest-теста и 4 ADR; поддержаны локальный Ollama и опциональный OpenAI.",
    features: [
      "AgentBrain объединяет интерфейсы",
      "Hybrid search: bge-m3 + LanceDB",
      "Числа считает код, LLM только интерпретирует",
      "Numeric validator и deterministic fallback",
      "Demo-only trade execution с 4 safety-гейтами",
      "Монитор уровней и журнал дисциплины",
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "Ollama/OpenAI",
      "LanceDB",
      "aiogram",
      "MetaTrader5",
      "MQL5",
      "faster-whisper",
      "PyQt6",
      "pytest",
    ],
    href: "https://github.com/Shuxrat-dat/Ai-Agent",
    accent: "#e4e4e7",
    image: "/projects/ai-agent.png",
  },
  {
    id: "03",
    slug: "companyos",
    title: "CompanyOS",
    subtitle: "Ранний MVP мультитенантной SaaS-платформы",
    summary:
      "Monorepo корпоративной платформы: NestJS API, Next.js web, BullMQ worker и cron-scheduler; 26 API-модулей, 96 моделей Prisma и около 31 UI-страницы.",
    description:
      "Проект не позиционируется как зрелый production-продукт; внешние billing/AI-интеграции работают при настройке env.",
    features: [
      "JWT rotation, OAuth strategies, API keys",
      "Tenant guard, RBAC + resource ACL",
      "Audit logging и rate limiting",
      "Проекты, задачи, документы, календарь",
      "Чат на Socket.io, файлы через MinIO/S3",
      "Очереди для email, AI, analytics, webhooks",
    ],
    stack: [
      "NestJS",
      "Next.js 15",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "Socket.io",
      "MinIO",
      "Docker",
      "Turborepo",
    ],
    href: "https://github.com/Shuxrat-dat/companyos",
    accent: "#e4e4e7",
    image: "/projects/companyos.png",
  },
  {
    id: "04",
    slug: "switchlab",
    title: "SwitchLab / Switchyard",
    subtitle: "Full-stack e-commerce demo",
    summary:
      "Интернет-магазин механических клавиатур с каталогом, корзиной, checkout, кабинетом пользователя и административной панелью; оплата намеренно симулируется.",
    description:
      "Показывает работу вне основного Node.js-стека: транзакционный backend, доведённый до CI и E2E.",
    features: [
      "Rust/Axum API с PostgreSQL/SQLx",
      "Argon2 sessions, CSRF/Origin protection",
      "Checkout в транзакции, остатки под FOR UPDATE",
      "OpenAPI/Swagger и роли",
      "React/Vite storefront и admin flows",
      "CI: rustfmt, clippy, Vitest, Playwright E2E",
    ],
    stack: [
      "Rust",
      "Axum",
      "Tokio",
      "SQLx",
      "PostgreSQL",
      "React 19",
      "TypeScript",
      "Vite",
      "TanStack Query",
      "Playwright",
      "Docker",
    ],
    href: "https://github.com/Shuxrat-dat/SwitchLab",
    accent: "#e4e4e7",
    image: "/projects/switchlab.png",
  },
];
