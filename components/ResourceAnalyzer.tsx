import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

interface Asset {
  id: number;
  name: string;
  buyPrice: number;
  currentValue: number;
}
interface AssetProgress {
  name: string;
  percentComplete: number;
  startDate: Date;
  expectedCompletion: Date;
}

const PASTEL_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ResourceAnalyzer() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [appreciatingAssets, setAppreciatingAssets] = useState<number>(0);
  const [depreciatingAssets, setDepreciatingAssets] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [assetProgress, setAssetProgress] = useState<AssetProgress[]>([]);

  useEffect(() => {

    const fakeAssets: Asset[] = [
      { id: 1, name: 'Municipal Buildings', buyPrice: 500000000, currentValue: 750000000 },
      { id: 2, name: 'Water Treatment Plant', buyPrice: 300000000, currentValue: 350000000 },
      { id: 3, name: 'Public Parks', buyPrice: 100000000, currentValue: 120000000 },
      { id: 4, name: 'Waste Management Facility', buyPrice: 200000000, currentValue: 180000000 },
      { id: 5, name: 'Municipal Vehicles', buyPrice: 50000000, currentValue: 40000000 },
    ];

    setAssets(fakeAssets);

    const appreciating = fakeAssets.filter(asset => asset.currentValue > asset.buyPrice).length;
    const depreciating = fakeAssets.length - appreciating;
    setAppreciatingAssets(appreciating);
    setDepreciatingAssets(depreciating);

    const total = fakeAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    setTotalValue(total);
    const fakeAssetProgress: AssetProgress[] = [
      {
        name: 'Indore Metro Rail Project',
        percentComplete: 60,
        startDate: new Date(2019, 5, 1), // June 1, 2019
        expectedCompletion: new Date(2025, 11, 31), // December 31, 2025
      },
      {
        name: 'Smart City Initiative - IoT Implementation',
        percentComplete: 75,
        startDate: new Date(2022, 0, 1), // January 1, 2022
        expectedCompletion: new Date(2024, 11, 31), // December 31, 2024
      },
      {
        name: 'Kahn River Front Development',
        percentComplete: 40,
        startDate: new Date(2021, 3, 1), // April 1, 2021
        expectedCompletion: new Date(2025, 2, 31), // March 31, 2025
      },
      {
        name: 'Super Corridor Expansion',
        percentComplete: 80,
        startDate: new Date(2020, 8, 1), // September 1, 2020
        expectedCompletion: new Date(2023, 11, 31), // December 31, 2023
      },
    ];

    setAssetProgress(fakeAssetProgress);
  }, []);

  const assetValueChange = assets.map(asset => ({
    name: asset.name,
    valueChange: ((asset.currentValue - asset.buyPrice) / asset.buyPrice) * 100,
    currentValue: asset.currentValue,
  }));

  const assetValueDistribution = assets.map(asset => ({
    name: asset.name,
    value: asset.currentValue,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Asset Value Change</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetValueChange}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valueChange" fill="#BAE1FF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetValueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} ${((value / totalValue) * 100).toFixed(1)}%`}
              >
                {assetValueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appreciating vs Depreciating Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Appreciating Assets</span>
              <span>{appreciatingAssets}</span>
            </div>
            <Progress value={(appreciatingAssets / assets.length) * 100} className="h-2" />
            <div className="flex justify-between">
              <span>Depreciating Assets</span>
              <span>{depreciatingAssets}</span>
            </div>
            <Progress value={(depreciatingAssets / assets.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Portfolio Value</span>
              <span>${totalValue.toLocaleString()}</span>
            </div>
            {assetValueChange.length > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Best Performing Asset</span>
                  <span>{assetValueChange.reduce((a, b) => a.valueChange > b.valueChange ? a : b).name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worst Performing Asset</span>
                  <span>{assetValueChange.reduce((a, b) => a.valueChange < b.valueChange ? a : b).name}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Progress of Asset Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assetProgress.map((asset, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{asset.name}</span>
                  <span>{asset.percentComplete}% complete</span>
                </div>
                <Progress value={asset.percentComplete} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Started: {format(asset.startDate, 'MMMM d, yyyy')}</span>
                  <span>Expected Completion: {format(asset.expectedCompletion, 'MMMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}