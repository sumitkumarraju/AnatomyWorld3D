# Event-Sourced Activity & Progress Tracking Architecture

## 1. Goal
Replace hardcoded dashboard progress with a dynamic system backed by Supabase that powers both:
1. The **Recent Activity** feed (granular events).
2. The **Active Modules** progress bars (aggregated dynamically from events).

## 2. Approach: Granular Event-Sourcing
We will capture specific user actions (e.g., viewing an organ, completing a task). The backend will record these as immutable events in a chronological log. Progress calculations will be derived by evaluating these events against the total known "steps" for a given module.

### 2.1 Database Schema (Supabase)

We will create a new table: `user_activity_log`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary Key, auto-gen | Unique event identifier |
| `user_id` | `uuid` | Foreign Key (`auth.users`) | The user who performed the action |
| `action_type` | `text` | e.g. 'EXPLORED_ORGAN', 'GENERATED_INSIGHT' | Categorizes what was done |
| `entity_id` | `text` | e.g. 'heart', 'liver' | Specific item interacted with |
| `entity_title` | `text` | e.g. 'Human Heart' | Human-readable string for display |
| `module_id` | `text` | e.g. 'cardiovascular' | Determines which progress bar grows |
| `created_at` | `timestamptz` | default `now()` | Timestamp for chronology |

### 2.2 Progress Calculation Strategy
Instead of manually updating an integer in a database, the Dashboard will:
1. Query the latest X records from `user_activity_log` for the **Recent Activity** feed.
2. Group records by `module_id`, count the number of *distinct* `entity_id`s explored by the user, and divide by the total number of trackable entities in that module to calculate the **Progress Percentage**.

Example: 
- Total organs in Cardiovascular = Heart, Vascular System (2 items)
- User viewed Heart (1 event).
- Progress = 1 / 2 = 50%.

## 3. Server Actions & API Patterns
We will introduce two primary server actions in `src/app/actions/progress.ts`:

1. `logUserActivity(actionType, entityId, entityTitle, moduleId)`
   - Called asynchronously when a user views a 3D model.
   - Inserts a row into `user_activity_log`.
2. `getDashboardData()`
   - Runs on the Server Component side for the Dashboard.
   - Retrieves the user's recent activities.
   - Computes progress percentiles based on total predefined modules.
   - Returns typed data so the React Client component stays thin.

## 4. Edge Cases & Constraints
- **Duplicate Views:** If a user views the Heart 10 times, we only count it once toward the 100% module progress (using distinct `entity_id`). However, all 10 views will populate the database so we have an accurate history. If we don't want the UI feed entirely spammed with "Viewed Heart", we can filter out duplicate activities within a short timeframe when querying.
- **Performance:** For tens of thousands of logs, we will need an index on `(user_id, created_at)` to query the feed efficiently.
