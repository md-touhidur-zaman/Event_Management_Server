# Event Management Server - AI Coding Guidelines

## Project Overview
Express.js + TypeScript backend API for a social event platform. The architecture follows **modular services pattern** with clear separation: Controllers → Services → Database Models.

**Tech Stack**: Express, TypeScript, MongoDB/Mongoose, JWT Auth, SSL Commerz Payments, Cloudinary Image Storage, Zod validation

---

## Architecture Pattern (MVC + Services)

### Module Structure (Template)
Each domain has this structure under `src/app/modules/{module}/`:
```
{module}.controllers.ts     # Request handlers (wrapped with catchAsync)
{module}.services.ts        # Business logic (throw AppError on validation failure)
{module}.model.ts           # Mongoose schema
{module}.routes.ts          # Express routes (import controllers + middleware)
{module}.interfaces.ts      # TypeScript interfaces for domain models
{module}.validation.ts      # Zod schemas for input validation
```
**Example**: User module spans [src/app/modules/user/](src/app/modules/user/). All new features must follow this pattern.

### Request Flow
1. **Routes** → **Controllers** (validate via middleware, call service)
2. **Controllers** → **Services** (business logic, database operations, throw errors)
3. **Services** → **Models** (Mongoose queries)
4. **Global Error Handler** catches AppError or generic errors

---

## Critical Patterns & Conventions

### 1. Error Handling
- **Always throw `AppError`** in services with explicit `httpStatusCode`:
  ```typescript
  throw new AppError(httpStatusCode.BAD_REQUEST, "User already registered.")
  ```
- **Never let unhandled errors propagate** — middleware wraps them
- Errors with file uploads auto-delete from Cloudinary in [globalErrorHandler](src/app/middleware/globalErrorHandler.ts)

### 2. Request Wrapping
- **Always wrap controllers** with `catchAsync()` to auto-catch Promise rejections:
  ```typescript
  const createEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await eventServices.createEvent(userId, req.body);
    sendResponse(res, { success: true, statusCode: 201, ... });
  });
  ```
  See [event.controllers.ts](src/app/modules/event/event.controllers.ts)

### 3. Response Format
- **Always use `sendResponse()` utility** with consistent structure:
  ```typescript
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Event created",
    data: result
  });
  ```
- See [utils/sendResponse.ts](src/app/utils/sendResponse.ts) for signature

### 4. Input Validation
- **Use Zod schemas** for request validation in controllers before calling services
- Example: [user.validates.ts](src/app/modules/user/user.validates.ts) defines schemas; parse in route middleware
- Schemas: required fields default to required, mark optional fields explicitly

### 5. Role-Based Access Control
- **Use `checkAuth()` middleware** on protected routes:
  ```typescript
  router.patch("/update/:id", checkAuth("user", "admin"), updateEventInfo)
  ```
- `checkAuth(...roles)` verifies JWT in cookies and checks user role
- Roles: `"user"`, `"host"`, `"admin"` (defined in User model)

### 6. Authentication & JWT
- **Access tokens stored in cookies** (see [app.ts](src/app.ts) — cookieParser middleware)
- Extract token in controllers via `req.user` (JwtPayload from [checkAuth.ts](src/app/middleware/checkAuth.ts))
- JWT utilities: [utils/jwt.ts](src/app/utils/jwt.ts) — `signToken()`, `verifyToken()`

### 7. File Uploads (Cloudinary)
- **Multer config** in [multer.config.ts](src/app/config/multer.config.ts) routes uploads to Cloudinary
- Access uploaded file path via `req.file?.path` in controllers
- **On error**: Global handler auto-deletes image from Cloudinary

### 8. Payment Flow (SSL Commerz)
- **Payment lifecycle**: Booking → Payment record created → Init payment gateway → Success/Cancel/Failed webhook
- Payment services in [payment.services.ts](src/app/modules/payment/payment.services.ts) manage status transitions
- Uses `transactionId` to track payments; Bookings linked via `payment` foreign key

---

## Key Dependencies & Integration Points

| Dependency | Usage | Config |
|---|---|---|
| **Mongoose** | MongoDB ODM | [env.ts](src/app/config/env.ts) → `DATABASE_URL` |
| **JWT** | Token generation/verification | [jwt.ts](src/app/utils/jwt.ts) → env secrets |
| **Zod** | Schema validation | Import schema, call `.parse()` |
| **Cloudinary** | Image storage | [cloudinary.config.ts](src/app/config/cloudinary.config.ts) → env credentials |
| **SSL Commerz** | Payment gateway | [sslCommerz.services.ts](src/app/modules/sslCommerz/sslCommerz.services.ts) → env config |
| **Bcryptjs** | Password hashing | [user.services.ts](src/app/modules/user/user.services.ts) → `BCRYPT_SALT_COUNT` |

---

## Development Workflows

### Build & Run
```bash
npm run dev              # Start with ts-node-dev (auto-restart on changes)
npm run build           # Compile TypeScript to dist/
npm start               # Run compiled server
npm run lint            # Check ESLint
```

### Adding a New Endpoint
1. Add route in `{module}.routes.ts`
2. Create controller method in `{module}.controllers.ts` (wrap with `catchAsync`)
3. Implement service method in `{module}.services.ts` (throw `AppError` on failure)
4. Add Zod schema in `{module}.validation.ts` if needed
5. Apply `checkAuth()` middleware for protected routes
6. Test with curl/Postman against `/api/v1/{module}/{endpoint}`

### Database Changes (Mongoose)
- Modify schema in `{module}.model.ts`
- Re-run `npm run dev` (Mongoose auto-syncs in dev)
- For migrations, consider adding scripts in [utils](src/app/utils/)

---

## Project-Specific Notes

- **Admin seeding**: [seedAdmin.ts](src/app/utils/seedAdmin.ts) bootstraps admin user on startup
- **Cookie domain**: CORS allows `localhost:3000` and `event-management-nine-brown.vercel.app` ([app.ts](src/app.ts))
- **Booking→Payment relationship**: Transactions use `session.startTransaction()` for atomicity (see [payment.services.ts](src/app/modules/payment/payment.services.ts))
- **No tests yet** — test script placeholder in package.json (implement as needed)
- **Module routes aggregated** in [router/index.ts](src/app/router/index.ts) via loop pattern

---

## Common Pitfalls to Avoid
- ❌ Not wrapping controller with `catchAsync` → unhandled Promise rejection
- ❌ Throwing generic `Error` instead of `AppError` → wrong status code in response
- ❌ Forgetting `checkAuth` middleware → auth-required route is public
- ❌ Not validating input with Zod → invalid data corrupts database
- ❌ Modifying uploaded files without Cloudinary cleanup → storage bloat
