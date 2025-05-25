import { AddThemeColor } from '../../themes/theme';
import { useTheme } from '../../ThemeContext';

export const helpdeskPrioritiesJson = [
  {
    priority: 'High',
    color: '#E60C0C',
    text: 'High',
  },
  {
    priority: 'Normal',
    color: '#DB8C0D',
    text: 'Normal',
  },
  {
    priority: 'Low',
    color: '#DB8C0D',
    text: 'Low',
  },
  {
    priority: 'Standard',
    color: '#359BBE',
    text: 'Standard',
  },
  {
    priority: 'Critical',
    color: '#359BBE',
    text: 'Critical',
  },
];

export const ppmFor = (value) => {
  const Json = [{
    value: 'e',
    label: 'Equipment',
  },
  {
    value: 'ah',
    label: 'Space',
  }];
  const findValue = Json.find((data) => data.value === value);
  if (findValue) {
    return findValue.label;
  }
  return '';
};

export const PPMpriority = [
  {
    priority: '0',
    text: 'Low',
    color: '#DB8C0D',
  },
  {
    priority: '1',
    text: 'Normal',
    color: '#DB8C0D',
  },
  {
    priority: '2',
    text: 'High',
    color: '#E60C0C',
  },
  {
    priority: '3',
    text: 'Breakdown',
    color: '#359BBE',
  },
  {
    priority: '4',
    text: 'Standard',
    color: '#359BBE',
  },
  {
    priority: '5',
    text: 'Critical',
    color: '#359BBE',
  },
];
export const inspectionStatusLogJson = [
  {
    status: 'Completed',
    backgroundColor: 'rgb(199, 243, 209)',
    color: 'rgb(40, 167, 69)',
  },
  {
    status: 'Upcoming',
    backgroundColor: 'rgb(229, 241, 248)',
    color: 'rgb(16, 146, 220)',
  }, {
    status: 'Missed',
    backgroundColor: 'rgb(255, 237, 237)',
    color: 'rgb(222, 24, 7)',
  },
  {
    status: 'Abnormal',
    backgroundColor: 'rgb(255, 237, 237)',
    color: 'rgb(222, 24, 7)',
  },
  {
    status: 'Cancelled',
    backgroundColor: 'rgb(255, 237, 237)',
    text: 'Cancelled',
    color: '#de1807',
  },
];
export const ppmStatusLogJson = [
  {
    status: 'Completed',
    backgroundColor: 'rgb(199, 243, 209)',
    text: 'Completed',
    color: 'rgb(40, 167, 69)',
  },
  {
    status: 'Upcoming',
    backgroundColor: 'rgb(229, 241, 248)',
    text: 'Upcoming',
    color: 'rgb(16, 146, 220)',
  }, {
    status: 'Missed',
    backgroundColor: 'rgb(255, 237, 237)',
    text: 'Missed',
    color: 'rgb(222, 24, 7)',
  },
  {
    status: 'In Progress',
    backgroundColor: '#ffeccf',
    text: 'In Progress',
    color: 'rgb(255, 160, 0)',
  },
  {
    status: 'Pause',
    backgroundColor: '#FFFFC2',
    text: 'On-Hold',
    color: '#ffa000',
  },
  {
    status: 'Cancelled',
    backgroundColor: 'rgb(255, 237, 237)',
    text: 'Cancelled',
    color: '#de1807',
  },
];
export const inspBulkStatusLogJson = [
  {
    status: 'Done',
    backgroundColor: 'rgb(199, 243, 209)',
    text: 'Done',
    color: 'rgb(40, 167, 69)',
  },
  {
    status: 'Draft',
    backgroundColor: 'rgb(229, 241, 248)',
    text: 'Draft',
    color: 'rgb(16, 146, 220)',
  },
  {
    status: 'Error',
    backgroundColor: 'rgb(255, 237, 237)',
    text: 'Error',
    color: '#de1807',
  },
];
export const heldeskStatusJson = [
  {
    status: 'Open',
    text: 'Open',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'In Progress',
    text: 'In Progress',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
  {
    status: 'On Hold',
    text: 'On Hold',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Closed',
    text: 'Closed',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'On-Hold Requested',
    text: 'On-Hold Requested',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
];
export const assetStatusJson = [
  {
    status: 'mn',
    text: 'Maintenance',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'op',
    text: 'Operative',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'br',
    text: 'Breakdown',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
  {
    status: 'wh',
    text: 'Warehouse',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'sc',
    text: 'Scrapped',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const auditStatusJson = [
  {
    status: 'new',
    text: 'New',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'open',
    text: 'In Progress',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'done',
    text: 'Closed',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'cancelled',
    text: 'Cancelled',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const auditActionStatusJson = [
  {
    status: 'new',
    text: 'New',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'open',
    text: 'In Progress',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'done',
    text: 'Closed',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'cancelled',
    text: 'Cancelled',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const slaAuditStatusJson = [
  {
    status: 'Draft',
    text: 'Draft',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Submitted',
    text: 'Submitted',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Reviewed',
    text: 'Reviewed',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
  {
    status: 'Approved',
    text: 'Approved',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const hxincidentStatusJson = [
  {
    status: 'Reported',
    text: 'Reported',
    color: '#827F7E',
    backgroundColor: '#EFECEC',
  },
  {
    status: 'Acknowledged',
    text: 'Acknowledged',
    color: '#FC6F51',
    backgroundColor: '#FCC6BB',
  },
  {
    status: 'Analyzed',
    text: 'Assessed',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Remediated',
    text: 'Recommended',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Resolved',
    text: 'Resolved',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'Validated',
    text: 'Validated',
    color: '#40CA5D',
    backgroundColor: '#C0F9CC',
  },
  {
    status: 'Signed off',
    text: 'Signed off',
    color: '#40CA5D',
    backgroundColor: '#C0F9CC',
  },
  {
    status: 'Paused',
    text: 'Paused',
    color: '#b6b608',
    backgroundColor: '#FEFE9F',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#FE2C07',
    backgroundColor: '#FBA494',
  },
];
export const OrdersStatusJson = [
  {
    status: 'Draft',
    text: 'Draft',
    color: '#827F7E',
    backgroundColor: '#EFECEC',
  },
  {
    status: 'Ordered',
    text: 'Ordered',
    color: '#FC6F51',
    backgroundColor: '#FCC6BB',
  },
  {
    status: 'Confirmed',
    text: 'Confirmed',
    color: '#2980B9',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Delivered',
    text: 'Delivered',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const PantryStatusJson = [
  {
    status: 'Active',
    text: 'Active',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
];
export const breakDownStatusJson = [
  {
    status: 'Open',
    text: 'Open',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'In Progress',
    text: 'In Progress',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'Closed',
    text: 'Closed',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
  {
    status: 'On Hold',
    text: 'On Hold',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'On-Hold Requested',
    text: 'On-Hold Requested',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
];
export const bmsStatusJson = [
  {
    status: 'Open',
    text: 'Open',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Closed',
    text: 'Closed',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'In Progress',
    text: 'In Progress',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'On Hold',
    text: 'On Hold',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
];
export const tankerStatusJson = [
  {
    status: 'Draft',
    text: 'Draft',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Verified',
    text: 'Verified',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'In Progress',
    text: 'In Progress',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'Submitted',
    text: 'Submitted',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
];
export const visitorStatusJson = [
  {
    status: 'Invited',
    text: 'Invited',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Checkin',
    text: 'Checked In',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
  {
    status: 'Checkout',
    text: 'Checked Out',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'time_elapsed',
    text: 'Time Elapsed',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
];
export const complianceStatusJson = [
  {
    status: 'Draft',
    text: 'Draft',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'Active',
    text: 'Active',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Due For Renewal',
    text: 'Due For Renewal',
    color: '#ffc107',
    backgroundColor: '#FFF9E3',
  },
  {
    status: 'Renewal In Progress',
    text: 'Renewal In Progress',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'Expired',
    text: 'Expired',
    color: '#DD6526',
    backgroundColor: '#FFF6EF',
  },
  {
    status: 'Archived',
    text: 'Archived',
    color: '#ffa000',
    backgroundColor: '#FFFFC2',

  },
];

export const criticalitiesJson = [
  {
    status: '0',
    text: 'General',
  },
  {
    status: '3',
    text: 'Critical',
  },
];

export const channelJson = [
  {
    channel: 'web',
    label: 'Web',
  },
  {
    channel: 'email',
    label: 'Email',
  },
  {
    channel: 'phone',
    label: 'Phone',
  },
  {
    channel: 'mobile_app',
    label: 'Mobile App',
  },
  {
    channel: 'one_campus',
    label: 'Client',
  },
];
export const slaJson = [
  {
    sla: 'SLA Elapsed',
    color: '#dc3545',
  },
  {
    sla: 'Within SLA',
    color: '#28a745',
  },
];
export const workOrderPrioritiesJson = [
  {
    priority: '0',
    color: '#007bff',
    text: 'Low',
  },
  {
    priority: '1',
    color: '#28a745',
    text: 'Normal',
  },
  {
    priority: '2',
    color: '#ffc107',
    text: 'High',
  },
  {
    priority: '3',
    color: '#dc3545',
    text: 'Breakdown',
  },
  {
    priority: '4',
    color: '#17a2b8',
    text: 'Standard',
  },
  {
    priority: '5',
    color: '#dc3545',
    text: 'Critical',
  },
];
export const workorderStatusJson = [
  {
    status: 'draft',
    color: '#17a2b8',
    text: 'Draft',
    backgroundColor: '#F0FFF0',

  },
  {
    status: 'released',
    color: '#dc3545',
    text: 'Waiting Parts',
    backgroundColor: '#ffeded',

  },
  {
    status: 'ready',
    color: '#ffc107',
    text: 'Ready to maintenance',
    backgroundColor: '#FFF9E3',
  },
  {
    status: 'assigned',
    color: '#17a2b8',
    text: 'Assigned',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'in_progress',
    color: '#ffa000',
    text: 'In Progress',
    backgroundColor: '#FFFFC2',
  },
  {
    status: 'pause',
    color: '#ffa000',
    text: 'On-Hold',
    backgroundColor: '#FFFFC2',
  },
  {
    status: 'done',
    color: '#309827',
    text: 'Done',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'missed',
    color: '#dc3545',
    text: 'Missed',
    backgroundColor: '#ffeded',
  },
  {
    status: 'cancel',
    color: '#dc3545',
    text: 'Cancelled',
    backgroundColor: '#ffeded',
  },
];

export const workorderStatusCapJson = [
  {
    status: 'DRAFT',
    color: '#17a2b8',
    text: 'Draft',
    backgroundColor: '#F0FFF0',

  },
  {
    status: 'RELEASED',
    color: '#dc3545',
    text: 'Waiting Parts',
    backgroundColor: '#ffeded',

  },
  {
    status: 'READY TO MAINTENANCE',
    color: '#ffc107',
    text: 'Ready to maintenance',
    backgroundColor: '#FFF9E3',
  },
  {
    status: 'ASSIGNED',
    color: '#17a2b8',
    text: 'Assigned',
    backgroundColor: '#F0FFF0',
  },
  {
    status: 'IN PROGRESS',
    color: '#ffa000',
    text: 'In Progress',
    backgroundColor: '#FFFFC2',
  },
  {
    status: 'PAUSE',
    color: '#ffa000',
    text: 'On-Hold',
    backgroundColor: '#FFFFC2',
  },
  {
    status: 'DONE',
    color: '#309827',
    text: 'Done',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'MISSED',
    color: '#dc3545',
    text: 'Missed',
    backgroundColor: '#ffeded',
  },
  {
    status: 'CANCELLED',
    color: '#dc3545',
    text: 'Cancelled',
    backgroundColor: '#ffeded',
  },
];

export const workorderMaintenanceJson = [
  {
    status: 'bm',
    text: 'Corrective',
  },
  {
    status: 'pm',
    text: 'Preventive',
  },
  {
    status: 'oc',
    text: 'On Condition',
  },
  {
    status: 'pr',
    text: 'Periodic',
  },
  {
    status: 'pd',
    text: 'Predictive',
  },
];

export const workorderTypesJson = [
  {
    status: 'equipment',
    text: 'Equipment',
  },
  {
    status: 'asset',
    text: 'Space',
  },
];

export const helpdeskTypesJson = [
  {
    status: 'equipment',
    text: 'Equipment',
  },
  {
    status: 'space',
    text: 'Space',
  },
];

export const levelTypesJson = [
  {
    status: 'level1',
    text: 'Level 1',
  },
  {
    status: 'level2',
    text: 'Level 2',
  },
  {
    status: 'level3',
    text: 'Level 3',
  },
  {
    status: 'level4',
    text: 'Level 4',
  },
  {
    status: 'level5',
    text: 'Level 5',
  }
];

export const surveyStatusJson = [
  {
    status: 'Published',
    text: 'Published',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Draft',
    text: 'Draft',
    color: '#17a2b8',
    backgroundColor: '#bfe1e7',
  },
  {
    status: 'Closed',
    text: 'Closed',
    color: '#f91414',
    backgroundColor: '#f19d9d',
  },
  {
    status: 'In progress',
    text: 'In progress',
    color: '#f7a20e',
    backgroundColor: '#F9F397',
  }, ,
  {
    status: 'Management System',
    text: 'Management System',
    color: '#17a2b8',
    backgroundColor: '#F0FFF0',
  },
];

export const workPermitStatusJson = [
  {
    status: 'Requested',
    text: 'Requested',
    color: '#24C1F3',
    backgroundColor: '#C4ECF9',
  },
  {
    status: 'Approved',
    text: 'Approved',
    color: '#f7a20e',
    backgroundColor: '#F9F397',
  },
  {
    status: 'On Hold',
    text: 'On Hold',
    color: '#f7a20e',
    backgroundColor: '#F9F397',
  },
  {
    status: 'Prepared',
    text: 'Prepared',
    color: '#132BF7',
    backgroundColor: '#D0D4FB',
  },
  {
    status: 'Issued Permit',
    text: 'Issued Permit',
    color: '#484A5A',
    backgroundColor: '#E8E9EB',
  },
  {
    status: 'Validated',
    text: 'Validated',
    color: '#0D7922',
    backgroundColor: '#C9FAD3',
  },
  {
    status: 'Work In Progress',
    text: 'Work In Progress',
    color: '#1092DC',
    backgroundColor: '#E5F1F8',
  },
  {
    status: 'Permit Rejected',
    text: 'Permit Rejected',
    color: '#24C1F3',
    backgroundColor: '#C4ECF9',
  },
  {
    status: 'Closed',
    text: 'Closed',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Elapsed',
    text: 'Elapsed',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Cancel',
    text: 'Cancelled',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
];

export const cjStatusJson = [
  {
    status: 'Approved',
    text: 'Approved',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Draft',
    text: 'Draft',
    color: '#6c757d',
    backgroundColor: '#d8d8d9',
  },
  {
    status: 'Submitted',
    text: 'Submitted',
    color: '#17a2b8',
    backgroundColor: '#9bdde7',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Reviewed',
    text: 'Reviewed',
    color: '#F1C40F',
    backgroundColor: '#FCF3CF',
  },
];
export const gatePassStatusJson = [
  {
    status: 'Approved',
    text: 'Approved',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Returned',
    text: 'Returned',
    color: '#6c757d',
    backgroundColor: '#cfd7df',
  },
  {
    status: 'Return Approved',
    text: 'Return Approved',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Created',
    text: 'Created',
    color: '#17a2b8',
    backgroundColor: '#8dd5e1',
  },
  {
    status: 'Rejected',
    text: 'Rejected',
    color: '#dc3545',
    backgroundColor: '#f5b9bf',
  },
  {
    status: 'Exited',
    text: 'Exited',
    color: '#ffc107',
    backgroundColor: '#fef2cb',
  },

];
export const hxAuditStatusJson = [
  {
    status: 'Upcoming',
    text: 'Upcoming',
    color: '#FFFFFF',
    backgroundColor: '#1092dc',
  },
  {
    status: 'Started',
    text: 'Started',
    color: '#FFFFFF',
    backgroundColor: '#ee7e01',
  },
  {
    status: 'Inprogress',
    color: '#FFFFFF',
    text: 'In Progress',
    backgroundColor: '#ffa000',
  },
  {
    status: 'Completed',
    text: 'Completed',
    color: '#FFFFFF',
    backgroundColor: '#70b652',
  },
  {
    status: 'Reviewed',
    text: 'Reviewed',
    color: '#FFFFFF',
    backgroundColor: '#28a745',
  },
  {
    status: 'Signed off',
    text: 'Signed off',
    color: '#FFFFFF',
    backgroundColor: '#309827',
  },
  {
    status: 'Canceled',
    color: '#FFFFFF',
    text: 'Cancelled',
    backgroundColor: '#de1807',
  },
  {
    status: 'Missed',
    text: 'Missed',
    color: '#FFFFFF',
    backgroundColor: '#de1807',
  },

];
export const hxAuditActionStatusJson = [
  {
    status: 'Closed',
    text: 'Closed',
    color: '#FFFFFF',
    backgroundColor: '#70b652',
  },
  {
    status: 'Open',
    text: 'Open',
    color: '#FFFFFF',
    backgroundColor: '#1092dc',
  },
  {
    status: 'Cancelled',
    color: '#FFFFFF',
    text: 'Cancelled',
    backgroundColor: '#de1807',
  },
  {
    status: 'In Progress',
    color: '#FFFFFF',
    text: 'In Progress',
    backgroundColor: '#ffa000',
  },
  {
    status: 'On Hold',
    text: 'On Hold',
    color: '#FFFFFF',
    backgroundColor: '#ee7e01',
  },

];
export const hxAuditSystemStatusJson = [
  {
    status: 'Published',
    text: 'Published',
    color: '#FFFFFF',
    backgroundColor: '#70b652',
  },
  {
    status: 'Draft',
    text: 'Draft',
    color: '#FFFFFF',
    backgroundColor: '#1092dc',
  },
  {
    status: 'Archived',
    color: '#FFFFFF',
    text: 'Archived',
    backgroundColor: '#de1807',
  },

];
export const hxInspCancelStatusJson = [
  {
    status: 'Approved',
    text: 'Approved',
    color: '#FFFFFF',
    backgroundColor: '#70b652',
  },
  {
    status: 'Pending',
    text: 'Pending',
    color: '#FFFFFF',
    backgroundColor: '#1092dc',
  },
  {
    status: 'Rejected',
    color: '#FFFFFF',
    text: 'Rejected',
    backgroundColor: '#de1807',
  },

];
export const hxOnBoardingTaskJson = [
  {
    status: 'Done',
    text: 'Done',
    color: '#FFFFFF',
    backgroundColor: '#70b652',
  },
  {
    status: 'In progress',
    text: 'In Progress',
    color: '#FFFFFF',
    backgroundColor: '#ffa000',
  },
  {
    status: 'Open',
    text: 'Open',
    color: '#FFFFFF',
    backgroundColor: '#1092dc',
  }
];
export const MailStatusJson = [
  {
    status: 'Delivered',
    text: 'Delivered',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Registered',
    text: 'Registered',
    color: '#17a2b8',
    backgroundColor: '#afe6ef',
  },
  {
    status: 'Shredded',
    text: 'Shredded',
    color: '#d39e00',
    backgroundColor: '#ffe082',
  },
  {
    status: 'Archived',
    text: 'Archived',
    color: '#6c757d',
    backgroundColor: '#d1d6db',
  },
  {
    status: 'Returned',
    text: 'Returned',
    color: '#c82333',
    backgroundColor: '#ffabb3',
  },

];

export const InwardStatusJson = [
  {
    status: 'Delivered',
    text: 'Delivered',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Approved',
    text: 'Approved',
    color: '#17a2b8',
    backgroundColor: '#afe6ef',
  },
  {
    status: 'Requested',
    text: 'Requested',
    color: '#6c757d',
    backgroundColor: '#d8d8d9',
  },
  {
    status: 'Rejected',
    text: 'Rejected',
    color: '#dc3545',
    backgroundColor: '#f5b9bf',
  },

];

export const ScrapStatusJson = [
  {
    status: 'done',
    text: 'Done',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'draft',
    text: 'Draft',
    color: '#17a2b8',
    backgroundColor: '#afe6ef',
  },

];

export const StockAuditStatusJson = [
  {
    status: 'confirm',
    text: 'In Progress',
    color: '#ffc107',
    backgroundColor: '#f9e7b2',
  },
  {
    status: 'draft',
    text: 'Draft',
    color: '#17a2b8',
    backgroundColor: '#afe6ef',
  },
  {
    status: 'done',
    text: 'Validated',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },

];
export const LocationStatusJson = [
  {
    status: true,
    text: 'Active',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
];
export const UsersStatusJson = [
  {
    status: 'Approved',
    text: 'Approved',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
  {
    status: 'Cancelled',
    text: 'Cancelled',
    color: '#DE1807',
    backgroundColor: '#ffeded',
  },
  {
    status: 'Registered',
    text: 'Registered',
    color: '#0089d9',
    backgroundColor: '#EAF5FF',
  },
];

export const typeJson = [
  {
    status: 'e',
    text: 'Equipment',
  },
  {
    status: 'ah',
    text: 'Space',
  },

];

export const InsTypeJson = [
  {
    status: 'Equipment',
    text: 'Equipment',
  },
  {
    status: 'Space',
    text: 'Space',
  },

];

export const certificateStatusJson = [
  {
    status: 'Certified',
    text: 'Certified',
    color: '#28a745',
    backgroundColor: '#c7f3d1',
  },
  {
    status: 'Provisionally Certified',
    text: 'Provisionally Certified',
    color: '#17a2b8',
    backgroundColor: '#afe6ef',
  },
  {
    status: 'Non-certified',
    text: 'Non-certified',
    color: '#6c757d',
    backgroundColor: '#d8d8d9',
  },
  {
    status: 'Certification Pending',
    text: 'Certification Pending',
    color: '#ffc107',
    backgroundColor: '#f9e7b2',
  },
  {
    status: 'Certification Expired',
    text: 'Certification Expired',
    color: '#dc3545',
    backgroundColor: '#f5b9bf',
  },
];

export const InspectionStatusJson = [
  {
    status: 'Draft',
    text: 'Draft',
    color: '#1A5276',
    backgroundColor: '#D4E6F1',
  },
  {
    status: 'Done',
    text: 'Published',
    color: '#309827',
    backgroundColor: '#F5FFE5',
  },
];

export const detailViewHeaderClass = () => {
  const { themes } = useTheme();
  return AddThemeColor({
    font: 'normal normal medium 20px/24px Suisse Intl',
    fontWeight: 600,
    background: themes === 'light' ? '#1E1F1E' : '#e8e9eb',
    textAlign: 'center',
    marginBottom: '8px',
  });
};
