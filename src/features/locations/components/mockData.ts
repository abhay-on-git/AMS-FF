// ── Mock Data for Locations Module ──

import { FieldOfficeConfig, LocationType, LocationNode, FieldOfficeSummary } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// FIELD OFFICE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const mockFieldOffices: FieldOfficeConfig[] = [
  {
    id: '1',
    code: 'FO-LV',
    name: 'Las Vegas Office',
    location: 'Las Vegas, Nevada',
    isActive: true,
    rootLocationId: 'loc-lv-001',
    locationTypes: [
      { id: 'type-lv-1', fieldOfficeId: '1', name: 'Site', icon: 'Business', level: 0, parentTypeId: null, isActive: true },
      { id: 'type-lv-2', fieldOfficeId: '1', name: 'Building', icon: 'Apartment', level: 1, parentTypeId: 'type-lv-1', isActive: true },
      { id: 'type-lv-3', fieldOfficeId: '1', name: 'Floor', icon: 'Layers', level: 2, parentTypeId: 'type-lv-2', isActive: true },
      { id: 'type-lv-4', fieldOfficeId: '1', name: 'Room', icon: 'MeetingRoom', level: 3, parentTypeId: 'type-lv-3', isActive: true },
    ],
  },
  {
    id: '2',
    code: 'FO-BLD',
    name: 'Boulder Office',
    location: 'Boulder, Colorado',
    isActive: true,
    rootLocationId: 'loc-bld-001',
    locationTypes: [
      { id: 'type-bld-1', fieldOfficeId: '2', name: 'Campus', icon: 'Public', level: 0, parentTypeId: null, isActive: true },
      { id: 'type-bld-2', fieldOfficeId: '2', name: 'Building', icon: 'Place', level: 1, parentTypeId: 'type-bld-1', isActive: true },
      { id: 'type-bld-3', fieldOfficeId: '2', name: 'Floor', icon: 'Store', level: 2, parentTypeId: 'type-bld-2', isActive: true },
      { id: 'type-bld-4', fieldOfficeId: '2', name: 'Room', icon: 'Storage', level: 3, parentTypeId: 'type-bld-3', isActive: true },
    ],
  },
  {
    id: '3',
    code: 'FO-MTV',
    name: 'Mountain View Office',
    location: 'Mountain View, California',
    isActive: true,
    rootLocationId: 'loc-mtv-001',
    locationTypes: [
      { id: 'type-mtv-1', fieldOfficeId: '3', name: 'Building', icon: 'Apartment', level: 0, parentTypeId: null, isActive: true },
      { id: 'type-mtv-2', fieldOfficeId: '3', name: 'Floor', icon: 'Layers', level: 1, parentTypeId: 'type-mtv-1', isActive: true },
      { id: 'type-mtv-3', fieldOfficeId: '3', name: 'Wing', icon: 'Category', level: 2, parentTypeId: 'type-mtv-2', isActive: true },
      { id: 'type-mtv-4', fieldOfficeId: '3', name: 'Room', icon: 'MeetingRoom', level: 3, parentTypeId: 'type-mtv-3', isActive: true },
    ],
  },
  {
    id: '4',
    code: 'FO-AUS',
    name: 'Austin Office',
    location: 'Austin, Texas',
    isActive: true,
    rootLocationId: 'loc-aus-001',
    locationTypes: [
      { id: 'type-aus-1', fieldOfficeId: '4', name: 'Site', icon: 'LocationCity', level: 0, parentTypeId: null, isActive: true },
      { id: 'type-aus-2', fieldOfficeId: '4', name: 'Building', icon: 'Apartment', level: 1, parentTypeId: 'type-aus-1', isActive: true },
      { id: 'type-aus-3', fieldOfficeId: '4', name: 'Level', icon: 'Layers', level: 2, parentTypeId: 'type-aus-2', isActive: true },
      { id: 'type-aus-4', fieldOfficeId: '4', name: 'Area', icon: 'GridView', level: 3, parentTypeId: 'type-aus-3', isActive: true },
    ],
  },
  {
    id: '5',
    code: 'FO-PHL',
    name: 'Philadelphia Office',
    location: 'Philadelphia, Pennsylvania',
    isActive: true,
    rootLocationId: 'loc-phl-001',
    locationTypes: [
      { id: 'type-phl-1', fieldOfficeId: '5', name: 'Complex', icon: 'AccountBalance', level: 0, parentTypeId: null, isActive: true },
      { id: 'type-phl-2', fieldOfficeId: '5', name: 'Building', icon: 'Domain', level: 1, parentTypeId: 'type-phl-1', isActive: true },
      { id: 'type-phl-3', fieldOfficeId: '5', name: 'Floor', icon: 'Layers', level: 2, parentTypeId: 'type-phl-2', isActive: true },
      { id: 'type-phl-4', fieldOfficeId: '5', name: 'Zone', icon: 'Dashboard', level: 3, parentTypeId: 'type-phl-3', isActive: true },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION NODES - LAS VEGAS OFFICE (Site → Building → Floor → Room)
// ═══════════════════════════════════════════════════════════════════════════

const lasVegasLocations: LocationNode[] = [
  // Site Level
  { id: 'loc-lv-001', code: 'LV-SITE-A', name: 'Main Campus', fieldOfficeId: '1', parentId: null, locationTypeId: 'type-lv-1', level: 0, path: [], description: 'Primary Las Vegas facility', metadata: {}, tags: ['primary', 'headquarters'], status: 'active', capacity: 1000, childCount: 2, assetCount: 245, assignedUserCount: 85, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-20', lastUpdatedBy: 'admin' },

  // Building Level
  { id: 'loc-lv-002', code: 'LV-BLD-A1', name: 'Administration Building', fieldOfficeId: '1', parentId: 'loc-lv-001', locationTypeId: 'type-lv-2', level: 1, path: ['loc-lv-001'], description: 'Central administrative offices', metadata: {}, tags: ['admin', 'office'], status: 'active', capacity: 400, childCount: 3, assetCount: 120, assignedUserCount: 45, createdDate: '2024-01-20', createdBy: 'admin', lastUpdated: '2024-03-15', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-003', code: 'LV-BLD-A2', name: 'Operations Building', fieldOfficeId: '1', parentId: 'loc-lv-001', locationTypeId: 'type-lv-2', level: 1, path: ['loc-lv-001'], description: 'Operations and logistics center', metadata: {}, tags: ['operations', 'warehouse'], status: 'active', capacity: 600, childCount: 2, assetCount: 125, assignedUserCount: 40, createdDate: '2024-01-20', createdBy: 'admin', lastUpdated: '2024-03-10', lastUpdatedBy: 'admin' },

  // Floor Level - Admin Building
  { id: 'loc-lv-004', code: 'LV-FLR-A1F1', name: 'Ground Floor', fieldOfficeId: '1', parentId: 'loc-lv-002', locationTypeId: 'type-lv-3', level: 2, path: ['loc-lv-001', 'loc-lv-002'], description: 'Ground floor reception and public areas', metadata: {}, tags: ['reception', 'public'], status: 'active', capacity: 100, childCount: 3, assetCount: 35, assignedUserCount: 12, createdDate: '2024-01-25', createdBy: 'admin', lastUpdated: '2024-03-01', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-005', code: 'LV-FLR-A1F2', name: 'First Floor', fieldOfficeId: '1', parentId: 'loc-lv-002', locationTypeId: 'type-lv-3', level: 2, path: ['loc-lv-001', 'loc-lv-002'], description: 'Executive offices', metadata: {}, tags: ['executive', 'office'], status: 'active', capacity: 150, childCount: 4, assetCount: 42, assignedUserCount: 18, createdDate: '2024-01-25', createdBy: 'admin', lastUpdated: '2024-02-28', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-006', code: 'LV-FLR-A1F3', name: 'Second Floor', fieldOfficeId: '1', parentId: 'loc-lv-002', locationTypeId: 'type-lv-3', level: 2, path: ['loc-lv-001', 'loc-lv-002'], description: 'General office spaces', metadata: {}, tags: ['office'], status: 'active', capacity: 150, childCount: 4, assetCount: 43, assignedUserCount: 15, createdDate: '2024-01-25', createdBy: 'admin', lastUpdated: '2024-02-25', lastUpdatedBy: 'admin' },

  // Room Level - Ground Floor
  { id: 'loc-lv-007', code: 'LV-RM-G01', name: 'Reception Area', fieldOfficeId: '1', parentId: 'loc-lv-004', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-004'], description: 'Main reception desk', metadata: {}, tags: ['reception'], status: 'active', capacity: 10, childCount: 0, assetCount: 8, assignedUserCount: 3, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-20', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-008', code: 'LV-RM-G02', name: 'Waiting Area', fieldOfficeId: '1', parentId: 'loc-lv-004', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-004'], description: 'Visitor waiting area', metadata: {}, tags: ['public'], status: 'active', capacity: 20, childCount: 0, assetCount: 12, assignedUserCount: 2, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-20', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-009', code: 'LV-RM-G03', name: 'Conference Room A', fieldOfficeId: '1', parentId: 'loc-lv-004', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-004'], description: '20-person conference room', metadata: {}, tags: ['meeting'], status: 'active', capacity: 20, childCount: 0, assetCount: 15, assignedUserCount: 7, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-18', lastUpdatedBy: 'admin' },

  // Room Level - First Floor
  { id: 'loc-lv-010', code: 'LV-RM-F101', name: 'Director Office', fieldOfficeId: '1', parentId: 'loc-lv-005', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-005'], description: 'Office of the Field Director', metadata: {}, tags: ['executive'], status: 'active', capacity: 5, childCount: 0, assetCount: 18, assignedUserCount: 2, createdDate: '2024-02-05', createdBy: 'admin', lastUpdated: '2024-02-15', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-011', code: 'LV-RM-F102', name: 'Deputy Director Office', fieldOfficeId: '1', parentId: 'loc-lv-005', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-005'], description: 'Office of the Deputy Director', metadata: {}, tags: ['executive'], status: 'active', capacity: 5, childCount: 0, assetCount: 16, assignedUserCount: 2, createdDate: '2024-02-05', createdBy: 'admin', lastUpdated: '2024-02-15', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-012', code: 'LV-RM-F103', name: 'Executive Meeting Room', fieldOfficeId: '1', parentId: 'loc-lv-005', locationTypeId: 'type-lv-4', level: 3, path: ['loc-lv-001', 'loc-lv-002', 'loc-lv-005'], description: 'Private executive meeting space', metadata: {}, tags: ['meeting', 'executive'], status: 'active', capacity: 12, childCount: 0, assetCount: 8, assignedUserCount: 8, createdDate: '2024-02-05', createdBy: 'admin', lastUpdated: '2024-02-12', lastUpdatedBy: 'admin' },

  // Floor Level - Operations Building
  { id: 'loc-lv-013', code: 'LV-FLR-A2F1', name: 'Warehouse Floor', fieldOfficeId: '1', parentId: 'loc-lv-003', locationTypeId: 'type-lv-3', level: 2, path: ['loc-lv-001', 'loc-lv-003'], description: 'Main warehouse storage area', metadata: {}, tags: ['warehouse', 'storage'], status: 'active', capacity: 300, childCount: 2, assetCount: 85, assignedUserCount: 25, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-03-05', lastUpdatedBy: 'admin' },
  { id: 'loc-lv-014', code: 'LV-FLR-A2F2', name: 'Operations Floor', fieldOfficeId: '1', parentId: 'loc-lv-003', locationTypeId: 'type-lv-3', level: 2, path: ['loc-lv-001', 'loc-lv-003'], description: 'Operations planning and coordination', metadata: {}, tags: ['operations'], status: 'active', capacity: 300, childCount: 3, assetCount: 40, assignedUserCount: 15, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-03-02', lastUpdatedBy: 'admin' },
];

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION NODES - BOULDER OFFICE (Campus → Building → Floor → Room)
// ═══════════════════════════════════════════════════════════════════════════

const boulderLocations: LocationNode[] = [
  // Campus Level
  { id: 'loc-bld-001', code: 'BLD-CAMP-MAIN', name: 'Tech Campus', fieldOfficeId: '2', parentId: null, locationTypeId: 'type-bld-1', level: 0, path: [], description: 'Main Boulder technology campus', metadata: {}, tags: ['campus'], status: 'active', capacity: 800, childCount: 2, assetCount: 185, assignedUserCount: 62, createdDate: '2024-01-10', createdBy: 'admin', lastUpdated: '2024-03-18', lastUpdatedBy: 'admin' },

  // Building Level
  { id: 'loc-bld-002', code: 'BLD-BLD-NORTH', name: 'North Building', fieldOfficeId: '2', parentId: 'loc-bld-001', locationTypeId: 'type-bld-2', level: 1, path: ['loc-bld-001'], description: 'North campus building', metadata: {}, tags: ['office'], status: 'active', capacity: 500, childCount: 2, assetCount: 125, assignedUserCount: 42, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-15', lastUpdatedBy: 'admin' },
  { id: 'loc-bld-003', code: 'BLD-BLD-SOUTH', name: 'South Building', fieldOfficeId: '2', parentId: 'loc-bld-001', locationTypeId: 'type-bld-2', level: 1, path: ['loc-bld-001'], description: 'South campus building', metadata: {}, tags: ['research'], status: 'active', capacity: 300, childCount: 1, assetCount: 60, assignedUserCount: 20, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-10', lastUpdatedBy: 'admin' },

  // Floor Level
  { id: 'loc-bld-004', code: 'BLD-FLR-N1', name: 'North Floor 1', fieldOfficeId: '2', parentId: 'loc-bld-002', locationTypeId: 'type-bld-3', level: 2, path: ['loc-bld-001', 'loc-bld-002'], description: 'First floor - North building', metadata: {}, tags: ['office'], status: 'active', capacity: 300, childCount: 3, assetCount: 78, assignedUserCount: 28, createdDate: '2024-01-20', createdBy: 'admin', lastUpdated: '2024-03-08', lastUpdatedBy: 'admin' },
  { id: 'loc-bld-005', code: 'BLD-FLR-N2', name: 'North Floor 2', fieldOfficeId: '2', parentId: 'loc-bld-002', locationTypeId: 'type-bld-3', level: 2, path: ['loc-bld-001', 'loc-bld-002'], description: 'Second floor - North building', metadata: {}, tags: ['office'], status: 'active', capacity: 200, childCount: 2, assetCount: 47, assignedUserCount: 14, createdDate: '2024-01-20', createdBy: 'admin', lastUpdated: '2024-03-05', lastUpdatedBy: 'admin' },

  // Room Level
  { id: 'loc-bld-006', code: 'BLD-RM-N101', name: 'Conference Room 101', fieldOfficeId: '2', parentId: 'loc-bld-004', locationTypeId: 'type-bld-4', level: 3, path: ['loc-bld-001', 'loc-bld-002', 'loc-bld-004'], description: 'Large conference room', metadata: {}, tags: ['meeting'], status: 'active', capacity: 50, childCount: 0, assetCount: 24, assignedUserCount: 8, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-28', lastUpdatedBy: 'admin' },
  { id: 'loc-bld-007', code: 'BLD-RM-N102', name: 'Team Room 102', fieldOfficeId: '2', parentId: 'loc-bld-004', locationTypeId: 'type-bld-4', level: 3, path: ['loc-bld-001', 'loc-bld-002', 'loc-bld-004'], description: 'Team collaboration space', metadata: {}, tags: ['office', 'team'], status: 'active', capacity: 50, childCount: 0, assetCount: 32, assignedUserCount: 12, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-25', lastUpdatedBy: 'admin' },
  { id: 'loc-bld-008', code: 'BLD-RM-N103', name: 'Lab 103', fieldOfficeId: '2', parentId: 'loc-bld-004', locationTypeId: 'type-bld-4', level: 3, path: ['loc-bld-001', 'loc-bld-002', 'loc-bld-004'], description: 'Research laboratory', metadata: {}, tags: ['lab', 'research'], status: 'active', capacity: 50, childCount: 0, assetCount: 22, assignedUserCount: 8, createdDate: '2024-02-01', createdBy: 'admin', lastUpdated: '2024-02-20', lastUpdatedBy: 'admin' },
];

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION NODES - OTHER OFFICES (Simplified for initial implementation)
// ═══════════════════════════════════════════════════════════════════════════

const mountainViewLocations: LocationNode[] = [
  { id: 'loc-mtv-001', code: 'MTV-BLD-001', name: 'Innovation Hub', fieldOfficeId: '3', parentId: null, locationTypeId: 'type-mtv-1', level: 0, path: [], description: 'Main office building', metadata: {}, tags: ['headquarters'], status: 'active', capacity: 600, childCount: 3, assetCount: 156, assignedUserCount: 48, createdDate: '2024-01-08', createdBy: 'admin', lastUpdated: '2024-03-20', lastUpdatedBy: 'admin' },
  { id: 'loc-mtv-002', code: 'MTV-FLR-002', name: '3rd Floor', fieldOfficeId: '3', parentId: 'loc-mtv-001', locationTypeId: 'type-mtv-2', level: 1, path: ['loc-mtv-001'], description: 'Engineering floor', metadata: {}, tags: ['engineering'], status: 'active', capacity: 200, childCount: 2, assetCount: 68, assignedUserCount: 22, createdDate: '2024-01-12', createdBy: 'admin', lastUpdated: '2024-03-15', lastUpdatedBy: 'admin' },
  { id: 'loc-mtv-003', code: 'MTV-WNG-001', name: 'West Wing', fieldOfficeId: '3', parentId: 'loc-mtv-002', locationTypeId: 'type-mtv-3', level: 2, path: ['loc-mtv-001', 'loc-mtv-002'], description: 'Western office wing', metadata: {}, tags: ['office'], status: 'active', capacity: 100, childCount: 3, assetCount: 34, assignedUserCount: 12, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-10', lastUpdatedBy: 'admin' },
  { id: 'loc-mtv-004', code: 'MTV-RM-301', name: 'Meeting Room 301', fieldOfficeId: '3', parentId: 'loc-mtv-003', locationTypeId: 'type-mtv-4', level: 3, path: ['loc-mtv-001', 'loc-mtv-002', 'loc-mtv-003'], description: 'Conference room', metadata: {}, tags: ['meeting'], status: 'active', capacity: 15, childCount: 0, assetCount: 12, assignedUserCount: 5, createdDate: '2024-01-18', createdBy: 'admin', lastUpdated: '2024-03-05', lastUpdatedBy: 'admin' },
];

const austinLocations: LocationNode[] = [
  { id: 'loc-aus-001', code: 'AUS-SITE-001', name: 'Austin Tech Park', fieldOfficeId: '4', parentId: null, locationTypeId: 'type-aus-1', level: 0, path: [], description: 'Main Austin facility', metadata: {}, tags: ['primary'], status: 'active', capacity: 700, childCount: 2, assetCount: 178, assignedUserCount: 54, createdDate: '2024-01-05', createdBy: 'admin', lastUpdated: '2024-03-22', lastUpdatedBy: 'admin' },
  { id: 'loc-aus-002', code: 'AUS-BLD-A', name: 'Building A', fieldOfficeId: '4', parentId: 'loc-aus-001', locationTypeId: 'type-aus-2', level: 1, path: ['loc-aus-001'], description: 'Primary office building', metadata: {}, tags: ['office'], status: 'active', capacity: 400, childCount: 3, assetCount: 102, assignedUserCount: 32, createdDate: '2024-01-10', createdBy: 'admin', lastUpdated: '2024-03-18', lastUpdatedBy: 'admin' },
  { id: 'loc-aus-003', code: 'AUS-LVL-001', name: 'Level 1', fieldOfficeId: '4', parentId: 'loc-aus-002', locationTypeId: 'type-aus-3', level: 2, path: ['loc-aus-001', 'loc-aus-002'], description: 'Ground level', metadata: {}, tags: [], status: 'active', capacity: 150, childCount: 2, assetCount: 45, assignedUserCount: 15, createdDate: '2024-01-12', createdBy: 'admin', lastUpdated: '2024-03-12', lastUpdatedBy: 'admin' },
  { id: 'loc-aus-004', code: 'AUS-AREA-A01', name: 'Area A01', fieldOfficeId: '4', parentId: 'loc-aus-003', locationTypeId: 'type-aus-4', level: 3, path: ['loc-aus-001', 'loc-aus-002', 'loc-aus-003'], description: 'Open workspace area', metadata: {}, tags: ['workspace'], status: 'active', capacity: 30, childCount: 0, assetCount: 22, assignedUserCount: 8, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-08', lastUpdatedBy: 'admin' },
];

const philadelphiaLocations: LocationNode[] = [
  { id: 'loc-phl-001', code: 'PHL-COMP-001', name: 'Downtown Complex', fieldOfficeId: '5', parentId: null, locationTypeId: 'type-phl-1', level: 0, path: [], description: 'Primary downtown complex', metadata: {}, tags: ['headquarters'], status: 'active', capacity: 500, childCount: 2, assetCount: 142, assignedUserCount: 46, createdDate: '2024-01-12', createdBy: 'admin', lastUpdated: '2024-03-19', lastUpdatedBy: 'admin' },
  { id: 'loc-phl-002', code: 'PHL-BLD-001', name: 'Main Building', fieldOfficeId: '5', parentId: 'loc-phl-001', locationTypeId: 'type-phl-2', level: 1, path: ['loc-phl-001'], description: 'Administrative building', metadata: {}, tags: ['admin'], status: 'active', capacity: 300, childCount: 2, assetCount: 86, assignedUserCount: 28, createdDate: '2024-01-15', createdBy: 'admin', lastUpdated: '2024-03-15', lastUpdatedBy: 'admin' },
  { id: 'loc-phl-003', code: 'PHL-FLR-001', name: 'Ground Floor', fieldOfficeId: '5', parentId: 'loc-phl-002', locationTypeId: 'type-phl-3', level: 2, path: ['loc-phl-001', 'loc-phl-002'], description: 'Ground floor offices', metadata: {}, tags: ['office'], status: 'active', capacity: 150, childCount: 2, assetCount: 42, assignedUserCount: 14, createdDate: '2024-01-18', createdBy: 'admin', lastUpdated: '2024-03-10', lastUpdatedBy: 'admin' },
  { id: 'loc-phl-004', code: 'PHL-ZN-A', name: 'Zone A', fieldOfficeId: '5', parentId: 'loc-phl-003', locationTypeId: 'type-phl-4', level: 3, path: ['loc-phl-001', 'loc-phl-002', 'loc-phl-003'], description: 'Reception and admin zone', metadata: {}, tags: ['reception'], status: 'active', capacity: 40, childCount: 0, assetCount: 18, assignedUserCount: 6, createdDate: '2024-01-20', createdBy: 'admin', lastUpdated: '2024-03-05', lastUpdatedBy: 'admin' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockLocationNodes: LocationNode[] = [
  ...lasVegasLocations,
  ...boulderLocations,
  ...mountainViewLocations,
  ...austinLocations,
  ...philadelphiaLocations,
];

// ═══════════════════════════════════════════════════════════════════════════
// FIELD OFFICE SUMMARIES
// ═══════════════════════════════════════════════════════════════════════════

export const mockFieldOfficeSummaries: FieldOfficeSummary[] = [
  {
    fieldOfficeId: '1',
    fieldOfficeName: 'Las Vegas Office',
    locationCount: lasVegasLocations.length,
    activeLocationCount: lasVegasLocations.filter(l => l.status === 'active').length,
    assetCount: lasVegasLocations.reduce((sum, l) => sum + l.assetCount, 0),
    userCount: lasVegasLocations.reduce((sum, l) => sum + l.assignedUserCount, 0),
    hierarchyDepth: 3,
    lastUpdated: '2024-03-20',
  },
  {
    fieldOfficeId: '2',
    fieldOfficeName: 'Boulder Office',
    locationCount: boulderLocations.length,
    activeLocationCount: boulderLocations.filter(l => l.status === 'active').length,
    assetCount: boulderLocations.reduce((sum, l) => sum + l.assetCount, 0),
    userCount: boulderLocations.reduce((sum, l) => sum + l.assignedUserCount, 0),
    hierarchyDepth: 3,
    lastUpdated: '2024-03-18',
  },
  {
    fieldOfficeId: '3',
    fieldOfficeName: 'Mountain View Office',
    locationCount: mountainViewLocations.length,
    activeLocationCount: mountainViewLocations.filter(l => l.status === 'active').length,
    assetCount: mountainViewLocations.reduce((sum, l) => sum + l.assetCount, 0),
    userCount: mountainViewLocations.reduce((sum, l) => sum + l.assignedUserCount, 0),
    hierarchyDepth: 3,
    lastUpdated: '2024-03-20',
  },
  {
    fieldOfficeId: '4',
    fieldOfficeName: 'Austin Office',
    locationCount: austinLocations.length,
    activeLocationCount: austinLocations.filter(l => l.status === 'active').length,
    assetCount: austinLocations.reduce((sum, l) => sum + l.assetCount, 0),
    userCount: austinLocations.reduce((sum, l) => sum + l.assignedUserCount, 0),
    hierarchyDepth: 3,
    lastUpdated: '2024-03-22',
  },
  {
    fieldOfficeId: '5',
    fieldOfficeName: 'Philadelphia Office',
    locationCount: philadelphiaLocations.length,
    activeLocationCount: philadelphiaLocations.filter(l => l.status === 'active').length,
    assetCount: philadelphiaLocations.reduce((sum, l) => sum + l.assetCount, 0),
    userCount: philadelphiaLocations.reduce((sum, l) => sum + l.assignedUserCount, 0),
    hierarchyDepth: 3,
    lastUpdated: '2024-03-19',
  },
];
