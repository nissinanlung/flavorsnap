# 🍲 FlavorSnap - Comprehensive Project Understanding

## Executive Summary

**FlavorSnap** is an AI-powered food classification web application that uses computer vision to instantly identify food dishes from user-uploaded images. Built as a modern microservices architecture, it combines React/Next.js frontend, Flask ML API, Express backend, and blockchain smart contracts for transparency and governance.

---

## 🎯 Project Goals & Purpose

1. **AI Classification**: Use deep learning (ResNet18) to identify Nigerian food dishes
2. **User-Friendly**: Provide instant feedback with confidence scores and recommendations
3. **Transparency**: Leverage blockchain (Stellar/Soroban) to create immutable records
4. **Explainability**: Show users why the AI made specific predictions (Grad-CAM)
5. **Accessibility**: WCAG 2.1 AA compliant for all users
6. **Internationalization**: Multi-language support (English, French, Arabic, Yoruba)

---

## 🏗️ Architecture Overview: 5-Tier Microservices

### Layer 1: Frontend (Next.js/React)
**Location**: `frontend/` directory

**Technologies**:
- Next.js 15 with React 19
- TypeScript for type safety
- TailwindCSS for styling
- i18next for internationalization (i18n)
- @tanstack/react-query for data fetching
- @stellar/freighter-api for blockchain wallet integration

**Key Features**:
- Multi-language support: English, French, Arabic (RTL), Yoruba
- Real-time activity tracking
- Dark mode support
- Progressive Web App (PWA)
- Social sharing capabilities
- Voice recognition
- Analytics dashboard
- 20+ reusable React components

**Main Sections**:
- `/pages/`: Next.js pages including index, classify page, API routes
- `/components/`: Reusable UI components (ImageUpload, Analytics, BlockchainWallet)
- `/hooks/`: Custom React hooks
- `/lib/`: Utility libraries
- `/styles/`: Global CSS and Tailwind configuration
- `/__tests__/`: Jest test files

### Layer 2: ML API (Flask + PyTorch)
**Location**: `ml-model-api/` directory

**Technologies**:
- Flask 3.0+ web framework
- PyTorch 2.0+ with ResNet18 model
- scikit-learn for ML metrics
- OpenCV for image processing
- Panel for dashboard visualization
- Prometheus for monitoring

**Key Endpoints**:
- `POST /predict`: Single image classification
  - Input: Food image
  - Output: Class label, confidence score, top-5 predictions
  - Latency: 200-500ms
  
- `POST /batch`: Batch processing
  - Supports: Up to 50 images per request
  - Max size: 10MB per image
  - Useful for bulk classification tasks

- `GET /explain/grad-cam`: Visual explanations
  - Returns heatmap showing which parts of image influenced prediction
  - Explainable AI (XAI) feature for transparency

- `GET /health`: Health check endpoint

**Key Files**:
- `app.py`: Main Flask application
- `api_endpoints.py`: Route definitions
- `model_loader.py`: Model initialization and caching
- `model_validator.py`: Model accuracy validation
- `analytics.py`: Classification metrics tracking
- `monitoring.py`: Performance monitoring
- `xai.py`: Explainable AI (Grad-CAM) implementation
- `batch_processor.py`: Batch processing logic
- `model_registry.py`: Model versioning and management
- `rate_limiter.py`: API rate limiting
- `swagger_setup.py`: OpenAPI documentation

**Security Features**:
- API key authentication
- Rate limiting (configurable per endpoint)
- Input validation and sanitization
- CORS configuration
- Request logging and auditing

### Layer 3: Express Backend (Image Processing)
**Location**: `backend/` directory

**Technologies**:
- Express.js 5.x
- TypeScript 5.x
- Multer for file uploads
- Sharp for image processing
- EXIF-parser for metadata extraction
- Helmet for security headers

**Key Responsibilities**:
- Handle image uploads from frontend
- Extract EXIF metadata (camera info, location, timestamp)
- Optimize images using Sharp
- Validate file types and sizes
- Preprocess images before ML API
- Return processed images to frontend

### Layer 4: Smart Contracts (Soroban/Rust on Stellar)
**Location**: `contracts/` directory

**Four Contract Types**:

1. **Food Registry Contract** (`model-governance/`)
   - Stores immutable classification records on blockchain
   - Records: user, image hash, predicted class, timestamp, confidence

2. **Tokenized Incentive Contract** (`tokenized-incentive/`)
   - Rewards users for participating in model improvement
   - Token vesting schedule
   - Governance voting on incentives

3. **Sensory Evaluation Contract** (`sensory-evaluation/`)
   - Collects human feedback on predictions
   - Evaluator ratings and comments
   - Builds consensus on classification accuracy

4. **Model Governance Contract** (`model-governance/`)
   - Democratic voting on model updates
   - Version management
   - Upgrade proposal and approval workflow

