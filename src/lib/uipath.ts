import { UiPath } from 'uipath-sdk';

/**
 * Initialized UiPath SDK client
 */
export const uipath = new UiPath({
    baseUrl: import.meta.env.VITE_UIPATH_BASE_URL,
    orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
    tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
    secret: import.meta.env.VITE_UIPATH_ACCESS_TOKEN
});

export type { UiPath } from 'uipath-sdk';