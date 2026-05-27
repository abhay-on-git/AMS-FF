import React, { useState, useCallback } from "react";
import UserManagement from "./UserManagement";
import RoleManagement from "./RoleManagement";
import { Button } from "@/components/ui/button";
import {
  People as Users,
  Security as Shield,
  Add as Plus,
} from "@mui/icons-material";

type SubPage = "users" | "roles";

interface UsersAccessManagementProps {
  onDetailViewChange?: (
    isDetail: boolean,
    detailName?: string,
    detailType?: string,
  ) => void;
}

export default function UsersAccessManagement({
  onDetailViewChange,
}: UsersAccessManagementProps) {
  const [subPage, setSubPage] = useState<SubPage>("users");
  const [detailOpen, setDetailOpen] = useState(false);
  const [createTrigger, setCreateTrigger] = useState(0);

  const subNavItems = [
    { id: "users" as SubPage, label: "Users", icon: Users },
    {
      id: "roles" as SubPage,
      label: "Roles & Permissions",
      icon: Shield,
    },
  ];

  const handleDetailViewChange = useCallback(
    (isDetail: boolean, detailName?: string) => {
      setDetailOpen(isDetail);
      if (onDetailViewChange) {
        onDetailViewChange(isDetail, detailName, subPage);
      }
    },
    [onDetailViewChange, subPage],
  );

  const handleCreate = () => {
    setCreateTrigger((prev) => prev + 1);
  };

  const getCreateButtonLabel = () => {
    switch (subPage) {
      case "users":
        return "Add User";
      case "roles":
        return "Add Role";
    }
  };

  const getPageDescription = () => {
    switch (subPage) {
      case "users":
        return "Manage users and roles";
      case "roles":
        return "Manage user roles and configure access controls";
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      {!detailOpen && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-[4px]">
            {subNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSubPage(item.id)}
                className={`px-4 py-2 rounded-[4px] text-[15px] transition-colors flex items-center gap-2 ${
                  subPage === item.id
                    ? "bg-[#121321] text-white shadow-sm"
                    : "bg-transparent text-[#121321]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
          <Button
            onClick={handleCreate}
            className="text-[15px]"
          >
            {getCreateButtonLabel()}
          </Button>
        </div>
      )}

      {/* Sub Page Content */}
      {subPage === "users" && (
        <UserManagement
          hideListHeader
          createTrigger={createTrigger}
          onDetailViewChange={handleDetailViewChange}
        />
      )}
      {subPage === "roles" && (
        <RoleManagement
          hideListHeader
          createTrigger={createTrigger}
          onDetailViewChange={handleDetailViewChange}
        />
      )}
    </div>
  );
}
