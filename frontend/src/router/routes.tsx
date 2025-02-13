import { RouteObject } from 'react-router-dom';

// Route path constants
export const ROUTES = {
  CER: {
    ROOT: '/cer',
    CONFIGURATIONS: {
      ROOT: '/cer/configurations',
      NEW: '/cer/configurations/new',
      DETAILS: (id: string) => `/cer/configurations/${id}`,
      EDIT: (id: string) => `/cer/configurations/${id}/edit`,
      SHARE: (id: string) => `/cer/configurations/${id}/share`,
      BILLING: (id: string) => `/cer/configurations/${id}/billing`,
      MEMBERS: (id: string) => `/cer/configurations/${id}/members`,
      COMPLIANCE: {
        ROOT: (id: string) => `/cer/configurations/${id}/compliance`,
        RECORD: (id: string, recordId: string) => `/cer/configurations/${id}/compliance/${recordId}`,
      },
      TRANSACTIONS: '/cer/configurations/transactions',
      ALL_MEMBERS: '/cer/configurations/members',
      ALL_BILLING: '/cer/configurations/billing',
      ALL_COMPLIANCE: '/cer/configurations/compliance',
    },
  },
};