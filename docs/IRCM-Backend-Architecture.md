# IRCM Backend — Complete Architecture Reference

> **Intelligent Real Estate & Commercial Management Platform**  
> Stack: ASP.NET Core 10 · EF Core · SQL Server · JWT · OpenAI  
> API: `http://localhost:5282` · Frontend: `http://localhost:5173`

---

## 1. High-Level Overview

IRCM is an **ASP.NET Core 10 Web API** for commercial real estate management.

### Architecture pattern

```
Frontend (React)
    ↓ HTTP + JWT
Controllers
    ↓
Services (Business Logic)
    ↓
Entity Framework Core
    ↓
SQL Server (LocalDB — IrcmDb)
```

### External services

- OpenAI API (AI insights)
- Cloudinary (optional thumbnail upload)

### NOT implemented (by design)

- RAG / vector databases
- Embeddings / semantic search
- PDF processing / document uploads
- LangChain / Azure OpenAI
- Chatbot with conversation memory

---

## 2. Project Folder Structure

```
IRCM/
├── Program.cs                  # App bootstrap, DI, middleware
├── appsettings.json            # Connection string, JWT, OpenAI, Cloudinary
├── IRCM.csproj                 # NuGet packages
│
├── Controllers/                # HTTP endpoints (7 controllers)
├── Services/
│   ├── Interfaces/             # IAuthService, IPropertyService, etc.
│   └── Implementation/         # Business logic classes
│
├── Models/                     # EF entities (5 tables)
├── Enums/                      # UserRole, PropertyType, LeaseStatus, etc.
├── DTOs/                       # Request/response shapes per module
├── Validations/                # FluentValidation rules
├── Data/
│   └── ApplicationDbContext.cs
├── Migrations/                 # EF Core database migrations
├── Helpers/
│   ├── JwtHelper.cs
│   ├── OpenAIChatService.cs
│   └── PromptBuilder.cs
└── Configurations/
    ├── OpenAISettings.cs
    └── CloudinarySettings.cs
```

**Backend path:** `C:\Users\AS162723\source\repos\IRCM`

---

## 3. Tech Stack & NuGet Packages

| Layer | Technology |
|-------|------------|
| Framework | ASP.NET Core 10 (`net10.0`) |
| Database | Entity Framework Core 10 + SQL Server |
| Auth | JWT Bearer |
| Password hashing | BCrypt (`BCrypt.Net-Next`) |
| Validation | FluentValidation |
| API docs | OpenAPI + Scalar (development only) |
| AI (installed) | `Microsoft.SemanticKernel` + Google connector (**not used in code yet**) |
| AI (actual) | `HttpClient` → OpenAI Chat Completions API |
| File upload | Cloudinary (`CloudinaryDotNet`) — optional |

---

## 4. Middleware Pipeline (`Program.cs`)

Request order:

1. MapOpenApi / Scalar (Development only)
2. `UseCors("IrcmFrontendPolicy")`
3. `UseHttpsRedirection`
4. `UseAuthentication` (JWT validation)
5. `UseAuthorization` (`[Authorize]` role checks)
6. `MapControllers`

**CORS policy allows:**

- `localhost` / `127.0.0.1` (any port, http/https) — Vite dev server
- `*.cloudshell.dev` (https) — Google Cloud Shell

---

## 5. Dependency Injection (Registered Services)

| Service | Implementation | Lifetime |
|---------|----------------|----------|
| `ApplicationDbContext` | EF Core | Scoped |
| `IAuthService` | `AuthService` | Scoped |
| `IUserService` | `UserService` | Scoped |
| `IPropertyService` | `PropertyImplementation` | Scoped |
| `ILeaseRequestService` | `LeaseRequestImplementation` | Scoped |
| `ILeaseService` | `LeaseService` | Scoped |
| `IUploadService` | `UploadService` | Scoped |
| `IAIInsightService` | `AIInsightService` | Scoped |
| `IOpenAIChatService` | `OpenAIChatService` | HttpClient |
| `JwtHelper` | `JwtHelper` | Scoped |

**Configuration sections:**

- `OpenAISettings` ← appsettings / user secrets
- `CloudinarySettings` ← appsettings

---

## 6. Database — Entity Relationship

### Tables (5)

- Users
- Properties
- LeaseRequests
- Leases
- AIInsights

