import * as React from "react";
import { createContext, useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar, SidebarContext } from "./useSidebar";

const sidebarVariants = cva(
  "group/sidebar relative flex h-full w-full flex-col gap-4 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-linear data-[collapsible=icon]:w-[--sidebar-width] data-[collapsible=icon]:min-w-[--sidebar-width] data-[collapsible=icon]:max-w-[--sidebar-width] data-[collapsible=icon]:[--sidebar-width:theme(spacing.16)] data-[collapsible=icon]:data-[state=expanded]:w-[--sidebar-width] data-[collapsible=icon]:data-[state=expanded]:min-w-[--sidebar-width] data-[collapsible=icon]:data-[state=expanded]:max-w-[--sidebar-width] data-[collapsible=icon]:data-[state=expanded]:[--sidebar-width:theme(spacing.64)] data-[collapsible=icon]:data-[state=collapsed]:w-[--sidebar-width] data-[collapsible=icon]:data-[state=collapsed]:min-w-[--sidebar-width] data-[collapsible=icon]:data-[state=collapsed]:max-w-[--sidebar-width] data-[collapsible=icon]:data-[state=collapsed]:[--sidebar-width:theme(spacing.16)]",
  {
    variants: {
      variant: {
        default: "bg-sidebar",
        secondary: "bg-sidebar-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const sidebarMenuButtonVariants = cva(
  "group/menu-button relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
  {
    variants: {
      variant: {
        default:
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        ghost:
          "hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent/50",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarProvider = ({
  children,
  defaultCollapsed = false,
  collapsible = true,
  collapsedBreakpoint = "lg",
  ...props
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  collapsedBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
} & VariantProps<typeof sidebarVariants>) => {
  const [open, setOpen] = useState(!defaultCollapsed);
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const breakpoint = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
      }[collapsedBreakpoint];

      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [collapsedBreakpoint]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMobile) {
        setOpenMobile(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  };

  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      <div
        data-sidebar=""
        data-collapsible={collapsible}
        data-state={state}
        className={cn(sidebarVariants({ variant: props.variant }))}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar=""
      className={cn("flex h-full w-full flex-col gap-4", className)}
      {...props}
    />
  )
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex h-[60px] items-center px-2", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn("flex flex-1 flex-col gap-2 px-3 pb-4", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex items-center gap-4 p-4 py-2", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: boolean;
  }
>(({ className, collapsible = false, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!collapsible) {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        ref={ref}
        data-sidebar="group"
        data-collapsible=""
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {children}
      </div>
    </Collapsible>
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: boolean;
  }
>(({ className, collapsible = false, children, ...props }, ref) => {
  if (!collapsible) {
    return (
      <div
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex items-center gap-2 px-2 text-xs font-semibold text-sidebar-foreground/60",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <CollapsibleTrigger asChild>
      <div
        ref={ref}
        data-sidebar="group-label"
        data-collapsible=""
        className={cn(
          "flex items-center gap-2 px-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
        <ChevronRight className="ml-auto size-3 transition-transform group-data-[state=open]:rotate-90" />
      </div>
    </CollapsibleTrigger>
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: boolean;
  }
>(({ className, collapsible = false, ...props }, ref) => {
  if (!collapsible) {
    return (
      <div
        ref={ref}
        data-sidebar="group-content"
        className={cn("flex flex-col gap-1", className)}
        {...props}
      />
    );
  }

  return (
    <CollapsibleContent>
      <div
        ref={ref}
        data-sidebar="group-content"
        data-collapsible=""
        className={cn("flex flex-col gap-1", className)}
        {...props}
      />
    </CollapsibleContent>
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    data-sidebar="group-action"
    className={cn(
      "ml-auto flex aspect-square w-8 items-center justify-center rounded-md text-sidebar-foreground/60 outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
      className
    )}
    {...props}
  />
));
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="inset"
    className={cn("flex flex-col gap-4 px-2", className)}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-sidebar="input"
    className={cn(
      "flex h-9 w-full rounded-md border border-sidebar-border bg-sidebar px-3 py-1 text-sm text-sidebar-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
SidebarInput.displayName = "SidebarInput";

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 h-px bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="rail"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
SidebarRail.displayName = "SidebarRail";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeftClose className="size-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu"
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-item"
    className={cn("relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    variant?: "default" | "ghost";
    size?: "default" | "sm" | "lg";
    isActive?: boolean;
    tooltip?: React.ComponentProps<typeof Tooltip> | string;
  }
>(
  (
    { asChild = false, variant, size, isActive, tooltip, className, ...props },
    ref
  ) => {
    const { state, isMobile } = useSidebar();
    const Comp = asChild ? Slot : "a";

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        data-size={size}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
};
