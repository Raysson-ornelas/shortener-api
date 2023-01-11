-- CreateTable
CREATE TABLE "UrlMapping" (
    "shortenedURL" TEXT NOT NULL PRIMARY KEY,
    "originalURL" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
