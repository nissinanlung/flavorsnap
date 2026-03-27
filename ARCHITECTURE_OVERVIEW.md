# FlavorSnap Architecture Overview

## 🏛️ System Architecture

FlavorSnap is a sophisticated **AI-powered food classification platform** built on a modern microservices architecture with blockchain integration. The system consists of five main components working in concert:

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                        │
│                    (Next.js Frontend - 15.3.3)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Express Backend     │  │  Blockchain Integration Layer    │ │
│  │  (TypeScript/Node)   │  │  (Stellar Freighter Wallet)      │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    MACHINE LEARNING LAYER                        │
│          (Flask API - PyTorch ResNet18 Classifier)               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Smart Contracts     │  │  Food Registry                   │ │
│  │  (Soroban - Rust)    │  │  (Rust-based)                    │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. 🎨 Frontend Application

### Technology Stack
- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: TailwindCSS + PostCSS
- **Language**: TypeScript
- **State Management**: TanStack React Query (v5.90.21)
- **i18n**: next-i18next (25.8.13) - Multi-language support
- **Blockchain Integration**: @stellar/freighter-api (6.0.1)
- **Testing**: Jest + React Testing Library

### Architecture & Components

**Key Directories:**
- `pages/` - Route definitions and API routes
- `components/` - Reusable React components including:
  - `ImageUpload.tsx` - Drag-and-drop image upload
  - `AnalyticsCard.tsx` - Performance metrics visualization
  - `CategoryList.tsx` - Food category display
  - `BlockchainWallet.tsx` - Stellar wallet integration
  - `ThemeProvider.tsx` - Dark mode support
  - `LanguageSwitcher.tsx` - Multi-language UI
  - `PWAInstallPrompt.tsx` - Progressive Web App support
  - `RealTimeActivity.tsx` - Live classification updates
  - `SocialShare.tsx` - Social media integration
  - `ModelPerformanceChart.tsx` - Model metrics dashboard

**Features:**
- 📱 **Responsive Design**: Desktop, tablet, mobile-optimized UI
- 🌍 **Internationalization**: English, French, Arabic, Yoruba (RTL support)
- 🌙 **Dark Mode**: Theme Provider for light/dark switching
- 📊 **Analytics Dashboard**: Real-time metrics and historical data
- ⛓️ **Wallet Integration**: Direct Stellar blockchain connectivity
- 🔄 **Real-time Updates**: WebSocket-based live activity feeds
- ♿ **Accessibility**: Full i18n and compliance testing

### Page Structure
```
frontend/
├── pages/
│   ├── index.tsx           # Landing page
│   ├── classify.tsx        # Main classification interface
│   ├── analytics/          # Analytics dashboard
│   └── api/                # Backend API routes
├── components/             # 20+ reusable components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions and helpers
├── lib/                    # Libraries and services
├── public/                 # Static assets
└── styles/                 # Global CSS and Tailwind configs
```

---

## 2. 🧠 ML Model API (Flask Backend)

### Technology Stack
- **Framework**: Flask
- **ML Framework**: PyTorch
- **Model**: ResNet18 trained on Nigerian dish classification
- **Explainability**: Custom Grad-CAM based XAI module
- **Security**: Flask-Limiter, API Key authentication, Input validation
- **Monitoring**: Prometheus metrics, performance tracking
- **Database**: SQLite for model registry and persistence

### Core API Endpoints

#### Classification Endpoints
```
POST /predict
├── Input: Image file (multipart/form-data)
├── Auth: X-API-Key header
├── Rate Limit: Configurable per endpoint
├── Response: {classification, confidence, inference_time}
└── Features: File validation, size limits, security checks

POST /explain/grad-cam
├── Input: Image + target class index
├── Response: Heatmap overlay visualization
└── Explainability: Grad-CAM class activation maps

GET /api/predictions/:id
├── Retrieve: Historical prediction data
└── Response: Detailed prediction metadata
```

#### Model Management
```
GET /api/models
├── List: All registered model versions
└── Filter: active_only parameter

GET /api/models/<version>
├── Details: Specific model metadata
├── Fields: accuracy, loss, epochs, timestamps, tags
└── Status: is_active, is_stable flags

POST /api/models/validate
├── Validate: Model checkpoint integrity
└── Check: Performance metrics and compatibility
```

