"use client";
import Dashboard from "@/components/Dashboard";
import MaintenanceAnalyzer from "@/components/MaintenanceAnalyzer";
import Navbar from "@/components/Navbar";
import { SidebarDashboard } from "@/components/Sidebar";
import { DashboardTypes } from "@/types/dashboard";
import { useEffect, useState } from "react";

export default function Page() {
  const [DashboardData, setDashboardData] = useState<DashboardTypes>({
    totalAssets: 0,
    assetValue: 0,
    assetCondition: 0,
    assetUtilization: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Dashboard data fetch failed");
      }
      const result = await response.json();
      setDashboardData(result as DashboardTypes);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="">
      <SidebarDashboard />
      </div>

    </div>
  );
}