### Relationships

```
User (Agent)
  └── owns many → Properties (AgentId FK)

User (Tenant)
  └── creates many → LeaseRequests (TenantId FK)

User (Agent)
  └── manages many → LeaseRequests (AgentId FK)

Property
  └── has many → LeaseRequests (PropertyId FK)
  └── has many → Leases (PropertyId FK)

LeaseRequest
  └── optionally linked → Lease (LeaseRequestId FK)

User
  └── generates many → AIInsights (GeneratedById FK)

Property
  └── optionally linked → AIInsights (PropertyId FK, nullable)
```

### Delete behaviors

- Most FKs: **Restrict** (no cascade delete)
- AIInsight → Property: **SetNull** on property delete

### Indexes

- `Users.Email` — unique
- Leases: `AgentId`, `TenantId`, `PropertyId`
- LeaseRequests: `AgentId`, `TenantId`, `PropertyId`
- AIInsights: `GeneratedById`, `PropertyId`

---

## 7. Enums (stored as STRINGS in SQL Server)

### UserRole

- Admin = 1
- Agent = 2
- Tenant = 3

### PropertyType

- Office, Retail, Warehouse, Coworking, Industrial, MixedUse

### LeaseRequestStatus

- Pending, Approved, Rejected

### LeaseStatus

- Pending, Active, Expired, Terminated

### AIInsightType

- ROIAnalysis, PropertyRecommendation, MonthlyReport

---

## 8. Entity Models (Summary)

### User

- Id, FullName, Email (unique), PasswordHash, PhoneNumber
- Role, CreatedAt, UpdatedAt

### Property

- Id, Title, Description, Location, Price, PropertyType
- TotalUnits, OccupiedUnits
- MonthlyMaintenanceCost, MonthlyRevenue, ROI
- Amenities, ThumbnailUrl
- AgentId → User
- CreatedAt, UpdatedAt

### LeaseRequest

- Id, PropertyId, TenantId, AgentId
- Message, Status
- RequestedAt, ReviewedAt

### Lease

- Id, PropertyId, TenantId, AgentId
- MonthlyRent, SecurityDeposit
- StartDate, EndDate, Status
- LeaseRequestId (optional)
- CreatedAt, UpdatedAt

### AIInsight

- Id, PropertyId (optional), Type
- Prompt, Response (full OpenAI raw text)
- GeneratedById → User
- GeneratedAt

---

## 9. Database Migrations (History)

1. **InitialCreate** — Users table
2. **InitialCreateOfProperty** — Properties
3. **AddLeaseRequestModule** — Lease requests
4. **AddLeaseModule** — Leases
5. **AddLeaseIndexes** — Performance indexes
6. **AddAIInsightModule** — AI insights table

**Connection string (default):**

```
Server=(localdb)\MSSQLLocalDB;Database=IrcmDb;Trusted_Connection=True
```

---

## 10. Security & Authentication

### JWT Token

- Algorithm: HMAC-SHA256
- Expiry: 7 days
- Claims:
  - `NameIdentifier` → User GUID
  - `Email` → user email
  - `Role` → Admin / Agent / Tenant

### Password

- Hashed with BCrypt on register
- Verified with BCrypt on login

### Role Access Matrix

**Tenant can access:**

- Browse properties (public GET)
- Submit & view own lease requests
- View own leases
- AI property recommendations (not saved)

**Agent can access:**

- CRUD own properties
- Manage lease requests for own properties
- Create & manage leases
- ROI analysis (saved)
- Monthly reports (saved)
- AI insight history (own only)

**Admin can access:**

- Everything Agent can access
- All users, all properties, all leases/requests
- Delete any AI insight
- Create agent accounts

### Standard response envelope

```json
{
  "success": true,
  "message": "...",
  "data": { },
  "count": 0
}
```

---

## 11. Module 1 — Authentication

