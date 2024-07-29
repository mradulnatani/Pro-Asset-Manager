import { NextRequest, NextResponse } from "next/server";
import {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from "@/utils/assetOperation";
import { db } from "@/utils/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const departmentId = searchParams.get("departmentId");

  if (id) {
    const asset = await getAssetById(Number(id));
    return NextResponse.json(asset);
  } else if (departmentId) {
    const assets = await db.asset.findMany({
      where: { departmentId: Number(departmentId) },
      include: { department: true },
    });
    return NextResponse.json(assets);
  } else {
    const assets = await getAllAssets();
    return NextResponse.json(assets);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Received body:", body);
  try {
    const newAsset = await db.asset.create({
      data: {
        name: body.name,
        type: body.type,
        location: body.location,
        purchaseDate: new Date(body.purchaseDate),
        lastMaintenance: body.lastMaintenance
          ? new Date(body.lastMaintenance)
          : null,
        status: body.status,
        departmentId: body.departmentId,
        buyPrice: body.buyPrice,
        maintenancePrice: body.maintenancePrice,
        replacementPrice: body.replacementPrice,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
    console.log("Created asset:", newAsset);
    return NextResponse.json(newAsset);
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const data = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Asset ID is required" },
      { status: 400 }
    );
  }

  if (data.departmentId) {
    const department = await db.department.findUnique({
      where: { id: data.departmentId },
    });
    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 400 }
      );
    }
  }

  const updatedAsset = await updateAsset(Number(id), data);
  return NextResponse.json(updatedAsset);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Asset ID is required" },
      { status: 400 }
    );
  }

  const deletedAsset = await deleteAsset(Number(id));
  return NextResponse.json(deletedAsset);
}
