import React, { useState } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Add as Plus, Search, Visibility as Eye, Description as FileText, ReportProblem as AlertTriangle, CheckCircle, Cancel as XCircle, ArrowForward as ArrowRight, Refresh as RotateCcw, ChevronLeft } from '@mui/icons-material';
import { toast } from 'sonner';

interface SurveyRecord {
  id: string;
  surveyCode: string;
  assetCount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected';
  recommendations: {
    dispose: number;
    repair: number;
    retain: number;
    transfer: number;
  };
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

type ViewMode = 'list' | 'detail' | 'create';

export default function Survey() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subView, setSubView] = useState<'all' | 'pending-approvals'>('all');

  const [surveys] = useState<SurveyRecord[]>([
    {
      id: '1',
      surveyCode: 'SRV-2024-001',
      assetCount: 15,
      status: 'pending-approval',
      recommendations: { dispose: 8, repair: 3, retain: 2, transfer: 2 },
      createdBy: 'John Doe',
      createdDate: '2024-12-28'
    },
    {
      id: '2',
      surveyCode: 'SRV-2024-002',
      assetCount: 10,
      status: 'approved',
      recommendations: { dispose: 6, repair: 2, retain: 1, transfer: 1 },
      createdBy: 'Jane Smith',
      createdDate: '2024-12-25',
      approvedBy: 'Manager',
      approvedDate: '2024-12-27'
    },
  ]);

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch = survey.surveyCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    
    if (subView === 'pending-approvals') {
      return matchesSearch && survey.status === 'pending-approval';
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
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

  const handleViewDetail = (survey: SurveyRecord) => {
    setSelectedSurvey(survey);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedSurvey(null);
  };

  if (viewMode === 'detail' && selectedSurvey) {
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
                Survey Requests
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{selectedSurvey.surveyCode}</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedSurvey.surveyCode}</h2>
            <p className="text-sm text-muted-foreground">Asset Survey Details</p>
          </div>
          <Badge className={getStatusColor(selectedSurvey.status)}>
            {selectedSurvey.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Survey Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-2xl font-bold text-red-600">{selectedSurvey.recommendations.dispose}</p>
                    <p className="text-xs text-muted-foreground mt-1">Dispose</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-2xl font-bold text-yellow-600">{selectedSurvey.recommendations.repair}</p>
                    <p className="text-xs text-muted-foreground mt-1">Repair</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-2xl font-bold text-green-600">{selectedSurvey.recommendations.retain}</p>
                    <p className="text-xs text-muted-foreground mt-1">Retain</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-2xl font-bold text-blue-600">{selectedSurvey.recommendations.transfer}</p>
                    <p className="text-xs text-muted-foreground mt-1">Transfer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assets in Survey */}
            <Card>
              <CardHeader>
                <CardTitle>Assets in Survey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Recommendation</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-['Manrope']">LAP-001230</TableCell>
                        <TableCell>Dell Latitude 5410 (Old)</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-500/10 text-red-700">Poor</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-500/10 text-red-700">Dispose</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">Obsolete, beyond repair</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-['Manrope']">PRN-001236</TableCell>
                        <TableCell>Canon ImageRunner</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">Fair</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500/10 text-yellow-700">Repair</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">Needs maintenance</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-['Manrope']">MON-001240</TableCell>
                        <TableCell>Dell U2415 Monitor</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-500/10 text-green-700">Good</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-700">Retain</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">Still functional</TableCell>
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
                {selectedSurvey.status === 'pending-approval' && (
                  <>
                    <Button className="w-full" onClick={() => {
                      toast.success('Survey approved');
                      handleBack();
                    }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Survey
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => {
                      toast.error('Survey rejected');
                      handleBack();
                    }}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Survey
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Pull Back
                    </Button>
                  </>
                )}
                {selectedSurvey.status === 'approved' && selectedSurvey.recommendations.dispose > 0 && (
                  <Button className="w-full" onClick={() => {
                    toast.success('Creating disposal request from survey');
                  }}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Create Disposal Request
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Created By</Label>
                  <p className="font-medium">{selectedSurvey.createdBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created Date</Label>
                  <p>{formatDate(selectedSurvey.createdDate)}</p>
                </div>
                {selectedSurvey.approvedDate && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Approved By</Label>
                      <p className="font-medium">{selectedSurvey.approvedBy}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Approved Date</Label>
                      <p>{formatDate(selectedSurvey.approvedDate)}</p>
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-muted-foreground">Total Assets</Label>
                  <p className="font-medium">{selectedSurvey.assetCount}</p>
                </div>
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
              Survey Requests
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Create Survey</span>
          </div>
          <h2 className="text-2xl font-bold">Create Survey</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Survey Description</Label>
                <Textarea placeholder="Enter survey description and purpose..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Select Assets for Survey</Label>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assets
                </Button>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={handleBack}>Cancel</Button>
                <Button onClick={() => {
                  toast.success('Survey created successfully');
                  handleBack();
                }}>Create Survey</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={subView} onValueChange={(v) => setSubView(v as typeof subView)}>
        <TabsList>
          <TabsTrigger value="all">All Surveys</TabsTrigger>
          <TabsTrigger value="pending-approvals">
            Pending Approvals
            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
              {surveys.filter(s => s.status === 'pending-approval').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button onClick={() => setViewMode('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search survey code..."
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
                  <TableHead>Survey Code</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Recommendations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow key={survey.id} className="cursor-pointer/50">
                    <TableCell className="font-medium font-['Manrope']">{survey.surveyCode}</TableCell>
                    <TableCell>{survey.assetCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 text-xs">
                        <Badge variant="outline" className="bg-red-500/10 text-red-700">
                          D:{survey.recommendations.dispose}
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
                          R:{survey.recommendations.repair}
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-700">
                          K:{survey.recommendations.retain}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(survey.createdDate)}</TableCell>
                    <TableCell>{survey.createdBy}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetail(survey)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSurveys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No surveys found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
