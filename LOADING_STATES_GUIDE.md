# Loading States - Implementation Guide & Best Practices

## Quick Start

### Using the Skeleton Components

#### 1. Single Card Loading
```typescript
import { AnalyticsCardSkeleton } from './components/SkeletonLoader';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <AnalyticsCardSkeleton />;
  }

  return <AnalyticsCard {...props} />;
}
```

#### 2. List with Loading
```typescript
import { ListSkeleton } from './components/SkeletonLoader';

function ActivityList({ items, isLoading }) {
  if (isLoading) {
    return <ListSkeleton count={3} type="activity" />;
  }

  return (
    <div>
      {items.map(item => <ActivityItem key={item.id} {...item} />)}
    </div>
  );
}
```

#### 3. Chart with Loading
```typescript
import { ChartSkeleton } from './components/SkeletonLoader';

function Analytics({ data, isLoading }) {
  if (isLoading) {
    return <ChartSkeleton title />;
  }

  return <Chart data={data} />;
}
```

---

## Advanced Patterns

### Pattern 1: Staggered Loading
Different sections load at different times (perceived performance boost):

```typescript
const [isLoadingCards, setIsLoadingCards] = useState(true);
const [isLoadingCharts, setIsLoadingCharts] = useState(true);

useEffect(() => {
  // Load cards first (fast)
  const timer1 = setTimeout(() => {
    setIsLoadingCards(false);
  }, 300);

  // Load charts later (slower)
  const timer2 = setTimeout(() => {
    setIsLoadingCharts(false);
  }, 800);

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, []);
```

### Pattern 2: Error Recovery
Show skeleton again when fetching fails and retrying:

```typescript
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

const retry = async () => {
  setError(null);
  setIsLoading(true);
  try {
    await fetchData();
  } catch (err) {
    setError('Failed to load data');
    setIsLoading(false);
  }
};
```

### Pattern 3: Skeleton Grid
Show multiple skeletons in a grid:

```typescript
{isLoading
  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
  : data.map((item) => <Card key={item.id} {...item} />)
}
```

### Pattern 4: Conditional Skeleton
Different skeleton based on context:

```typescript
{isLoading && (
  <div className="space-y-4">
    {context === 'card' && <SkeletonCard />}
    {context === 'chart' && <ChartSkeleton />}
    {context === 'list' && <ListSkeleton count={5} />}
  </div>
)}
```

---

## Skeleton Component Variations

### Create Custom Skeletons

```typescript
// Custom product card skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg p-4">
    <Skeleton className="h-48 w-full mb-4" variant="rectangular" />
    <Skeleton className="h-4 w-3/4 mb-2" variant="text" />
    <Skeleton className="h-4 w-1/2 mb-4" variant="text" />
    <Skeleton className="h-10 w-full" variant="rectangular" />
  </div>
);

// Custom user profile skeleton
export const UserProfileSkeleton: React.FC = () => (
  <div className="flex gap-4">
    <Skeleton className="h-16 w-16" variant="circular" />
    <div className="flex-1">
      <Skeleton className="h-4 w-40 mb-2" variant="text" />
      <Skeleton className="h-4 w-32" variant="text" />
    </div>
  </div>
);
```

---

## Best Practices

### ✅ DO

1. **Match Real Content Structure**
   ```typescript
   // ✓ Good: Skeleton matches real layout
   <Skeleton className="h-6 w-40 mb-4" /> {/* Title */}
   <Skeleton className="h-64 w-full" /> {/* Chart */}
   ```

2. **Use Multiple Loading States**
   ```typescript
   // ✓ Good: Different states for different sections
   const [isLoadingCards, setIsLoadingCards] = useState(true);
   const [isLoadingCharts, setIsLoadingCharts] = useState(true);
   ```

3. **Provide User Feedback**
   ```typescript
   // ✓ Good: Show what's happening
   {isRefreshing && <RefreshSkeleton aria-label="Refreshing data..." />}
   ```

4. **Keep Animations Smooth**
   ```typescript
   // ✓ Good: CSS animation (GPU accelerated)
   className="animate-pulse"
   ```

5. **Error States**
   ```typescript
   // ✓ Good: Show error with recovery option
   {error && (
     <ErrorBanner message={error} onRetry={retry} />
   )}
   ```

### ❌ DON'T

1. **Don't Create Skeleton for Every Element**
   ```typescript
   // ✗ Bad: Excessive skeletons
   <Skeleton /> Login Button
   <Skeleton /> Footer
   <Skeleton /> Social Links
   
   // ✓ Good: Skeleton only for async content
   {isLoading ? <ChartSkeleton /> : <Chart />}
   ```

2. **Don't Make Skeleton Animations Too Fast**
   ```typescript
   // ✗ Bad: Too fast, distracting
   className="animate-pulse" // Default is 2 seconds
   
   // ✓ Good: Use standard animation speed
   className="animate-pulse" // Stick with default
   ```

3. **Don't Mix Loading States**
   ```typescript
   // ✗ Bad: Unclear which is loading
   {isLoading && <Card />} {data && <Card />}
   
   // ✓ Good: Clear conditional rendering
   {isLoading ? <SkeletonCard /> : <Card {...data} />}
   ```

4. **Don't Block User Interaction**
   ```typescript
   // ✗ Bad: User can't interact while loading
   {isLoading ? <SkeletonForm /> : <Form />}
   
   // ✓ Good: Show skeleton but disable submission
   <Form isLoading={isLoading} />
   ```

5. **Don't Forget Error States**
   ```typescript
   // ✗ Bad: No error handling
   if (isLoading) return <Skeleton />;
   return <Chart data={data} />;
   
   // ✓ Good: Show error
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorBanner />;
   return <Chart data={data} />;
   ```

