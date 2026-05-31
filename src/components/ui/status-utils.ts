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
      return { variant: 'info' };
    
    case 'in-use':
    case 'active':
      return { variant: 'secondary' };
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return { variant: 'warning' };
    
    case 'retired':
      return { variant: 'secondary', className: 'bg-muted text-muted-foreground' };
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return { variant: 'destructive' };
    
    case 'created':
    case 'updated':
      return { variant: 'info' };
    
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
      return 'text-brand-teal dark:text-brand-teal';
    
    case 'in-use':
    case 'active':
    case 'retired':
      return 'text-muted-foreground dark:text-muted-foreground';
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return 'text-chart-3 dark:text-chart-3';
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return 'text-destructive dark:text-destructive';
    
    default:
      return 'text-muted-foreground dark:text-muted-foreground';
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
      return 'bg-accent dark:bg-accent';
    
    case 'in-use':
    case 'active':
    case 'retired':
      return 'bg-muted dark:bg-sidebar-accent';
    
    case 'damaged':
    case 'pending':
    case 'pending-approval':
      return 'bg-chart-3/10 dark:bg-chart-3/20';
    
    case 'disposed':
    case 'missing':
    case 'inactive':
      return 'bg-destructive/10 dark:bg-destructive/20';
    
    default:
      return 'bg-muted dark:bg-sidebar-accent';
  }
}
