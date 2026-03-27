# Environment Variable Validation Guide

## Overview

The FlavorSnap frontend now includes a comprehensive environment variable validation system that ensures all required variables are properly configured and typed before runtime.

## Files

- **`config/env.ts`**: Core validation schema and utilities
- **`next.config.ts`**: Build-time validation and configuration
- **`.env.example`**: Template for all environment variables

## Key Features

### ✅ Build-Time Validation
Environment variables are validated when you run `npm run build`. Invalid configurations cause the build to fail with clear error messages.

```bash
npm run build  # Validates all env vars before building
```

### ✅ Type-Safe Access
All environment variables are accessed through a centralized `validatedEnv` object with full TypeScript support:

```typescript
import { validatedEnv } from '@/config/env';

// Type-safe access with defaults
const apiUrl = validatedEnv.apiUrl;        // http://localhost:5000
const isAnalytics = validatedEnv.analyticsEnabled;  // true/false
const timeout = validatedEnv.apiTimeout;   // 30000
```

### ✅ Automatic Fallbacks
All variables have sensible defaults, so the app works out-of-the-box without configuration:

```typescript
// These have defaults and won't fail if not set:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GA_MEASUREMENT_ID=""  // empty by default
NEXT_PUBLIC_CONTRACT_ADDRESS=""   // empty by default
```

### ✅ Format Validation
Variables are validated against their expected format:
- URLs are verified to be valid URLs
- Numbers are checked to be numeric and positive
- Booleans accept: true/false, 1/0, yes/no
- Enums are restricted to allowed values

## Usage Examples

### In React Components

```typescript
import { validatedEnv } from '@/config/env';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Check if analytics is enabled
  if (validatedEnv.analyticsEnabled && validatedEnv.gaId) {
    initializeGA(validatedEnv.gaId);
  }

  return <>{children}</>;
}
```

### In API Routes

```typescript
import { validatedEnv } from '@/config/env';

export async function GET() {
  try {
    const response = await fetch(`${validatedEnv.apiUrl}/api/health`, {
      timeout: validatedEnv.apiTimeout,
    });
    return Response.json({ status: 'ok' });
  } catch (error) {
    return Response.json({ error: 'API unavailable' }, { status: 503 });
  }
}
```

### In Utilities

```typescript
import { validatedEnv, checkEnvRequirement } from '@/config/env';

export function initializeBlockchain() {
  // Warn if blockchain feature is not properly configured
  checkEnvRequirement('contractAddress', 'Contract address not configured');
  
  if (!validatedEnv.contractAddress) {
    console.warn('Blockchain features disabled');
    return;
  }

  // Initialize blockchain connection
  connectToSoroban({
    network: validatedEnv.stellarNetwork,
    rpcUrl: validatedEnv.sorobanRpcUrl,
    contractAddress: validatedEnv.contractAddress,
  });
}
```

## Environment Variable Reference

### API Configuration

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | No | URL |
| `NEXT_PUBLIC_MODEL_ENDPOINT` | `/api/predict` | No | String |
| `API_TIMEOUT` | `30000` | No | Number (ms) |
| `API_RETRY_ATTEMPTS` | `3` | No | Number |

### Analytics

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `` (empty) | No | String (GA ID format) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | No | Boolean |

### Blockchain / Stellar

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `` (empty) | No | String |
| `NEXT_PUBLIC_ENABLE_BLOCKCHAIN` | `true` | No | Boolean |
| `STELLAR_NETWORK` | `testnet` | No | `testnet` \| `mainnet` |
| `SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` | No | URL |

### Feature Flags

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | No | Boolean |
| `NEXT_PUBLIC_ENABLE_BLOCKCHAIN` | `true` | No | Boolean |
| `NEXT_PUBLIC_ENABLE_PWA` | `true` | No | Boolean |

### Build & Configuration

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `NODE_ENV` | `development` | No | `development` \| `production` \| `test` |
| `NEXT_PUBLIC_BUILD_ID` | Today's date | No | String |
| `LOG_LEVEL` | `info` | No | `error` \| `warn` \| `info` \| `debug` \| `trace` |

### File Upload (Backend)

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `MAX_FILE_SIZE` | `10485760` (10MB) | No | Number (bytes) |
| `ALLOWED_FILE_TYPES` | `jpg,jpeg,png,gif,webp` | No | Comma-separated |

### Model Configuration (Backend)

| Variable | Default | Required | Format |
|----------|---------|----------|--------|
| `MODEL_PATH` | `models/best_model.pth` | No | String |
| `CLASSES_PATH` | `food_classes.txt` | No | String |

## Setup Instructions

### Local Development

```bash
# 1. Copy the template
cp frontend/.env.example frontend/.env.local

# 2. Update variables (optional - defaults should work)
# Edit .env.local with your values

# 3. Start development
npm run dev
```

