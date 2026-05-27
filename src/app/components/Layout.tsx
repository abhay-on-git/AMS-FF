import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ChangePasswordDialog from "./ChangePasswordDialog";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  BarChartOutlined as BarChartIcon,
  Inventory2Outlined as PackageIcon,
  LocationOnOutlined as MapPinIcon,
  DescriptionOutlined as FileTextIcon,
  PeopleOutlined as UsersIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon,
  Menu as MenuIcon,
  FolderOutlined as FolderTreeIcon,
  PersonOutlined as UserIcon,
  Logout as LogOutIcon,
  MoreHoriz as MoreHorizIcon,
  NotificationsOutlined as BellIcon,
  ChevronLeft,
  ChevronRight,
  DashboardOutlined as DashboardIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  VpnKey as KeyIcon,
  Language as GlobeIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import chorusLogo from "../../assets/c41ddd9636ba0cf84d17b65494aee06fd1254e8a.png";
import chorusIcon from "../../assets/Chorus_Orange_Icon.png";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  breadcrumbs?: { label: string; href?: string }[];
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  pageTitle?: string;
  pageDescription?: string;
}

const SIDEBAR_BG = "#121321";
const SIDEBAR_BORDER = "#353750";
const ACTIVE_BG = "#1A1B2E";
const TEXT_INACTIVE = "#989AAE";
const TEXT_ACTIVE = "#dcdde5";

