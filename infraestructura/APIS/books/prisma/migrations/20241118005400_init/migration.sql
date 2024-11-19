-- CreateTable
CREATE TABLE "Books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);
