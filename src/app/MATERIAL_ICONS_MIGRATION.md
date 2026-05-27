# Material Icons Migration Guide

This document tracks the migration from `lucide-react` to `@mui/icons-material` for all icons in the RFID Asset Management System.

## ✅ Completed Files

### Core Layout & Navigation
- [x] `/components/Layout.tsx` - Main layout with sidebar navigation
- [x] `/components/Dashboard.tsx` - Dashboard page
- [x] `/components/NotificationBell.tsx` - Notification dropdown
- [x] `/components/UserProfileMenu.tsx` - User profile menu
- [x] `/components/Categories.tsx` - Categories management page

## 📋 Icon Mapping Reference

### Navigation & UI Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Menu` | `Menu` | `Menu` |
| `ArrowLeft` | `ArrowBack` | `ArrowBack` |
| `ArrowRight` | `ArrowForward` | `ArrowForward` |
| `ArrowRightLeft` | `SwapHoriz` | `SwapHoriz` |
| `ChevronDown` | `ExpandMore` | `ExpandMore` |
| `ChevronLeft` | `ChevronLeft` | `ChevronLeft` |
| `MoreHorizontal` | `MoreHoriz` | `MoreHoriz` |

### Action Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Plus` | `Add` | `Add` |
| `Search` | `Search` | `Search` |
| `Edit` | `Edit` | `Edit` |
| `Trash2` | `Delete` | `Delete` |
| `Download` | `Download` | `Download` |
| `Upload` | `Upload` | `Upload` |
| `Save` | `Save` | `Save` |
| `X` | `Close` | `Close` |
| `Eye` | `Visibility` | `Visibility` |
| `EyeOff` | `VisibilityOff` | `VisibilityOff` |
| `Scan` | `QrCodeScanner` | `QrCodeScanner` |
| `Send` | `Send` | `Send` |
| `RotateCcw` | `Refresh` | `Refresh` |
| `RefreshCw` | `Refresh` | `Refresh` |
| `Filter` | `FilterList` | `FilterList` |

### Status & State Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `CheckCircle` | `CheckCircle` | `CheckCircle` |
| `CheckCircle2` | `CheckCircle` | `CheckCircle` |
| `Check` | `Check` | `Check` |
| `XCircle` | `Cancel` | `Cancel` |
| `AlertCircle` | `Warning` | `Warning` |
| `AlertTriangle` | `ErrorOutline` | `ErrorOutline` |
| `Info` | `Info` | `Info` |
| `HelpCircle` | `HelpOutline` | `HelpOutline` |
| `Clock` | `Schedule` | `Schedule` |

### Business Object Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Package` | `Inventory2` | `Inventory2` |
| `FileText` | `Description` | `Description` |
| `MapPin` | `LocationOn` | `LocationOn` |
| `Building` | `Business` | `Business` |
| `Building2` | `Business` | `Business` |
| `Database` | `Storage` | `Storage` |
| `FolderTree` | `Folder` | `Folder` |

### People & Access Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `User` | `Person` | `Person` |
| `Users` | `People` | `People` |
| `Shield` | `Security` | `Security` |
| `Lock` | `Lock` | `Lock` |
| `Unlock` | `LockOpen` | `LockOpen` |
| `Key` | `VpnKey` | `VpnKey` |
| `KeyRound` | `VpnKey` | `VpnKey` |
| `LogOut` | `Logout` | `Logout` |
| `Mail` | `Email` | `Email` |

### Technology Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Smartphone` | `Smartphone` | `Smartphone` |
| `Monitor` | `Computer` | `Computer` |
| `Radio` | `Router` | `Router` |
| `Radar` | `Radar` | `Radar` |
| `Wifi` | `Wifi` | `Wifi` |
| `WifiOff` | `WifiOff` | `WifiOff` |
| `Signal` | `SignalCellularAlt` | `SignalCellularAlt` |
| `Activity` | `ShowChart` | `ShowChart` |

