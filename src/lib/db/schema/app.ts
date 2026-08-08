import {
    bigint,
    boolean,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { user } from "./auth";

export const gameRuns = pgTable(
    "game_runs",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        /*
         * UUID tạo trên client khi bắt đầu vòng.
         * Unique để chặn retry hoặc effect chạy lặp.
         */
        clientRunId: uuid("client_run_id").notNull(),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        gameType: varchar("game_type", {
            length: 30,
        }).notNull(),

        gameMode: varchar("game_mode", {
            length: 30,
        }).notNull(),

        difficulty: varchar("difficulty", {
            length: 20,
        }).notNull(),

        score: integer("score").notNull(),
        correctAnswers: integer("correct_answers").notNull(),
        totalAnswers: integer("total_answers").notNull(),
        durationSeconds: integer("duration_seconds").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        uniqueIndex("game_runs_client_run_id_unique").on(
            table.clientRunId
        ),
        uniqueIndex("game_runs_daily_challenge_unique")
            .on(table.userId, table.gameMode)
            .where(sql`${table.gameMode} like 'daily-%'`),
        index("game_runs_user_id_idx").on(table.userId),
        index("game_runs_created_at_idx").on(table.createdAt),
    ]
);

export const playerStats = pgTable(
    "player_stats",
    {
        userId: text("user_id")
            .primaryKey()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        totalScore: bigint("total_score", {
            mode: "number",
        })
            .default(0)
            .notNull(),

        totalPlays: integer("total_plays")
            .default(0)
            .notNull(),

        bestScore: integer("best_score")
            .default(0)
            .notNull(),

        totalCorrect: integer("total_correct")
            .default(0)
            .notNull(),

        totalAnswers: integer("total_answers")
            .default(0)
            .notNull(),

        totalPlaySeconds: bigint("total_play_seconds", {
            mode: "number",
        })
            .default(0)
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("player_stats_total_score_idx").on(
            table.totalScore
        ),
    ]
);

export const notes = pgTable(
    "notes",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        title: varchar("title", {
            length: 120,
        })
            .default("")
            .notNull(),

        content: text("content")
            .default("")
            .notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("notes_user_updated_idx").on(
            table.userId,
            table.updatedAt
        ),
    ]
);

export const todos = pgTable(
    "todos",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        content: varchar("content", {
            length: 500,
        }).notNull(),

        completed: boolean("completed")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "date",
        })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("todos_user_updated_idx").on(
            table.userId,
            table.updatedAt
        ),
    ]
);
