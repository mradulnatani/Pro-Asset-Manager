"use client"
import { useState, useEffect } from 'react';
import { Asset } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast';

interface MaintenanceSchedule {
  assetId: number;
  assetName: string;
  nextMaintenance: Date;
  priority: 'Low' | 'Medium' | 'High';
  daysSinceLastMaintenance: number;
}

export default function MaintenanceAnalyzer() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [visibleItems, setVisibleItems] = useState<number>(5);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const loadingToast = toast.loading('Fetching assets...');
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      setAssets(data);
      analyzeMaintenanceNeeds(data);
      toast.success('Assets fetched successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to fetch assets', { id: loadingToast });
    }
  };

  const analyzeMaintenanceNeeds = (assets: Asset[]) => {
    const schedule: MaintenanceSchedule[] = assets.map(asset => {
      const daysSinceLastMaintenance = asset.lastMaintenance
        ? Math.floor((new Date().getTime() - new Date(asset.lastMaintenance).getTime()) / (1000 * 3600 * 24))
        : Infinity;

      const nextMaintenance = new Date(asset.lastMaintenance || asset.purchaseDate);
      nextMaintenance.setDate(nextMaintenance.getDate() + calculateMaintenanceInterval(asset));

      let priority: 'Low' | 'Medium' | 'High' = 'Low';
      if (daysSinceLastMaintenance > 365) {
        priority = 'High';
      } else if (daysSinceLastMaintenance > 180) {
        priority = 'Medium';
      }

      return {
        assetId: asset.id,
        assetName: asset.name,
        nextMaintenance,
        priority,
        daysSinceLastMaintenance,
      };
    });

    setMaintenanceSchedule(schedule.sort((a, b) => a.nextMaintenance.getTime() - b.nextMaintenance.getTime()));
  };

  const calculateMaintenanceInterval = (asset: Asset) => {
    const baseInterval = 180; // 6 months
    const priceRatio = asset.maintenancePrice / asset.buyPrice;
    return Math.round(baseInterval * (1 - priceRatio));
  };

  const scheduleMaintenance = async (assetId: number) => {
    const loadingToast = toast.loading('Scheduling maintenance...');
    setTimeout(() => {
      toast.success('Maintenance scheduled successfully', { id: loadingToast });
    }, 2000);
  };

  const filteredSchedule = filterPriority === 'all'
    ? maintenanceSchedule
    : maintenanceSchedule.filter(item => item.priority.toLowerCase() === filterPriority);

  const visibleSchedule = filteredSchedule.slice(0, visibleItems);

  const handleShowMore = () => {
    setVisibleItems(prevVisible => prevVisible + 5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setFilterPriority} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Days Since Last Maintenance</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleSchedule.map((item) => (
              <TableRow key={item.assetId}>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>{item.nextMaintenance.toLocaleDateString()}</TableCell>
                <TableCell>{item.daysSinceLastMaintenance}</TableCell>
                <TableCell>
                  <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'outline' : 'secondary'}>
                    {item.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => scheduleMaintenance(item.assetId)}>
                    Schedule Maintenance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visibleItems < filteredSchedule.length && (
          <div className="mt-4 text-center">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}