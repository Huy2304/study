CREATE TABLE "news_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(180) NOT NULL,
	"excerpt" varchar(320) DEFAULT '' NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"affiliate_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "news_posts_published_idx" ON "news_posts" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "news_posts_created_at_idx" ON "news_posts" USING btree ("created_at");