/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Candidate" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_slug_key" ON "public"."Candidate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "public"."Client"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "public"."Job"("slug");
