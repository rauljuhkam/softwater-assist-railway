# SoftWater Assist Railway

This is the Railway version of the educational app. Next.js App Router, TypeScript, Tailwind, Prisma 6, PostgreSQL. Deploy from GitHub main to Railway; database credentials come only from DATABASE_URL. Do not create a local database. AI responses are simulated; no paid LLM service or API key is required. Attachment handling stores filename and size only. Do not claim that custom prompt text or sliders control real inference.

Read ENVIRONMENT.md before using the local runtime. Use pnpm. Run pnpm test and pnpm build before proposing a commit. Startup applies committed Prisma migrations and idempotently seeds default personas before starting Next.js on PORT. Never commit .env or secrets. Commit, push and merge only as authorized by the user. Do not overwrite the separate SoftWater-Assist local demo.

This is a shared public classroom demo without authentication: every visitor can read, change or delete shared conversations and custom personas. Do not present it as a private customer portal. Keep the shared-data notice visible. Default personas can be edited but cannot be deleted.