#### Batch Processing
```
POST /api/batch/upload
├── Files: Multiple images (max 50 per batch)
├── Size: 10MB per file limit
├── Response: Batch job ID for async tracking

GET /api/batch/<job_id>
├── Status: Processing progress
├── Results: Partial or complete classifications

GET /api/batch/<job_id>/results
├── Download: CSV export of batch results
└── Format: classification, confidence, filename
```

#### Analytics & Monitoring
```
GET /api/analytics/usage
├── Data: 30-day usage metrics
├── Metrics: requests, users, accuracy trends

GET /api/analytics/model-performance
├── Models: ResNet18, ResNet34, EfficientNet comparison
├── Metrics: accuracy, inference time, confidence scores

GET /api/monitoring/metrics
├── Prometheus: Scrape-compatible metrics endpoint
└── Metrics: HTTP requests, inference duration, error rates

GET /api/monitoring/health
├── Status: Service health check
└── Components: Model loaded, DB connected, API ready
```

#### XAI (Explainable AI)
```
POST /explain/grad-cam
├── Purpose: Generate visual explanations
├── Input: Image + class index
└── Output: Base64 heatmap overlay

POST /explain/feature-attribution
├── Analyze: Model decision reasoning
└── Response: Feature importance scores
```

### Key Features

**Security Implementation:**
- ✅ API Key validation on protected endpoints
- ✅ Rate limiting: Per-endpoint configurable limits
- ✅ Input validation: File type, size, content checks
- ✅ CORS configuration for frontend
- ✅ Request timeout and resource limits
- ✅ Security headers and monitoring

**Model Management:**
```python
ModelRegistry:
├── Version Control: Track multiple model versions
├── Metadata: accuracy, loss, epochs, timestamps
├── Status: is_active, is_stable flags
├── Tags: Custom tagging system
└── Checksums: Model hash verification
```

**Monitoring & Logging:**
- Prometheus metrics for infrastructure monitoring
- Per-request timing and error tracking
- Model inference performance logging
- Classification history persistence
- Batch processing job tracking

**Performance Features:**
- Batch prediction for multiple images
- Async batch job processing with status tracking
- Optional model caching in memory
- Request compression support
- Database optimization with prepared statements

### Module Structure
```
ml-model-api/
├── app.py                    # Flask app initialization & /predict endpoint
├── api_endpoints.py          # Management & model endpoints
├── batch_endpoints.py        # Batch processing routes
├── category_management.py    # Food class management
├── category_routes.py        # Category listing APIs
├── xai.py                    # Explainable AI implementation
├── xai_routes.py             # XAI endpoints
├── model_registry.py         # Model versioning & registry
├── model_validator.py        # Model validation logic
├── analytics.py              # Analytics data generation
├── monitoring.py             # Prometheus metrics setup
├── batch_processor.py        # Async batch processing
├── persistence.py            # Database operations
├── security_config.py        # Security & validation
├── deployment_manager.py     # Production deployment
├── db_config.py              # Database configuration
├── logger_config.py          # Logging setup
├── swagger_setup.py          # OpenAPI documentation
└── migrations/               # Database migrations
```

---

## 3. 🛠️ Express Backend Server

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js (5.2.1)
- **Language**: TypeScript (5.9.3)
- **Image Processing**: Sharp (0.34.5), Jimp, exif-parser
- **Security**: Helmet (8.1.0)
- **File Upload**: Multer (2.0.2)
- **Database**: MySQL2 (3.18.0)

### Purpose & Responsibilities

The Express backend primarily handles:
1. **Image Upload & Storage** - Multipart form-data file handling
2. **Image Preprocessing** - Optimization before ML processing
3. **File Management** - Organization and cleanup
4. **EXIF Data Handling** - Metadata extraction and processing
5. **Database Operations** - MySQL integration for user data
6. **Security Enforcement** - Helmet middleware, validation

### API Routes

**File Upload Route** (`routes/upload.ts`):
```typescript
POST /api/upload
├── Upload: Single image file via multipart/form-data
├── Validation:
│   ├── File types: JPEG, PNG, WebP, TIFF, BMP
│   ├── Size limit: 10MB
│   └── MIME type verification
├── Processing:
│   ├── Secure filename generation
│   ├── Directory creation if needed
│   ├── Temporary file storage
│   └── EXIF data extraction
├── Response: {
│   filename: string,
│   path: string,
│   size: number,
│   uploadedAt: timestamp
}
└── Error Handling: Clear validation messages
```

