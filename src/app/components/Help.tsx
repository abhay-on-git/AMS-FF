import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { MenuBook, ExpandMore, CheckCircle, Schedule, ReportProblem, Inventory2, Description, People, Settings, ArrowForward, PlayArrow } from '@mui/icons-material';

export default function Help() {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const StatusCard = ({ status, color, icon: Icon, title, description }: {
    status: string;
    color: string;
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <Card className="transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {status}
              </Badge>
              <h4 className="font-medium">{title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const WorkflowStep = ({ step, title, description, isLast = false }: {
    step: number;
    title: string;
    description: string;
    isLast?: boolean;
  }) => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {step}
        </div>
        {!isLast && <div className="w-px h-16 bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="outline">
          <MenuBook className="w-4 h-4 mr-2" />
          Download PDF Guide
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
          <TabsTrigger value="overview" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Overview</TabsTrigger>
          <TabsTrigger value="statuses" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Asset Statuses</TabsTrigger>
          <TabsTrigger value="workflows" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Workflows</TabsTrigger>
          <TabsTrigger value="inventory" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Inventory Process</TabsTrigger>
          <TabsTrigger value="troubleshooting" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The RFID Asset Management System helps organizations track and manage their physical assets 
                using Radio Frequency Identification (RFID) technology. The system provides comprehensive 
                asset lifecycle management from registration to disposal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <Inventory2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium">Asset Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Register, track, and manage all your assets
                  </p>
                </Card>
                
                <Card className="text-center p-4">
                  <Description className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Inventory Control</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conduct regular inventories with RFID scanning
                  </p>
                </Card>
                
                <Card className="text-center p-4">
                  <People className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">User Management</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Role-based access control and user administration
                  </p>
                </Card>
                
                <Card className="text-center p-4">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium">Device Configuration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure RFID devices for optimal performance
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Web Interface
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Real-time dashboard with KPIs</li>
                    <li>• Comprehensive asset database</li>
                    <li>• Inventory management workflows</li>
                    <li>• User and role administration</li>
                    <li>• Bilingual support (English/Vietnamese)</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Mobile Interface (RF88)
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Asset registration with RFID scanning</li>
                    <li>• Inventory sheet execution</li>
                    <li>• Quick asset lookup</li>
                    <li>• Offline capability with sync</li>
                    <li>• Device configuration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statuses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Status Definitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard
                  status="ACTIVE"
                  color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  icon={CheckCircle}
                  title="Active Asset"
                  description="Asset is in use and available for normal operations. Can be moved, assigned, and tracked."
                />
                
                <StatusCard
                  status="INACTIVE"
                  color="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  icon={Schedule}
                  title="Inactive Asset"
                  description="Asset is not currently in use but is still owned by the organization. May be in storage or awaiting deployment."
                />
                
                <StatusCard
                  status="MAINTENANCE"
                  color="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  icon={ReportProblem}
                  title="Under Maintenance"
                  description="Asset is temporarily out of service for maintenance, repair, or calibration. Cannot be assigned to users."
                />
                
                <StatusCard
                  status="DISPOSED"
                  color="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  icon={Inventory2}
                  title="Disposed"
                  description="Asset has been disposed of, sold, or retired from service. Historical record is maintained for audit purposes."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status Definitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusCard
                  status="MATCH"
                  color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  icon={CheckCircle}
                  title="Expected & Found"
                  description="Asset was expected to be in the location and was successfully scanned during inventory."
                />
                
                <StatusCard
                  status="EXTRA"
                  color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  icon={Inventory2}
                  title="Found but not Expected"
                  description="Asset was scanned but was not expected to be in this location. May need location update."
                />
                
                <StatusCard
                  status="UNKNOWN"
                  color="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                  icon={ReportProblem}
                  title="Unknown Asset"
                  description="Scanned EPC does not match any asset in the system. May be a new asset requiring registration."
                />
                
                <StatusCard
                  status="MISSING"
                  color="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  icon={Schedule}
                  title="Expected but not Found"
                  description="Asset was expected to be in the location but was not scanned during inventory. Requires investigation."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayArrow className="w-5 h-5" />
                  Asset Registration Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <WorkflowStep
                    step={1}
                    title="Create Asset Type"
                    description="Define asset categories and types in the system"
                  />
                  <WorkflowStep
                    step={2}
                    title="Assign RFID Tag"
                    description="Attach RFID tag to physical asset and scan EPC"
                  />
                  <WorkflowStep
                    step={3}
                    title="Register Asset"
                    description="Create asset record with details, location, and owner"
                  />
                  <WorkflowStep
                    step={4}
                    title="Assign Location"
                    description="Place asset in designated warehouse area"
                    isLast={true}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayArrow className="w-5 h-5" />
                  Inventory Process Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <WorkflowStep
                    step={1}
                    title="Create Inventory Sheet"
                    description="Manager creates inventory sheet for specific area"
                  />
                  <WorkflowStep
                    step={2}
                    title="Assign to Staff"
                    description="Inventory sheet assigned to inventory staff member"
                  />
                  <WorkflowStep
                    step={3}
                    title="Conduct Scan"
                    description="Staff scans all assets in assigned area using RF88"
                  />
                  <WorkflowStep
                    step={4}
                    title="Review & Approve"
                    description="Manager reviews results and approves inventory"
                    isLast={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Process Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Collapsible 
                  open={openSections['preparation']} 
                  onOpenChange={() => toggleSection('preparation')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                      <div className="text-left">
                        <h4 className="font-medium">1. Inventory Preparation</h4>
                        <p className="text-sm text-muted-foreground">Setup and planning phase</p>
                      </div>
                      <ExpandMore className={`w-4 h-4 transition-transform ${openSections['preparation'] ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Ensure RF88 device is charged and configured
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Create inventory sheet for target warehouse area
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Assign inventory sheet to staff member
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Download inventory data to mobile device
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible 
                  open={openSections['execution']} 
                  onOpenChange={() => toggleSection('execution')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                      <div className="text-left">
                        <h4 className="font-medium">2. Inventory Execution</h4>
                        <p className="text-sm text-muted-foreground">Scanning and data collection</p>
                      </div>
                      <ExpandMore className={`w-4 h-4 transition-transform ${openSections['execution'] ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Start inventory session on RF88 device
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Systematically scan all assets in the area
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Review real-time counters (Match, Extra, Unknown, Missing)
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Handle extra and unknown items with quick actions
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible 
                  open={openSections['completion']} 
                  onOpenChange={() => toggleSection('completion')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                      <div className="text-left">
                        <h4 className="font-medium">3. Completion & Review</h4>
                        <p className="text-sm text-muted-foreground">Finalizing and approval</p>
                      </div>
                      <ExpandMore className={`w-4 h-4 transition-transform ${openSections['completion'] ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Submit inventory results from RF88 device
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Sync data with central system when online
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Manager reviews inventory sheet details
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowForward className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        Approve or reject inventory results
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">RFID Tags Not Reading</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground"><strong>Symptoms:</strong> RF88 device cannot detect nearby RFID tags</p>
                    <p className="text-muted-foreground"><strong>Solutions:</strong></p>
                    <ul className="ml-4 space-y-1 text-muted-foreground">
                      <li>• Check device battery level and charge if needed</li>
                      <li>• Verify RFID power settings are adequate</li>
                      <li>• Ensure tags are not damaged or deactivated</li>
                      <li>• Check for interference from metal objects</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Sync Issues</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground"><strong>Symptoms:</strong> Data not syncing between RF88 and central system</p>
                    <p className="text-muted-foreground"><strong>Solutions:</strong></p>
                    <ul className="ml-4 space-y-1 text-muted-foreground">
                      <li>• Check WiFi/network connectivity</li>
                      <li>• Verify login credentials are correct</li>
                      <li>• Try manual sync from device settings</li>
                      <li>• Contact IT support if network issues persist</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Unknown Assets in Inventory</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground"><strong>Symptoms:</strong> Assets appear as"Unknown" during inventory</p>
                    <p className="text-muted-foreground"><strong>Solutions:</strong></p>
                    <ul className="ml-4 space-y-1 text-muted-foreground">
                      <li>• Check if asset is registered in the system</li>
                      <li>• Verify EPC code matches database records</li>
                      <li>• Register new assets if they are legitimate</li>
                      <li>• Use"Update Location" action for moved assets</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Performance Issues</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground"><strong>Symptoms:</strong> System running slowly or timing out</p>
                    <p className="text-muted-foreground"><strong>Solutions:</strong></p>
                    <ul className="ml-4 space-y-1 text-muted-foreground">
                      <li>• Clear browser cache and cookies</li>
                      <li>• Check network connection speed</li>
                      <li>• Close unnecessary browser tabs</li>
                      <li>• Contact system administrator for server issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <People className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium">Contact IT Support</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    support@company.com<br />
                    +84 (0) 123 456 789
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Description className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Training Materials</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Video tutorials and<br />
                    step-by-step guides
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">System Updates</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Latest features and<br />
                    maintenance schedules
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