**Blockchain Benefits**:
- Immutable audit trail
- Transparent governance
- User incentivization
- Decentralized decision-making

### Layer 5: Rust Food Registry
**Location**: `flavorsnap-food-registry/` directory

**Purpose**:
- High-performance, memory-safe registry of food classifications
- Efficient querying of food database
- Integration with smart contracts

---

## 📦 Technology Stack Summary

| Layer | Component | Technologies |
|-------|-----------|---------------|
| Frontend | Web UI | Next.js 15, React 19, TypeScript, TailwindCSS |
| ML API | Inference | Flask, PyTorch, scikit-learn, OpenCV |
| Backend | Image Processing | Express.js, TypeScript, Sharp, Multer |
| Blockchain | Governance | Soroban, Rust, Stellar Network |
| Registry | Database | Rust, High-performance storage |
| Deployment | Containerization | Docker, Docker Compose, Kubernetes |
| Monitoring | Observability | Prometheus, Panel dashboards |
| Security | Protection | API keys, rate limiting, Helmet, input validation |

---

## 📊 Data Flow

```
User Uploads Image
    ↓
Express Backend (Image Preprocessing)
    ↓
Image Optimization & Validation
    ↓
Flask ML API (ResNet18 Inference)
    ↓
Classification Result + Confidence Score
    ↓
Optional: Grad-CAM Explanation
    ↓
Record to Blockchain (Food Registry)
    ↓
Display Results to Frontend
    ↓
Update Analytics Dashboard
```

---

## 🔒 Security Architecture

### Multiple Layers of Protection:

1. **Input Validation**
   - File type checking (only images)
   - File size limits
   - Image resolution validation

2. **API Security**
   - API key authentication
   - Rate limiting (default: 100 requests/minute per user)
   - CORS configuration
   - Helmet security headers

3. **Data Protection**
   - Sensitive environment variables in .env files
   - Redis for secure session management
   - Bleach for HTML sanitization
   - Password hashing (for admin features)

4. **Network Security**
   - Docker network isolation
   - HTTPS in production
   - Secure API endpoints
   - Request logging and monitoring

---

## 📈 Performance Characteristics

| Metric | Value |
|--------|-------|
| **Classification Latency** | 200-500ms |
| **Model Size** | 45MB (model.pth) |
| **Batch Processing** | Up to 50 images, 10MB each |
| **Max Concurrent Users** | Configurable (default: 1000) |
| **Memory Usage** | ~2GB for ML API |
| **Throughput** | ~2-5 predictions/second (single GPU) |

---

## 📁 Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `frontend/` | Next.js web application (React components, pages, styling) |
| `ml-model-api/` | Flask ML inference server with all endpoints |
| `backend/` | Express image preprocessing and upload handling |
| `contracts/` | Soroban smart contracts for blockchain integration |
| `flavorsnap-food-registry/` | Rust-based high-performance food registry |
| `dataset/` | Training images organized by food class |
| `models/` | Trained PyTorch model (model.pth) and metadata |
| `config/` | YAML configuration files for dev/prod/test |
| `docs/` | Comprehensive documentation (installation, structure, troubleshooting) |
| `kubernetes/` | K8s manifests for production deployment |
| `scripts/` | Automation scripts (installation, environment checks, analysis) |
| `uploads/` | User-uploaded images organized by prediction class |

---

## 🚀 Deployment Options

### 1. **Docker (Recommended for Development)**
```bash
docker-compose up
# Starts: Frontend (3000), ML API (5000), Backend (5001), Redis, MySQL
```

### 2. **Docker Compose with Environments**
- `docker-compose.yml`: Multi-service setup
- `docker-compose.dev.yml`: Development with hot-reload
- `docker-compose.prod.yml`: Production-optimized
- `docker-compose.test.yml`: Testing environment

### 3. **Kubernetes (Production)**
- Location: `kubernetes/` directory
- Includes: deployment.yaml, service.yaml, ingress configs
- Scalable and self-healing infrastructure

### 4. **Manual Installation (Development)**
- Python 3.9+ for ML API
- Node.js 18+ for Frontend/Backend
- MySQL and Redis for data persistence

---

## 🧪 Testing Structure

Test files throughout the project:
- `test_analytics.py`: Analytics metrics testing
- `test_error_handling.py`: Error scenarios
- `test_export_functionality.py`: Export features
- `test_preprocessing.py`: Image preprocessing
- `test_realtime.py`: Real-time features
- Frontend tests: `frontend/__tests__/` with Jest

---

## 🎯 Key Features Implemented

### Core ML Features
- ✅ Food image classification (ResNet18)
- ✅ Confidence scoring
- ✅ Top-5 predictions
- ✅ Batch processing
- ✅ Model versioning
- ✅ A/B testing framework

