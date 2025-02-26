import * as React from "react";
import { TbSearch } from "react-icons/tb";

import { cn } from "@/lib/utils";

// Base Input component interface and implementation as you have it
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted-foreground/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// New SearchInput interface and implementation
interface SearchInputProps extends InputProps {
  wrapperClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
            "flex h-8 items-center px-2.5 rounded-lg border border-slate-500 bg-slate-50 focus-within:ring-1 focus-within:ring-slate-600 group",
          wrapperClassName
        )}
      >
        <TbSearch className="icon-sm text-muted-foreground group-focus-within:text-primary" />
        <Input
          className={cn(
            "text-xs focus-visible:outline-none focus-visible:ring-0 border-transparent px-1.5 placeholder:text-muted-foreground/50 group-focus-within:placeholder:text-muted-foreground text-muted-foreground",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// New IconInput interface and implementation
interface IconInputProps extends InputProps {
  wrapperClassName?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  iconClassName?: string;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  (
    { className, wrapperClassName, icon, onIconClick, iconClassName, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex h-7 items-center px-2.5 rounded-lg border border-input focus-within:ring-1 focus-within:ring-muted-foreground/40 group",
          wrapperClassName
        )}
      >
        <Input
          className={cn(
            "text-xs border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0",
            "bg-transparent",
            "placeholder:text-muted-foreground/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div
            onClick={onIconClick}
            className={cn(
              "text-muted-foreground group-focus-within:text-primary",
              onIconClick && "cursor-pointer hover:text-primary",
              iconClassName
            )}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);
IconInput.displayName = "IconInput";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputNoBorder = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full bg-transparent text-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputNoBorder.displayName = "InputNoBorder";

export { Input, SearchInput, IconInput, InputNoBorder };
