/**
 * Environment Variable Validation Schema
 * 
 * This module validates and provides type-safe access to environment variables
 * with proper fallbacks and validation rules. Ensures runtime safety and
 * provides clear error messages for missing critical variables.
 * 
 * Note: Requires @types/node to be installed (already in devDependencies)
 */

/**
 * Environment variable definitions with validation rules and fallbacks
 */
interface EnvVarDef {
  /** Variable name */
  name: string;
  /** Whether this variable is required */
  required: boolean;
  /** Default value if not provided */
  default?: string | number | boolean;
  /** Validation function */
  validate?: (value: string) => boolean | string;
  /** Human-readable description */
  description: string;
  /** Whether to expose this in client bundle (NEXT_PUBLIC_ prefix) */
  clientSide: boolean;
}

/**
 * Validator functions for common patterns
 */
const validators = {
  url: (value: string): boolean | string => {
    try {
      new URL(value);
      return true;
    } catch {
      return `"${value}" is not a valid URL`;
    }
  },
  
  number: (value: string): boolean | string => {
    const num = Number(value);
    return !isNaN(num) ? true : `"${value}" is not a valid number`;
  },
  
  positiveNumber: (value: string): boolean | string => {
    const num = Number(value);
    return !isNaN(num) && num > 0 ? true : `"${value}" must be a positive number`;
  },
  
  boolean: (value: string): boolean | string => {
    return ['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())
      ? true
      : `"${value}" is not a valid boolean (use true/false, 1/0, yes/no)`;
  },
  
  enum: (allowedValues: string[]) => (value: string): boolean | string => {
    return allowedValues.includes(value)
      ? true
      : `"${value}" must be one of: ${allowedValues.join(', ')}`;
  },
};

/**
 * Environment variable schema definition
 */
const envSchema: Record<string, EnvVarDef> = {
  // Next.js specific
  NODE_ENV: {
    name: 'NODE_ENV',
    required: false,
    default: 'development',
    validate: validators.enum(['development', 'production', 'test']),
    description: 'Node.js environment',
    clientSide: false,
  },

  // API Configuration
  NEXT_PUBLIC_API_URL: {
    name: 'NEXT_PUBLIC_API_URL',
    required: false,
    default: 'http://localhost:5000',
    validate: validators.url,
    description: 'Base URL for backend API',
    clientSide: true,
  },

  NEXT_PUBLIC_MODEL_ENDPOINT: {
    name: 'NEXT_PUBLIC_MODEL_ENDPOINT',
    required: false,
    default: '/api/predict',
    description: 'ML model prediction endpoint',
    clientSide: true,
  },

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: {
    name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    default: '',
    description: 'Google Analytics measurement ID',
    clientSide: true,
  },

  // Blockchain/Stellar
  NEXT_PUBLIC_CONTRACT_ADDRESS: {
    name: 'NEXT_PUBLIC_CONTRACT_ADDRESS',
    required: false,
    default: '',
    description: 'Stellar smart contract address',
    clientSide: true,
  },

  STELLAR_NETWORK: {
    name: 'STELLAR_NETWORK',
    required: false,
    default: 'testnet',
    validate: validators.enum(['testnet', 'mainnet']),
    description: 'Stellar network (testnet or mainnet)',
    clientSide: false,
  },

  SOROBAN_RPC_URL: {
    name: 'SOROBAN_RPC_URL',
    required: false,
    default: 'https://soroban-testnet.stellar.org',
    validate: validators.url,
    description: 'Soroban RPC endpoint URL',
    clientSide: false,
  },

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: {
    name: 'NEXT_PUBLIC_ENABLE_ANALYTICS',
    required: false,
    default: 'true',
    validate: validators.boolean,
    description: 'Enable analytics tracking',
    clientSide: true,
  },

  NEXT_PUBLIC_ENABLE_BLOCKCHAIN: {
    name: 'NEXT_PUBLIC_ENABLE_BLOCKCHAIN',
    required: false,
    default: 'true',
    validate: validators.boolean,
    description: 'Enable blockchain features',
    clientSide: true,
  },

  NEXT_PUBLIC_ENABLE_PWA: {
    name: 'NEXT_PUBLIC_ENABLE_PWA',
    required: false,
    default: 'true',
    validate: validators.boolean,
    description: 'Enable Progressive Web App features',
    clientSide: true,
  },

  // Build Configuration
  NEXT_PUBLIC_BUILD_ID: {
    name: 'NEXT_PUBLIC_BUILD_ID',
    required: false,
    default: new Date().toISOString().split('T')[0],
    description: 'Build identifier',
    clientSide: true,
  },

  // Database/Model Configuration (backend)
  MODEL_PATH: {
    name: 'MODEL_PATH',
    required: false,
    default: 'models/best_model.pth',
    description: 'Path to ML model file',
    clientSide: false,
  },

  CLASSES_PATH: {
    name: 'CLASSES_PATH',
    required: false,
    default: 'food_classes.txt',
    description: 'Path to model classes file',
    clientSide: false,
  },

  // File Upload
  MAX_FILE_SIZE: {
    name: 'MAX_FILE_SIZE',
    required: false,
    default: '10485760', // 10MB
    validate: validators.positiveNumber,
    description: 'Maximum file upload size in bytes',
    clientSide: false,
  },

  ALLOWED_FILE_TYPES: {
    name: 'ALLOWED_FILE_TYPES',
    required: false,
    default: 'jpg,jpeg,png,gif,webp',
    description: 'Comma-separated list of allowed file extensions',
    clientSide: false,
  },

  // API Configuration
  API_TIMEOUT: {
    name: 'API_TIMEOUT',
    required: false,
    default: '30000',
    validate: validators.positiveNumber,
    description: 'API request timeout in milliseconds',
    clientSide: false,
  },

  API_RETRY_ATTEMPTS: {
    name: 'API_RETRY_ATTEMPTS',
    required: false,
    default: '3',
    validate: validators.positiveNumber,
    description: 'Number of API retry attempts',
    clientSide: false,
  },

  // Logging
  LOG_LEVEL: {
    name: 'LOG_LEVEL',
    required: false,
    default: 'info',
    validate: validators.enum(['error', 'warn', 'info', 'debug', 'trace']),
    description: 'Application log level',
    clientSide: false,
  },
};

/**
 * Validation result type
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates all environment variables against schema
 */
function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.values(envSchema).forEach((def) => {
    const value = process.env[def.name];

    // Check if required variable is missing
    if (def.required && !value && def.default === undefined) {
      errors.push(
        `Missing required environment variable: ${def.name}\n  Description: ${def.description}`
      );
      return;
    }

    // Validate if value is provided
    if (value !== undefined) {
      if (def.validate) {
        const validationResult = def.validate(value);
        if (validationResult !== true) {
          errors.push(
            `Invalid ${def.name}: ${validationResult}\n  Description: ${def.description}`
          );
        }
      }
    }

    // Warn about using defaults
    if (!value && def.default !== undefined) {
      warnings.push(
        `${def.name} not set, using default: ${def.default}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get environment variable with type coercion
 */
function getEnvValue(name: string, defaultValue?: string | number | boolean): string | undefined {
  const value = process.env[name];
  const def = envSchema[name];
  const fallback = value || (def?.default ?? defaultValue);
  return fallback?.toString();
}

/**
 * Get environment variable as boolean
 */
function getEnvBoolean(name: string, defaultValue: boolean = false): boolean {
  const value = getEnvValue(name);
  if (!value) return defaultValue;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
}

/**
 * Get environment variable as number
 */
function getEnvNumber(name: string, defaultValue: number = 0): number {
  const value = getEnvValue(name);
  if (!value) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Validated environment configuration
 * This object is safe to use throughout the application
 */
export const validatedEnv = {
  // Node.js environment
  nodeEnv: (getEnvValue('NODE_ENV') || 'development') as 'development' | 'production' | 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // API Configuration
  apiUrl: getEnvValue('NEXT_PUBLIC_API_URL') || 'http://localhost:5000',
  modelEndpoint: getEnvValue('NEXT_PUBLIC_MODEL_ENDPOINT') || '/api/predict',
  apiTimeout: getEnvNumber('API_TIMEOUT', 30000),
  apiRetryAttempts: getEnvNumber('API_RETRY_ATTEMPTS', 3),

  // Analytics
  gaId: getEnvValue('NEXT_PUBLIC_GA_MEASUREMENT_ID') || '',
  analyticsEnabled: getEnvBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', true),

  // Blockchain/Stellar
  contractAddress: getEnvValue('NEXT_PUBLIC_CONTRACT_ADDRESS') || '',
  blockchainEnabled: getEnvBoolean('NEXT_PUBLIC_ENABLE_BLOCKCHAIN', true),
  stellarNetwork: (getEnvValue('STELLAR_NETWORK') || 'testnet') as 'testnet' | 'mainnet',
  sorobanRpcUrl: getEnvValue('SOROBAN_RPC_URL') || 'https://soroban-testnet.stellar.org',

  // Feature Flags
  pwaEnabled: getEnvBoolean('NEXT_PUBLIC_ENABLE_PWA', true),

  // Build Configuration
  buildId: getEnvValue('NEXT_PUBLIC_BUILD_ID') || new Date().toISOString().split('T')[0],

  // File Upload
  maxFileSize: getEnvNumber('MAX_FILE_SIZE', 10485760),
  allowedFileTypes: (getEnvValue('ALLOWED_FILE_TYPES') || 'jpg,jpeg,png,gif,webp').split(',').map(t => t.trim()),

  // Model Configuration
  modelPath: getEnvValue('MODEL_PATH') || 'models/best_model.pth',
  classesPath: getEnvValue('CLASSES_PATH') || 'food_classes.txt',

  // Logging
  logLevel: (getEnvValue('LOG_LEVEL') || 'info') as 'error' | 'warn' | 'info' | 'debug' | 'trace',
} as const;

/**
 * Export for internal use
 */
export const envGetters = {
  getValue: getEnvValue,
  getBoolean: getEnvBoolean,
  getNumber: getEnvNumber,
};

/**
 * Validate environment on application start
 * Returns validation result
 */
export function validateEnvironment(): ValidationResult {
  return validateEnv();
}

/**
 * Get all environment variables for debugging
 * Only includes NEXT_PUBLIC_ variables in production for security
 */
export function getPublicEnv(): Record<string, string | boolean | number> {
  const env: Record<string, string | boolean | number> = {};
  
  Object.entries(envSchema).forEach(([key, def]) => {
    if (def.clientSide) {
      const value = process.env[key];
      if (value !== undefined) {
        if (def.name.includes('ENABLE') || def.validate === validators.boolean) {
          env[key] = getEnvBoolean(key, false);
        } else if (def.validate === validators.number || def.validate === validators.positiveNumber) {
          env[key] = getEnvNumber(key, 0);
        } else {
          env[key] = value;
        }
      } else if (def.default !== undefined) {
        env[key] = def.default;
      }
    }
  });

  return env;
}

/**
 * Log environment configuration for debugging
 */
export function logEnvironmentConfig(isDevelopment: boolean = false): void {
  if (!isDevelopment && process.env.NODE_ENV === 'production') {
    return; // Don't log sensitive info in production
  }

  console.log('\n=== Environment Configuration ===');
  console.log(`Node Env: ${validatedEnv.nodeEnv}`);
  console.log(`API URL: ${validatedEnv.apiUrl}`);
  console.log(`Analytics: ${validatedEnv.analyticsEnabled}`);
  console.log(`Blockchain: ${validatedEnv.blockchainEnabled}`);
  console.log(`PWA: ${validatedEnv.pwaEnabled}`);
  console.log(`Log Level: ${validatedEnv.logLevel}`);
  console.log('==================================\n');
}

/**
 * Assertion hook for runtime validation checks
 * Use this in React components or API routes to ensure required features are available
 * 
 * @example
 * if (validatedEnv.analyticsEnabled) {
 *   initializeAnalytics(validatedEnv.gaId);
 * }
 */
export function checkEnvRequirement(
  feature: keyof typeof validatedEnv,
  errorMessage?: string
): void {
  const value = validatedEnv[feature];
  
  if (!value || (typeof value === 'string' && value === '')) {
    const message = errorMessage || `Required feature not available: ${feature}`;
    console.warn(`⚠️ ${message}`);
  }
}

/**
 * Initialize environment and log warnings/errors
 * Call this in your app's root component or _app.tsx
 */
export function initializeEnvironment(): void {
  if (typeof window === 'undefined') {
    // Server-side initialization
    const validation = validateEnvironment();
    
    if (!validation.valid) {
      console.error('\n❌ Environment Validation Errors:');
      validation.errors.forEach(error => {
        console.error(`  ${error}`);
      });
      
      // In development, we might want to warn but continue
      // In production, this should be caught at build time
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Critical environment validation failed');
      }
    }
    
    if (validation.warnings.length > 0) {
      console.warn('\n⚠️ Environment Warnings:');
      validation.warnings.forEach(warning => {
        console.warn(`  ${warning}`);
      });
    }
  } else {
    // Client-side initialization
    // Silently verify public env vars are available
    const publicEnv = getPublicEnv();
    if (Object.keys(publicEnv).length === 0 && process.env.NODE_ENV === 'development') {
      console.warn('ℹ️ No public environment variables detected');
    }
  }
}

export default validatedEnv;