**Image Analysis Route** (`routes/analyze.ts`):
```typescript
POST /api/analyze
├── Input: Processed image path or buffer
├── Processing:
│   ├── Sharp-based optimization
│   ├── Format conversion if needed
│   └── Quality compression
├── Output: Analysis-ready image
└── Integration: Passes to ML API for classification
```

### Image Processing Pipeline

```
Upload → Multer validation → Secure storage →
EXIF extraction → Sharp optimization → ML API
```

### Security Measures
- Helmet.js middleware for HTTP headers
- File type whitelist enforcement
- Size limit enforcement (10MB)
- Secure filename generation (prevents directory traversal)
- MIME type validation
- EXIF data sanitization

### Database Integration
- MySQL connectivity via mysql2
- User data persistence
- Upload history tracking
- Image metadata storage

---

## 4. ⛓️ Smart Contracts (Soroban/Stellar)

### Technology Stack
- **Platform**: Stellar Soroban
- **Language**: Rust
- **Contract Type**: Multi-contract system on Stellar testnet/mainnet

### Smart Contracts Overview

#### 1. **Food Registry Contract** 
(`flavorsnap-food-registry/`)

**Purpose**: Immutable on-chain food classification record

**Key Structures:**
```rust
FoodEntry {
    classification: String,      // Predicted dish name
    confidence: u32,             // Confidence score (0-100)
    timestamp: u64,              // Classification timestamp
    verifier: Address,           // Account that verified entry
}
```

**Functions:**
```rust
initialize(admin: Address)
├── Setup: One-time contract initialization
└── Admin: Sets contract administrator

register_food_entry(
    image_hash: String,          // IPFS/sha256 hash of image
    classification: String,       // ML model prediction
    confidence: u32,             // Model confidence %
    verifier: Address            // Verifying party
)
├── Purpose: Record classification on-chain
├── Verification: Ensures data integrity
└── Traceability: Complete audit trail

retrieve_entry(image_hash: String) -> FoodEntry
├── Lookup: Get historical classification
└── Immutability: Cannot modify verified entries
```

**Benefits:**
- ✅ Immutable classification records
- ✅ Transparent audit trail
- ✅ Timestamp verification
- ✅ Multi-verifier support

---

#### 2. **Tokenized Incentive Contract**
(`contracts/tokenized-incentive/`)

**Purpose**: Token-based reward system for accurate classifications and community contributions

**Key Modules:**
```rust
admin.rs
├── Multi-admin management
├── Role-based access control
└── Admin action approval system

token.rs
├── Token minting/burning
├── Transfer functionality
├── Balance tracking
└── Allowance management

vesting.rs
├── Time-locked token releases
├── Vest schedule management
├── Cliff and linear vesting support
└── Early withdraw penalties

types.rs
├── AdminAction enum
├── Token balance structures
└── Vesting schedule definitions
```

**Contract Functions:**
```rust
initialize(
    admins: Vec<Address>,
    max_supply: u64,
    decimals: u32
)
├── Setup token parameters
├── Initialize admin set
└── Set supply cap

mint_tokens(to: Address, amount: u64)
├── Admin-only token creation
└── Supply cap enforcement

transfer_tokens(from, to, amount)
├── User token transfers
├── Balance validation

stake_tokens(amount: u64, duration: u64)
├── Incentivize participation
├── Time-locked rewards
└── Yield calculations
```

**Use Cases:**
- 🎁 Reward accurate classifications
- 👥 Incentivize community contributions
- 📊 Sensory evaluation participation
- 🏆 Model improvement feedback

---

#### 3. **Sensory Evaluation Contract**
(`contracts/sensory-evaluation/`)

**Purpose**: Manage decentralized sensory evaluation and feedback system

**Key Modules:**
```rust
admin.rs
├── Multi-admin governance
├── Evaluator registration
└── Role management

token.rs
├── Evaluation token system
├── Reward distribution
└── Supply management

staking.rs
├── Evaluator stake requirement
├── Reward pool management
├── Slashing mechanisms
└── Unstaking with penalties
```

