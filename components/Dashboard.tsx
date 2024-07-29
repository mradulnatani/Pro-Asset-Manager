import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardTypes } from "@/types/dashboard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { SidebarDashboard } from "./Sidebar";
import MaintenanceAnalyzer from "./MaintenanceAnalyzer";
import ResourceAnalyzer from "./ResourceAnalyzer";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardTypes>({
    totalAssets: 0,
    assetValue: 0,
    assetCondition: 0,
    assetUtilization: 0,
  });
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          dashboardData: dashboardData,
          departmentData,
          assetValueData,
          assetConditionData,
          assetUtilizationData,
          maintenanceCostData
        }),
      });
      if (!response.ok) throw new Error("Failed to get response");
      const result = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.message }]);
    } catch (error) {
      console.error("Error in chat:", error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process your request." }]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

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

  const departmentData = [
    { name: 'Indore Municipal Corporation', value: 35 },
    { name: 'Development Authority', value: 25 },
    { name: 'Public Health Engineering', value: 15 },
    { name: 'Urban Transport', value: 10 },
    { name: 'Smart City Development', value: 15 },
  ];

  const assetValueData = [
    { year: 2019, value: 15000000000 }, // 1500 crore INR
    { year: 2020, value: 17000000000 }, // 1700 crore INR
    { year: 2021, value: 19000000000 }, // 1900 crore INR
    { year: 2022, value: 21000000000 }, // 2100 crore INR
    { year: 2023, value: 23000000000 }, // 2300 crore INR
  ];

  const assetConditionData = [
    { condition: 'Excellent', count: 40 },
    { condition: 'Good', count: 35 },
    { condition: 'Fair', count: 15 },
    { condition: 'Poor', count: 10 },
  ];

  const assetUtilizationData = [
    { department: 'Indore Municipal Corporation', utilized: 85, underutilized: 15 },
    { department: 'Indore Development Authority', utilized: 80, underutilized: 20 },
    { department: 'Public Health Engineering', utilized: 90, underutilized: 10 },
    { department: 'Urban Transport', utilized: 75, underutilized: 25 },
    { department: 'Smart City Development', utilized: 95, underutilized: 5 },
  ];

  const maintenanceCostData = [
    { year: 2019, cost: 500000000 }, // 50 crore INR
    { year: 2020, cost: 550000000 }, // 55 crore INR
    { year: 2021, cost: 600000000 }, // 60 crore INR
    { year: 2022, cost: 650000000 }, // 65 crore INR
    { year: 2023, cost: 700000000 }, // 70 crore INR
  ];

  const determineChartType = (data: any[]): string => {
    if (!data || data.length === 0) return 'none';

    const keys = Object.keys(data[0]);
    const numericKeys = keys.filter(key => typeof data[0][key] === 'number');
    const dateKeys = keys.filter(key => data[0][key] instanceof Date);

    if (numericKeys.length === 1 && dateKeys.length === 1) {
      return 'line';
    } else if (numericKeys.length === 1 && keys.length === 2) {
      return 'pie';
    } else if (numericKeys.length > 1) {
      return 'bar';
    } else {
      return 'table';
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen w-full bg-inherit">
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalAssets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Asset Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dashboardData.assetValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Asset Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.assetCondition}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Asset Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.assetUtilization}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] overflow-y-auto mb-4 p-2 border rounded">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask about the dashboard data..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                />
                <Button onClick={handleChatSubmit} disabled={isLoading}>
                  {isLoading ? 'Thinking...' : 'Ask'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Value Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={assetValueData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Condition Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetConditionData}>
                  <XAxis dataKey="condition" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d">
                    {assetConditionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Utilization by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetUtilizationData}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilized" stackId="a" fill="#82ca9d" name="Utilized" />
                  <Bar dataKey="underutilized" stackId="a" fill="#ffc658" name="Underutilized" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Cost Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={maintenanceCostData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="cost" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="my-8 border-gray-200" />
        <h2 className="text-2xl font-bold mb-4">Resource Analysis</h2>
        <div className="mt-8" id="resource">
          <ResourceAnalyzer />
        </div>
        <div className="my-8 border-gray-200" />
        <h2 className="text-2xl font-bold mb-4">Maintenance Analysis</h2>
        <div className="pt-5" id="maintenance">
          <MaintenanceAnalyzer />
        </div>
      </main>
    </div>
  );
}