import React from 'react';

/**
 * SkeletonLoader component for displaying loading states
 * Provides various skeleton shapes for different content types
 */

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

/**
 * Generic skeleton loader with pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClass = 'bg-gray-200 animate-pulse';
  const variantClass = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded'
  };

  return <div className={`${baseClass} ${variantClass[variant]} ${className}`} />;
};

/**
 * Analytics card skeleton loader
 */
export const AnalyticsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-24 mb-2" variant="text" />
        {/* Value skeleton */}
        <Skeleton className="h-8 w-32 mb-2" variant="text" />
        {/* Change text skeleton */}
        <Skeleton className="h-4 w-20 mt-2" variant="text" />
      </div>
      {/* Icon skeleton */}
      <Skeleton className="h-12 w-12 ml-4" variant="rectangular" />
    </div>
  </div>
);

/**
 * Chart skeleton loader
 */
export const ChartSkeleton: React.FC<{ title: boolean }> = ({ title = true }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    {title && <Skeleton className="h-6 w-40 mb-4" variant="text" />}
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-end gap-2">
          <Skeleton className={`h-${Math.random() > 0.5 ? '24' : '32'} flex-1`} variant="rectangular" />
          <Skeleton className={`h-${Math.random() > 0.5 ? '16' : '20'} w-12`} variant="rectangular" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Activity item skeleton loader
 */
export const ActivityItemSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3 flex-1">
      {/* Icon skeleton */}
      <Skeleton className="h-5 w-5 rounded-full" variant="circular" />
      <div className="flex-1">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-32 mb-2" variant="text" />
        {/* Description skeleton */}
        <Skeleton className="h-3 w-48" variant="text" />
      </div>
    </div>
    {/* Time skeleton */}
    <Skeleton className="h-3 w-16 ml-4" variant="text" />
  </div>
);

/**
 * List skeleton loader with multiple items
 */
export const ListSkeleton: React.FC<{ count: number; type?: 'activity' | 'table' }> = ({
  count = 3,
  type = 'activity',
}) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <ActivityItemSkeleton key={i} />
    ))}
  </div>
);

/**
 * Date range filter skeleton
 */
export const DateRangeFilterSkeleton: React.FC = () => (
  <div className="flex gap-4 items-end">
    <div>
      <Skeleton className="h-4 w-20 mb-2" variant="text" />
      <Skeleton className="h-10 w-40" variant="rectangular" />
    </div>
    <div>
      <Skeleton className="h-4 w-20 mb-2" variant="text" />
      <Skeleton className="h-10 w-40" variant="rectangular" />
    </div>
    <Skeleton className="h-10 w-32" variant="rectangular" />
  </div>
);

/**
 * Full analytics dashboard skeleton
 */
export const AnalyticsDashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" variant="text" />
        <Skeleton className="h-4 w-full max-w-md" variant="text" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnalyticsCardSkeleton key={i} />
        ))}
      </div>

      {/* Date range filter skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <DateRangeFilterSkeleton />
      </div>

      {/* Charts grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartSkeleton title={true} />
        <ChartSkeleton title={true} />
        <ChartSkeleton title={true} />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-6 w-40 mb-4" variant="text" />
          <ListSkeleton count={3} type="activity" />
        </div>
      </div>
    </div>
  </div>
);
