import { db } from "@/utils/db";
import { Asset, Prisma } from "@prisma/client";

// Create
export async function createAsset(data: Prisma.AssetCreateInput): Promise<Asset> {
  return await db.asset.create({
    data,
    include: { department: true },
  });
}

// Read
export async function getAssetById(id: number): Promise<Asset | null> {
  return await db.asset.findUnique({
    where: { id },
    include: { department: true },
  });
}

export async function getAllAssets(): Promise<Asset[]> {
  return await db.asset.findMany({
    include: { department: true },
  });
}

// Update
export async function updateAsset(id: number, data: Prisma.AssetUpdateInput): Promise<Asset> {
  return await db.asset.update({
    where: { id },
    data,
    include: { department: true },
  });
}

// Delete
export async function deleteAsset(id: number): Promise<Asset> {
  return await db.asset.delete({
    where: { id },
    include: { department: true },
  });
}