- **Controller:** `AuthController`
- **Route:** `/api/auth`
- **Service:** `AuthService`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/register` | Public | Register new user (default Tenant) |
| POST | `/login` | Public | Login → JWT |
| POST | `/create-agent-with-admin-role` | Admin | Create agent accounts |

**Flow:** Register/Login → BCrypt hash/verify → `JwtHelper.GenerateToken()` → return token

---

## 12. Module 2 — Users

- **Controller:** `UserController`
- **Route:** `/api/user`
- **Service:** `UserService`

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | List all users |
| GET | `/{id}` | Get user by ID |
| PUT | `/{id}` | Update user profile |

> **Note:** Some `[Authorize]` attributes are commented out — tighten for production.

---

## 13. Module 3 — Properties

- **Controller:** `PropertyController`
- **Route:** `/api/property`
- **Service:** `PropertyImplementation`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | Public | List all properties |
| GET | `/{id}` | Public | Property details |
| POST | `/` | Agent | Create property |
| PUT | `/{id}` | Agent | Update own property |
| DELETE | `/{id}` | Agent, Admin | Delete property |
| GET | `/my-properties` | Agent, Admin | Agent's listings |
| GET | `/my-properties/{id}` | Agent, Admin | Single owned property |

**Key fields for dashboards:**

- `OccupiedUnits / TotalUnits` → occupancy %
- `MonthlyRevenue`, `MonthlyMaintenanceCost`, `ROI`
- `PropertyType` stored as string (`"Office"`, not integer)

---

## 14. Module 4 — Lease Requests

- **Controller:** `LeaseRequestController`
- **Route:** `/api/leaserequest`
- **Service:** `LeaseRequestImplementation`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/` | Tenant | Submit lease request |
| GET | `/my-requests` | Tenant | Tenant's requests |
| GET | `/agent` | Agent, Admin | Agent's requests |
| GET | `/property/{propertyId}` | Agent, Admin | Requests per property |
| PUT | `/{id}/approve` | Agent, Admin | Approve |
| PUT | `/{id}/reject` | Agent, Admin | Reject |

**Workflow:** Tenant submits → Pending → Agent approves/rejects → (if approved) Agent creates lease

---

## 15. Module 5 — Leases

- **Controller:** `LeaseController`
- **Route:** `/api/lease`
- **Service:** `LeaseService`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/` | Agent, Admin | Create lease |
| GET | `/agent` | Agent, Admin | Agent's leases |
| GET | `/my-leases` | Tenant | Tenant's leases |
| GET | `/{id}` | Authenticated | Lease details |
| GET | `/property/{propertyId}` | Agent, Admin | Leases by property |
| PUT | `/{id}/activate` | Agent, Admin | Pending → Active |
| PUT | `/{id}/expire` | Agent, Admin | → Expired |
| PUT | `/{id}/terminate` | Agent, Admin | → Terminated |

> **Important:** "Active Leases" dashboard count only includes `Status = Active`. Leases start as Pending — must manually Activate.

---

## 16. Module 6 — Upload

- **Controller:** `UploadController`
- **Route:** `/api/upload`
- **Service:** `UploadService`

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/thumbnail` | Agent, Admin | Upload thumbnail to Cloudinary |

Frontend fallback: Unsplash building images when `thumbnailUrl` is empty/invalid.

---

## 17. Module 7 — AI Insights (Phase 5)

- **Controller:** `AIInsightController`
- **Route:** `/api/ai`
- **Service:** `AIInsightService`

### Architecture (NO semantic search)

```
SQL Server
    ↓ backend filters & calculates
PromptBuilder (text prompt)
    ↓
OpenAIChatService (HTTP REST)
    ↓
OpenAI API (gpt-4o-mini)
    ↓
AiJsonHelper (extract JSON from response)
    ↓
Parse + optionally save to AIInsights table
```

**Packages installed vs used:**

- `Microsoft.SemanticKernel` — installed, **NOT used in code**
- Actual integration — `HttpClient` POST to `generativelanguage.googleapis.com`

```
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer {ApiKey}
```

**Config:**

- `appsettings.json` → `OpenAI:ApiKey`, `OpenAI:ModelId`
- User secrets ID: `ircm-ai-insights-local`

---

## 18. AI Feature 1 — ROI Analysis

- **Endpoint:** `POST /api/ai/roi-analysis/{propertyId}`
- **Roles:** Agent, Admin
- **Saves to DB:** Yes (`AIInsightType = ROIAnalysis`)

### Backend steps

1. Load property from SQL
2. Verify agent owns property (Admin bypasses)
3. Calculate:
   - Occupancy % = `OccupiedUnits / TotalUnits × 100`
   - Active lease count
   - Net income = `MonthlyRevenue - MonthlyMaintenanceCost`
