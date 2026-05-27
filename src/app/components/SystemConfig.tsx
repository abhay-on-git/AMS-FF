import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Backup as BackupIcon, 
  Storage, 
  Timer, 
  Smartphone, 
  Security, 
  Settings, 
  CheckCircle, 
  Warning, 
  Schedule, 
  Download, 
  Upload, 
  Refresh, 
  Info 
} from '@mui/icons-material';
import { toast } from 'sonner';
import { FileUploadDrawer } from './shared/FileUploadDrawer';

export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('backup');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px] w-fit">
          <TabsTrigger value="backup" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Backup & Restore</TabsTrigger>
          <TabsTrigger value="retention" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Data Retention</TabsTrigger>
          <TabsTrigger value="security" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">Security</TabsTrigger>
          <TabsTrigger value="pda" className="px-4 py-2 rounded-[4px] text-sm transition-colors data-[state=active]:bg-[#121321] data-[state=active]:text-white data-[state=active]:shadow-sm bg-transparent text-[#121321] border border-transparent data-[state=inactive]:border-[#121321]/20 data-[state=inactive]:[#121321]/5 dark:text-white dark:data-[state=inactive]:border-white/20">PDA Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-6">
          <BackupRestoreSection />
        </TabsContent>
        <TabsContent value="retention" className="space-y-6">
          <DataRetentionSection />
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="pda" className="space-y-6">
          <PDAConfigSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BackupRestoreSection() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [restoreBackupDrawerOpen, setRestoreBackupDrawerOpen] = useState(false);

  const backupHistory = [
    { id: 'BKP-001', date: '2026-02-26 02:00:00', size: '2.4 GB', type: 'Automated', status: 'success' },
    { id: 'BKP-002', date: '2026-02-25 02:00:00', size: '2.3 GB', type: 'Automated', status: 'success' },
    { id: 'BKP-003', date: '2026-02-24 14:30:00', size: '2.3 GB', type: 'Manual', status: 'success' },
    { id: 'BKP-004', date: '2026-02-24 02:00:00', size: '2.2 GB', type: 'Automated', status: 'failed' },
    { id: 'BKP-005', date: '2026-02-23 02:00:00', size: '2.2 GB', type: 'Automated', status: 'success' },
  ];

  return (
    <>
      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="font-medium">2026-02-26 02:00</p>
                <p className="text-xs text-green-600">Success</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Storage className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Backup Size</p>
                <p className="font-medium">11.4 GB</p>
                <p className="text-xs text-muted-foreground">5 backups stored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Schedule className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Scheduled</p>
                <p className="font-medium">2026-02-27 02:00</p>
                <p className="text-xs text-muted-foreground">In ~12 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Backup Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automated Backup</Label>
              <p className="text-sm text-muted-foreground">Enable automatic scheduled backups</p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast.success('Manual backup initiated')}>
              <BackupIcon className="w-4 h-4 mr-2" />
              Backup Now
            </Button>
            <Button variant="outline" onClick={() => setRestoreBackupDrawerOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Restore from Backup
            </Button>
            <Button variant="outline" onClick={() => toast.success('Settings saved')}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map(bk => (
                  <TableRow key={bk.id}>
                    <TableCell className="font-['Manrope']">{bk.id}</TableCell>
                    <TableCell className="font-['Manrope']">{bk.date}</TableCell>
                    <TableCell>{bk.size}</TableCell>
                    <TableCell><Badge variant="outline">{bk.type}</Badge></TableCell>
                    <TableCell>
                      <Badge className={bk.status === 'success' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}>
                        {bk.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info('Downloading backup...')}>
                          <Download className="w-4 h-4" />
                        </Button>
                        {bk.status === 'success' && (
                          <Button size="sm" variant="ghost" onClick={() => setRestoreBackupDrawerOpen(true)}>
                            <Refresh className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Restore Backup Drawer */}
      <FileUploadDrawer
        open={restoreBackupDrawerOpen}
        onOpenChange={setRestoreBackupDrawerOpen}
        title="Restore from Backup"
        description="Upload a backup archive (.sql, .gz, or .zip) to restore the system to a previous state. This action will overwrite current data."
        acceptedTypes={['application/gzip', 'application/zip', 'application/x-sql', 'application/octet-stream']}
        maxFiles={1}
        maxFileSize={100}
        onUploadComplete={(files) => {
          toast.success(`Backup"${files[0]?.name}" uploaded — system restore initiated. This may take several minutes.`);
        }}
      />
    </>
  );
}

function DataRetentionSection() {
  return (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Data retention policies define how long different types of data are kept before automatic archival or deletion. Changes require administrator approval.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Retention Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { category: 'Asset Records', current: 'Indefinite', description: 'Active and disposed asset data' },
              { category: 'Audit Logs', current: '7 years', description: 'System activity and user action logs' },
              { category: 'Transfer Records', current: '5 years', description: 'Asset transfer documentation' },
              { category: 'Inspection Reports', current: '5 years', description: 'Physical inspection results and reports' },
              { category: 'Disposal Certificates', current: '10 years', description: 'Disposal documentation and approvals' },
              { category: 'Session Logs', current: '90 days', description: 'User login/logout session data' },
              { category: 'Sync History', current: '1 year', description: 'SAP integration sync records' },
            ].map((policy, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{policy.category}</p>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Select defaultValue={policy.current}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="90 days">90 days</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="3 years">3 years</SelectItem>
                      <SelectItem value="5 years">5 years</SelectItem>
                      <SelectItem value="7 years">7 years</SelectItem>
                      <SelectItem value="10 years">10 years</SelectItem>
                      <SelectItem value="Indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => toast.success('Retention policies updated')}>Save Policies</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function SecuritySection() {
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState('90');

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Users will be logged out after this period of inactivity</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Force Single Session</Label>
                <p className="text-xs text-muted-foreground">Prevent users from logging in on multiple devices</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Session Timeout Warning</Label>
                <p className="text-xs text-muted-foreground">Display warning 2 minutes before timeout</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Security className="w-5 h-5" />
              Password Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Password Length</Label>
              <Input type="number" defaultValue="12" min={8} max={32} />
            </div>
            <div className="space-y-2">
              <Label>Max Failed Login Attempts</Label>
              <Select defaultValue="5">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Multi-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Require MFA for all users</p>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">99.8%</p>
              <p className="text-xs text-muted-foreground mt-1">Uptime (30d)</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1.2s</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Response</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">45</p>
              <p className="text-xs text-muted-foreground mt-1">Active Sessions</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">Errors (24h)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('Security settings saved')}>Save Security Settings</Button>
      </div>
    </>
  );
}

function PDAConfigSection() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const connectedDevices = [
    { id: 'PDA-001', name: 'RF88 - Inspector A', user: 'john.doe', lastSync: '2026-02-26 14:00', status: 'online', battery: 78 },
    { id: 'PDA-002', name: 'RF88 - Inspector B', user: 'jane.smith', lastSync: '2026-02-26 13:45', status: 'online', battery: 54 },
    { id: 'PDA-003', name: 'RF88 - Warehouse', user: 'bob.wilson', lastSync: '2026-02-25 16:30', status: 'offline', battery: 12 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              PDA Sync Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-xs text-muted-foreground">Allow PDA devices to work without network</p>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Sync on Reconnect</Label>
                <p className="text-xs text-muted-foreground">Automatically sync data when device reconnects</p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            <div className="space-y-2">
              <Label>Sync Interval (minutes)</Label>
              <Select defaultValue="5">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Offline Cache Size</Label>
              <Select defaultValue="500">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="100">100 MB</SelectItem>
                  <SelectItem value="500">500 MB</SelectItem>
                  <SelectItem value="1000">1 GB</SelectItem>
                  <SelectItem value="2000">2 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFID Reader Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Read Power (dBm)</Label>
              <Input type="number" defaultValue="25" min={10} max={30} />
            </div>
            <div className="space-y-2">
              <Label>Read Session</Label>
              <Select defaultValue="S1">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                  <SelectItem value="S0">Session 0</SelectItem>
                  <SelectItem value="S1">Session 1</SelectItem>
                  <SelectItem value="S2">Session 2</SelectItem>
                  <SelectItem value="S3">Session 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Sound on Tag Read</Label>
                <p className="text-xs text-muted-foreground">Beep when tag is successfully read</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Vibrate on Tag Read</Label>
                <p className="text-xs text-muted-foreground">Vibrate device on successful read</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Connected PDA Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedDevices.map(device => (
                  <TableRow key={device.id}>
                    <TableCell className="font-['Manrope']">{device.id}</TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.user}</TableCell>
                    <TableCell className="font-['Manrope']">{device.lastSync}</TableCell>
                    <TableCell>
                      <Badge className={device.status === 'online' ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'}>
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-2 rounded-full bg-muted overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${device.battery > 50 ? 'bg-green-500' : device.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${device.battery}%` }}
                          />
                        </div>
                        <span className="text-xs">{device.battery}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Force sync ${device.id}`)}>
                        <Refresh className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('PDA configuration saved')}>Save PDA Settings</Button>
      </div>
    </>
  );
}
