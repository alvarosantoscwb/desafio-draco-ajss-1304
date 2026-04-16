-- CreateTable
CREATE TABLE "communication" (
    "id" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "court_acronym" TEXT NOT NULL,
    "organ_name" TEXT NOT NULL,
    "communication_type" TEXT NOT NULL,
    "document_type" TEXT,
    "class_name" TEXT,
    "process_number" TEXT NOT NULL,
    "process_number_mask" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "medium_full" TEXT NOT NULL,
    "link" TEXT,
    "status" TEXT NOT NULL,
    "available_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipient" (
    "id" SERIAL NOT NULL,
    "communication_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pole" TEXT,
    "is_lawyer" BOOLEAN NOT NULL,
    "oab_number" TEXT,
    "oab_state" TEXT,

    CONSTRAINT "recipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "communication_hash_key" ON "communication"("hash");

-- AddForeignKey
ALTER TABLE "recipient" ADD CONSTRAINT "recipient_communication_id_fkey" FOREIGN KEY ("communication_id") REFERENCES "communication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
