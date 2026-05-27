import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import DetailPageLayout from './shared/DetailPageLayout';
import QuickActions from './shared/QuickActions';
import { TableSkeleton, KPICardSkeleton } from './shared/SkeletonLoaders';
import { Add as Plus, Search, Edit, Visibility as Eye, LocationOn as MapPin, Business as Building, Inventory2 as Package, BarChart as BarChart3, TrendingUp, ArrowForward as ArrowRight, ExpandMore as ChevronDown } from '@mui/icons-material';
import { toast } from "sonner";

interface Location {
  id: string;
  code: string;
  name: string;
  address: string;
  totalAreas: number;
  totalAssets: number;
  activeAreas: number;
  maintenanceAreas: number;
  inactiveAreas: number;
  utilization: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface Area {
  id: string;
  code: string;
  name: string;
  locationId: string;
  status: 'active' | 'maintenance' | 'inactive';
  assetCount: number;
  lastUpdated: string;
  capacity: number;
  utilization: number;
}

type ViewMode = 'list' | 'detail' | 'areas';

export default function Locations() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const [locations] = useState<Location[]>([
    {
      id: '1',
      code: 'HQ',
      name: 'Headquarters',
      address: '123 Business Street, City Center',
      totalAreas: 4,
      totalAssets: 67,
      activeAreas: 3,
      maintenanceAreas: 1,
      inactiveAreas: 0,
      utilization: 72,
      status: 'active'
    },
    {
      id: '2',
      code: 'WH-MAIN',
      name: 'Main Warehouse',
      address: '456 Industrial Zone, Manufacturing District',
      totalAreas: 6,
      totalAssets: 78,
      activeAreas: 5,
      maintenanceAreas: 0,
      inactiveAreas: 1,
      utilization: 87,
      status: 'active'
    },
    {
      id: '3',
      code: 'WH-BCK',
      name: 'Backup Storage',
      address: '789 Storage Avenue, Logistics Hub',
      totalAreas: 8,
      totalAssets: 23,
      activeAreas: 7,
      maintenanceAreas: 0,
      inactiveAreas: 1,
      utilization: 77,
      status: 'maintenance'
    },
    {
      id: '4',
      code: 'WH-RTL',
      name: 'Retail Center',
      address: '321 Commerce Boulevard, Shopping District',
      totalAreas: 8,
      totalAssets: 67,
      activeAreas: 8,
      maintenanceAreas: 0,
      inactiveAreas: 0,
      utilization: 54,
      status: 'active'
    }
  ]);

  const [areas] = useState<Area[]>([
    {
      id: '1',
      code: 'HQ-F1',
      name: 'Office Floor 1',
      locationId: '1',
      status: 'active',
      assetCount: 24,
      lastUpdated: '2 hours ago',
      capacity: 30,
      utilization: 80
    },
    {
      id: '2',
      code: 'HQ-F2',
      name: 'Office Floor 2',
      locationId: '1',
      status: 'active',
      assetCount: 18,
      lastUpdated: '2 hours ago',
      capacity: 25,
      utilization: 72
    },
    {
      id: '3',
      code: 'HQ-ST',
      name: 'Storage Area',
      locationId: '1',
      status: 'maintenance',
      assetCount: 3,
      lastUpdated: '2 hours ago',
      capacity: 20,
      utilization: 15
    },
    {
      id: '4',
      code: 'HQ-CR',
      name: 'Conference Rooms',
      locationId: '1',
      status: 'active',
      assetCount: 12,
      lastUpdated: '2 hours ago',
      capacity: 15,
      utilization: 80
    }
  ]);

