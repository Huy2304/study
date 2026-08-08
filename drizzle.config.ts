import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Drizzle CLI không tự đọc .env.local như Next.js.
config({
    path: ".env",
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error(
        "Không tìm thấy DATABASE_URL trong file .env"
    );
}

export default defineConfig({
    schema: "./src/lib/db/schema/index.ts",
    out: "./drizzle",
    dialect: "postgresql",

    dbCredentials: {
        url: databaseUrl,
    },
});
