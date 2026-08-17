ALTER TABLE "redemptions" ADD COLUMN "destination_bank_name" text;--> statement-breakpoint
ALTER TABLE "redemptions" ADD COLUMN "destination_account_number" text;--> statement-breakpoint
ALTER TABLE "redemptions" ADD COLUMN "destination_account_name" text;--> statement-breakpoint
ALTER TABLE "redemptions" ADD COLUMN "destination_phone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "destination_bank_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "destination_account_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "destination_account_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "destination_phone" text;