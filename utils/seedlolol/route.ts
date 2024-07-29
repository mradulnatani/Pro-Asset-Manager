import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { departments, assets } from './data';

export async function GET() {
  try {
    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete data from tables with foreign keys to Asset
      await tx.maintenanceLog.deleteMany();
      await tx.communityReport.deleteMany();
      
      // Delete data from tables with foreign keys to Department (if any)
      // e.g., await tx.employee.deleteMany();
      
      // Then delete assets
      await tx.asset.deleteMany();
      

      // Seed assets
      await tx.asset.createMany({
        data: assets,
      });

      // If you have data to seed for other tables, add it here
      // e.g., await tx.maintenanceLog.createMany({ data: maintenanceLogs });
      // e.g., await tx.communityReport.createMany({ data: communityReports });
    });
    
    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Error seeding database' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}