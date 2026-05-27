import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Person as UserIcon, 
  VpnKey as KeyRoundIcon, 
  Logout as LogOutIcon 
} from '@mui/icons-material';
import ChangePasswordDialog from './ChangePasswordDialog';

interface UserProfileMenuProps {
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export default function UserProfileMenu({ onProfileClick, onLogout }: UserProfileMenuProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const currentUser = {
    name: 'Admin User',
    email: 'admin@chorus-ams.com',
    role: 'System Administrator',
    initials: 'AU',
  };

  const handleProfile = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{currentUser.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile}>
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
            <KeyRoundIcon className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </>
  );
}
