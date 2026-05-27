import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Add as Plus, Search, Visibility as Eye, QrCodeScanner as Scan, LocationOn as MapPin, Event as Calendar, CheckCircle, Schedule as Clock, ShowChart as Activity, ChevronLeft } from '@mui/icons-material';
import { toast } from 'sonner';

interface Inspection {
  id: string;
  taskCode: string;
  location: string;
  area: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  totalAssets: number;
  scannedAssets: number;
  createdDate: string;
  completedDate?: string;
  dueDate: string;
}

type ViewMode = 'list' | 'detail';

export default function Inspections() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subView, setSubView] = useState<'all' | 'my-inspections'>('all');

  const [inspections] = useState<Inspection[]>([
    {
      id: '1',
      taskCode: 'INS-2024-001',
      location: 'Office Floor 1',
      area: 'Area A1',
      assignedTo: 'John Doe',
      status: 'in-progress',
      totalAssets: 50,
      scannedAssets: 32,
      createdDate: '2024-12-28',
      dueDate: '2024-12-31'
    },
    {
      id: '2',
      taskCode: 'INS-2024-002',
      location: 'Warehouse B1',
      area: 'Storage Zone 1',
      assignedTo: 'Jane Smith',
      status: 'pending',
      totalAssets: 120,
      scannedAssets: 0,
      createdDate: '2024-12-29',
      dueDate: '2025-01-05'
    },
    {
      id: '3',
      taskCode: 'INS-2024-003',
      location: 'Office Floor 2',
      area: 'Area B2',
      assignedTo: 'Bob Wilson',
      status: 'completed',
      totalAssets: 35,
      scannedAssets: 35,
      createdDate: '2024-12-25',
      completedDate: '2024-12-27',
      dueDate: '2024-12-30'
    },
  ]);

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch = 
      inspection.taskCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    
    if (subView === 'my-inspections') {
      return matchesSearch && matchesStatus && inspection.assignedTo === 'John Doe';
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'approved':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'in-progress':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'pending':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleViewDetail = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedInspection(null);
  };

  if (viewMode === 'detail' && selectedInspection) {
    const progressPercentage = (selectedInspection.scannedAssets / selectedInspection.totalAssets) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <button
                onClick={handleBack}
                className="text-muted-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleBack}
                className="text-muted-foreground transition-colors"
              >
                Inspection Tasks
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{selectedInspection.taskCode}</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedInspection.taskCode}</h2>
            <p className="text-sm text-muted-foreground">Inspection Task Details</p>
          </div>
          <Badge className={getStatusColor(selectedInspection.status)}>
            {selectedInspection.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedInspection.location}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Area</Label>
                    <p className="font-medium">{selectedInspection.area}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Assigned To</Label>
                    <p className="font-medium">{selectedInspection.assignedTo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedInspection.dueDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Inspection Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {selectedInspection.scannedAssets} of {selectedInspection.totalAssets} assets scanned
                    </span>
                    <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedInspection.scannedAssets}</p>
                    <p className="text-xs text-muted-foreground mt-1">Scanned</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedInspection.totalAssets - selectedInspection.scannedAssets}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{selectedInspection.totalAssets}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scanned Assets */}
            <Card>
              <CardHeader>
                <CardTitle>Scanned Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[15px]">Asset ID</TableHead>
                        <TableHead className="text-[15px]">Name</TableHead>
                        <TableHead className="text-[15px]">Condition</TableHead>
                        <TableHead className="text-[15px]">Scanned At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-['Manrope']">LAP-001234</TableCell>
                        <TableCell>Dell Latitude 5520</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-700">Good</Badge>
                        </TableCell>
                        <TableCell>2024-12-29 14:30</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-['Manrope']">DES-001235</TableCell>
                        <TableCell>HP EliteDesk 800</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-700">Good</Badge>
                        </TableCell>
                        <TableCell>2024-12-29 14:35</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedInspection.status === 'in-progress' && (
                  <Button className="w-full text-[15px]">
                    <Scan className="w-4 h-4 mr-2" />
                    Continue Scanning
                  </Button>
                )}
                {selectedInspection.status === 'pending' && (
                  <Button className="w-full text-[15px]">
                    <Activity className="w-4 h-4 mr-2" />
                    Start Inspection
                  </Button>
                )}
                {selectedInspection.status === 'completed' && (
                  <Button className="w-full text-[15px]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Inspection
                  </Button>
                )}
                <Button variant="outline" className="w-full text-[15px]">
                  View Full Report
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedInspection.createdDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {selectedInspection.completedDate && (
                    <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedInspection.completedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={subView} onValueChange={(v) => setSubView(v as typeof subView)}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="my-inspections">My Inspections</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button className="text-[15px]" onClick={() => toast.info('Create inspection task')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Inspection Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search task code, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-[15px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 text-[15px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                <SelectItem value="pending" className="text-[15px]">Pending</SelectItem>
                <SelectItem value="in-progress" className="text-[15px]">In Progress</SelectItem>
                <SelectItem value="completed" className="text-[15px]">Completed</SelectItem>
                <SelectItem value="approved" className="text-[15px]">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[15px]">Task Code</TableHead>
                  <TableHead className="text-[15px]">Location / Area</TableHead>
                  <TableHead className="text-[15px]">Assigned To</TableHead>
                  <TableHead className="text-[15px]">Progress</TableHead>
                  <TableHead className="text-[15px]">Status</TableHead>
                  <TableHead className="text-[15px]">Due Date</TableHead>
                  <TableHead className="text-[15px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map((inspection) => {
                  const progress = (inspection.scannedAssets / inspection.totalAssets) * 100;
                  return (
                    <TableRow key={inspection.id} className="cursor-pointer/50">
                      <TableCell className="font-medium font-['Manrope']">{inspection.taskCode}</TableCell>
                      <TableCell>
                        <div className="text-[15px]">
                          <p className="font-medium">{inspection.location}</p>
                          <p className="text-muted-foreground text-xs">{inspection.area}</p>
                        </div>
                      </TableCell>
                      <TableCell>{inspection.assignedTo}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {inspection.scannedAssets}/{inspection.totalAssets}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(inspection.status)}>
                          {inspection.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(inspection.dueDate)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetail(inspection)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
