import { registerRouteFilter, registerSidebarEntryFilter } from '@kinvolk/headlamp-plugin/lib';

/**
 * Policy-driver UI minimization plugins.
 *
 * - No UI settings
 * - No localStorage
 * - Policy is read from a JSON file shipped with the plugin: ./policy.json
 * (can be overridden by mounting a file into the plugin directory).
 */


type Policy = {
  /**
   * If set, only these sidebar entry names will be kept.
   * Everything else will be hidden.
   */
  allowSidebarEntries?: string[];
  /**
   * Sidebar entry names to hide
   */
  hideSidebarEntries?: string[];
  /**
   * If set, only these route paths will be kept.
   * Everyting else will be removed.
   */
  allowRoutes?: string[];
  /**
   * Route paths to remove.
   */
  hideRoutes?: string[];
};

const defaultPolicy: Required<Pick<Policy, 'hideSidebarEntries' | 'hideRoutes'>> = {
  hideSidebarEntries: ['map', 'advancedSearch', 'gatewayapi'],
  hideRoutes: [
    '/map',
    '/advanced-search',
    '/gateways',
    '/gatewayclasses',
    '/httproutes',
    '/grpcroutes',
    '/referencegrants',
    '/backendtlspolicies',
    '/backendtrafficpolicies',
  ],
};

let loadedPolicy: Policy | null = null;

async function loadPolicy(): Promise<void> {
  try {
    const url = new URL(/* @vite-ignore */ './policy.json', import.meta.url)
    const res = await fetch(url.toString(), { cache: 'no-store'});
    if (!res.ok) {
      return;
    }
    loadedPolicy = (await res.json()) as Policy;
  } catch {
    // fallback
  }
}

void loadPolicy();

function getStringSet(values: string[] | undefined): Set<string> {
  return new Set((values ?? []).map(v => String(v).trim()).filter(Boolean));
}

registerSidebarEntryFilter(entry => {
  const policy = loadedPolicy;
  const allow = getStringSet(policy?.allowSidebarEntries);
  const hide = new Set([...defaultPolicy.hideSidebarEntries, ...getStringSet(policy?.hideSidebarEntries)]);

  if (allow.size > 0) {
    return allow.has(entry.name) ? entry : null;
  }

  return hide.has(entry.name) ? null : entry;
});

registerRouteFilter(route => {
  const policy = loadedPolicy;

  if (typeof route.path !== 'string') {
    return route;
  }

  const allow = getStringSet(policy?.allowRoutes);
  const hide = new Set([...defaultPolicy?.hideRoutes, ...getStringSet(policy?.hideRoutes)]);

  if (allow.size > 0) {
    return allow.has(route.path) ? route : null;
  }

  return hide.has(route.path) ? null : route;
});