**Functions:**
```rust
initialize(
    admins: Vec<Address>,
    token_name: String,
    token_symbol: String,
    max_supply: u128,
    decimals: u32
)
├── Setup governance token
├── Configure contract parameters

register_evaluator(evaluator: Address)
├── Onboard quality evaluators
└── Stake requirement enforcement

submit_evaluation(
    classification_id: String,
    rating: u32,           // 1-5 stars
    feedback: String
)
├── Accept evaluator feedback
├── Store evaluation history
└── Update reputation

distribute_rewards(evaluation_id: String)
├── Calculate rewards based on accuracy
├── Distribute tokens to evaluators
└── Update staking rewards
```

**Governance Model:**
- MultiSig approval for critical actions
- Role-based permissions (Admin, Evaluator, Verifier)
- Reputation system with on-chain tracking
- Slash mechanism for low-quality evaluations

---

#### 4. **Model Governance Contract**
(`contracts/model-governance/`)

**Purpose**: Democratic model versioning and deployment decisions

**Features:**
- Model version tracking on-chain
- Voting on model updates
- Performance metric recording
- Deployment approval workflow

---

### Blockchain Integration Layer

**Frontend Integration:**
```typescript
// Stellar Freighter Wallet API
components/BlockchainWallet.tsx
├── User wallet connection
├── Account balance display
├── Transaction signing
└── Smart contract interaction
```

**Transaction Flow:**
```
User Action (in Frontend)
    ↓
Freighter Wallet (User approves)
    ↓
Stellar Network
    ↓
Smart Contract Execution
    ↓
On-chain State Update
    ↓
Frontend Update via subscription
```

---

## 5. 🦀 Rust Food Registry Component

### Technology Stack
- **Language**: Rust (2021 edition)
- **Compilation**: Target agnostic with optimization
- **Smart Contract**: Soroban SDK integration
- **Benchmarking**: Built-in performance tests

### Purpose
Provides high-performance, memory-safe food classification registry with blockchain verification support.

### Cargo Configuration
```toml
[workspace]
members = ["flavorsnap-food-registry"]

[profile.release]
opt-level = "z"          # Maximum optimization
lto = true               # Link-time optimization
panic = "abort"          # Minimize panic handling overhead
codegen-units = 1        # Better optimization
debug-assertions = false # Production optimization
```

### Registry Features
- **Performance**: FFI optimization for blockchain operations
- **Safety**: Memory-safe food classification lookups
- **Persistence**: Contract-backed registry storage
- **Verifiability**: Cryptographic proof support

---

## 🏗️ Architecture Patterns & Key Design Decisions

### 1. **Microservices Separation**
```
Frontend (React/Next.js)
    ↓ HTTP/JSON
Backend (Express)
    ↓ Routes & Image Prep
ML API (Flask)
    ↓ Classification
Database + Registry
Blockchain (Soroban)
```

**Benefits:**
- Independent scaling
- Technology flexibility
- Failure isolation
- Development team parallelization

### 2. **Security Layers**

**Layer 1 - Frontend:**
- Input validation at UI level
- Secure file selection
- CORS enforcement

**Layer 2 - Express Backend:**
- Multer file validation
- MIME type verification
- Helmet security headers
- Rate limiting ready

**Layer 3 - Flask ML API:**
- API key authentication
- Input validation
- Rate limiting per endpoint
- Request/response logging
- Security monitoring

**Layer 4 - Blockchain:**
- Immutable records
- Signature verification
- Role-based access control

### 3. **Data Flow**

**Classification Request:**
```
1. User uploads image (Frontend)
   └── React component handles drag-drop
   
2. Express Backend processes file
   └── Validation → Storage → EXIF extraction
   
3. Flask API receives image
   └── Security checks → Preprocessing → Model inference
   
4. Results classified
   └── Confidence score calculated
   
5. Smart Contract records (optional)
   └── Image hash + classification immutably stored
   
6. Response to Frontend
   └── Classification, confidence, ✅ verified
   
7. Frontend displays results
   └── Analytics updated, history saved
```

### 4. **State Management**

**Frontend State:**
- React Query: Server state (API responses)
- React Context: UI state (theme, language)
- Local Storage: Persistent preferences

**Backend State:**
- SQLite: Model registry, prediction history
- File System: User uploads, model checkpoints
- Redis (optional): Rate limiting, session data

**Blockchain State:**
- Soroban Ledger: Immutable classification records
- Contract Storage: Token balances, staking data

### 5. **Deployment Architecture**

