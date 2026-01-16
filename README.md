# sidebar-filters-headlamp-plugin (policy based)

This plugin hides selected Headlamp sidebar items and blocks their routes, to keep the UI minimal and faster.

It is **policy-based**:

- No UI settings
- No localStorage
- Reads `policy.json` shipped next to `main.js` (you can override it by mouting your own `policy.json` into the plugin )

Default policy hides:

- Map (`/map`)
- Advanced search (Beta) (`/advanced-search`)
- Gateway (beta) (Gateway API routes)

## policy.json

Supported fields:

- `hideSidebarEntries`: `string[]`
- `hideRoutes`: `string[]`
- `allowSidebarEntries`: `string[]` (if set, everything else is hidden)
- `allowRoutes`: `string[]` (if set, everyting else is removed)

#### In-cluster Headlamp

- Install Headlamp (https://headlamp.dev/docs/latest/installation/in-cluster/)
- Add an initContainer to the headlamp deployment to download the sidebar-filters files. See [example helm values](examples/headlamp-helm-values.yaml).
