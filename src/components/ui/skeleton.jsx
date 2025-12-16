import React from "react";

export function Skeleton({ className = "", children = null }) {
  return (
    <div className={`animate-pulse bg-gray-100 ${className}`}>{children}</div>
  );
}

export function SkeletonText({ className = "h-4 w-full rounded" }) {
  return <div className={`bg-gray-200 ${className} animate-pulse`} />;
}

export default Skeleton;