4. Build prompt via `PromptBuilder.BuildRoiPrompt()`
5. Send to OpenAI
6. Parse JSON: `roiScore`, `analysis`, `recommendations`
7. Save prompt + raw response to `AIInsights`

### Response example

```json
{
  "roiScore": 8.5,
  "analysis": "...",
  "recommendations": ["...", "..."]
}
```

---

## 19. AI Feature 2 — Property Recommendations

- **Endpoint:** `POST /api/ai/recommend-properties`
- **Roles:** Tenant only
- **Saves to DB:** No (temporary response)

### Request body

```json
{
  "location": "Mumbai",
  "budget": 500000,
  "propertyType": "Office"
}
```

### Backend steps

1. **SQL filter** (NOT AI search):
   - Location contains filter
   - `Price <= budget`
   - PropertyType match
2. Take **top 5** matches only
3. Send shortlist to OpenAI for comparison
4. Parse `recommendedProperties` array
5. Fallback: return top 3 SQL matches if AI JSON fails

### Response example

```json
{
  "recommendedProperties": [
    {
      "propertyId": "guid",
      "propertyName": "Corporate Plaza",
      "reason": "Excellent connectivity and fits budget."
    }
  ]
}
```

---

## 20. AI Feature 3 — Monthly Business Report

- **Endpoint:** `POST /api/ai/monthly-report`
- **Roles:** Agent, Admin
- **Saves to DB:** Yes (`AIInsightType = MonthlyReport`)

### Request body

```json
{
  "month": 6,
  "year": 2026
}
```

### Backend calculates portfolio snapshot

- Total properties, total revenue
- Average occupancy %
- Active / expired / pending leases
- New / approved / rejected requests in period
- Agent sees own portfolio; Admin sees all

### Response example

```json
{
  "title": "Monthly Portfolio Report",
  "summary": "...",
  "highlights": ["..."],
  "recommendations": ["..."]
}
```

---

## 21. AI History Endpoints

| Method | Path | Roles | Purpose |
|--------|------|-------|---------|
| GET | `/api/ai` | Agent, Admin | List saved insights |
| GET | `/api/ai/{id}` | Agent, Admin | Full insight detail |
| DELETE | `/api/ai/{id}` | Agent, Admin | Agent deletes own; Admin deletes any |

---

## 22. Key Helper Classes

### JwtHelper.cs

- Generates JWT with user Id, email, role
- 7-day expiry

### OpenAIChatService.cs

- `IOpenAIChatService` interface
- HTTP POST to OpenAI `/v1/chat/completions`
- Returns plain text response

### PromptBuilder.cs

- `BuildRoiPrompt()`
- `BuildRecommendationPrompt()`
- `BuildMonthlyReportPrompt()`
- Injects real SQL data into prompts

### AiJsonHelper.cs

- `ExtractJson()` — pulls `{ }` or `[ ]` from AI text (handles markdown wrappers)

---

## 23. Validators (FluentValidation)

**Auth:**

- LoginValidator
- RegisterValidator

**Property:**

- CreatePropertyValidator

**Lease:**

- CreateLeaseValidator

**Lease Request:**

- CreateLeaseRequestValidator

**AI:**

- PropertyRecommendationRequestValidator (location required, budget > 0)
- MonthlyReportRequestValidator (month required)

Auto-validation enabled via `AddFluentValidationAutoValidation()`.

---

## 24. Complete API Endpoint Cheat Sheet

### AUTH (`/api/auth`)

```
POST   /register
POST   /login
POST   /create-agent-with-admin-role     [Admin]
```

### USERS (`/api/user`)

```
GET    /
GET    /{id}
PUT    /{id}
```

### PROPERTIES (`/api/property`)

```
GET    /                                  [Public]
GET    /{id}                              [Public]
POST   /                                  [Agent]
PUT    /{id}                              [Agent]
DELETE /{id}                              [Agent, Admin]
GET    /my-properties                     [Agent, Admin]
GET    /my-properties/{id}                [Agent, Admin]
```

### LEASE REQUESTS (`/api/leaserequest`)

```
POST   /                                  [Tenant]
GET    /my-requests                       [Tenant]
GET    /agent                             [Agent, Admin]
GET    /property/{propertyId}             [Agent, Admin]
PUT    /{id}/approve                      [Agent, Admin]
PUT    /{id}/reject                       [Agent, Admin]
```

