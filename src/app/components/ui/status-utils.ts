/**
 * Chorus Brand - Status Badge Utilities
 * Ensures consistent status colors across all components
 */

export type AssetStatus = 
  | 'registered' 
  | 'in-use' 
  | 'under-verification' 
  | 'damaged' 
  | 'retired' 
  | 'pending' 
  | 'approved' 
  | 'disposed' 
  | 'missing'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'updated'
  | 'created';

/**
 * Get the Chorus-compliant badge variant and className for a given status
 */
export function getStatusStyle(status: string): {
  variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' | 'outline';
  className?: string;
} {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedStatus) {
    case 'registered':
    case 'under-verification':
    case 'approved':
    case 'completed':
      return { variant: 'info' }; // Uses #81CCD7 (Chorus accent)
    
    case 'in-use':
    case 'active':
      return { variant: 'secondary' }; // Uses #EDEDED background
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return { variant: 'warning' }; // Uses #EF652B (Chorus primary)
    
    case 'retired':
      return { variant: 'secondary', className: 'bg-[#F0F0F0] text-[#999999]' };
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return { variant: 'destructive' }; // Uses #D93F3F
    
    case 'created':
    case 'updated':
      return { variant: 'info' }; // Uses #81CCD7 (Chorus accent)
    
    default:
      return { variant: 'outline' };
  }
}

/**
 * Get color classes for text/icon elements (not badges)
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedStatus) {
    case 'registered':
    case 'under-verification':
    case 'approved':
    case 'completed':
    case 'created':
    case 'updated':
      return 'text-[#81CCD7] dark:text-[#81CCD7]';
    
    case 'in-use':
    case 'active':
    case 'retired':
      return 'text-[#999999] dark:text-[#999999]';
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return 'text-[#EF652B] dark:text-[#EF652B]';
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return 'text-[#D93F3F] dark:text-[#D93F3F]';
    
    default:
      return 'text-[#999999] dark:text-[#999999]';
  }
}

/**
 * Get background color classes for status indicators
 */
export function getStatusBackgroundColor(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedStatus) {
    case 'registered':
    case 'under-verification':
    case 'approved':
    case 'completed':
    case 'created':
    case 'updated':
      return 'bg-[#E6F7F9] dark:bg-[#1A3D3D]';
    
    case 'in-use':
    case 'active':
    case 'retired':
      return 'bg-[#F0F0F0] dark:bg-[#2D3050]';
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return 'bg-[#FEF3ED] dark:bg-[#3D2A1A]';
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return 'bg-[#FCEAEA] dark:bg-[#3D1A1A]';
    
    default:
      return 'bg-[#F0F0F0] dark:bg-[#2D3050]';
  }
}
