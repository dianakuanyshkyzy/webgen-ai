-- CreateTable
CREATE TABLE "Wish" (
    "id" SERIAL NOT NULL,
    "wishData" JSONB NOT NULL,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);
