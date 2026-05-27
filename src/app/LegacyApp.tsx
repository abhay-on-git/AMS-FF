import { useState, useEffect, useMemo } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthScreen from "./components/AuthScreen";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Categories from "./components/Categories";
import Assets from "./components/Assets";
import Locations from "./components/Locations";
import ReportingAnalytics from "./components/ReportingAnalytics";
import UsersAccessManagement from "./components/UsersAccessManagement";
import NotificationCenter from "./components/NotificationCenter";
import RFIDSettings from "./components/RFIDSettings";
import ActionLog from "./components/ActionLog";
import PendingActionDetail from "./components/PendingActionDetail";
import ComplianceGapDetail from "./components/ComplianceGapDetail";
import ProfilePage from "./components/ProfilePage";
import { Toaster } from "@/components/ui/sonner";

type PageType =
  | "dashboard"
  | "categories"
  | "assets"
  | "locations"
  | "reporting"
  | "users"
  | "notifications"
  | "action-log"
  | "rfid-settings"
  | "pending-action-detail"
  | "compliance-gap-detail"
  | "profile";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] =
    useState<PageType>("dashboard");
  const [pendingActionId, setPendingActionId] =
    useState<string>("");
  const [complianceGapType, setComplianceGapType] =
    useState<string>("");
  const [userDetailName, setUserDetailName] =
    useState<string>("");
  const [userDetailType, setUserDetailType] =
    useState<string>("");
  const [initialAssetId, setInitialAssetId] =
    useState<string>("");

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
    if (page !== "users") {
      setUserDetailName("");
      setUserDetailType("");
    }
  };

  const handleUserDetailViewChange = (
    isDetail: boolean,
    detailName?: string,
    detailType?: string,
  ) => {
    if (isDetail && detailName) {
      setUserDetailName(detailName);
      setUserDetailType(detailType || "");
    } else {
      setUserDetailName("");
      setUserDetailType("");
    }
  };

  const getCurrentPageComponent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "categories":
        return <Categories />;
      case "assets":
        return <Assets initialAssetId={initialAssetId} />;
      case "locations":
        return <Locations />;
      case "reporting":
        return (
          <ReportingAnalytics
            onNavigateToPendingAction={(actionId: string) => {
              setPendingActionId(actionId);
              setCurrentPage("pending-action-detail");
            }}
            onNavigateToComplianceGap={(gapType: string) => {
              setComplianceGapType(gapType);
              setCurrentPage("compliance-gap-detail");
            }}
          />
        );
      case "users":
        return (
          <UsersAccessManagement
            onDetailViewChange={handleUserDetailViewChange}
          />
        );
      case "notifications":
        return <NotificationCenter />;
      case "action-log":
        return <ActionLog />;
      case "rfid-settings":
        return <RFIDSettings />;
      case "pending-action-detail":
        return (
          <PendingActionDetail
            actionId={pendingActionId}
            onBack={() => setCurrentPage("reporting")}
          />
        );
      case "compliance-gap-detail":
        return (
          <ComplianceGapDetail
            gapType={complianceGapType}
            onBack={() => setCurrentPage("reporting")}
          />
        );
      case "profile":
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  // ✅ FIX: pageMetadata is defined directly in useMemo with currentPage
  // as the dependency — no wrapper function, no stale closure possible.
  const pageMetadata = useMemo(() => {
    const metadataMap: Record<
      PageType,
      { title: string; description: string }
    > = {
      dashboard: {
        title: "Dashboard",
        description: "Overview of your asset management system",
      },
      categories: {
        title: "Categories",
        description:
          "Manage asset categories and classifications",
      },
      assets: {
        title: "Asset Management",
        description:
          "Track and manage all organizational assets",
      },
      locations: {
        title: "Locations",
        description: "Manage office locations and hierarchies",
      },
      reporting: {
        title: "Reporting & Analytics",
        description:
          "View insights and analytics for your assets",
      },
      users: {
        title: "User Management",
        description: "Manage users, roles, and permissions",
      },
      notifications: {
        title: "Notifications",
        description: "View and manage your notifications",
      },
      "action-log": {
        title: "Action Log",
        description: "Track all system activities and changes",
      },
      "rfid-settings": {
        title: "Inspections & PDA",
        description: "Configure RFID and inspection settings",
      },
      "pending-action-detail": {
        title: "Pending Action Detail",
        description: "View details of pending actions",
      },
      "compliance-gap-detail": {
        title: "Compliance Gap Detail",
        description: "Review compliance gap information",
      },
      profile: {
        title: "My Profile",
        description:
          "Manage your account settings and preferences",
      },
    };
    return (
      metadataMap[currentPage] || {
        title: "Asset Management App",
        description: "",
      }
    );
  }, [currentPage]);

  const getBreadcrumbs = () => {
    const breadcrumbMap = {
      dashboard: [{ label: "Dashboard" }],
      categories: [{ label: "Categories" }],
      assets: [{ label: "Assets" }],
      locations: [{ label: "Locations" }],
      reporting: [{ label: "Reporting & Analytics" }],
      users: userDetailName
        ? [
            { label: "User Management", href: "#users" },
            { label: userDetailName },
          ]
        : [{ label: "User Management" }],
      notifications: [{ label: "Notifications" }],
      "action-log": [{ label: "Action Log" }],
      "rfid-settings": [{ label: "Inspections & PDA" }],
      "pending-action-detail": [
        { label: "Reporting & Analytics", href: "#reporting" },
        { label: "Pending Action Detail" },
      ],
      "compliance-gap-detail": [
        { label: "Reporting & Analytics", href: "#reporting" },
        { label: "Compliance Gap Detail" },
      ],
      profile: [{ label: "My Profile" }],
    };
    return breadcrumbMap[currentPage] || [];
  };

  // ✅ FIX: removed `page !== currentPage` guard so navigation always
  // updates state, and dependency is only [isAuthenticated].
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const [page, queryString] = hash.split("?");

      if (page) {
        setCurrentPage(page as PageType);
        if (page !== "users") {
          setUserDetailName("");
          setUserDetailType("");
        }
      }

      if (queryString) {
        const params = new URLSearchParams(queryString);
        const assetId = params.get("assetId");
        if (assetId && page === "assets") {
          setInitialAssetId(assetId);
        }
      } else if (page !== "assets") {
        setInitialAssetId("");
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () =>
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
  }, [isAuthenticated]);

  // ── Auth Gate ──
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AuthScreen
            onAuthenticated={() => {
              setIsAuthenticated(true);
              window.location.hash = "dashboard";
            }}
          />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <Layout
            currentPage={currentPage}
            breadcrumbs={getBreadcrumbs()}
            onNavigate={handleNavigation}
            onLogout={() => {
              setIsAuthenticated(false);
              setCurrentPage("dashboard");
              window.location.hash = "";
            }}
            pageTitle={pageMetadata.title}
            pageDescription={pageMetadata.description}
          >
            {getCurrentPageComponent()}
          </Layout>
          <Toaster />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}