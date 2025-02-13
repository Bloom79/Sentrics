import { ConfigurationManagement } from '@/components/cer/ConfigurationManagement';
import { MembersManagement } from './MembersManagement';
import { BoundaryManagement } from './BoundaryManagement';
import { DocumentsManagement } from './DocumentsManagement';
import { ComplianceManagement } from './ComplianceManagement';
import { ActivityManagement } from './ActivityManagement';

export const cerNavigation = [
  {
    id: 'members',
    name: 'Members',
    component: MembersManagement,
    icon: 'UserGroupIcon',
  },
  {
    id: 'configurations',
    name: 'Configurations',
    component: ConfigurationManagement,
    icon: 'CogIcon',
  },
  {
    id: 'boundary',
    name: 'Boundary',
    component: BoundaryManagement,
    icon: 'MapIcon',
  },
  {
    id: 'documents',
    name: 'Documents',
    component: DocumentsManagement,
    icon: 'DocumentIcon',
  },
  {
    id: 'compliance',
    name: 'Compliance',
    component: ComplianceManagement,
    icon: 'ShieldCheckIcon',
  },
  {
    id: 'activity',
    name: 'Activity',
    component: ActivityManagement,
    icon: 'ChartBarIcon',
  },
]; 