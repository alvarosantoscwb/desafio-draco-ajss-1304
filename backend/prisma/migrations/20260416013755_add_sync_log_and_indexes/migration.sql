-- CreateTable
CREATE TABLE "sync_log" (
    "id" SERIAL NOT NULL,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,

    CONSTRAINT "sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communication_process_number_idx" ON "communication"("process_number");

-- CreateIndex
CREATE INDEX "communication_available_at_idx" ON "communication"("available_at");

-- CreateIndex
CREATE INDEX "communication_court_acronym_idx" ON "communication"("court_acronym");
