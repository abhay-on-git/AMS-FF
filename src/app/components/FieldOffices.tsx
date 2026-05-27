import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Add as Plus, Search, Business as Building2, People as Users, Inventory2 as Package, SwapHoriz as ArrowRightLeft, TrendingUp, ChevronLeft, Edit, PersonAdd, Delete as Trash2 } from '@mui/icons-material';
import { toast } from 'sonner';

interface FieldOffice {
  id: string;
  code: string;
  name: string;
  location: string;
  totalUsers: number;
  totalAssets: number;
  activeTransfers: number;
  activeInspections: number;
  status: 'active' | 'inactive';
}

interface OfficeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

type ViewMode = 'list' | 'detail';

interface FieldOfficesProps {
  hideListHeader?: boolean;
  createTrigger?: number;
  onDetailViewChange?: (isDetail: boolean, detailName?: string) => void;
}

export default function FieldOffices({ hideListHeader, createTrigger, onDetailViewChange }: FieldOfficesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOffice, setSelectedOffice] = useState<FieldOffice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editOfficeOpen, setEditOfficeOpen] = useState(false);
  const [assignUserOpen, setAssignUserOpen] = useState(false);
  const [addOfficeOpen, setAddOfficeOpen] = useState(false);

  // Form state for Add Field Office
  const [newOfficeCode, setNewOfficeCode] = useState('');
  const [newOfficeName, setNewOfficeName] = useState('');
  const [newOfficeCity, setNewOfficeCity] = useState('');
  const [newOfficeCountry, setNewOfficeCountry] = useState('');
  const [newOfficeManager, setNewOfficeManager] = useState('');
  const [newOfficeEmail, setNewOfficeEmail] = useState('');
  const [newOfficePhone, setNewOfficePhone] = useState('');
  const [newOfficeAddress, setNewOfficeAddress] = useState('');
  const [newOfficeStatus, setNewOfficeStatus] = useState('active');

  const resetAddForm = () => {
    setNewOfficeCode('');
    setNewOfficeName('');
    setNewOfficeCity('');
    setNewOfficeCountry('');
    setNewOfficeManager('');
    setNewOfficeEmail('');
    setNewOfficePhone('');
    setNewOfficeAddress('');
    setNewOfficeStatus('active');
  };

  const handleAddOfficeClose = () => {
    setAddOfficeOpen(false);
    resetAddForm();
  };

  const handleAddOfficeSave = () => {
    if (!newOfficeCode.trim() || !newOfficeName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Field office"${newOfficeName}" created successfully`);
    handleAddOfficeClose();
  };

  // React to parent create trigger
  useEffect(() => {
    if (createTrigger && createTrigger > 0) {
      setAddOfficeOpen(true);
    }
  }, [createTrigger]);

  const [fieldOffices] = useState<FieldOffice[]>([
    {
      id: '1',
      code: 'FO-AMM',
      name: 'Amman Office',
      location: 'Amman, Jordan',
      totalUsers: 8,
      totalAssets: 245,
      activeTransfers: 12,
      activeInspections: 3,
      status: 'active',
    },
    {
      id: '2',
      code: 'FO-AFA',
      name: 'Afghanistan Office',
      location: 'Kabul, Afghanistan',
      totalUsers: 5,
      totalAssets: 189,
      activeTransfers: 7,
      activeInspections: 2,
      status: 'active',
    },
    {
      id: '3',
      code: 'FO-BKK',
      name: 'Bangkok Office',
      location: 'Bangkok, Thailand',
      totalUsers: 12,
      totalAssets: 412,
      activeTransfers: 18,
      activeInspections: 5,
      status: 'active',
    },
    {
      id: '4',
      code: 'FO-MEL',
      name: 'Melbourne Office',
      location: 'Melbourne, Australia',
      totalUsers: 6,
      totalAssets: 198,
      activeTransfers: 4,
      activeInspections: 1,
      status: 'active',
    },
    {
      id: '5',
      code: 'FO-PNH',
      name: 'Phnom Penh Office',
      location: 'Phnom Penh, Cambodia',
      totalUsers: 9,
      totalAssets: 287,
      activeTransfers: 15,
      activeInspections: 4,
      status: 'active',
    },
  ]);

  const [officeUsers] = useState<OfficeUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Manager',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Inventory Staff',
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Inventory Staff',
      status: 'active',
    },
  ]);

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'Inventory Staff':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleViewOffice = (office: FieldOffice) => {
    setSelectedOffice(office);
    setViewMode('detail');
    if (onDetailViewChange) {
      onDetailViewChange(true, office.name);
    }
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedOffice(null);
    if (onDetailViewChange) {
      onDetailViewChange(false, undefined);
    }
  };

  // Field Office Detail View
  if (viewMode === 'detail' && selectedOffice) {
    const tabClass ="px-4 py-2 rounded-[4px] text-[15px] transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20";

    return (
      <div className="space-y-6">
        {/* ── Edit Office Side Drawer ── */}
        <Sheet open={editOfficeOpen} onOpenChange={(open) => { if (!open) setEditOfficeOpen(false); }}>
          <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
            <SheetHeader className="pr-8">
              <SheetTitle className="text-[15px]">Edit Field Office</SheetTitle>
              <SheetDescription className="text-[14px]">
                Update details for {selectedOffice.name} ({selectedOffice.code})
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-code" className="text-[15px] font-medium">Office Code <span className="text-red-500">*</span></Label>
                  <Input id="edit-office-code" defaultValue={selectedOffice.code} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-name" className="text-[15px] font-medium">Office Name <span className="text-red-500">*</span></Label>
                  <Input id="edit-office-name" defaultValue={selectedOffice.name} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-location" className="text-[15px] font-medium">Location <span className="text-red-500">*</span></Label>
                  <Input id="edit-office-location" defaultValue={selectedOffice.location} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Contact Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-manager" className="text-[15px] font-medium">Office Manager</Label>
                  <Input id="edit-office-manager" placeholder="Select office manager" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-email" className="text-[15px] font-medium">Contact Email</Label>
                  <Input id="edit-office-email" type="email" placeholder="office@company.com" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-phone" className="text-[15px] font-medium">Phone Number</Label>
                  <Input id="edit-office-phone" placeholder="+1 234 567 890" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-address" className="text-[15px] font-medium">Street Address</Label>
                  <Textarea id="edit-office-address" placeholder="Enter full address" rows={3} className="text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-office-city" className="text-[15px] font-medium">City</Label>
                    <Input id="edit-office-city" defaultValue={selectedOffice.location.split(',')[0]?.trim()} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-office-country" className="text-[15px] font-medium">Country</Label>
                    <Input id="edit-office-country" defaultValue={selectedOffice.location.split(',')[1]?.trim()} className="h-[52px] text-[15px] placeholder:text-[14px]" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Status</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-office-status" className="text-[15px] font-medium">Office Status</Label>
                  <Select defaultValue={selectedOffice.status}>
                    <SelectTrigger id="edit-office-status" className="h-[52px] text-[15px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-muted/50 rounded-[4px] border p-4 mb-20">
                <p className="text-[14px] text-muted-foreground mb-2 font-medium">Field Office Tips</p>
                <div className="space-y-1 text-[14px] text-muted-foreground">
                  <p>- Office code is used as a prefix for assets and transfers</p>
                  <p>- Deactivating an office will restrict data access for assigned users</p>
                  <p>- Users must be reassigned before deactivation</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditOfficeOpen(false)} className="text-[15px]">
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success(`Field office"${selectedOffice.name}" updated successfully`);
                  setEditOfficeOpen(false);
                }} className="text-[15px]">
                  Save Changes
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* ── Assign User Side Drawer ── */}
        <Sheet open={assignUserOpen} onOpenChange={(open) => { if (!open) setAssignUserOpen(false); }}>
          <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
            <SheetHeader className="pr-8">
              <SheetTitle className="text-[15px]">Assign User</SheetTitle>
              <SheetDescription className="text-[14px]">
                Assign a user to {selectedOffice.name} ({selectedOffice.code})
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
              {/* Office Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-[4px] border">
                <div className="w-10 h-10 bg-blue-100 dark:bg-[#F7F7F8]/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{selectedOffice.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOffice.code} &middot; {selectedOffice.location}</p>
                </div>
              </div>

              {/* User Selection */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Select User</h3>
                <div className="space-y-2">
                  <Label htmlFor="assign-user" className="text-[15px] font-medium">User <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger id="assign-user" className="h-[52px] text-[15px]">
                      <SelectValue placeholder="Select a user to assign" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="sarah.chen">Sarah Chen (sarah.chen@company.com)</SelectItem>
                      <SelectItem value="alex.kumar">Alex Kumar (alex.kumar@company.com)</SelectItem>
                      <SelectItem value="lisa.wong">Lisa Wong (lisa.wong@company.com)</SelectItem>
                      <SelectItem value="omar.hassan">Omar Hassan (omar.hassan@company.com)</SelectItem>
                      <SelectItem value="maria.garcia">Maria Garcia (maria.garcia@company.com)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Role Assignment */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Role & Access</h3>
                <div className="space-y-2">
                  <Label htmlFor="assign-role" className="text-[15px] font-medium">Role at this Office <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger id="assign-role" className="h-[52px] text-[15px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="inventory-staff">Inventory Staff</SelectItem>
                      <SelectItem value="auditor">Auditor (Read-Only)</SelectItem>
                      <SelectItem value="approver">Approver / Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assign-start-date" className="text-[15px] font-medium">Assignment Start Date</Label>
                  <Input id="assign-start-date" type="date" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assign-end-date" className="text-[15px] font-medium">Assignment End Date (Optional)</Label>
                  <Input id="assign-end-date" type="date" className="h-[52px] text-[15px] placeholder:text-[14px]" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Additional Notes</h3>
                <div className="space-y-2">
                  <Label htmlFor="assign-notes" className="text-[15px] font-medium">Notes</Label>
                  <Textarea id="assign-notes" placeholder="Add any notes about this assignment..." rows={3} className="text-[15px] placeholder:text-[14px]" />
                </div>
              </div>

              {/* Currently Assigned */}
              <div className="space-y-4">
                <h3 className="text-[14px] text-muted-foreground">Currently Assigned ({officeUsers.length})</h3>
                <div className="space-y-2">
                  {officeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-[4px] border">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[15px] font-medium">{user.name}</p>
                          <p className="text-[14px] text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(user.status)} >{user.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-muted/50 rounded-[4px] border p-4 mb-20">
                <p className="text-[14px] text-muted-foreground mb-2 font-medium">Assignment Tips</p>
                <div className="space-y-1 text-[14px] text-muted-foreground">
                  <p>- Users can only be assigned to one field office at a time</p>
                  <p>- Assigning here will update the user's field office in their profile</p>
                  <p>- The user will gain access to all data scoped to this office</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAssignUserOpen(false)} className="text-[15px]">
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success(`User assigned to ${selectedOffice.name} successfully`);
                  setAssignUserOpen(false);
                }} className="text-[15px]">
                  Assign User
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Header - flex-col matching Asset Lifecycle */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
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
              Field Offices
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{selectedOffice.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{selectedOffice.name}</h2>
                <Badge className={getStatusColor(selectedOffice.status)}>
                  {selectedOffice.status.charAt(0).toUpperCase() + selectedOffice.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5">{selectedOffice.code} &middot; {selectedOffice.location}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOfficeOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Office
              </Button>
              <Button onClick={() => setAssignUserOpen(true)}>
                <PersonAdd className="w-4 h-4 mr-2" />
                Assign User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{selectedOffice.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">{selectedOffice.totalAssets}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transfers</p>
                  <p className="text-2xl font-bold">{selectedOffice.activeTransfers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inspections</p>
                  <p className="text-2xl font-bold">{selectedOffice.activeInspections}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Standard App Tab Pattern */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
            <TabsTrigger value="users" className={tabClass}>Users ({officeUsers.length})</TabsTrigger>
            <TabsTrigger value="stats" className={tabClass}>Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Office Users</CardTitle>
                  
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 text-[15px]"
                  />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[15px]">User</TableHead>
                        <TableHead className="text-[15px]">Email</TableHead>
                        <TableHead className="text-[15px]">Role</TableHead>
                        <TableHead className="text-[15px]">Status</TableHead>
                        <TableHead className="text-[15px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {officeUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-[15px]">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[15px]">{user.email}</TableCell>
                          <TableCell className="text-[15px]">
                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-[15px]">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="text-[15px]">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Office Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Asset Categories</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Different asset types</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Asset Age</p>
                    <p className="text-2xl font-bold">2.4 years</p>
                    <p className="text-xs text-muted-foreground">Based on acquisition date</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Completed Inspections</p>
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Transfer Success Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Field Offices List View
  const filteredOffices = fieldOffices.filter((office) =>
    office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action button */}
      {!hideListHeader && (
        <div className="flex items-center justify-end">
          <Button onClick={() => setAddOfficeOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field Office
          </Button>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search field offices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-[15px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffices.map((office) => (
              <Card key={office.id} className="transition-shadow cursor-pointer" onClick={() => handleViewOffice(office)}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">{office.name}</h3>
                      </div>
                      <Badge className={getStatusColor(office.status)}>
                        {office.status}
                      </Badge>
                    </div>

                    {/* Code */}
                    <div className="text-sm text-muted-foreground font-['Manrope']">
                      {office.code}
                    </div>

                    {/* Location */}
                    <div className="text-sm text-muted-foreground">
                      {office.location}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Users</p>
                        <p className="text-lg font-bold">{office.totalUsers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Assets</p>
                        <p className="text-lg font-bold">{office.totalAssets}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Transfers</p>
                        <p className="text-lg font-bold">{office.activeTransfers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Inspections</p>
                        <p className="text-lg font-bold">{office.activeInspections}</p>
                      </div>
                    </div>

                    {/* View Details */}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewOffice(office)}>
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredOffices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No field offices found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      
      {/* ── Add Field Office Side Drawer ── */}
      <Sheet open={addOfficeOpen} onOpenChange={(open) => { if (!open) handleAddOfficeClose(); }}>
        <SheetContent side="right" className="!w-full sm:!max-w-xl flex flex-col overflow-hidden">
          <SheetHeader className="pr-8">
            <SheetTitle className="text-[15px]">Add Field Office</SheetTitle>
            <SheetDescription className="text-[14px]">
              Create a new field office location. Fill in the required details below.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="add-office-code" className="text-[15px] font-medium">Office Code <span className="text-red-500">*</span></Label>
                <Input
                  id="add-office-code"
                  placeholder="e.g., FO-NYC"
                  value={newOfficeCode}
                  onChange={(e) => setNewOfficeCode(e.target.value)}
                  className="h-[52px] text-[15px] placeholder:text-[14px]"
                />
                <p className="text-[14px] text-muted-foreground">Unique identifier used as a prefix for assets and transfers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-office-name" className="text-[15px] font-medium">Office Name <span className="text-red-500">*</span></Label>
                <Input
                  id="add-office-name"
                  placeholder="e.g., New York Office"
                  value={newOfficeName}
                  onChange={(e) => setNewOfficeName(e.target.value)}
                  className="h-[52px] text-[15px] placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">Contact Details</h3>
              <div className="space-y-2">
                <Label htmlFor="add-office-manager" className="text-[15px] font-medium">Office Manager</Label>
                <Select value={newOfficeManager} onValueChange={setNewOfficeManager}>
                  <SelectTrigger id="add-office-manager" className="h-[52px] text-[15px]">
                    <SelectValue placeholder="Select office manager" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="john.doe">John Doe</SelectItem>
                    <SelectItem value="jane.smith">Jane Smith</SelectItem>
                    <SelectItem value="sarah.chen">Sarah Chen</SelectItem>
                    <SelectItem value="alex.kumar">Alex Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-office-email" className="text-[15px] font-medium">Contact Email</Label>
                <Input
                  id="add-office-email"
                  type="email"
                  placeholder="office@company.com"
                  value={newOfficeEmail}
                  onChange={(e) => setNewOfficeEmail(e.target.value)}
                  className="h-[52px] text-[15px] placeholder:text-[14px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-office-phone" className="text-[15px] font-medium">Phone Number</Label>
                <Input
                  id="add-office-phone"
                  placeholder="+1 234 567 890"
                  value={newOfficePhone}
                  onChange={(e) => setNewOfficePhone(e.target.value)}
                  className="h-[52px] text-[15px] placeholder:text-[14px]"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">Address</h3>
              <div className="space-y-2">
                <Label htmlFor="add-office-address" className="text-[15px] font-medium">Street Address</Label>
                <Textarea
                  id="add-office-address"
                  placeholder="Enter full street address"
                  rows={3}
                  value={newOfficeAddress}
                  onChange={(e) => setNewOfficeAddress(e.target.value)}
                  className="text-[15px] placeholder:text-[14px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-office-city" className="text-[15px] font-medium">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="add-office-city"
                    placeholder="e.g., New York"
                    value={newOfficeCity}
                    onChange={(e) => setNewOfficeCity(e.target.value)}
                    className="h-[52px] text-[15px] placeholder:text-[14px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-office-country" className="text-[15px] font-medium">Country <span className="text-red-500">*</span></Label>
                  <Input
                    id="add-office-country"
                    placeholder="e.g., United States"
                    value={newOfficeCountry}
                    onChange={(e) => setNewOfficeCountry(e.target.value)}
                    className="h-[52px] text-[15px] placeholder:text-[14px]"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-sm text-muted-foreground">Status</h3>
              <div className="space-y-2">
                <Label htmlFor="add-office-status" className="text-[15px] font-medium">Office Status</Label>
                <Select value={newOfficeStatus} onValueChange={setNewOfficeStatus}>
                  <SelectTrigger id="add-office-status" className="h-[52px] text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/50 rounded-[4px] border p-4 mb-20">
              <p className="text-[14px] text-muted-foreground mb-2 font-medium">Field Office Tips</p>
              <div className="space-y-1 text-[14px] text-muted-foreground">
                <p>- Office code is used as a prefix for assets and transfers</p>
                <p>- You can assign users to this office after creation</p>
                <p>- Set the office as inactive if it is not yet operational</p>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleAddOfficeClose} className="text-[15px]">
                Cancel
              </Button>
              <Button onClick={handleAddOfficeSave} className="text-[15px]">
                Add Field Office
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
