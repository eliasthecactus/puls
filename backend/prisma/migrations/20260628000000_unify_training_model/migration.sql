-- Exercises no longer carry their own duration (set per-training instead)
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "duration";

-- System plans move to a ref-based, single-language, computed-duration model.
-- The table is recreated since the column shape changes substantially; it is
-- repopulated by the startup auto-seed.
DROP TABLE IF EXISTS "system_plans";

CREATE TABLE "system_plans" (
    "id" TEXT NOT NULL,
    "planetKey" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "system_plans_planetKey_key" ON "system_plans"("planetKey");
