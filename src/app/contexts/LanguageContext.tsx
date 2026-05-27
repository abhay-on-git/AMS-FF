import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'vi' | 'fr' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.masterData': 'Master Data',
    'nav.assetTypes': 'Asset Types',
    'nav.assets': 'Assets',
    'nav.warehouses': 'Warehouses',
    'nav.transactions': 'Transactions',
    'nav.inventorySheets': 'Inventory Sheets',
    'nav.systemAdmin': 'System Admin',
    'nav.users': 'User Management',
    'nav.actionLog': 'Activity Log',
    'nav.rfidSettings': 'Inspections & PDA',
    'nav.help': 'Help',
    
    // Common
    'common.search': 'Search',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.actions': 'Actions',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.create': 'Create',
    'common.details': 'Details',
    'common.history': 'History',
    'common.date': 'Date',
    'common.name': 'Name',
    'common.code': 'Code',
    'common.type': 'Type',
    'common.location': 'Location',
    'common.description': 'Description',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalAssets': 'Total Assets',
    'dashboard.assetsByStatus': 'Assets by Status',
    'dashboard.lastInventory': 'Last Inventory',
    'dashboard.alerts': 'Alerts',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.noActivity': 'No recent activity',
    
    // Asset Types
    'assetTypes.title': 'Asset Types',
    'assetTypes.typeCode': 'Type Code',
    'assetTypes.typeName': 'Type Name',
    'assetTypes.parentType': 'Parent Type',
    'assetTypes.createType': 'Create Asset Type',
    'assetTypes.editType': 'Edit Asset Type',
    
    // Assets
    'assets.title': 'Assets',
    'assets.assetId': 'Asset ID',
    'assets.epc': 'EPC',
    'assets.barcode': 'Barcode',
    'assets.responsiblePerson': 'Custodian',
    'assets.createAsset': 'Create Asset',
    'assets.assetDetails': 'Asset Details',
    'assets.changeLocation': 'Change Location',
    'assets.updateStatus': 'Update Status',
    'assets.lock': 'Lock',
    'assets.unlock': 'Unlock',
    'assets.owner': 'Owner',
    
    // Warehouses
    'warehouses.title': 'Warehouses',
    'warehouses.warehouseCode': 'Warehouse Code',
    'warehouses.warehouseName': 'Warehouse Name',
    'warehouses.address': 'Address',
    'warehouses.areas': 'Areas',
    'warehouses.areaCode': 'Area Code',
    'warehouses.areaName': 'Area Name',
    'warehouses.addWarehouse': 'Add Warehouse',
    'warehouses.addArea': 'Add Area',
    'warehouses.assetsInArea': 'Assets in Area',
    
    // Inventory
    'inventory.title': 'Inventory Sheets',
    'inventory.sheetCode': 'Sheet Code',
    'inventory.warehouse': 'Warehouse',
    'inventory.area': 'Area',
    'inventory.assignedTo': 'Assigned To',
    'inventory.createSheet': 'Create Inventory Sheet',
    'inventory.draft': 'Draft',
    'inventory.inProgress': 'In Progress',
    'inventory.completed': 'Completed',
    'inventory.approved': 'Approved',
    'inventory.match': 'Match',
    'inventory.extra': 'Extra',
    'inventory.unknown': 'Unknown',
    'inventory.missing': 'Missing',
    'inventory.approve': 'Approve',
    'inventory.reject': 'Reject',
    'inventory.notes': 'Notes',
    
    // Users
    'users.title': 'User Management',
    'users.username': 'Username',
    'users.role': 'Role',
    'users.createUser': 'Create User',
    'users.password': 'Password',
    'users.resetPassword': 'Reset Password',
    'users.admin': 'Admin',
    'users.manager': 'Manager',
    'users.staff': 'Inventory Staff',
    
    // RFID Settings
    'rfid.title': 'RFID Device Settings',
    'rfid.power': 'Power Setting',
    'rfid.rssi': 'RSSI Threshold',
    'rfid.scanMode': 'Scan Mode',
    'rfid.continuous': 'Continuous',
    'rfid.pressHold': 'Press & Hold',
    'rfid.feedback': 'Feedback',
    'rfid.beep': 'Beep',
    'rfid.vibration': 'Vibration',
    
    // Mobile
    'mobile.login': 'Login',
    'mobile.selectWarehouse': 'Select Default Warehouse',
    'mobile.assetRegistration': 'Asset Registration',
    'mobile.scan': 'Scan',
    'mobile.startScan': 'Start Scan',
    'mobile.pauseScan': 'Pause Scan',
    'mobile.lookup': 'Lookup',
    'mobile.findExtra': 'Find Extra',
    'mobile.submitResults': 'Submit Results',
    'mobile.updateLocation': 'Update Location',
    'mobile.ignore': 'Ignore',
    'mobile.serialNumber': 'Serial Number',
    
    // Settings
    'settings.language': 'Language',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
  },
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.masterData': 'Dữ liệu chính',
    'nav.assetTypes': 'Loại tài sản',
    'nav.assets': 'Tài sản',
    'nav.warehouses': 'Kho bãi',
    'nav.transactions': 'Giao dịch',
    'nav.inventorySheets': 'Phiếu kiểm kê',
    'nav.systemAdmin': 'Quản trị hệ thống',
    'nav.users': 'Người dùng & Quyền',
    'nav.actionLog': 'Nhật ký hoạt động',
    'nav.rfidSettings': 'Inspections & PDA',
    'nav.help': 'Trợ giúp',
    
    // Common
    'common.search': 'Tìm kiếm',
    'common.add': 'Thêm',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.status': 'Trạng thái',
    'common.active': 'Hoạt động',
    'common.inactive': 'Không hoạt động',
    'common.actions': 'Thao tác',
    'common.filter': 'Lọc',
    'common.export': 'Xuất',
    'common.import': 'Nhập',
    'common.create': 'Tạo',
    'common.details': 'Chi tiết',
    'common.history': 'Lịch sử',
    'common.date': 'Ngày',
    'common.name': 'Tên',
    'common.code': 'Mã',
    'common.type': 'Loại',
    'common.location': 'Vị trí',
    'common.description': 'Mô tả',
    
    // Dashboard
    'dashboard.title': 'Bảng điều khiển',
    'dashboard.totalAssets': 'Tổng tài sản',
    'dashboard.assetsByStatus': 'Tài sản theo trạng thái',
    'dashboard.lastInventory': 'Kiểm kê gần nhất',
    'dashboard.alerts': 'Cảnh báo',
    'dashboard.recentActivity': 'Hoạt động gần đây',
    'dashboard.noActivity': 'Không có hoạt động gần đây',
    
    // Asset Types
    'assetTypes.title': 'Loại tài sản',
    'assetTypes.typeCode': 'Mã loại',
    'assetTypes.typeName': 'Tên loại',
    'assetTypes.parentType': 'Loại cha',
    'assetTypes.createType': 'Tạo loại tài sản',
    'assetTypes.editType': 'Sửa loại tài sản',
    
    // Assets
    'assets.title': 'Tài sản',
    'assets.assetId': 'Mã tài sản',
    'assets.epc': 'EPC',
    'assets.barcode': 'Mã vạch',
    'assets.responsiblePerson': 'Người giám hộ',
    'assets.createAsset': 'Tạo tài sản',
    'assets.assetDetails': 'Chi tiết tài sản',
    'assets.changeLocation': 'Đổi vị trí',
    'assets.updateStatus': 'Cập nhật trạng thái',
    'assets.lock': 'Khóa',
    'assets.unlock': 'Mở khóa',
    'assets.owner': 'Chủ sở hữu',
    
    // Warehouses
    'warehouses.title': 'Kho bãi',
    'warehouses.warehouseCode': 'Mã kho',
    'warehouses.warehouseName': 'Tên kho',
    'warehouses.address': 'Địa chỉ',
    'warehouses.areas': 'Khu vực',
    'warehouses.areaCode': 'Mã khu vực',
    'warehouses.areaName': 'Tên khu vực',
    'warehouses.addWarehouse': 'Thêm kho',
    'warehouses.addArea': 'Thêm khu vực',
    'warehouses.assetsInArea': 'Tài sản trong khu vực',
    
    // Inventory
    'inventory.title': 'Phiếu kiểm kê',
    'inventory.sheetCode': 'Mã phiếu',
    'inventory.warehouse': 'Kho',
    'inventory.area': 'Khu vực',
    'inventory.assignedTo': 'Được giao cho',
    'inventory.createSheet': 'Tạo phiếu kiểm kê',
    'inventory.draft': 'Nháp',
    'inventory.inProgress': 'Đang thực hiện',
    'inventory.completed': 'Hoàn thành',
    'inventory.approved': 'Đã duyệt',
    'inventory.match': 'Khớp',
    'inventory.extra': 'Thừa',
    'inventory.unknown': 'Không xác định',
    'inventory.missing': 'Thiếu',
    'inventory.approve': 'Duyệt',
    'inventory.reject': 'Từ chối',
    'inventory.notes': 'Ghi chú',
    
    // Users
    'users.title': 'Người dùng & Quyền',
    'users.username': 'Tên đăng nhập',
    'users.role': 'Vai trò',
    'users.createUser': 'Tạo người dùng',
    'users.password': 'Mật khẩu',
    'users.resetPassword': 'Đặt lại mật khẩu',
    'users.admin': 'Quản trị viên',
    'users.manager': 'Quản lý',
    'users.staff': 'Nhân viên kiểm kê',
    
    // RFID Settings
    'rfid.title': 'Cài đặt thiết bị RFID',
    'rfid.power': 'Cài đặt công suất',
    'rfid.rssi': 'Ngưỡng RSSI',
    'rfid.scanMode': 'Chế độ quét',
    'rfid.continuous': 'Liên tục',
    'rfid.pressHold': 'Nhấn giữ',
    'rfid.feedback': 'Phản hồi',
    'rfid.beep': 'Tiếng bíp',
    'rfid.vibration': 'Rung',
    
    // Mobile
    'mobile.login': 'Đăng nhập',
    'mobile.selectWarehouse': 'Chọn kho mặc định',
    'mobile.assetRegistration': 'Đăng ký tài sản',
    'mobile.scan': 'Quét',
    'mobile.startScan': 'Bắt đầu quét',
    'mobile.pauseScan': 'Tạm dừng quét',
    'mobile.lookup': 'Tra cứu',
    'mobile.findExtra': 'Tìm thừa',
    'mobile.submitResults': 'Gửi kết quả',
    'mobile.updateLocation': 'Cập nhật vị trí',
    'mobile.ignore': 'Bỏ qua',
    'mobile.serialNumber': 'Số serial',
    
    // Settings
    'settings.language': 'Ngôn ngữ',
    'settings.darkMode': 'Chế độ tối',
    'settings.lightMode': 'Chế độ sáng',
  },
  fr: {
    // French translations - placeholder for future support
    'nav.dashboard': 'Tableau de bord',
  },
  zh: {
    // Chinese translations - placeholder for future support
    'nav.dashboard': '仪表板',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return (translations[language] && translations[language][key]) || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}