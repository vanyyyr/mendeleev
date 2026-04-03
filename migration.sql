-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Element" (
    "id" SERIAL NOT NULL,
    "atomicNum" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "atomicMass" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "applications" TEXT NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "elementId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentElementId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "elementId" INTEGER,
    "questionId" INTEGER,
    "userAnswer" TEXT,
    "aiHint" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Element_atomicNum_key" ON "Element"("atomicNum");

-- CreateIndex
CREATE UNIQUE INDEX "Element_symbol_key" ON "Element"("symbol");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

