CREATE TABLE "news_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_post_id_news_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."news_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_comments_post_id_idx" ON "news_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "news_comments_created_at_idx" ON "news_comments" USING btree ("created_at");