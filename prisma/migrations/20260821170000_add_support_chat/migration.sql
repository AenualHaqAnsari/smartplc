-- CreateEnum
CREATE TYPE "SupportConversationStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportMessageSender" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateTable
CREATE TABLE "SupportConversation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "SupportConversationStatus" NOT NULL DEFAULT 'OPEN',
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sender" "SupportMessageSender" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportConversation_customerId_idx"
ON "SupportConversation"("customerId");

-- CreateIndex
CREATE INDEX "SupportConversation_status_idx"
ON "SupportConversation"("status");

-- CreateIndex
CREATE INDEX "SupportConversation_blocked_idx"
ON "SupportConversation"("blocked");

-- CreateIndex
CREATE INDEX "SupportConversation_updatedAt_idx"
ON "SupportConversation"("updatedAt");

-- CreateIndex
CREATE INDEX "SupportMessage_conversationId_idx"
ON "SupportMessage"("conversationId");

-- CreateIndex
CREATE INDEX "SupportMessage_createdAt_idx"
ON "SupportMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "SupportConversation"
ADD CONSTRAINT "SupportConversation_customerId_fkey"
FOREIGN KEY ("customerId")
REFERENCES "Customer"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage"
ADD CONSTRAINT "SupportMessage_conversationId_fkey"
FOREIGN KEY ("conversationId")
REFERENCES "SupportConversation"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;