export default function Layout({
  children,
  currentPage,
  breadcrumbs = [],
  onNavigate,
  onLogout,
  pageTitle,
  pageDescription,
}: LayoutProps) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [changePasswordOpen, setChangePasswordOpen] =
    useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] =
    useState(false);
  const [selectedSearchModule, setSelectedSearchModule] =
    useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] =
    useState("Assets");
  // ✅ track whether entity dropdown is open for active state
  const [entityDropdownOpen, setEntityDropdownOpen] =
    useState(false);

  const currentUser = {
    name: "Admin User",
    email: "admin@chorus.com",
    role: "Admin",
    initials: "C",
    org: "Organization",
    username: "Chorus",
  };

  const mainNavItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: DashboardIcon,
      href: "#dashboard",
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderTreeIcon,
      href: "#categories",
    },
    {
      id: "assets",
      label: "Asset Management",
      icon: PackageIcon,
      href: "#assets",
    },
    {
      id: "locations",
      label: "Locations",
      icon: MapPinIcon,
      href: "#locations",
    },
    {
      id: "reporting",
      label: "Reports",
      icon: BarChartIcon,
      href: "#reporting",
    },
    {
      id: "users",
      label: t("nav.users"),
      icon: UsersIcon,
      href: "#users",
    },
    {
      id: "action-log",
      label: t("nav.actionLog"),
      icon: FileTextIcon,
      href: "#action-log",
    },
  ];

  const bottomNavItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      href: "#notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
      href: "#profile",
    },
  ];

  const pageLabels: Record<string, string> = {
    dashboard: "Dashboard",
    categories: "Categories",
    assets: "All Assets",
    locations: "Locations",
    reporting: "Reporting & Analytics",
    users: "User Management",
    "action-log": "Action Log",
    roles: "Role Management",
    profile: "Profile",
    notifications: "Notifications",
  };

  const searchModules = [
    { id: "all", label: "All Modules", icon: null },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderTreeIcon,
    },
    { id: "assets", label: "Assets", icon: PackageIcon },
    { id: "locations", label: "Locations", icon: MapPinIcon },
    { id: "reporting", label: "Reporting", icon: BarChartIcon },
    { id: "users", label: "Users", icon: UsersIcon },
    {
      id: "action-log",
      label: "Action Log",
      icon: FileTextIcon,
    },
  ];

  // ✅ updated entity options
  const entityOptions = [
    "Assets",
    "Categories",
    "Users",
    "Locations",
    "Reports",
  ];

  const mockAssets = [
    {
      id: "LAP-001234",
      name: "Dell Latitude 5520",
      category: "IT Equipment",
      location: "Office Floor 1",
    },
    {
      id: "DES-001235",
      name: "HP EliteDesk 800",
      category: "IT Equipment",
      location: "Office A1-02",
    },
    {
      id: "PRN-001236",
      name: "Canon ImageRunner",
      category: "Office Equipment",
      location: "Office Floor 1",
    },
    {
      id: "MON-001237",
      name: 'Dell U2720Q 27"',
      category: "IT Equipment",
      location: "Office A1-03",
    },
    {
      id: "SRV-001238",
      name: "HP ProLiant DL380",
      category: "IT Equipment",
      location: "Server Room B2",
    },
    {
      id: "FUR-001239",
      name: "Herman Miller Aeron Chair",
      category: "Office Furniture",
      location: "Office A1-05",
    },
    {
      id: "NET-001240",
      name: "Cisco Catalyst 9300",
      category: "IT Equipment",
      location: "Server Room B2",
    },
    {
      id: "LAP-001241",
      name: "Lenovo ThinkPad T14",
      category: "IT Equipment",
      location: "Office Floor 2",
    },
  ];

  const filteredModules = searchModules.filter((module) => {
    if (
      selectedSearchModule !== "all" &&
      module.id !== selectedSearchModule &&
      module.id !== "all"
    ) {
      return false;
    }
    if (!searchQuery) return false;
    return module.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const filteredAssets = mockAssets
    .filter((asset) => {
      if (!searchQuery) return false;
      const query = searchQuery.toLowerCase();
      return (
        asset.id.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query) ||
        asset.location.toLowerCase().includes(query)
      );
    })
    .slice(0, 5);

  const hasResults =
    filteredModules.length > 0 || filteredAssets.length > 0;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          const searchInput =
            document.getElementById("global-search");
          searchInput?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const NavItem = ({
    item,
  }: {
    item: (typeof mainNavItems)[0];
  }) => {
    const isActive = currentPage === item.id;
    return (
      <a
        href={item.href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "12px 0" : "12px",
          height: 48,
          backgroundColor: isActive ? "#2b2d46" : "transparent",
          color: TEXT_ACTIVE,
          fontSize: 16,
          fontFamily: "Manrope",
          fontWeight: 500,
          textDecoration: "none",
          borderRadius: 6,
          transition: "all 0.15s",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          (
            e.currentTarget as HTMLElement
          ).style.backgroundColor = "#2b2d46";
        }}
        onMouseLeave={(e) => {
          (
            e.currentTarget as HTMLElement
          ).style.backgroundColor = isActive
            ? "#2b2d46"
            : "transparent";
        }}
        title={collapsed ? item.label : undefined}
      >
        <item.icon
          style={{
            fontSize: 24,
            color: isActive ? TEXT_ACTIVE : TEXT_INACTIVE,
            flexShrink: 0,
          }}
        />
        {!collapsed && <span>{item.label}</span>}
      </a>
    );
  };

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: SIDEBAR_BG,
        overflow: "visible",
      }}
    >
      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed
            ? "center"
            : "space-between",
          height: 64,
          padding: collapsed
            ? "56px 0 32px 0"
            : "56px 18px 32px 18px",
          flexShrink: 0,
          position: "relative",
          overflow: "visible",
        }}
      >
        {!collapsed ? (
          <img
            src={chorusLogo}
            alt="Chorus"
            style={{ height: 48, width: "auto" }}
          />
        ) : (
          <img
            src={chorusIcon}
            alt="Chorus"
            style={{ height: 48, width: "auto" }}
          />
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              borderRadius: 12,
              color: TEXT_INACTIVE,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "16px",
            }}
          >
            <ChevronLeft style={{ fontSize: 18 }} />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLElement
              ).style.backgroundColor = "#2b2d46";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLElement
              ).style.backgroundColor = SIDEBAR_BG;
            }}
            style={{
              width: 32,
              height: 32,
              background: SIDEBAR_BG,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: "70%",
              transform: "translate(50%, -50%)",
              zIndex: 10000,
              transition: "background-color 0.15s",
              color: TEXT_INACTIVE,
            }}
          >
            <ChevronRight style={{ fontSize: 18 }} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "18px 8px" : "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {mainNavItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div
        style={{
          padding: collapsed ? "6px" : "20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {bottomNavItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${SIDEBAR_BORDER}`,
          padding: collapsed ? "10px" : "10px 18px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: collapsed ? "14px 10px" : "14px 10px",
                borderRadius: 6,
                justifyContent: collapsed
                  ? "center"
                  : "flex-start",
                transition: "background-color 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.backgroundColor = "#2b2d46";
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.backgroundColor = "transparent";
              }}
            >
              {collapsed ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#2d3150",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 600,
                      color: TEXT_ACTIVE,
                      flexShrink: 0,
                      marginRight: 2,
                    }}
                  >
                    {currentUser.initials}
                  </div>
                  <MoreHorizIcon
                    style={{
                      fontSize: 20,
                      color: TEXT_INACTIVE,
                      flexShrink: 0,
                      transform: "rotate(90deg)",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#2d3150",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 600,
                      color: TEXT_ACTIVE,
                      flexShrink: 0,
                      marginRight: 2,
                    }}
                  >
                    {currentUser.initials}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: "left",
                    }}
                  >
                    <p
                      style={{
                        color: TEXT_INACTIVE,
                        fontSize: 12,
                        margin: 0,
                        lineHeight: 1.5,
                        fontWeight: 350,
                      }}
                    >
                      {currentUser.org}
                    </p>
                    <p
                      style={{
                        color: TEXT_ACTIVE,
                        fontSize: 14,
                        margin: 0,
                        lineHeight: 1.3,
                        fontWeight: 400,
                      }}
                    >
                      {currentUser.username}
                    </p>
                  </div>
                  <MoreHorizIcon
                    style={{
                      fontSize: 21,
                      color: TEXT_INACTIVE,
                      flexShrink: 0,
                      transform: "rotate(90deg)",
                    }}
                  />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-72 p-0 bg-[#121321] border-[#4B5168]"
            style={{ zIndex: 99999 }}
          >
            <div className="px-5 py-5 border-b border-[#4B5168]">
              <p className="font-['Manrope'] text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                ACCOUNT
              </p>
              <p className="font-['Manrope'] text-md text-white">
                {currentUser.email}
              </p>
            </div>

            <div className="px-5 py-4 border-b border-[#4B5168]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-5 h-5 text-[#60A5FA]" />
                  <span className="font-['Manrope'] text-sm font-semibold text-[#9CA3AF] uppercase tracking-wide">
                    LANGUAGE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#374151] rounded">
                  <span className="font-['Manrope'] text-sm text-white">
                    English
                  </span>
                </div>
              </div>
            </div>

            <div
              className="p-3"
              onMouseEnter={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.backgroundColor = "#374151";
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.backgroundColor = "transparent";
              }}
            >
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded text-left transition-colors"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                }}
              >
                <LogOutIcon className="w-4 h-4" />
                Log out
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: collapsed ? 110 : 280,
          flexShrink: 0,
          transition: "width 0.2s ease",
          backgroundColor: SIDEBAR_BG,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "visible",
          zIndex: 9999,
        }}
        className="hidden md:flex"
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : -280,
          width: 280,
          height: "100vh",
          zIndex: 50,
          transition: "left 0.2s ease",
          backgroundColor: SIDEBAR_BG,
        }}
        className="flex flex-col md:hidden"
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          minWidth: 0,
          padding: "10px 8px 8px 0",
          backgroundColor: SIDEBAR_BG,
          overflow: "visible",
          maxHeight: "100vh",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            maxHeight: "98vh",
            backgroundColor: "#f7f7f8",
            borderRadius: 10,
            overflow: "hidden",
            padding: "0 1rem",
            boxShadow:
              "0px 4px 12px rgba(10, 18, 28, 0.06), 0px 1px 4px rgba(10, 18, 28, 0.04)",
          }}
        >
          {/* Header */}
          <header
            className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60"
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <div className="flex items-center justify-between px-6 py-8 bg-[#f7f7f8]">
              <button
                className="md:hidden p-1 rounded"
                onClick={() => setMobileOpen((o) => !o)}
              >
                <MenuIcon className="w-5 h-5" />
              </button>

              {/* Page title and description */}
              <div className="flex-1">
                <h1 className="text-[30px]">
                  {pageTitle || "Asset Management App"}
                </h1>
                {pageDescription && (
                  <p className="text-[16px] text-muted-foreground mt-1">
                    {pageDescription}
                  </p>
                )}
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden md:flex relative">
                  {/* Main pill container */}
                  <div
                    className="relative flex items-center w-[444px] h-14 rounded-full border border-[#F1F1F3] bg-white transition-all duration-200"
                    style={{
                      boxShadow:
                        "0 12px 20px -2px rgba(32,34,57,0.04), 0 6px 8px -4px rgba(32,34,57,0.02)",
                      overflow: "visible",
                    }}
                  >
                    {/* Search input section */}
                    <div
                      className="relative h-15 flex items-center"
                      style={{
                        flex: 1,
                        minWidth: 203,
                        borderRadius: "9999px 0 0 9999px",
                        overflow: "hidden",
                      }}
                    >
                      <SearchIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 transition-colors"
                        style={{
                          color: isSearchFocused
                            ? "#989AAE"
                            : "#AFB1C0",
                        }}
                      />

                      <input
                        id="global-search"
                        type="text"
                        placeholder={`Search ${selectedEntity.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSearchDropdownOpen(
                            e.target.value.length > 0,
                          );
                          setIsSearchLoading(
                            e.target.value.length > 0,
                          );
                          setTimeout(
                            () => setIsSearchLoading(false),
                            500,
                          );
                        }}
                        onFocus={() => {
                          setIsSearchFocused(true);
                          if (searchQuery)
                            setSearchDropdownOpen(true);
                        }}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full h-15 pl-[46px] pr-9 font-['Sora'] text-md text-[#353750] placeholder:text-[#AFB1C0] bg-transparent border-none outline-none"
                        style={{
                          caretColor: "#8789A1",
                          fontWeight: 350,
                        }}
                      />

                      {/* Clear button — shown when there's text and not loading */}
                      {searchQuery && !isSearchLoading && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSearchDropdownOpen(false);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F1F3] hover:bg-[#E9E9EC] transition-colors"
                        >
                          <CloseIcon
                            style={{
                              fontSize: 15,
                              color: "#353750",
                            }}
                          />
                        </button>
                      )}

                      {/* Loading spinner */}
                      {isSearchLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CircularProgress
                            size={14}
                            thickness={5}
                            style={{ color: "#3395A7" }}
                          />
                        </div>
                      )}

                      {/* ✅ "/" hint — only hides when user has typed something, NOT on focus */}
                      {!searchQuery && (
                        <div
                          className="absolute right-[14px] top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded bg-[#F1F1F3] font-['Sora'] text-md text-[#767893]"
                          title="Use '/' key to trigger search"
                        >
                          /
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        width: 1,
                        height: 24,
                        backgroundColor: "#F1F1F3",
                        flexShrink: 0,
                      }}
                    />

                    {/* ✅ Entity selector — active state matches hover color (#B8E3E9) */}
                    <DropdownMenu
                      onOpenChange={(open) =>
                        setEntityDropdownOpen(open)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex border border-[#F1F1F3] cursor-pointer items-center gap-1 px-4 h-14 w-[110px] font-['Sora'] text-md font-medium text-[#475569] rounded-r-full transition-colors outline-none"
                          style={{
                            backgroundColor: entityDropdownOpen
                              ? "#f1f1f3"
                              : "white",
                          }}
                        >
                          <span className="flex-1 text-left truncate">
                            {selectedEntity}
                          </span>
                          <ExpandMoreIcon
                            className="w-5 h-5 flex-shrink-0"
                            style={{
                              color: "#475569",
                              transition: "transform 0.2s",
                              transform: entityDropdownOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[136px] rounded-lg border border-[#F1F1F3] bg-white"
                        style={{
                          padding: "6px 9px",
                          zIndex: 200,
                          boxShadow:
                            "0px 12px 20px -2px rgba(32,34,57,0.04), 0px 6px 8px -4px rgba(32,34,57,0.02)",
                        }}
                      >
                        {entityOptions.map((entity) => (
                          <DropdownMenuItem
                            key={entity}
                            onClick={() =>
                              setSelectedEntity(entity)
                            }
                            className="flex items-center justify-between rounded-md cursor-pointer font-['Manrope'] text-md font-medium text-[#353750] outline-none"
                            style={{ padding: "8px 10px" }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.backgroundColor =
                                "#F1F1F3";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <span>{entity}</span>
                            {selectedEntity === entity && (
                              <CheckIcon
                                style={{
                                  fontSize: 18,
                                  color: "#2D798D",
                                }}
                              />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Search results dropdown */}
                    {searchDropdownOpen && hasResults && (
                      <>
                        <div
                          className="fixed inset-0 z-[110]"
                          onClick={() =>
                            setSearchDropdownOpen(false)
                          }
                        />
                        <div
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#F1F1F3] z-[120] max-h-[336px] overflow-y-auto"
                          style={{
                            boxShadow:
                              "0 12px 20px -2px rgba(32,34,57,0.04), 0 6px 8px -4px rgba(32,34,57,0.02)",
                            scrollbarWidth: "thin",
                            scrollbarColor:
                              "#E9E9EC transparent",
                          }}
                        >
                          {filteredAssets.length > 0 && (
                            <div>
                              {filteredModules.length > 0 && (
                                <div className="h-px bg-[#F1F1F3] my-2" />
                              )}
                              <p className="px-3 py-1.5 text-[10px] font-['Manrope'] font-semibold text-[#767893] uppercase tracking-wider">
                                Assets
                              </p>
                              {filteredAssets.map((asset) => (
                                <a
                                  key={asset.id}
                                  href={`#assets?assetId=${asset.id}`}
                                  onClick={() => {
                                    setSearchDropdownOpen(
                                      false,
                                    );
                                    setSearchQuery("");
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#F1F1F3] transition-colors text-left"
                                >
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-[#81CCD7]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-['Manrope'] text-sm font-medium text-[#353750]">
                                      {asset.id} - {asset.name}
                                    </p>
                                    <p className="font-['Manrope'] text-xs text-[#989AAE]">
                                      {asset.category} •{" "}
                                      {asset.location}
                                    </p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <LanguageSwitcher />
              </div>
            </div>
          </header>

          {/* Content */}
          <main
            className="flex-1 p-4 min-w-0 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {children}
          </main>
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
}
