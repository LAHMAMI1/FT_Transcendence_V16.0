-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date_joined" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "oauth_provider" TEXT NOT NULL,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_secret" TEXT,
    "two_factor_email_code" TEXT,
    "two_factor_email_expires" DATETIME,
    "two_factor_email_verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("date_joined", "email", "first_name", "id", "last_name", "oauth_provider", "password", "two_factor_email_code", "two_factor_email_expires", "two_factor_enabled", "two_factor_secret", "username") SELECT "date_joined", "email", "first_name", "id", "last_name", "oauth_provider", "password", "two_factor_email_code", "two_factor_email_expires", "two_factor_enabled", "two_factor_secret", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
