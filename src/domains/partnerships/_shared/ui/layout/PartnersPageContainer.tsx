import React from "react";
import clsx from "clsx";

type Width = "default" | "wide" | "full";

const widthClass: Record<Width, string> = {
  default: "mx-auto w-full max-w-6xl",
  wide: "mx-auto w-full max-w-7xl",
  full: "w-full",
};

interface PartnersPageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width preset
   * - default: max-w-6xl (baseline for partners desktop)
   * - wide: max-w-7xl (use sparingly for heavy dashboards)
   * - full: fluid (only when truly full-bleed is needed)
   */
  width?: Width;
}

export function PartnersPageContainer({
  width = "default",
  className,
  children,
  ...rest
}: PartnersPageContainerProps) {
  return (
    <div className={clsx(widthClass[width], "px-4 lg:px-8 xl:px-10", className)} {...rest}>
      {children}
    </div>
  );
}

export default PartnersPageContainer;
