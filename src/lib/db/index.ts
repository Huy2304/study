import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("Thiếu biến môi trường DATABASE_URL");
}

/*
 * Supabase Transaction Pooler không hỗ trợ prepared statements.
 * prepare: false cũng hoạt động với connection thông thường.
 */
const client = postgres(connectionString, {
    prepare: false,
    max: 5,
});

export const db = drizzle(client, {
    schema,
});

export type Database = typeof db;
