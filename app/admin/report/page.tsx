"use client"
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast, { Toaster } from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '@/components/Navbar';

interface Report {
  id: number;
  reporterName: string;
  issue: string;
  status: string;
  createdAt: string;
  department: string;
  subDepartment: string | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, statusFilter]);

  const fetchReports = async () => {
    const loadingToast = toast.loading('Fetching reports...');
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
      toast.success('Reports fetched successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports', { id: loadingToast });
    }
  };

  const filterReports = () => {
    if (statusFilter === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === statusFilter));
    }
  };

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updatedReport = await response.json();
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
      toast.success('Status updated successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const handleResolveReport = async (reportId: number, resolution: string) => {
    const loadingToast = toast.loading('Resolving report...');
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', resolution }),
      });
      if (!response.ok) throw new Error('Failed to resolve report');
      const updatedReport = await response.json();
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: 'Resolved', resolution } : report
        )
      );
      setSelectedReport(null);
      toast.success('Report resolved successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report', { id: loadingToast });
    }
  };

  return (
    <div className="container mx-auto p-10 min-h-screen">
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <h1 className="text-2xl font-bold mb-4 mt-20">Community Reports</h1>

      <Select onValueChange={setStatusFilter} defaultValue="all">
        <SelectTrigger className="w-[200px] mb-4">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reports</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reporter</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.reporterName}</TableCell>
              <TableCell>{report.issue}</TableCell>
              <TableCell>{report.department}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className='flex flex-col items-center justify-center'>
                <Select
                  onValueChange={(value) => handleStatusChange(report.id, value)}
                  defaultValue={report.status}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild className='mt-1'>
                    <Button className="w-[150px]" onClick={() => setSelectedReport(report)}>Resolve</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resolve Report</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const resolution = (e.target as any).resolution.value;
                      if (selectedReport) {
                        handleResolveReport(selectedReport.id, resolution);
                      }
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="resolution" className="text-right">
                            Resolution
                          </Label>
                          <Textarea
                            id="resolution"
                            className="col-span-3"
                            placeholder="Enter resolution details..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Submit Resolution</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}