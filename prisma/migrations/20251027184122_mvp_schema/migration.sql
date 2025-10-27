-- CreateEnum
CREATE TYPE "public"."InteractionSource" AS ENUM ('manual', 'gmail', 'zoom', 'linkedin', 'ats', 'other');

-- CreateEnum
CREATE TYPE "public"."InteractionType" AS ENUM ('email', 'call', 'meeting', 'note', 'other');

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'hiring_manager';

-- AlterTable
ALTER TABLE "public"."Candidate" ADD COLUMN     "ai_confidence" DOUBLE PRECISION,
ADD COLUMN     "ai_needs_review" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ai_strengths" TEXT,
ADD COLUMN     "ai_summary" TEXT,
ADD COLUMN     "ai_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ai_weaknesses" TEXT,
ADD COLUMN     "last_ai_updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "user_id" TEXT,
    "source" "public"."InteractionSource" NOT NULL,
    "type" "public"."InteractionType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_confidence" DOUBLE PRECISION,
    "needs_review" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interaction_candidate_id_idx" ON "public"."Interaction"("candidate_id");

-- CreateIndex
CREATE INDEX "Interaction_user_id_idx" ON "public"."Interaction"("user_id");

-- CreateIndex
CREATE INDEX "Note_candidate_id_idx" ON "public"."Note"("candidate_id");

-- CreateIndex
CREATE INDEX "Note_author_id_idx" ON "public"."Note"("author_id");

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "public"."Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
