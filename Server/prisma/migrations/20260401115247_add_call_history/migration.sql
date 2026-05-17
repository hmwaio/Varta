-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('AUDIO', 'VIDEO');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('MISSED', 'ANSWERED', 'DECLINED');

-- CreateTable
CREATE TABLE "Call" (
    "call_id" TEXT NOT NULL,
    "caller_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "type" "CallType" NOT NULL DEFAULT 'AUDIO',
    "status" "CallStatus" NOT NULL DEFAULT 'MISSED',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "Call_pkey" PRIMARY KEY ("call_id")
);

-- CreateIndex
CREATE INDEX "Call_caller_id_idx" ON "Call"("caller_id");

-- CreateIndex
CREATE INDEX "Call_receiver_id_idx" ON "Call"("receiver_id");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_caller_id_fkey" FOREIGN KEY ("caller_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE CASCADE;
