"use client";

import { Label } from "@/components/ui/label";
import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asset, Department } from "@prisma/client";
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const AssetMap = dynamic(() => import('./AssetMap'), { ssr: false });

export default function AssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [newAsset, setNewAsset] = useState<Omit<Asset, "id">>({
    name: "",
    type: "",
    location: "",
    purchaseDate: new Date(),
    lastMaintenance: null,
    status: "",
    departmentId: 0,
    buyPrice: 0,
    maintenancePrice: 0,
    replacementPrice: 0,
    latitude: null,
    longitude: null,
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingAsset) return;
    const { name, value } = e.target;
    if (name === 'buyPrice' || name === 'maintenancePrice' || name === 'replacementPrice') {
      setEditingAsset({ ...editingAsset, [name]: parseFloat(value) || 0 });
    } else if (name === 'purchaseDate') {
      setEditingAsset({ ...editingAsset, [name]: new Date(value) });
    } else {
      setEditingAsset({ ...editingAsset, [name]: value });
    }
  };

  const handleEditSelectChange = (value: string) => {
    if (!editingAsset) return;
    setEditingAsset({ ...editingAsset, departmentId: parseInt(value) });
  };

  const handleUpdateAsset = async () => {
    if (!editingAsset) return;
    const loadingToast = toast.loading('Updating asset...');
    try {
      const response = await fetch(`/api/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAsset),
      });
      if (!response.ok) throw new Error('Failed to update asset');
      await fetchAssets();
      setEditingAsset(null);
      toast.success('Asset updated successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset', { id: loadingToast });
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAssets();
  }, [selectedDepartment]);

  const fetchAssets = async () => {
    const loadingToast = toast.loading('Fetching assets...');
    try {
      const response = await fetch(
        `/api/assets${selectedDepartment !== "all"
          ? `?departmentId=${selectedDepartment}`
          : ""
        }`
      );
      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      setAssets(data);
      toast.success('Assets fetched successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to fetch assets', { id: loadingToast });
    }
  };

  const fetchDepartments = async () => {
    const loadingToast = toast.loading('Fetching departments...');
    try {
      const response = await fetch("/api/departments");
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
      toast.success('Departments fetched successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments', { id: loadingToast });
    }
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'buyPrice' || name === 'maintenancePrice' || name === 'replacementPrice') {
      setNewAsset({ ...newAsset, [name]: parseFloat(value) || 0 });
    } else if (name === 'purchaseDate') {
      setNewAsset({ ...newAsset, [name]: new Date(value) });
    } else if (name === 'latitude' || name === 'longitude') {
      setNewAsset({ ...newAsset, [name]: parseFloat(value) || null });
    } else {
      setNewAsset({ ...newAsset, [name]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    setNewAsset({ ...newAsset, departmentId: parseInt(value) });
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Adding new asset...');
    try {
      console.log("Submitting new asset:", newAsset);
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to add new asset');
      }
      const data = await response.json();
      console.log("Response data:", data);
      await fetchAssets();
      setNewAsset({
        name: "",
        type: "",
        location: "",
        purchaseDate: new Date(),
        lastMaintenance: null,
        status: "",
        departmentId: 0,
        buyPrice: 0,
        maintenancePrice: 0,
        replacementPrice: 0,
        latitude: null,
        longitude: null,
      });
      toast.success('New asset added successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error adding new asset:', error);
      toast.error(`Failed to add new asset`, { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    const loadingToast = toast.loading('Deleting asset...');
    try {
      const response = await fetch(`/api/assets?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error('Failed to delete asset');
      await fetchAssets();
      toast.success('Asset deleted successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset', { id: loadingToast });
    }
  };

  const combinedAssets = assets.map((asset) => ({
    ...asset,
    departmentName:
      departments.find((d) => d.id === asset.departmentId)?.name || "",
  }));

  const options = {
    keys: ["name", "type", "location", "status", "departmentName"],
    threshold: 0.4, // Adjust the threshold to control fuzziness (0 = exact match, 1 = match anything)
  };

  const fuse = new Fuse(combinedAssets, options);
  let filteredAssets = assets;
  if (search !== "") {
    filteredAssets = fuse.search(search).map((result: { item: any; }) => result.item);
  }

  const handleExcelUpload = () => {
    document.getElementById('excelUpload')?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const loadingToast = toast.loading('Uploading Excel file...');
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload Excel file');
        }


        toast.success('Excel file uploaded successfully', { id: loadingToast });
        fetchAssets();
      } catch (error) {
        console.error('Error uploading Excel file:', error);
        toast.error('Failed to upload Excel file', { id: loadingToast });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="bottom-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Asset Management</h1>

      <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
        <SelectTrigger className="w-[200px] mb-4">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id.toString()}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog>
        <div className="flex justify-between items-center mb-4">
          <div>
            <DialogTrigger asChild>
              <Button className="mr-2">Add New Asset</Button>
            </DialogTrigger>
            <Button onClick={handleExcelUpload} className="mr-2">Upload File</Button>
            <input
              type="file"
              id="excelUpload"
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <input
            className="rounded-full p-1"
            type="text"
            placeholder="search here"
            onChange={handleSearchChange}
          />
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Asset Name"
              value={newAsset.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="type"
              placeholder="Asset Type"
              value={newAsset.type}
              onChange={handleInputChange}
              required
            />
            <Input
              name="location"
              placeholder="Location"
              value={newAsset.location}
              onChange={handleInputChange}
              required
            />
            <Input
              name="purchaseDate"
              type="date"
              value={newAsset.purchaseDate.toISOString().split("T")[0]}
              onChange={handleInputChange}
              required
            />
            <Input
              name="status"
              placeholder="Status"
              value={newAsset.status}
              onChange={handleInputChange}
              required
            />
            <Input
              name="latitude"
              type="number"
              step="any"
              placeholder="Latitude"
              value={newAsset.latitude || ''}
              onChange={handleInputChange}
            />
            <Input
              name="longitude"
              type="number"
              step="any"
              placeholder="Longitude"
              value={newAsset.longitude || ''}
              onChange={handleInputChange}
            />
            <Input
              name="buyPrice"
              type="number"
              step="0.01"
              placeholder="Buy Price"
              value={newAsset.buyPrice}
              onChange={handleInputChange}
              required
            />
            <Input
              name="maintenancePrice"
              type="number"
              step="0.01"
              placeholder="Maintenance Price"
              value={newAsset.maintenancePrice}
              onChange={handleInputChange}
              required
            />
            <Input
              name="replacementPrice"
              type="number"
              step="0.01"
              placeholder="Replacement Price"
              value={newAsset.replacementPrice}
              onChange={handleInputChange}
              required
            />
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem
                    key={department.id}
                    value={department.id.toString()}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Add Asset</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Last Maintenance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets.map((asset, index) => (
            <TableRow key={asset.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>
                {new Date(asset.purchaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {asset.lastMaintenance
                  ? new Date(asset.lastMaintenance).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>
                {departments.find((d) => d.id === asset.departmentId)?.name ||
                  "N/A"}
              </TableCell>
              <TableCell className="flex justify-end flex-col">
                <Button
                  variant="link"
                  onClick={() => handleViewAsset(asset)}
                  className="text-black"
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(asset)}
                >
                  Edit
                </Button>
              </TableCell>
              <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Asset</DialogTitle>
                  </DialogHeader>
                  {editingAsset && (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateAsset(); }} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editingAsset.name}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentId">Department</Label>
                        <Select onValueChange={handleEditSelectChange} value={editingAsset.departmentId.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.id.toString()}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between">
                        <Button type="submit">Update Asset</Button>
                        <Button variant="destructive" onClick={() => handleDelete(editingAsset.id)}>Delete Asset</Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="min-w-[700px]">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row">
            {selectedAsset && (
              <div className="flex flex-col space-y-2 w-1/2">
                <p><strong>Name:</strong> {selectedAsset.name}</p>
                <p><strong>Type:</strong> {selectedAsset.type}</p>
                <p><strong>Location:</strong> {selectedAsset.location}</p>
                <p><strong>Purchase Date:</strong> {new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                <p><strong>Last Maintenance:</strong> {selectedAsset.lastMaintenance ? new Date(selectedAsset.lastMaintenance).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Status:</strong> {selectedAsset.status}</p>
                <p><strong>Department:</strong> {departments.find(d => d.id === selectedAsset.departmentId)?.name || 'N/A'}</p>
                <p><strong>Buy Price:</strong> ₹{selectedAsset.buyPrice.toFixed(2)}</p>
                <p><strong>Maintenance Price:</strong> ₹{selectedAsset.maintenancePrice.toFixed(2)}</p>
                <p><strong>Replacement Price:</strong> ₹{selectedAsset.replacementPrice.toFixed(2)}</p>
              </div>
            )}
            {selectedAsset && selectedAsset.latitude && selectedAsset.longitude && (
              <div className="w-1/2">
                <AssetMap
                  latitude={selectedAsset.latitude}
                  longitude={selectedAsset.longitude}
                  name={selectedAsset.name}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}