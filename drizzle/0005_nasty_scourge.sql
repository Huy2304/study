ALTER TABLE "news_comments" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news_comments" ADD COLUMN "nickname" varchar(50);