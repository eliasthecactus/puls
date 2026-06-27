-- Add lastActiveAt to users
ALTER TABLE "users" ADD COLUMN "lastActiveAt" TIMESTAMP(3);

-- Create exercises table
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "nameDE" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "detailDE" TEXT NOT NULL DEFAULT '',
    "detailEN" TEXT NOT NULL DEFAULT '',
    "formTipDE" TEXT,
    "formTipEN" TEXT,
    "imageUrl" TEXT,
    "primaryMuscles" TEXT[],
    "secondaryMuscles" TEXT[],
    "duration" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- Create custom_plans table
CREATE TABLE "custom_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "custom_plans_pkey" PRIMARY KEY ("id")
);

-- Create passkey_reset_tokens table
CREATE TABLE "passkey_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "passkey_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "custom_plans" ADD CONSTRAINT "custom_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "passkey_reset_tokens" ADD CONSTRAINT "passkey_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique constraints
ALTER TABLE "passkey_reset_tokens" ADD CONSTRAINT "passkey_reset_tokens_token_key" UNIQUE ("token");