**Docker Containers:**
- `frontend/Dockerfile` - Next.js production build
- `ml-model-api/Dockerfile` - Flask + PyTorch
- `backend/Dockerfile` - Express.js (optional)

**Orchestration:**
- `docker-compose.yml` - Local development
- `docker-compose.prod.yml` - Production
- `kubernetes/` - K8s manifests for scaling

---

## 📊 Technology Stack Matrix

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Frontend** | Next.js | 15.3.3 | Web UI framework |
| | React | 19 | UI components |
| | TypeScript | Latest | Type safety |
| | TailwindCSS | 4 | Styling |
| | i18next | 25.8.13 | Internationalization |
| **Backend** | Express.js | 5.2.1 | API server |
| | TypeScript | 5.9.3 | Type safety |
| | Sharp | 0.34.5 | Image optimization |
| | Helmet | 8.1.0 | Security headers |
| | MySQL2 | 3.18.0 | Database |
| **ML API** | Flask | Latest | REST API framework |
| | PyTorch | Latest | Deep learning |
| | ResNet18 | Trained | Model architecture |
| | Prometheus | Latest | Metrics |
| | SQLite | Latest | Registry DB |
| **Blockchain** | Soroban | Latest | Smart contracts |
| | Rust | 2021 | Contract language |
| | Stellar | Mainnet | Blockchain network |
| **DevOps** | Docker | Latest | Containerization |
| | Kubernetes | Latest | Orchestration |
| | Docker Compose | Latest | Local dev |

---

## 🔐 Security Architecture

### Defense in Depth

**1. API Security**
- API key validation (X-API-Key header)
- CORS origin checking
- Rate limiting (per endpoint, per IP)
- Request size limits (10MB for images)

**2. Input Validation**
- File type whitelist (image/* only)
- MIME type verification
- File size boundaries
- Secure filename generation

**3. Network Security**
- Helmet.js headers (CSP, X-Frame-Options, etc.)
- HTTPS enforcement (production)
- Secure CORS policies
- Request timeout limits

**4. Data Protection**
- Encryption at rest (database)
- Encryption in transit (HTTPS)
- EXIF data sanitization
- Temporary file cleanup

**5. Application Security**
- SQL injection prevention (parameterized queries)
- XSS protection (React/Next.js built-in)
- CSRF token handling
- Secure session management

**6. Blockchain Security**
- Multi-signature contract functions
- Role verification on entry
- Timestamp validation
- Immutable append-only records

---

## 🚀 Scalability Considerations

### Horizontal Scaling

1. **Frontend:** Static hosting on CDN (Vercel, Netlify)
2. **Backend:** Load balancer → Multiple Express instances
3. **ML API:** Flask scaling via Gunicorn workers or K8s pods
4. **Storage:** S3/Blob storage for image uploads
5. **Database:** MySQL replication or managed services

### Vertical Scaling
- Increase container resources (CPU, memory)
- Upgrade model inference hardware (GPU)
- Database connection pooling and caching

### Caching Strategy
- Frontend: Browser cache, SWR (stale-while-revalidate)
- Backend: Redis for rate limiting and session data
- ML: Model caching in memory, inference result caching
- CDN: Static assets and API response caching

---

## 📈 Performance Characteristics

**API Response Times:**
- Image Upload: 100-500ms (depends on size)
- Classification: 200-500ms (ResNet18 inference)
- Batch Processing: 5-50s per 50 images
- Explainability (Grad-CAM): 500ms-2s

**Resource Usage:**
- Model Memory: ~45MB (ResNet18)
- API Container: 500MB-1GB RAM
- Frontend Bundle: ~200KB (gzipped)
- Database: Scales with prediction history

---

## 🎯 Summary

FlavorSnap represents a **production-grade, enterprise-scale** AI food classification system with:

✅ **Separation of Concerns** - Clear domain boundaries  
✅ **Type Safety** - TypeScript throughout  
✅ **Security** - Multi-layered defense  
✅ **Scalability** - Microservices architecture  
✅ **Transparency** - Blockchain integration  
✅ **Analytics** - Comprehensive monitoring  
✅ **Accessibility** - i18n & responsive design  
✅ **Explainability** - Grad-CAM visual explanations  

The architecture supports both **ease of development** and **production reliability**, making it suitable for rapid iteration during development and confident deployment in production environments.
