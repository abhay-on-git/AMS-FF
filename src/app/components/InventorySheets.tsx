import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Add as Plus, Search, Description as FileText, ExpandMore as ChevronDown, Check, Close as X, LocationOn as MapPin, Visibility as Eye, VisibilityOff as EyeOff, Event as Calendar, ArrowBack as ArrowLeft, ChevronLeft } from '@mui/icons-material';
import { toast } from 'sonner';
import { TablePagination, paginateData } from './shared/TablePagination';

interface InventorySheet {
  id: string;
  sheetCode: string;
  date: string;
  warehouse: string;
  area: string;
  assignedTo: string;
  status: 'draft' | 'in-progress' | 'completed' | 'approved';
  notes?: string;
  matchCount: number;
  extraCount: number;
  unknownCount: number;
  missingCount: number;
  createdBy: string;
  createdDate: string;
}

interface InventoryItem {
  id: string;
  epc: string;
  assetId?: string;
  name?: string;
  type: 'match' | 'extra' | 'unknown' | 'missing';
  status?: string;
  location?: string;
  action?: 'none' | 'update-location' | 'ignore' | 'mark-missing';
}

type ViewMode = 'list' | 'detail';

export default function InventorySheets() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSheet, setSelectedSheet] = useState<InventorySheet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [invPage, setInvPage] = useState(0);
  const [invRowsPerPage, setInvRowsPerPage] = useState(10);

  const [inventorySheets] = useState<InventorySheet[]>([
    {
      id: '1',
      sheetCode: 'INV-2024-001',
      date: '2024-01-20',
      warehouse: 'Main Storage Warehouse',
      area: 'Electronics Section',
      assignedTo: 'John Doe',
      status: 'completed',
      notes: 'Regular monthly inventory check',
      matchCount: 42,
      extraCount: 3,
      unknownCount: 1,
      missingCount: 2,
      createdBy: 'Admin',
      createdDate: '2024-01-20 09:00:00',
    },
    {
      id: '2',
      sheetCode: 'INV-2024-002',
      date: '2024-01-21',
      warehouse: 'Main Storage Warehouse',
      area: 'Furniture Section',
      assignedTo: 'Jane Smith',
      status: 'in-progress',
      notes: 'Quarterly furniture audit',
      matchCount: 35,
      extraCount: 5,
      unknownCount: 2,
      missingCount: 1,
      createdBy: 'Manager',
      createdDate: '2024-01-21 10:30:00',
    },
    {
      id: '3',
      sheetCode: 'INV-2024-003',
      date: '2024-01-22',
      warehouse: 'Secondary Storage',
      area: 'IT Equipment',
      assignedTo: 'Bob Wilson',
      status: 'approved',
      notes: 'IT asset verification',
      matchCount: 67,
      extraCount: 2,
      unknownCount: 0,
      missingCount: 3,
      createdBy: 'Admin',
      createdDate: '2024-01-22 14:15:00',
    },
  ]);

  const [inventoryItems] = useState<InventoryItem[]>([
    { id: '1', epc: 'E2801160600002040000001234', assetId: 'LAP-001234', name: 'Dell Latitude 5520', type: 'match', status: 'active', location: 'A1-01' },
    { id: '2', epc: 'E2801160600002040000001235', assetId: 'DES-001235', name: 'HP EliteDesk 800', type: 'match', status: 'active', location: 'A1-02' },
    { id: '3', epc: 'E2801160600002040000001236', type: 'extra', action: 'none' },
    { id: '4', epc: 'E2801160600002040000001237', type: 'unknown', action: 'none' },
    { id: '5', epc: '', assetId: 'PRN-001236', name: 'Canon ImageRunner', type: 'missing', status: 'active', location: 'A1-03' },
  ]);

  const getFilteredSheets = () => {
    return inventorySheets.filter((sheet) => {
      const matchesSearch = 
        sheet.sheetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sheet.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWarehouse = warehouseFilter === 'all' || sheet.warehouse === warehouseFilter;
      const matchesArea = areaFilter === 'all' || sheet.area === areaFilter;
      const matchesStatus = statusFilter === 'all' || sheet.status === statusFilter;
      
      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(sheet.date) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && new Date(sheet.date) <= new Date(dateTo);
      }
      
      return matchesSearch && matchesWarehouse && matchesArea && matchesStatus && matchesDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'approved':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'extra':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'unknown':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      case 'missing':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleSheetClick = (sheet: InventorySheet) => {
    setSelectedSheet(sheet);
    setViewMode('detail');
  };

  const handleApproveSheet = () => {
    toast.success('Inventory sheet approved successfully!');
  };

  const handleRejectSheet = () => {
    toast.success('Inventory sheet rejected and returned to completed status.');
  };

  const handleQuickAction = (itemId: string, action: string) => {
    console.log('Quick action:', action, 'for item:', itemId);
    toast.success(`Item ${action} successfully!`);
  };

  const CreateSheetForm = () => {
    const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      warehouse: '',
      area: '',
      assignedTo: '',
      notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Creating inventory sheet:', formData);
      toast.success('Inventory sheet created successfully!');
      setIsCreateDialogOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        warehouse: '',
        area: '',
        assignedTo: '',
        notes: '',
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[15px] font-medium">{t('common.date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="text-[15px] font-medium">{t('inventory.assignedTo')}</Label>
            <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="bob-wilson">Bob Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="warehouse" className="text-[15px] font-medium">{t('inventory.warehouse')}</Label>
            <Select value={formData.warehouse} onValueChange={(value) => setFormData({ ...formData, warehouse: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="main-storage">Main Storage Warehouse</SelectItem>
                <SelectItem value="secondary-storage">Secondary Storage</SelectItem>
                <SelectItem value="archive-storage">Archive Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="area" className="text-[15px] font-medium">{t('inventory.area')}</Label>
            <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="electronics">Electronics Section</SelectItem>
                <SelectItem value="furniture">Furniture Section</SelectItem>
                <SelectItem value="equipment">Equipment Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-[15px] font-medium">{t('inventory.notes')}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter notes..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">
            {t('common.create')}
          </Button>
        </div>
      </form>
    );
  };

  const InventoryItemSection = ({ type, items, title }: { type: string; items: InventoryItem[]; title: string }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const sectionItems = items.filter(item => item.type === type);

    return (
      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className={getItemTypeColor(type)}>
                    {sectionItems.length}
                  </Badge>
                  {title}
                </CardTitle>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              {sectionItems.length > 0 ? (
                <div className="space-y-2">
                  {sectionItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-['Manrope'] text-sm">{item.epc || item.assetId}</div>
                        {item.name && <div className="text-sm text-muted-foreground">{item.name}</div>}
                        {item.location && <div className="text-xs text-muted-foreground">Location: {item.location}</div>}
                      </div>
                      
                      {(type === 'extra' || type === 'unknown') && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleQuickAction(item.id, 'update-location')}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {t('mobile.updateLocation')}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleQuickAction(item.id, 'ignore')}
                          >
                            <EyeOff className="w-3 h-3 mr-1" />
                            {t('mobile.ignore')}
                          </Button>
                          {type === 'unknown' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleQuickAction(item.id, 'mark-missing')}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Mark Missing
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <div className="text-sm">No {title.toLowerCase()} items</div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  const SheetDetailView = ({ sheet }: { sheet: InventorySheet }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setViewMode('list')}
                className="text-muted-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="text-muted-foreground transition-colors"
              >
                Inventory Sheets
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{sheet.sheetCode}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{sheet.sheetCode}</h2>
              <p className="text-sm text-muted-foreground">
                {sheet.warehouse} - {sheet.area}
              </p>
            </div>
          </div>
          
          {sheet.status === 'completed' && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="w-4 h-4 mr-2" />
                    {t('inventory.reject')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Inventory Sheet</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this inventory sheet? It will be returned to completed status.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRejectSheet}>Reject</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    <Check className="w-4 h-4 mr-2" />
                    {t('inventory.approve')} & Close
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Inventory Sheet</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this inventory sheet? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApproveSheet}>Approve</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Sheet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sheet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">{t('common.date')}</Label>
                <p className="font-medium">{sheet.date}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">{t('inventory.assignedTo')}</Label>
                <p className="font-medium">{sheet.assignedTo}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">{t('common.status')}</Label>
                <Badge className={getStatusColor(sheet.status)}>
                  {t(`inventory.${sheet.status}`)}
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Created By</Label>
                <p className="font-medium">{sheet.createdBy}</p>
              </div>
              {sheet.notes && (
                <div className="col-span-2 md:col-span-4">
                  <Label className="text-sm text-muted-foreground">{t('inventory.notes')}</Label>
                  <p className="font-medium">{sheet.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t('inventory.match')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sheet.matchCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t('inventory.extra')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sheet.extraCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t('inventory.unknown')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{sheet.unknownCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t('inventory.missing')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{sheet.missingCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Items Sections */}
        <div className="space-y-4">
          <InventoryItemSection type="match" items={inventoryItems} title={t('inventory.match')} />
          <InventoryItemSection type="extra" items={inventoryItems} title={t('inventory.extra')} />
          <InventoryItemSection type="unknown" items={inventoryItems} title={t('inventory.unknown')} />
          <InventoryItemSection type="missing" items={inventoryItems} title={t('inventory.missing')} />
        </div>
      </div>
    );
  };

  if (viewMode === 'detail' && selectedSheet) {
    return <SheetDetailView sheet={selectedSheet} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('inventory.createSheet')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('inventory.createSheet')}</DialogTitle>
              <DialogDescription>Create a new inventory sheet to organize and track your assets</DialogDescription>
            </DialogHeader>
            <CreateSheetForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`${t('common.search')} ${t('inventory.sheetCode')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Warehouse" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="all">All Warehouses</SelectItem>
                    <SelectItem value="Main Storage Warehouse">Main Storage</SelectItem>
                    <SelectItem value="Secondary Storage">Secondary Storage</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">{t('inventory.draft')}</SelectItem>
                    <SelectItem value="in-progress">{t('inventory.inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('inventory.completed')}</SelectItem>
                    <SelectItem value="approved">{t('inventory.approved')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Label className="text-[15px] font-medium">Date Range:</Label>
              </div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
                placeholder="From"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
                placeholder="To"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-420px)] scrollbar-hide">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('inventory.sheetCode')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('inventory.warehouse')}</TableHead>
                    <TableHead>{t('inventory.area')}</TableHead>
                    <TableHead>{t('inventory.assignedTo')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead className="w-24">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(getFilteredSheets(), invPage, invRowsPerPage).map((sheet) => (
                    <TableRow 
                      key={sheet.id} 
                      className="/50 cursor-pointer"
                      onDoubleClick={() => handleSheetClick(sheet)}
                    >
                      <TableCell className="font-medium">{sheet.sheetCode}</TableCell>
                      <TableCell>{sheet.date}</TableCell>
                      <TableCell>{sheet.warehouse}</TableCell>
                      <TableCell>{sheet.area}</TableCell>
                      <TableCell>{sheet.assignedTo}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sheet.status)}>
                          {t(`inventory.${sheet.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            M:{sheet.matchCount}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            E:{sheet.extraCount}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            U:{sheet.unknownCount}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            M:{sheet.missingCount}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSheetClick(sheet)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              totalItems={getFilteredSheets().length}
              page={invPage}
              rowsPerPage={invRowsPerPage}
              onPageChange={setInvPage}
              onRowsPerPageChange={setInvRowsPerPage}
              totalUnfilteredItems={inventorySheets.length}
              itemLabel="sheets"
            />
          </div>
          
          {getFilteredSheets().length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No inventory sheets found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
