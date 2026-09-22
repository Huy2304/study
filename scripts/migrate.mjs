import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env" });

const runMigrate = async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("Missing DATABASE_URL");
    }

    console.log("⏳ Đang chạy migrations...");
    // prepare: false là cần thiết cho Supabase transaction pooler
    const migrationClient = postgres(databaseUrl, { max: 1, prepare: false });
    const db = drizzle(migrationClient);

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Chạy migrations thành công!");
    await migrationClient.end();
    process.exit(0);
};

runMigrate().catch((err) => {
    console.error("❌ Chạy migration thất bại", err);
    process.exit(1);
});
