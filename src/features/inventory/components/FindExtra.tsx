import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { ArrowBack as ArrowLeft, Search, PlayArrow as Play, Pause, Send, LocationOn as MapPin, VisibilityOff as EyeOff, Radar, SignalCellularAlt as Signal, GpsFixed as Target, Close as X, ChevronLeft } from '@mui/icons-material';
import { toast } from 'sonner';
import { TablePagination, paginateData } from './shared/TablePagination';

interface ExtraAsset {
  id: string;
  epc: string;
  assetName?: string;
  currentLocation?: string;
  status: 'extra' | 'unknown';
  rssi?: number;
  distance?: 'far' | 'medium' | 'near';
}

interface FindExtraCounters {
  totalScanned: number;
  extraCount: number;
  unknownCount: number;
}

type ViewMode = 'list' | 'radar';

interface FindExtraProps {
  onBack: () => void;
}

export default function FindExtra({ onBack }: FindExtraProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEPC, setSelectedEPC] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [extraPage, setExtraPage] = useState(0);
  const [extraRowsPerPage, setExtraRowsPerPage] = useState(10);

  const [counters, setCounters] = useState<FindExtraCounters>({
    totalScanned: 127,
    extraCount: 8,
    unknownCount: 3
  });

  const [extraAssets, setExtraAssets] = useState<ExtraAsset[]>([
    {
      id: '1',
      epc: 'E2801160600002040000001236',
      assetName: 'HP Laptop ProBook',
      currentLocation: 'Office A1-03',
      status: 'extra',
      rssi: -45,
      distance: 'near'
    },
    {
      id: '2',
      epc: 'E2801160600002040000001237',
      assetName: 'Dell Monitor 24"',
      currentLocation: 'Office A1-05',
      status: 'extra',
      rssi: -68,
      distance: 'medium'
    },
    {
      id: '3',
      epc: 'E2801160600002040000001238',
      status: 'unknown',
      rssi: -72,
      distance: 'far'
    },
    {
      id: '4',
      epc: 'E2801160600002040000001239',
      assetName: 'Canon Printer MX490',
      currentLocation: 'Office Floor 1',
      status: 'extra',
      rssi: -52,
      distance: 'medium'
    },
    {
      id: '5',
      epc: 'E2801160600002040000001240',
      status: 'unknown',
      rssi: -78,
      distance: 'far'
    },
    {
      id: '6',
      epc: 'E2801160600002040000001241',
      assetName: 'Wireless Mouse Logitech',
      currentLocation: 'Office A1-01',
      status: 'extra',
      rssi: -41,
      distance: 'near'
    }
  ]);

  const filteredAssets = extraAssets.filter(asset =>
    asset.epc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.assetName && asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'extra':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'unknown':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRowBackgroundColor = (status: string) => {
    switch (status) {
      case 'extra':
        return 'bg-yellow-50 dark:bg-yellow-900/10100 dark:900/20';
      case 'unknown':
        return 'bg-red-50 dark:bg-red-900/10100 dark:900/20';
      default:
        return '/50';
    }
  };

  const getRSSIColor = (rssi: number) => {
    if (rssi >= -50) return 'text-green-600';
    if (rssi >= -70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStartStopScan = () => {
    setIsScanning(!isScanning);
    toast.info(isScanning ? 'Scanning stopped' : 'Scanning started');
    
    if (!isScanning) {
      // Simulate finding new items
      setTimeout(() => {
        setCounters(prev => ({
          ...prev,
          totalScanned: prev.totalScanned + 1,
          extraCount: prev.extraCount + (Math.random() > 0.7 ? 1 : 0)
        }));
      }, 3000);
    }
  };

  const handleSubmitResults = () => {
    toast.success('Find Extra results submitted successfully!');
    onBack();
  };

  const handleUpdateLocation = (assetId: string, newLocation: string) => {
    setExtraAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { ...asset, currentLocation: newLocation }
          : asset
      )
    );
    toast.success('Location updated successfully');
  };

  const handleIgnoreAsset = (assetId: string) => {
    setExtraAssets(prev => prev.filter(asset => asset.id !== assetId));
    setCounters(prev => ({
      ...prev,
      extraCount: prev.extraCount - 1
    }));
    toast.success('Asset ignored');
  };

  const handleFindAsset = (epc: string) => {
    setSelectedEPC(epc);
    setViewMode('radar');
    toast.info(`Starting radar search for ${epc}`);
  };

  const RadarScreen = () => {
    const [radarRSSI, setRadarRSSI] = useState(-65);
    const [distance, setDistance] = useState<'far' | 'medium' | 'near'>('medium');
    const [isSearching, setIsSearching] = useState(true);

    useEffect(() => {
      if (isSearching) {
        const interval = setInterval(() => {
          // Simulate RSSI changes
          const newRSSI = -40 - Math.random() * 40;
          setRadarRSSI(newRSSI);
          
          if (newRSSI >= -50) setDistance('near');
          else if (newRSSI >= -70) setDistance('medium');
          else setDistance('far');
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [isSearching]);

    const getRSSIPercentage = () => {
      return Math.max(0, Math.min(100, (radarRSSI + 100) * 1.25));
    };

    const getSignalColor = () => {
      const percentage = getRSSIPercentage();
      if (percentage >= 70) return 'text-green-500';
      if (percentage >= 40) return 'text-yellow-500';
      return 'text-red-500';
    };

    const getDistanceLabel = () => {
      switch (distance) {
        case 'near': return 'Very Close';
        case 'medium': return 'Getting Closer';
        case 'far': return 'Keep Looking';
        default: return 'Searching...';
      }
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-primary-foreground">
              <button
                onClick={() => setViewMode('list')}
                className="/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="opacity-60">/</span>
              <button
                onClick={() => setViewMode('list')}
                className="/80 transition-colors"
              >
                Find Extra
              </button>
              <span className="opacity-60">/</span>
              <span className="font-medium">Radar Search</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Find Asset by EPC</h1>
              <p className="text-sm opacity-90 font-['Manrope']">{selectedEPC}</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Radar Visualization */}
          <Card>
            <CardContent className="p-8">
              <div className="relative aspect-square max-w-xs mx-auto">
                {/* Radar circles */}
                <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/20 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full border border-muted-foreground/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-8 rounded-full border border-muted-foreground/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Center target */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Target className={`w-8 h-8 ${getSignalColor()}`} />
                </div>

                {/* Signal indicator */}
                <div className="absolute top-2 right-2">
                  <Signal className={`w-6 h-6 ${getSignalColor()}`} />
                </div>
              </div>

              {/* Distance indicator */}
              <div className="text-center mt-6">
                <p className={`text-2xl font-bold ${getSignalColor()}`}>
                  {getDistanceLabel()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Follow the signal strength
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signal Strength */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="w-5 h-5" />
                Signal Strength
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>RSSI</span>
                  <span className={`font-['Manrope'] ${getRSSIColor(radarRSSI)}`}>
                    {radarRSSI} dBm
                  </span>
                </div>
                <Progress 
                  value={getRSSIPercentage()} 
                  className={`h-3 ${distance === 'near' ? 'bg-green-100' : distance === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}
                />
              </div>

              <div className="text-center">
                <p className={`text-lg font-semibold ${getSignalColor()}`}>
                  {getRSSIPercentage().toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Signal Quality</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => setIsSearching(!isSearching)}
              className={`w-full h-12 ${isSearching ? 'bg-red-500600' : ''}`}
              variant={isSearching ? 'destructive' : 'default'}
            >
              {isSearching ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isSearching ? 'Stop Find' : 'Start Find'}
            </Button>

            <Button variant="outline" className="w-full">
              <MapPin className="w-4 h-4 mr-2" />
              Mark Current Location
            </Button>

            <Button variant="outline" className="w-full" onClick={() => setViewMode('list')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Extra List
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'radar') {
    return <RadarScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-primary-foreground">
            <button
              onClick={onBack}
              className="/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="opacity-60">/</span>
            <button
              onClick={onBack}
              className="/80 transition-colors"
            >
              RFID Operations
            </button>
            <span className="opacity-60">/</span>
            <span className="font-medium">Find Extra Mode</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Find Extra Mode</h1>
            <p className="text-sm opacity-90">Locate and manage unexpected assets</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Real-time Counter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scanned</p>
                  <p className="text-2xl font-bold text-blue-600">{counters.totalScanned}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Extra Assets</p>
                  <p className="text-2xl font-bold text-yellow-600">{counters.extraCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unknown Assets</p>
                  <p className="text-2xl font-bold text-red-600">{counters.unknownCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
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
                  placeholder="Search EPC codes or asset names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40 text-[15px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem className="text-[15px]" value="all">All Types</SelectItem>
                  <SelectItem className="text-[15px]" value="extra">Extra Only</SelectItem>
                  <SelectItem className="text-[15px]" value="unknown">Unknown Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[15px]">EPC Code</TableHead>
                    <TableHead className="text-[15px]">Asset Name</TableHead>
                    <TableHead className="text-[15px]">Current Location</TableHead>
                    <TableHead className="text-[15px]">Status</TableHead>
                    <TableHead className="text-[15px]">Signal</TableHead>
                    <TableHead className="w-48 text-[15px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(filteredAssets, extraPage, extraRowsPerPage).map((asset) => (
                    <TableRow 
                      key={asset.id} 
                      className={getRowBackgroundColor(asset.status)}
                    >
                      <TableCell className="font-['Manrope'] text-[15px]">
                        {asset.epc}
                      </TableCell>
                      <TableCell className="text-[15px]">
                        {asset.assetName ? (
                          <span className="font-medium">{asset.assetName}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Unknown Asset</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[15px]">
                        {asset.currentLocation ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[15px]">{asset.currentLocation}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">No location</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[15px]">
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[15px]">
                        {asset.rssi && (
                          <div className="flex items-center gap-2">
                            <Signal className={`w-4 h-4 ${getRSSIColor(asset.rssi)}`} />
                            <span className={`text-sm ${getRSSIColor(asset.rssi)}`}>
                              {asset.rssi} dBm
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Select defaultValue="">
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Update Location" />
                            </SelectTrigger>
                            <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                              <SelectItem value="office-a1-01">Office A1-01</SelectItem>
                              <SelectItem value="office-a1-02">Office A1-02</SelectItem>
                              <SelectItem value="office-a1-03">Office A1-03</SelectItem>
                              <SelectItem value="warehouse-b1">Warehouse B1</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFindAsset(asset.epc)}
                          >
                            <Radar className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIgnoreAsset(asset.id)}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No extra or unknown assets found</p>
              </div>
            )}

            {filteredAssets.length > extraRowsPerPage && (
              <TablePagination
                totalItems={filteredAssets.length}
                page={extraPage}
                rowsPerPage={extraRowsPerPage}
                onPageChange={setExtraPage}
                onRowsPerPageChange={setExtraRowsPerPage}
                totalUnfilteredItems={extraAssets.length}
                itemLabel="assets"
              />
            )}
          </CardContent>
        </Card>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <Button
            onClick={handleStartStopScan}
            className={`w-14 h-14 rounded-full shadow-lg ${isScanning ? 'bg-red-500600' : ''}`}
            variant={isScanning ? 'destructive' : 'default'}
          >
            {isScanning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={handleSubmitResults}
            className="w-14 h-14 rounded-full shadow-lg bg-green-500600 text-white"
            disabled={extraAssets.length === 0}
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
