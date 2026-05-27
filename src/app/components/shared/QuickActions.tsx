import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Lock as LockIcon, LockOpen as Unlock, Edit, Delete as Trash2, MoreHoriz as MoreHorizontal, LocationOn as MapPin, CheckCircle, Cancel as XCircle } from '@mui/icons-material';
import { toast } from 'sonner';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive' | 'secondary';
  confirmMessage?: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
  compact?: boolean;
}

export default function QuickActions({ actions, compact = false }: QuickActionsProps) {
  if (compact && actions.length > 2) {
    // Show first 2 actions as buttons, rest in dropdown
    const visibleActions = actions.slice(0, 2);
    const dropdownActions = actions.slice(2);

    return (
      <div className="flex gap-1">
        {visibleActions.map((action) => (
          <QuickActionButton key={action.id} action={action} />
        ))}
        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dropdownActions.map((action) => (
                <DropdownMenuItem key={action.id} onClick={action.onClick}>
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {actions.map((action) => (
        <QuickActionButton key={action.id} action={action} />
      ))}
    </div>
  );
}

function QuickActionButton({ action }: { action: QuickAction }) {
  if (action.confirmMessage) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost">
            <action.icon className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {action.confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={action.onClick}
              className={action.variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : ''}
            >
              {action.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button size="sm" variant="ghost" onClick={action.onClick}>
      <action.icon className="w-4 h-4" />
    </Button>
  );
}

// Predefined quick actions for common use cases
export const createUserQuickActions = (userId: string, userStatus: string) => {
  const actions: QuickAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: () => {
        console.log('Edit user:', userId);
        toast.info('Edit user functionality');
      }
    }
  ];

  if (userStatus === 'active') {
    actions.push({
      id: 'lock',
      label: 'Lock',
      icon: LockIcon,
      variant: 'destructive',
      confirmMessage: 'Are you sure you want to lock this user? They will not be able to log in.',
      onClick: () => {
        console.log('Lock user:', userId);
        toast.success('User has been locked.');
      }
    });
  } else if (userStatus === 'locked') {
    actions.push({
      id: 'unlock',
      label: 'Unlock',
      icon: Unlock,
      onClick: () => {
        console.log('Unlock user:', userId);
        toast.success('User has been unlocked.');
      }
    });
  }

  return actions;
};

export const createAssetQuickActions = (assetId: string, assetStatus: string) => {
  const actions: QuickAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: () => {
        console.log('Edit asset:', assetId);
        toast.info('Edit asset functionality');
      }
    },
    {
      id: 'change-location',
      label: 'Change Location',
      icon: MapPin,
      onClick: () => {
        console.log('Change location for asset:', assetId);
        toast.info('Change location functionality');
      }
    }
  ];

  if (assetStatus === 'active') {
    actions.push({
      id: 'deactivate',
      label: 'Deactivate',
      icon: XCircle,
      confirmMessage: 'Are you sure you want to deactivate this asset?',
      onClick: () => {
        console.log('Deactivate asset:', assetId);
        toast.success('Asset deactivated successfully.');
      }
    });
  } else {
    actions.push({
      id: 'activate',
      label: 'Activate',
      icon: CheckCircle,
      onClick: () => {
        console.log('Activate asset:', assetId);
        toast.success('Asset activated successfully.');
      }
    });
  }

  return actions;
};
