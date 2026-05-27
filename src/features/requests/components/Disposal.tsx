import React, { useState } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Add as Plus, Search, Visibility as Eye, Delete as Trash2, CheckCircle, Cancel as XCircle, Warning as AlertCircle, Description as FileText, Event as Calendar, ChevronLeft } from '@mui/icons-material';
import { toast } from 'sonner';

interface DisposalRecord {
  id: string;
  disposalCode: string;
  assetCount: number;
  method: 'sale' | 'donation' | 'destruction' | 'transfer' | 'scrap';
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'completed';
  linkedSurvey?: string;
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  completedDate?: string;
  notes?: string;
}

type ViewMode = 'list' | 'detail' | 'create';

export default function Disposal() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDisposal, setSelectedDisposal] = useState<DisposalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subView, setSubView] = useState<'all' | 'pending-approvals'>('all');

  const [disposals] = useState<DisposalRecord[]>([
    {
      id: '1',
      disposalCode: 'DSP-2024-001',
      assetCount: 8,
      method: 'destruction',
      status: 'pending-approval',
      linkedSurvey: 'SRV-2024-001',
      createdBy: 'John Doe',
      createdDate: '2024-12-28',
      notes: 'Obsolete laptops beyond repair'
    },
    {
      id: '2',
      disposalCode: 'DSP-2024-002',
      assetCount: 5,
      method: 'donation',
      status: 'approved',
      linkedSurvey: 'SRV-2024-002',
      createdBy: 'Jane Smith',
      createdDate: '2024-12-25',
      approvedBy: 'Manager',
      approvedDate: '2024-12-27',
      notes: 'Donation to local school'
    },
    {
      id: '3',
      disposalCode: 'DSP-2024-003',
      assetCount: 3,
      method: 'sale',
      status: 'completed',
      createdBy: 'Bob Wilson',
      createdDate: '2024-12-20',
      approvedBy: 'Admin',
      approvedDate: '2024-12-22',
      completedDate: '2024-12-26',
      notes: 'Sold to recycling company'
    },
  ]);

  const filteredDisposals = disposals.filter((disposal) => {
    const matchesSearch = disposal.disposalCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || disposal.status === statusFilter;
    
    if (subView === 'pending-approvals') {
      return matchesSearch && disposal.status === 'pending-approval';
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'approved':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'pending-approval':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'draft':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'sale':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'donation':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'destruction':
      case 'scrap':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'transfer':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleViewDetail = (disposal: DisposalRecord) => {
    setSelectedDisposal(disposal);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedDisposal(null);
  };

  if (viewMode === 'detail' && selectedDisposal) {
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
                Disposal Requests
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{selectedDisposal.disposalCode}</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedDisposal.disposalCode}</h2>
            <p className="text-sm text-muted-foreground">Disposal Request Details</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getMethodColor(selectedDisposal.method)}>
              {selectedDisposal.method.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(selectedDisposal.status)}>
              {selectedDisposal.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Disposal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Disposal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Disposal Method</Label>
                    <p className="font-medium">{selectedDisposal.method.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Asset Count</Label>
                    <p className="font-medium">{selectedDisposal.assetCount} items</p>
                  </div>
                  {selectedDisposal.linkedSurvey && (
                    <div>
                      <Label className="text-muted-foreground">Linked Survey</Label>
                      <p className="font-['Manrope'] text-sm">
                        <a href="#" className="text-blue-600">
                          {selectedDisposal.linkedSurvey}
                        </a>
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Created Date</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedDisposal.createdDate)}
                    </p>
                  </div>
                </div>
                {selectedDisposal.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-1">{selectedDisposal.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assets to Dispose */}
            <Card>
              <CardHeader>
                <CardTitle>Assets for Disposal</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These assets will be marked as DISPOSED and locked after completion.
                  </AlertDescription>
                </Alert>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-['Manrope']">LAP-001230</TableCell>
                        <TableCell>Dell Latitude 5410 (Old)</TableCell>
                        <TableCell>Laptop</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-500/10 text-red-700">Poor</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">Obsolete</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-['Manrope']">LAP-001231</TableCell>
                        <TableCell>HP ProBook 450 G5</TableCell>
                        <TableCell>Laptop</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-500/10 text-red-700">Damaged</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">Beyond repair</TableCell>
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
                {selectedDisposal.status === 'pending-approval' && (
                  <>
                    <Button className="w-full" onClick={() => {
                      toast.success('Disposal approved');
                      handleBack();
                    }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Disposal
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => {
                      toast.error('Disposal rejected');
                      handleBack();
                    }}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Disposal
                    </Button>
                  </>
                )}
                {selectedDisposal.status === 'approved' && !selectedDisposal.completedDate && (
                  <Button className="w-full" onClick={() => {
                    toast.success('Disposal marked as completed. Assets are now DISPOSED.');
                    handleBack();
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Download Certificate
                </Button>
              </CardContent>
            </Card>

            {/* Approval Chain */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {(selectedDisposal.approvedDate || selectedDisposal.completedDate) && (
                        <div className="w-0.5 h-12 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedDisposal.createdDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">by {selectedDisposal.createdBy}</p>
                    </div>
                  </div>
                  
                  {selectedDisposal.approvedDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        {selectedDisposal.completedDate && <div className="w-0.5 h-12 bg-gray-200"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">Approved</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedDisposal.approvedDate).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">by {selectedDisposal.approvedBy}</p>
                      </div>
                    </div>
                  )}

                  {selectedDisposal.completedDate && (
                    <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedDisposal.completedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-5 h-5" />
                  Important
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Multi-level approval required. Assets will be permanently locked after disposal completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
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
              Disposal Requests
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Create Request</span>
          </div>
          <h2 className="text-2xl font-bold">Create Disposal Request</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Disposal Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disposal method" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="destruction">Destruction</SelectItem>
                    <SelectItem value="scrap">Scrap</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Link to Survey (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approved survey" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="srv-001">SRV-2024-001</SelectItem>
                    <SelectItem value="srv-002">SRV-2024-002</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes / Reason</Label>
                <Textarea placeholder="Enter disposal reason and details..." rows={3} />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Assets must be approved for disposal before this request can be submitted.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleBack}>Cancel</Button>
                <Button onClick={() => {
                  toast.success('Disposal request created');
                  handleBack();
                }}>Create Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      

      <div className="flex items-center justify-between">
        <Button onClick={() => setViewMode('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Disposal Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search disposal code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disposal Code</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Linked Survey</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisposals.map((disposal) => (
                  <TableRow key={disposal.id} className="cursor-pointer/50">
                    <TableCell className="font-medium font-['Manrope']">{disposal.disposalCode}</TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(disposal.method)}>
                        {disposal.method}
                      </Badge>
                    </TableCell>
                    <TableCell>{disposal.assetCount}</TableCell>
                    <TableCell>
                      {disposal.linkedSurvey ? (
                        <span className="font-['Manrope'] text-sm">{disposal.linkedSurvey}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(disposal.status)}>
                        {disposal.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(disposal.createdDate)}</TableCell>
                    <TableCell>{disposal.createdBy}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetail(disposal)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDisposals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No disposal requests found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
