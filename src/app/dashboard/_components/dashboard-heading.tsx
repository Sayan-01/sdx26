import React from "react";

const DashboardHeading = ({ title, description }: { title: string; description: string }) => {
  return (
    <div>
      <h1 className="text-4xl  tracking-tight">{title}</h1>
      <p className="text-zinc-500 mt-1">{description}</p>
    </div>
  );
};

export default DashboardHeading;
