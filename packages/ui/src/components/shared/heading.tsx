import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const headingVariants = cva('tracking-tight text-neutral-900 font-bold font-sans', {
  variants: {
    level: {
      h1: 'text-4xl sm:text-5xl lg:text-6xl leading-[1.15] font-extrabold',
      h2: 'text-3xl sm:text-4xl leading-tight font-bold',
      h3: 'text-2xl sm:text-3xl leading-snug font-semibold',
      h4: 'text-xl sm:text-2xl leading-normal font-semibold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 'h2',
    align: 'left',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Heading({ className, level = 'h2', align, ...props }: HeadingProps) {
  const Component = level as React.ElementType;
  return <Component className={cn(headingVariants({ level, align, className }))} {...props} />;
}
