-- CreateTable
CREATE TABLE IF NOT EXISTS "home_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'APPROVED',
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'home_comments_parentId_fkey') THEN
        ALTER TABLE "home_comments" ADD CONSTRAINT "home_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "home_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
