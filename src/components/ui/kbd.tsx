import { cn } from '@/lib/utils';

export default function KBD({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        'pointer-events-non inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
        className
      )}>
      {children}
    </kbd>
  );
}