### LEASES (`/api/lease`)

```
POST   /                                  [Agent, Admin]
GET    /agent                             [Agent, Admin]
GET    /my-leases                         [Tenant]
GET    /{id}                              [Authenticated]
GET    /property/{propertyId}             [Agent, Admin]
PUT    /{id}/activate                     [Agent, Admin]
PUT    /{id}/expire                       [Agent, Admin]
PUT    /{id}/terminate                    [Agent, Admin]
```

### UPLOAD (`/api/upload`)

```
POST   /thumbnail                         [Agent, Admin]
```

### AI (`/api/ai`)

```
POST   /roi-analysis/{propertyId}         [Agent, Admin]
POST   /recommend-properties              [Tenant]
POST   /monthly-report                    [Agent, Admin]
GET    /                                  [Agent, Admin]
GET    /{id}                              [Agent, Admin]
DELETE /{id}                              [Agent, Admin]
```

---

## 25. End-to-End Business Flow

1. Agent creates Property listing
2. Tenant browses properties (`GET /api/property`)
3. Tenant submits LeaseRequest (`POST /api/leaserequest`)
4. Agent approves request (`PUT /api/leaserequest/{id}/approve`)
5. Agent creates Lease (`POST /api/lease`)
6. Agent activates Lease (`PUT /api/lease/{id}/activate`)
7. Dashboard metrics update (occupancy, active leases, revenue)
8. Agent runs ROI Analysis (`POST /api/ai/roi-analysis/{id}`)
9. Agent generates Monthly Report (`POST /api/ai/monthly-report`)
10. Tenant gets AI Recommendations (`POST /api/ai/recommend-properties`)

---

## 26. Configuration Reference

### appsettings.json sections

| Section | Purpose |
|---------|---------|
| `ConnectionStrings:DefaultConnection` | SQL Server LocalDB (`IrcmDb`) |
| `Jwt:Key / Issuer / Audience` | Token signing |
| `OpenAI:ApiKey` | OpenAI API key |
| `OpenAI:ModelId` | Default: `gpt-4o-mini` |
| `CloudinarySettings` | Optional image uploads |

### Set OpenAI key via user secrets

```powershell
cd C:\Users\AS162723\source\repos\IRCM
dotnet user-secrets set "OpenAI:ApiKey" "YOUR_KEY"
```

---

## 27. Local Development

### Backend

```powershell
cd C:\Users\AS162723\source\repos\IRCM
dotnet run --urls "http://localhost:5282"
```

### Frontend

```powershell
cd C:\Users\AS162723\Desktop\ircm-frontend
npm run dev
```

### API docs (dev)

Scalar UI at `/scalar/v1`

### Stop locked process before rebuild

```powershell
Get-Process -Name IRCM | Stop-Process -Force
```

---

## 28. Frontend Integration (Reference)

| File | Purpose |
|------|---------|
| `src/api/services/aiService.js` | All AI API calls |
| `src/pages/admin/AdminAnalytics.jsx` | Monthly report + AI history |
| `src/pages/tenant/TenantRecommendations.jsx` | Tenant recommendation form |
| `src/pages/admin/AdminPropertyDetails.jsx` | ROI analysis button |
| `src/pages/agent/EditProperty.jsx` | ROI analysis button |

- **API base URL:** `http://localhost:5282`
- **Response shape:** `{ success, message, data }`

---

## 29. Security Notes for Production

- Move `OpenAI:ApiKey` to user secrets / environment variables (not git)
- Re-enable `[Authorize]` on UserController endpoints
- Rotate API keys if exposed in chat or commits
- Use strong JWT secret key (not default placeholder)

---

## 30. Phase Summary

| Phase | Scope |
|-------|-------|
| Phase 1 | Authentication (JWT, BCrypt, roles) |
| Phase 2 | Users module |
| Phase 3 | Properties module |
| Phase 4 | Lease Requests + Leases + Admin enterprise features |
| Phase 5 | AI Insights (OpenAI, ROI, recommendations, monthly reports) |

### Future (not implemented)

- RAG over lease documents
- Vector search / embeddings
- Semantic Kernel refactor
- LeaseSummary AI feature

---

*Generated for IRCM project documentation. Copy into Notion via Import → Markdown or paste directly.*
