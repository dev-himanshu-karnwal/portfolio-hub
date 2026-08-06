# Data Model — Portfolio Hub

## Collections

### `projects`

Document ID: auto-generated.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Required |
| `url` | string \| null | Live site URL |
| `figma_url` | string \| null | Figma file / prototype URL |
| `description` | string | Required |
| `tech_stack` | string[] | e.g. `["React","Firebase"]` |
| `domain` | string[] | e.g. `["Fintech"]` |
| `project_type` | string[] | See enum below; multi-select |
| `visibility` | string | `public` \| `proposal_only` \| `internal` |
| `has_live_url` | boolean | Derived when `url` is set |
| `has_figma` | boolean | Derived when `figma_url` is set |
| `has_case_study` | boolean | True when `case_study_url` set |
| `case_study_url` | string \| null | |
| `tags` | string[] | Freeform |
| `notes` | string \| null | Internal; UI shows to editors/admins only |
| `created_at` | Timestamp | Server timestamp |
| `updated_at` | Timestamp | Server timestamp |
| `created_by` | string | Firebase Auth UID |

No media fields — the app does not use Firebase Storage.

**`project_type` values** (stored as an array; pick one or more)

- `Full Stack`
- `Frontend Only`
- `Backend Only`
- `Chrome Extension`
- `Mobile App`
- `Desktop App`
- `API Development`
- `Database Design`
- `System Integration`
- `DevOps`
- `Cloud Services`
- `Security`
- `Figma`
- `UI-UX`
- `Landing Page`
- `Case Study`
- `Shopify`
- `WooCommerce`
- `WordPress`

Legacy combined labels (`Figma/UI-UX`, `Shopify/WooCommerce/WordPress`) are expanded on read.

**Example document**

```json
{
  "name": "Acme Banking Dashboard",
  "url": "https://example.com",
  "figma_url": "https://figma.com/file/abc123",
  "description": "Real-time ops dashboard for mid-market banks.",
  "tech_stack": ["React", "Node.js", "PostgreSQL"],
  "domain": ["Fintech"],
  "project_type": ["Full Stack", "Figma"],
  "visibility": "public",
  "has_live_url": true,
  "has_figma": true,
  "has_case_study": true,
  "case_study_url": "https://example.com/case-study",
  "tags": ["dashboard", "B2B"],
  "notes": "Do not show pricing slide to Prospect X.",
  "created_at": "<Timestamp>",
  "updated_at": "<Timestamp>",
  "created_by": "firebaseAuthUid"
}
```

### `users`

Document ID = Firebase Auth UID.

| Field | Type | Notes |
| --- | --- | --- |
| `uid` | string | Same as document ID |
| `email` | string | |
| `displayName` | string | |
| `role` | string | `admin` \| `editor` \| `viewer` |
| `createdAt` | Timestamp | |

There is **no public signup**. Provision Auth users in the Firebase Console, then create the matching `users/{uid}` document (first admin via Console; later users via Admin panel).

## Indexes

- Queries use `orderBy('updated_at', 'desc')` on `projects`.
- Single-field indexes are created automatically by Firestore.
- Composite indexes are not required (all filtering is in-memory).

## Security Rules Summary

### Firestore (`firebase/firestore.rules`)

| Actor | `projects` | `users` |
| --- | --- | --- |
| Unauthenticated | none | none |
| Viewer | read | read |
| Editor | read; create; update **own** (`created_by == uid`) | read |
| Admin | full CRUD | create / update / delete (role management) |

Firebase Storage is not used.

## Filtering (client-side)

After login the app loads all `projects` once. Search and multi-select filters run in the browser:

- OR within a category (tech, domain, type, visibility)
- AND across categories

URL query params (bookmarkable):

| Param | Meaning |
| --- | --- |
| `q` | Search string |
| `tech` | Comma-separated tech stack |
| `domain` | Comma-separated domains |
| `type` | Comma-separated project types |
| `visibility` | Comma-separated visibility values |
| `view` | `grid` (default) or `table` |
