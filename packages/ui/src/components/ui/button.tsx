import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-600/10',
        emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10',
        accentYellow: 'bg-accent-yellow-500 text-accent-brown-900 hover:bg-accent-yellow-400 hover:text-accent-brown-900 shadow-md shadow-accent-yellow-500/10 font-semibold',
        accentBrown: 'bg-accent-brown-700 text-white hover:bg-accent-brown-800 shadow-md shadow-accent-brown-700/10',
        outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent',
        ghost: 'hover:bg-primary-50 text-neutral-700 hover:text-primary-700',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2.5 text-sm',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
