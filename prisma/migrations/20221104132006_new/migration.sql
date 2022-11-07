-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "coverArt" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "purchasedAmount" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollectionsOwned" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionsOwned_AB_unique" ON "_CollectionsOwned"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionsOwned_B_index" ON "_CollectionsOwned"("B");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionsOwned" ADD CONSTRAINT "_CollectionsOwned_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionsOwned" ADD CONSTRAINT "_CollectionsOwned_B_fkey" FOREIGN KEY ("B") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
