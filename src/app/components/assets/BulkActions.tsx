import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Download as DownloadIcon,
  Assignment as AssignIcon,
  SwapHoriz as TransferIcon,
  Edit as EditIcon,
  Close as XIcon,
  ContentPasteSearch as SurveyIcon,
  Delete as DisposalIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onTransfer?: () => void;
  onInspection?: () => void;
  onSurvey?: () => void;
  onDisposal?: () => void;
  onChangeStatus?: () => void;
  userRole?: string;
}

export function BulkActions({ selectedCount, onClearSelection, onTransfer, onInspection, onSurvey, onDisposal, onChangeStatus, userRole = 'admin' }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#121321] text-white rounded-[4px] animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <button onClick={onClearSelection} className="/20 rounded-full p-0.5 transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="h-5 w-px bg-white/30" />
      <div className="flex gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="ghost"
          className="text-white/20 text-xs h-7 gap-1"
          onClick={() => toast.success(`Exporting ${selectedCount} assets...`)}
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          Export Selected
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white/20 text-xs h-7 gap-1"
          onClick={() => onInspection ? onInspection() : toast.info(`Assigning inspection for ${selectedCount} assets`)}
        >
          <AssignIcon className="w-3.5 h-3.5" />
          Assign Inspection
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white/20 text-xs h-7 gap-1"
          onClick={() => onSurvey ? onSurvey() : toast.info(`Initiating survey for ${selectedCount} assets`)}
        >
          <SurveyIcon className="w-3.5 h-3.5" />
          Initiate Survey
        </Button>
        {(userRole === 'admin' || userRole === 'smio') && (
          <Button
            size="sm"
            variant="ghost"
            className="text-white/20 text-xs h-7 gap-1"
            onClick={() => onTransfer ? onTransfer() : toast.info(`Transfer ${selectedCount} assets`)}
          >
            <TransferIcon className="w-3.5 h-3.5" />
            Transfer
          </Button>
        )}
        {userRole === 'admin' && (
          <Button
            size="sm"
            variant="ghost"
            className="text-white/20 text-xs h-7 gap-1"
            onClick={() => onDisposal ? onDisposal() : toast.info(`Initiating disposal for ${selectedCount} assets`)}
          >
            <DisposalIcon className="w-3.5 h-3.5" />
            Dispose
          </Button>
        )}
        {userRole === 'admin' && (
          <Button
            size="sm"
            variant="ghost"
            className="text-white/20 text-xs h-7 gap-1"
            onClick={() => onChangeStatus ? onChangeStatus() : toast.info(`Change status for ${selectedCount} assets`)}
          >
            <EditIcon className="w-3.5 h-3.5" />
            Change Status
          </Button>
        )}
      </div>
    </div>
  );
}
