import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export function Section({ className, as: Component = 'section', ...props }: SectionProps) {
  return <Component className={cn('py-16 md:py-24 overflow-hidden', className)} {...props} />;
}