  const kpiData = {
    totalLocations: locations.length,
    activeLocations: locations.filter(w => w.status === 'active').length,
    totalAreas: locations.reduce((sum, w) => sum + w.totalAreas, 0),
    totalAssets: locations.reduce((sum, w) => sum + w.totalAssets, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'maintenance':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-red-500';
    if (utilization >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setViewMode('detail');
    toast.info(`Opening details for ${location.name}`);
  };

  const handleBack = () => {
    if (viewMode === 'areas') {
      setViewMode('detail');
    } else {
      setViewMode('list');
      setSelectedLocation(null);
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const LocationDetailView = ({ location }: { location: Location }) => {
    const locationAreas = areas.filter(area => area.locationId === location.id);
    
    const breadcrumbs = [
      { label: 'Master Data', href: '#' },
      { label: 'Locations', href: '#locations' },
      { label: location.name }
    ];

    return (
      <div className="min-h-screen bg-background">
        {/* Enhanced Header */}
        <div className="bg-card border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumbs */}
            <div className="mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="cursor-pointer">Master Data</span>
                <span className="mx-2">/</span>
                <span className="cursor-pointer" onClick={handleBack}>Locations</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">{location.name}</span>
              </div>
            </div>

            {/* Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                  Back to Locations
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl">{location.name}</h1>
                    <Badge className={getStatusColor(location.status)}>
                      {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{location.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{location.address}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Areas:</span>
                      <span className="font-medium ml-2">{location.totalAreas}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Assets:</span>
                      <span className="font-medium ml-2">{location.totalAssets}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Area
                </Button>
                <Button variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Add Asset to Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Areas</p>
                    <p className="text-2xl font-bold text-green-600">{location.activeAreas}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Under Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">{location.maintenanceAreas}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive Areas</p>
                    <p className="text-2xl font-bold text-gray-600">{location.inactiveAreas}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/20 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Areas Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Areas ({locationAreas.length})</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Area
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search areas..."
                  className="pl-9 mb-4"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area Code</TableHead>
                      <TableHead>Area Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Asset Count</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationAreas.map((area) => (
                      <TableRow key={area.id} className="/50">
                        <TableCell className="font-medium font-['Manrope']">{area.code}</TableCell>
                        <TableCell>{area.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(area.status)}>
                            {area.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{area.assetCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={area.utilization} 
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">{area.utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{area.lastUpdated}</TableCell>
                        <TableCell>
                          <QuickActions 
                            actions={[
                              {
                                id: 'view',
                                label: 'View Details',
                                icon: Eye,
                                onClick: () => toast.info(`View details for ${area.name}`)
                              },
                              {
                                id: 'edit',
                                label: 'Edit',
                                icon: Edit,
                                onClick: () => toast.info(`Edit ${area.name}`)
                              }
                            ]}
                            compact={true}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (viewMode === 'detail' && selectedLocation) {
    return <LocationDetailView location={selectedLocation} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Web
        </Button>
        <Button variant="outline">
          <Building className="w-4 h-4 mr-2" />
          Mobile
        </Button>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-2xl font-bold">{kpiData.totalLocations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Locations</p>
                <p className="text-2xl font-bold text-green-600">{kpiData.activeLocations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Areas</p>
                <p className="text-2xl font-bold text-blue-600">{kpiData.totalAreas}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-purple-600">{kpiData.totalAssets}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <KPICardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <Card key={location.id} className="transition-shadow cursor-pointer" onClick={() => handleLocationClick(location)}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">{location.name}</h3>
                        </div>
                        <Badge className={getStatusColor(location.status)}>
                          {location.status}
                        </Badge>
                      </div>

                      {/* Code */}
                      <div className="text-sm text-muted-foreground font-['Manrope']">
                        {location.code}
                      </div>

                      {/* Address */}
                      <div className="text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {location.address}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Areas</p>
                            <p className="font-medium">{location.totalAreas}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Assets</p>
                            <p className="font-medium">{location.totalAssets}</p>
                          </div>
                        </div>
                      </div>

                      {/* Utilization */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Utilization</span>
                          <span className="font-medium">{location.utilization}%</span>
                        </div>
                        <Progress 
                          value={location.utilization} 
                          className="h-2"
                        />
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
                          e.stopPropagation();
                          handleLocationClick(location);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Detail
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Edit ${location.name}`);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredLocations.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No locations found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
