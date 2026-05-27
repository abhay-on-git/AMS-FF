import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Transfers from './requests/Transfers';
import Inspections from './requests/Inspections';
import Survey from './requests/Survey';
import Disposal from './requests/Disposal';

export default function RequestsCases() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('transfers');

  // Mock pending counts for badges
  const pendingCounts = {
    transfers: 3,
    inspections: 5,
    survey: 2,
    disposal: 1,
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="transfers" className="relative">
            Transfers
            {pendingCounts.transfers > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                {pendingCounts.transfers}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="inspections" className="relative">
            Inspections
            {pendingCounts.inspections > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                {pendingCounts.inspections}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="survey" className="relative">
            Survey
            {pendingCounts.survey > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                {pendingCounts.survey}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="disposal" className="relative">
            Disposal
            {pendingCounts.disposal > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                {pendingCounts.disposal}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfers">
          <Transfers />
        </TabsContent>

        <TabsContent value="inspections">
          <Inspections />
        </TabsContent>

        <TabsContent value="survey">
          <Survey />
        </TabsContent>

        <TabsContent value="disposal">
          <Disposal />
        </TabsContent>
      </Tabs>
    </div>
  );
}

