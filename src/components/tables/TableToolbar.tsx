interface TableToolbarProps {
  children?: React.ReactNode;
}

export function TableToolbar({ children }: TableToolbarProps) {
  return <div className='mb-3 flex items-center justify-between gap-2'>{children}</div>;
}