### Production (Docker)

```bash
# Set environment variables in docker-compose.yml or .env
docker-compose build
docker-compose up
```

### Production (Vercel/Netlify)

Set these in your platform's environment variables:
- `NEXT_PUBLIC_API_URL` - Your production API endpoint
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Your GA measurement ID
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Production contract address (if using blockchain)
- `STELLAR_NETWORK` - Set to `mainnet`

## Validation Error Examples

### Build-Time Error - Missing Invalid URL

```
❌ Environment Validation Failed:
  • Invalid NEXT_PUBLIC_API_URL: "not-a-url" is not a valid URL
    Description: Base URL for backend API
```

**Fix:**
```bash
# In .env.local or production settings
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Build-Time Error - Invalid Number

```
❌ Environment Validation Failed:
  • Invalid MAX_FILE_SIZE: "not-a-number" must be a positive number
    Description: Maximum file upload size in bytes
```

**Fix:**
```bash
# In .env.local or production settings
MAX_FILE_SIZE=10485760
```

### Build-Time Warning - Using Default

```
⚠️ Environment Warnings:
  • NEXT_PUBLIC_GA_MEASUREMENT_ID not set, using default: 
  • NEXT_PUBLIC_CONTRACT_ADDRESS not set, using default: 
```

This is normal if you're not using these features. No action needed.

## Advanced Usage

### Getting All Public Environment Variables

```typescript
import { getPublicEnv } from '@/config/env';

// Returns only NEXT_PUBLIC_* variables for client-side use
const publicConfig = getPublicEnv();
console.log(publicConfig);
```

### Logging Configuration for Debugging

```typescript
import { logEnvironmentConfig } from '@/config/env';

// In development only, logs current env configuration
logEnvironmentConfig(process.env.NODE_ENV === 'development');
```

### Runtime Environment Check

```typescript
import { validateEnvironment } from '@/config/env';

const validation = validateEnvironment();
if (!validation.valid) {
  console.error('Configuration issues:', validation.errors);
  validation.warnings.forEach(w => console.warn(w));
}
```

### Typed Environment Getter Functions

```typescript
import { envGetters } from '@/config/env';

// Get individual values with proper type conversion
const url = envGetters.getValue('NEXT_PUBLIC_API_URL') || 'http://localhost:5000';
const enabled = envGetters.getBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', false);
const timeout = envGetters.getNumber('API_TIMEOUT', 30000);
```

## Troubleshooting

### Issue: "Build failed due to invalid environment configuration"

1. Check the error message for which variable is causing the issue
2. Look at the expected format in the error message
3. Update your `.env.local` or production environment settings
4. Try building again: `npm run build`

### Issue: App uses default value instead of my setting

1. Verify the variable is spelled correctly (case-sensitive)
2. For `NEXT_PUBLIC_*` variables, they must start with `NEXT_PUBLIC_` to be available client-side
3. Verify the `.env.local` file is in the `frontend/` directory
4. Restart the development server: `npm run dev`

### Issue: Feature seems disabled even though I set it to 'true'

Check that you're using valid boolean values:
- ✅ Valid: `true`, `false`, `1`, `0`, `yes`, `no`
- ❌ Invalid: `True`, `FALSE`, `enabled`, `disabled`

### Issue: Can't find validatedEnv in my component

Make sure to import from the correct path:
```typescript
import { validatedEnv } from '@/config/env';  // ✅ Correct
```

Not:
```typescript
import { validatedEnv } from '../config/env';  // ❌ Wrong path
```

## Best Practices

1. **Always use `validatedEnv`** instead of accessing `process.env` directly
   ```typescript
   // ✅ Good
   const url = validatedEnv.apiUrl;
   
   // ❌ Avoid
   const url = process.env.NEXT_PUBLIC_API_URL;
   ```

2. **Check feature flags before using features**
   ```typescript
   if (validatedEnv.analyticsEnabled && validatedEnv.gaId) {
     initializeAnalytics();
   }
   ```

3. **Use type-specific getters for flexibility**
   ```typescript
   const timeout = validatedEnv.apiTimeout;  // Use this in most cases
   const customTimeout = envGetters.getNumber('CUSTOM_TIMEOUT', 5000);  // For custom vars
   ```

4. **Document required variables in deployment guides**
   ```markdown
   Required environment variables for production:
   - NEXT_PUBLIC_API_URL
   - NEXT_PUBLIC_GA_MEASUREMENT_ID (if using analytics)
   - STELLAR_NETWORK (set to 'mainnet')
   ```

## See Also

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [`.env.example`](.env.example) - Complete list of all available variables
- [`config/env.ts`](config/env.ts) - Implementation details and type definitions
- [`next.config.ts`](next.config.ts) - Build-time configuration
