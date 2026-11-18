# SplitSpace — Testing & Quality Assurance

SplitSpace includes automated integration test suites and frontend build checks ensuring reliability across the microservice cluster and client application.

---

## 🧪 Test Suites

### 1. Group Service & Debt Settlement Tests (`backend/test_groups.py`)
Validates:
* Multi-user registration & JWT generation (Alice, Bob, Charlie).
* Group creation and unique 6-character invite code generation.
* Joining groups with invite codes and duplicate membership rejection.
* Equal expense splitting calculation ($90 split 3 ways).
* Real-time net balance calculations ($60 credit, -$30 debit, -$30 debit).
* Debt settlement payments (`is_settlement: true`) and subsequent net balance reconciliation.

**To Run**:
```bash
python backend/test_groups.py
```
**Status**: ✔ **PASSED** (all assertions satisfied).

---

### 2. Personal Expenses & Financial Analytics Tests (`backend/test_personal_expenses.py`)
Validates:
* Personal expense creation with category, amount, and payment mode tagging.
* Filtering by category and search queries.
* Updating expense amounts and note contents.
* Aggregation pipeline for financial analytics:
  - Total spending sum.
  - Active transactions count.
  - Category percentage breakdown.
  - Payment method volume distribution.
  - Multi-month trend tracking.
* Expense deletion and verified count decrements.

**To Run**:
```bash
python backend/test_personal_expenses.py
```
**Status**: ✔ **PASSED** (all assertions satisfied).

---

### 3. Frontend Production Build Verification
Validates:
* JSX syntax across all routes and components.
* Tailwind CSS compilation.
* Zero unresolved imports or dead dependencies.

**To Run**:
```bash
cd frontend
npm run build
```
**Status**: ✔ **PASSED** (`vite v8.3.1 built in ~685ms`).

---

## 🔄 Automated CI Pipeline

A GitHub Actions workflow is configured in `.github/workflows/ci.yml` that automatically:
1. Runs `npm run build` on Node.js 20.
2. Spins up a MongoDB 6.0 container.
3. Initializes collections and indexes via `python backend/init_db.py`.
4. Executes both backend integration test suites in a clean environment.
