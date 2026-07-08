import React from "react";

const DashboardHeading = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-4xl sm:text-[52px] font-normal leading-[1.02] tracking-[-0.01em] text-foreground">{title}</h1>
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.55]">{description}</p>
    </div>
  );
};

export default DashboardHeading;

