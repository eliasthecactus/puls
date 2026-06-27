CREATE TABLE "system_plans" (
    "id" TEXT NOT NULL,
    "planKey" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "subtitle" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT[],
    "sections" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "system_plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "system_plans_planKey_key" ON "system_plans"("planKey");
