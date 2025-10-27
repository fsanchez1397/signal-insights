-- AlterTable
ALTER TABLE "public"."Settings" ADD COLUMN     "ai_confidence_threshold" DOUBLE PRECISION,
ADD COLUMN     "allowed_senders" TEXT[] DEFAULT ARRAY[]::TEXT[];
