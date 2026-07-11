# Copilot Repository Instructions — Car Dealership Inventory System

This file is auto-loaded by GitHub Copilot Chat (VS Code, JetBrains, GitHub.com) on every
request in this repo. Keep the "Current Status" section at the bottom up to date as features
land — it's how Copilot knows where the project actually is.

## Project

A full-stack Car Dealership Inventory System (TDD kata). Users register/login, browse and
search vehicles, and purchase them (stock decrements). Admins can add/update/delete vehicles
and restock. Built as a production-style project, not a toy — real DB, real auth, real CI.

## Tech Stack — do not deviate without asking first

- **Backend:** Java 21, Spring Boot 4.0, Maven. Package base `com.CDIS.backend` with
  `controller`, `service`, `dto`, `exception`, `config`, `entity`, `repository` sub-packages.
- **Auth:** Spring Security + JWT (`io.jsonwebtoken:jjwt`), BCrypt password hashing.
- **DB:** PostgreSQL. Local dev via docker-compose. Never suggest an in-memory DB as sufficient
  for tests — use Testcontainers (`postgresql` module) for any test that touches persistence.
- **Testing:** JUnit 5, Mockito, AssertJ, MockMvc.
  **Use `@MockitoBean` from `org.springframework.test.context.bean.override.mockito.MockitoBean`.**
  This project is on Spring Boot 4.0 — `@MockBean` / `org.springframework.boot.test.mock.mockito`
  has been removed entirely. Do not suggest it.
- **Frontend:** React 18, **plain JavaScript, not TypeScript**, Vite, TailwindCSS, React Router,
  TanStack Query, Axios, Vitest + React Testing Library.
- **CI/CD:** Jenkins (`Jenkinsfile` at repo root, declarative pipeline). Not GitHub Actions.

## TDD Workflow — follow exactly for every piece of backend logic

1. **RED** — write only the test for the next behavior. It is expected and correct for this
   test to target classes/methods that don't exist yet, causing a compile failure. **Do not
   refuse to write the test because the target class is missing, and do not search the repo
   first looking for an existing implementation — there isn't one, on purpose.**
2. **GREEN** — write the minimal production code needed to make that specific (and only that)
   test pass. Do not add validation, endpoints, or behavior the current test doesn't require.
3. **REFACTOR** — clean up naming, duplication, SOLID violations once green, without changing
   behavior. Re-run tests to confirm still green.

Never collapse RED and GREEN into a single step, even if the fix looks trivial.

## Security rules

- `/api/auth/**` is public. Everything else requires authentication by default (deny-by-default).
- Registration never accepts a client-supplied `role` — always defaults to `USER`. Admin accounts
  are seeded (e.g. `CommandLineRunner`), never self-registered.
- No secrets or DB credentials hardcoded anywhere — pull from environment vars /
  `application-{profile}.yml`.

## Git conventions

- One feature = one branch (`feature/<name>`), PR into `main`.
- Commit separately at each red/green/refactor step. Type-prefixed: `test:`, `feat:`,
  `refactor:`, `fix:`, `docs:`, `chore:`.
- Whenever Copilot generates the bulk of a change, end the commit message with two blank lines
  then `Co-authored-by: GitHub Copilot <copilot@github.com>`.

## Functional Requirements (full scope)

**Auth**
- `POST /api/auth/register` — {email, password} → 201 {id, email} (never password), 409 if
  email already exists.
- `POST /api/auth/login` — {email, password} → 200 with JWT, 401 on bad credentials.

**Vehicles (protected)**
- `Vehicle`: id, make, model, category, price, quantity, `@Version` field (optimistic locking).
- `POST /api/vehicles` — add vehicle.
- `GET /api/vehicles` — list all.
- `GET /api/vehicles/search` — filter by make/model/category/price range. Use JPA
  Specifications for combinable filters, not chained if-else in the repository.
- `PUT /api/vehicles/:id` — update.
- `DELETE /api/vehicles/:id` — admin only.

**Inventory (protected)**
- `POST /api/vehicles/:id/purchase` — decrement quantity; reject with a clear error if
  quantity is already 0.
- `POST /api/vehicles/:id/restock` — admin only, increment quantity.

**Frontend**
- Register/login forms, JWT stored client-side, protected routes.
- Dashboard listing vehicles, with search/filter UI.
- Purchase button, disabled when quantity is 0.
- Admin-only add/update/delete UI.

## Current Status (update as you go)

- [x] Scaffolding (backend + frontend), docker-compose, Jenkinsfile
- [x] `SecurityConfig` — permits `/api/auth/**`, denies everything else by default
- [x] Feature 1: Registration — `AuthController`, `UserService`, and persistence-backed
  registration tests are in place
- [ ] Feature 2: Login + JWT issuance
- [ ] Feature 3: Role-based security for `/api/vehicles/**` (JWT filter)
- [ ] Feature 4: Vehicle CRUD
- [ ] Feature 5: Search/filter
- [ ] Feature 6: Purchase / Restock
- [ ] Feature 7: Frontend auth
- [ ] Feature 8: Frontend dashboard + search/filter
- [ ] Feature 9: Frontend admin CRUD + purchase button
- [ ] Feature 10: Swagger docs, JaCoCo/Vitest coverage reports, README (setup, screenshots,
      AI Usage section), optional AWS deploy