---

## Performance Tips

### 1. Lazy Load Skeleton Components
```typescript
// Import only what you need
import { ChartSkeleton } from './components/SkeletonLoader/ChartSkeleton';
```

### 2. Memoize Skeleton Components
```typescript
// Prevent unnecessary re-renders
const MemoizedSkeleton = React.memo(AnalyticsCardSkeleton);
```

### 3. Use useCallback for Functions
```typescript
// Prevent function recreation
const handleRefresh = useCallback(async () => {
  await fetchData();
}, []);
```

### 4. Debounce Rapid Refreshes
```typescript
// Prevent API hammering
const debouncedrefresh = useMemo(
  () => debounce(handleRefresh, 1000),
  []
);
```

---

## Accessibility Considerations

### 1. Add ARIA Labels
```typescript
<div aria-label="Loading analytics data..." role="status">
  <SkeletonLoader />
</div>
```

### 2. Semantic HTML
```typescript
// ✓ Good: Semantic content
<article className="loading">
  <Skeleton /> {/* Title */}
  <Skeleton /> {/* Content */}
</article>
```

### 3. Keyboard Navigation
```typescript
// ✓ Good: Buttons remain focusable
<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Click me'}
</button>
```

### 4. Color Contrast
```typescript
// ✓ Good: 4.5:1 contrast ratio
className="bg-gray-200 animate-pulse" // Sufficient contrast
```

---

## Testing

### 1. Test Loading State
```typescript
test('shows skeleton while loading', () => {
  const { getByLabelText } = render(<Analytics isLoading />);
  expect(getByLabelText('Loading analytics data...')).toBeInTheDocument();
});
```

### 2. Test Loaded State
```typescript
test('shows data when loaded', () => {
  const { getByText } = render(<Analytics isLoading={false} data={mockData} />);
  expect(getByText('12,847')).toBeInTheDocument();
});
```

### 3. Test Error State
```typescript
test('shows error message on failure', () => {
  const { getByText } = render(<Analytics error="Failed to load" />);
  expect(getByText('Failed to load')).toBeInTheDocument();
});
```

### 4. Test Refresh
```typescript
test('refreshes data on button click', async () => {
  const { getByText } = render(<Analytics />);
  const refreshBtn = getByText('Refresh');
  
  await userEvent.click(refreshBtn);
  expect(getByText('Refreshing...')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Issue: Skeleton Shows Forever
```typescript
// ✗ Problem: setIsLoading never called
useEffect(() => {
  fetchData(); // Never sets isLoading = false
}, []);

// ✓ Solution: Ensure loading state is updated
useEffect(() => {
  setIsLoading(true);
  fetchData()
    .finally(() => setIsLoading(false));
}, []);
```

### Issue: Skeleton Looks Wrong
```typescript
// ✗ Problem: Wrong dimensions
<Skeleton className="h-4 w-full" /> {/* Too small for chart */}

// ✓ Solution: Match real component dimensions
<Skeleton className="h-64 w-full" /> {/* Full height chart */}
```

### Issue: Skeleton Animation Not Smooth
```typescript
// ✗ Problem: Custom animation too fast
className="animate-bounce" // Wrong animation

// ✓ Solution: Use animate-pulse
className="animate-pulse" // Correct animation
```

### Issue: Performance Issues
```typescript
// ✗ Problem: Too many skeletons re-rendering
{skeletons.map(s => <SkeletonItem key={Math.random()} />)}

// ✓ Solution: Use index, avoid re-renders
{skeletons.map((s, i) => <SkeletonItem key={i} />)}
```

---

## Migration Checklist

When adding loading states to existing components:

- [ ] Create skeleton component matching real component structure
- [ ] Add `isLoading` state to parent component
- [ ] Add `useEffect` hook to trigger data fetching
- [ ] Update JSX: `{isLoading ? <Skeleton /> : <Component />}`
- [ ] Add error state handling
- [ ] Test on mobile/tablet/desktop
- [ ] Test with actual API (not just mock data)
- [ ] Add accessibility labels
- [ ] Performance test with slow network
- [ ] User testing for UX feedback

---

## Examples by Use Case

### Use Case 1: Dashboard Loading
```typescript
// Load different sections at different times
const [isLoadingCards, setIsLoadingCards] = useState(true);
const [isLoadingCharts, setIsLoadingCharts] = useState(true);

// Cards load first (100-200ms)
// Charts load after (400-800ms)
```

### Use Case 2: Real-time Updates
```typescript
// Show skeleton then update when new data arrives
useEffect(() => {
  const unsubscribe = subscribeToUpdates((newData) => {
    setData(newData);
  });
}, []);
```

### Use Case 3: Search Results
```typescript
// Show skeleton while searching
const handleSearch = async (query) => {
  setIsLoading(true);
  const results = await search(query);
  setResults(results);
  setIsLoading(false);
};
```

### Use Case 4: Pagination
```typescript
// Show skeleton when loading next page
const handleNextPage = async () => {
  setIsLoading(true);
  const newData = await fetchPage(currentPage + 1);
  setData(newData);
  setIsLoading(false);
};
```

---

## Summary

✅ **Implemented**: Complete loading state system with skeleton screens
✅ **Responsive**: Works on all device sizes
✅ **Accessible**: WCAG compliant
✅ **Performant**: CSS animations, proper optimization
✅ **Maintainable**: Reusable components, clear patterns
✅ **User-Friendly**: Clear feedback during loading

The implementation provides a professional, modern user experience while data is being fetched!