### Settings & Controls
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Settings` | `Settings` | `Settings` |
| `Globe` | `Language` | `Language` |
| `Sun` | `LightMode` | `LightMode` |
| `Moon` | `DarkMode` | `DarkMode` |
| `Volume2` | `VolumeUp` | `VolumeUp` |
| `Vibrate` | `Vibration` | `Vibration` |
| `Zap` | `Bolt` | `Bolt` |

### Charts & Analytics
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `BarChart3` | `BarChart` | `BarChart` |
| `TrendingUp` | `TrendingUp` | `TrendingUp` |
| `Activity` | `ShowChart` | `ShowChart` |

### Media & Content
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `Play` | `PlayArrow` | `PlayArrow` |
| `Pause` | `Pause` | `Pause` |
| `BookOpen` | `MenuBook` | `MenuBook` |
| `Calendar` | `Event` | `Event` |
| `Bell` | `Notifications` | `Notifications` |

### Special Icons
| Lucide React | Material Icons | Import Name |
|--------------|----------------|-------------|
| `History` | `History` | `History` |
| `Target` | `GpsFixed` | `GpsFixed` |
| `ClipboardCheck` | `AssignmentTurnedIn` | `AssignmentTurnedIn` |

## 🔄 Files Requiring Icon Updates

### Master Data Components
- [ ] `/components/Assets.tsx` - Large file with many icons
- [ ] `/components/Locations.tsx`
- [ ] `/components/Warehouses.tsx`

### Transaction Components
- [ ] `/components/RequestsCases.tsx`
- [ ] `/components/requests/Transfers.tsx`
- [ ] `/components/requests/Inspections.tsx`
- [ ] `/components/requests/Survey.tsx`
- [ ] `/components/requests/Disposal.tsx`
- [ ] `/components/InventorySheets.tsx`
- [ ] `/components/FindExtra.tsx`

### System Admin Components
- [ ] `/components/UsersAccessManagement.tsx`
- [ ] `/components/UserManagement.tsx`
- [ ] `/components/FieldOffices.tsx`
- [ ] `/components/RoleManagement.tsx`
- [ ] `/components/Integrations.tsx`
- [ ] `/components/RFIDSettings.tsx`
- [ ] `/components/NotificationCenter.tsx`

### Reporting Components
- [ ] `/components/ReportingAnalytics.tsx`

### Help Components
- [ ] `/components/Help.tsx`

### Mobile Components
- [ ] `/components/mobile/LoginScreen.tsx`
- [ ] `/components/mobile/HomeScreen.tsx`
- [ ] `/components/mobile/AssetRegistrationScreen.tsx`
- [ ] `/components/mobile/InventoryScreen.tsx`
- [ ] `/components/mobile/LookupScreen.tsx`
- [ ] `/components/mobile/MobileSettingsScreen.tsx`
- [ ] `/components/mobile/MobileHelpScreen.tsx`
- [ ] `/components/mobile/StatusCard.tsx`
- [ ] `/components/mobile/WorkflowSection.tsx`
- [ ] `/components/mobile/TroubleshootingItem.tsx`

### Shared Components
- [ ] `/components/shared/DetailPageLayout.tsx`
- [ ] `/components/shared/QuickActions.tsx`

## 📝 Import Pattern

### Before (Lucide React):
```tsx
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
```

### After (Material Icons):
```tsx
import { 
  Add as PlusIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as Trash2Icon 
} from '@mui/icons-material';
```

### Usage in JSX:
```tsx
// Before
<Plus className="w-4 h-4" />

// After
<PlusIcon className="w-4 h-4" />
```

## 🎨 Styling Notes

Material Icons work seamlessly with Tailwind CSS sizing classes:
- `w-4 h-4` → 16px icons (small)
- `w-5 h-5` → 20px icons (medium)
- `w-6 h-6` → 24px icons (default Material size)
- `w-8 h-8` → 32px icons (large)

Color classes work the same way:
- `text-blue-600`
- `text-green-600`
- `text-red-600`
- etc.

## ✅ Verification Checklist

After migrating a file:
- [ ] Remove `lucide-react` import
- [ ] Add `@mui/icons-material` imports with aliases
- [ ] Update all icon references in JSX (append `Icon` suffix)
- [ ] Test that all icons render correctly
- [ ] Check that icon sizes and colors are preserved
- [ ] Verify dark mode compatibility

## 🚀 Next Steps

1. Continue updating remaining component files
2. Remove `lucide-react` from package.json when all files are migrated
3. Add `@mui/icons-material` to package.json dependencies
4. Test the entire application for any missing icons
5. Update any documentation or style guides

## 📦 Package Dependencies

### Add:
```json
{
  "@mui/icons-material": "^5.15.0"
}
```

### Remove (after migration complete):
```json
{
  "lucide-react": "..."
}
```