### User Features
- ✅ Image upload with drag-and-drop
- ✅ Real-time classification results
- ✅ Classification history
- ✅ Analytics dashboard
- ✅ Social sharing
- ✅ Multi-language support (4 languages)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode
- ✅ Accessibility (WCAG 2.1 AA)

### Advanced Features
- ✅ Explainable AI (Grad-CAM heatmaps)
- ✅ Blockchain immutability
- ✅ Tokenized incentive system
- ✅ Governance voting
- ✅ Performance monitoring
- ✅ Error tracking and reporting
- ✅ Voice recognition
- ✅ PWA capabilities

---

## 📊 Configuration Management

**Files**: `config/` directory
- `default.yaml`: Base settings
- `development.yaml`: Dev-specific overrides
- `production.yaml`: Prod-specific optimizations
- `config_manager.py`: Python configuration loader

**Environment Variables**: `.env` file
- Database credentials
- API keys
- Model paths
- Rate limiting settings
- Feature flags

---

## 📚 Documentation Resources

| Document | Purpose |
|----------|---------|
| [project_structure.md](docs/project_structure.md) | Directory and file organization |
| [installation.md](docs/installation.md) | Setup instructions for all platforms |
| [development_workflow.md](docs/development_workflow.md) | Development best practices |
| [configuration.md](docs/configuration.md) | Configuration options |
| [troubleshooting.md](docs/troubleshooting.md) | Common issues and solutions |
| [file_purposes.md](docs/file_purposes.md) | What each file does |

---

## 🤝 Project Workflows

### 1. **User Classification Workflow**
1. User uploads image via Next.js frontend
2. Express backend validates and preprocesses
3. Flask API performs classification
4. Results returned with confidence score
5. Optional Grad-CAM explanation generated
6. Results recorded to blockchain
7. Analytics updated
8. User sees results with recommendations

### 2. **Model Improvement Workflow**
1. Collect human feedback via Sensory Evaluation contract
2. Aggregate feedback using scikit-learn metrics
3. A/B test new model versions
4. Governance voting on model upgrades
5. Deploy approved model version
6. Incentivize evaluators with tokens

### 3. **Development Workflow**
1. Create feature branch
2. Develop in dev environment (`docker-compose.dev.yml`)
3. Run tests (frontend + backend)
4. Submit PR with description
5. Code review and CI/CD checks
6. Merge to main
7. Deploy to production via Kubernetes

---

## 🔄 Integration Points

### Frontend → Backend
- REST API calls to Express for image processing
- WebSocket for real-time updates

### Frontend → ML API
- HTTP requests to `/predict` endpoint
- Batch requests to `/batch` endpoint

### ML API → Models
- Load PyTorch ResNet18 model
- Load metadata and class definitions

### Blockchain Integration
- Frontend uses Freighter wallet for transactions
- Smart contracts record classifications
- Aggregate user ratings and governance voting

### Database
- Express and ML API store/query MySQL
- Redis for session management and caching

---

## 💡 Key Design Decisions

1. **Microservices Architecture**: Independent scaling and deployment
2. **TypeScript Everywhere**: Type safety across full stack
3. **Blockchain for Trust**: Immutable records strengthen user confidence
4. **Explainable AI**: Grad-CAM builds transparency
5. **Multi-Language Support**: Accessible to global audience
6. **Docker Containerization**: Consistent dev/prod environments
7. **PyTorch Over TensorFlow**: Pythonic API, strong PyData ecosystem
8. **Stellar Network**: Low-cost, efficient blockchain transactions

---

## 🎓 Getting Started

### For Frontend Developers
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Visit `http://localhost:3000`

### For ML Engineers
1. Navigate to `ml-model-api/` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Run Flask app: `python app.py`
4. Visit `http://localhost:5000/docs` for Swagger UI

### For Full Stack
1. Run: `docker-compose up`
2. All services start automatically
3. Access frontend at `http://localhost:3000`

---

## 🏆 Project Maturity

This is a **production-ready** application with:
- ✅ Comprehensive error handling
- ✅ Monitoring and logging
- ✅ Security implementations
- ✅ Accessibility compliance
- ✅ Full test coverage
- ✅ Documentation
- ✅ Scalable architecture
- ✅ CI/CD ready
- ✅ Kubernetes deployment manifests
- ✅ Multi-environment configurations

---

## 📞 Next Steps

1. **Environment Setup**: Follow [installation.md](docs/installation.md)
2. **Explore Codebase**: Check [file_purposes.md](docs/file_purposes.md)
3. **Start Development**: Use `docker-compose.dev.yml`
4. **Run Tests**: Execute test suite
5. **Read PR Descriptions**: Check recent PRs for context
6. **Join Community**: Telegram link in README

---

*Last Updated: March 2026*
*Project Version: 1.0.0*
