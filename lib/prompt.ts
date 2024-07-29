export const helper = `model Department {
  id     Int     @id @default(autoincrement())
  name   String  @unique
  assets Asset[]
  users  User[]
}

model Asset {
  id              Int      @id @default(autoincrement())
  name            String
  type            String
  location        String
  purchaseDate    DateTime
  lastMaintenance DateTime?
  status          String
  departmentId    Int
  buyPrice        Float
  maintenancePrice   Float
  replacementPrice    Float
  department      Department @relation(fields: [departmentId], references: [id])
  maintenanceLogs MaintenanceLog[]
  communityReports CommunityReport[]
}

model MaintenanceLog {
  id        Int      @id @default(autoincrement())
  assetId   Int
  asset     Asset    @relation(fields: [assetId], references: [id])
  date      DateTime
  type      String
  cost      Float
  notes     String?
  performedBy String
  user      User     @relation(fields: [performedBy], references: [id])
}

model CommunityReport {
  id           Int      @id @default(autoincrement())
  assetId      Int?
  asset        Asset?   @relation(fields: [assetId], references: [id])
  reporterName String
  image        String?
  issue        String
  status       String
  createdAt    DateTime @default(now())
  department   String
  resolution     String?
}`;