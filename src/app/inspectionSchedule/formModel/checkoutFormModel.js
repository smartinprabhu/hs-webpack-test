export default {
  formId: 'checkoutinspectionForm',
  formField: {
    groupId: {
      name: 'group_id',
      label: 'Group',
      requiredErrorMsg: 'Group is required',
    },
    type: {
      name: 'category_type',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    equipmentId: {
      name: 'equipment_id',
      label: 'Equipment',
      requiredErrorMsg: 'Equipment is required',
    },
    spaceId: {
      name: 'space_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    company: {
      name: 'company_id',
      label: 'Company',
      requiredErrorMsg: 'Company is required',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      requiredErrorMsg: 'Maintenance Team is required',
    },
    taskId: {
      name: 'task_id',
      label: 'Maintenance Operations',
    },
    checklistId: {
      name: 'check_list_id',
      label: 'Checklist',
      required: true,
      requiredErrorMsg: 'Checklist is required',
    },
    startsAt: {
      name: 'starts_at',
      label: 'Starts At (Hours)',
      requiredErrorMsg: 'Starts At is required',
      required: true,
    },
    durationAt: {
      name: 'duration',
      label: 'Duration (Hours)',
      requiredErrorMsg: 'Duration is required',
      required: true,
    },
    excludeHolidays: {
      name: 'is_exclude_holidays',
      label: 'Exclude Holidays?',
    },
    parentSchedule: {
      name: 'parent_id',
      label: 'Parent Schedule',
    },
    priorityValue: {
      name: 'priority',
      label: 'Priority',
    },
    commencesOn: {
      name: 'commences_on',
      label: 'Commences On',
      requiredErrorMsg: 'Commences On is required',
      required: true,
    },
    endsOn: {
      name: 'ends_on',
      label: 'End On',
    },
    descriptionValue: {
      name: 'description',
      label: 'Description',
      requiredErrorMsg: 'Description is required',
      required: true,
    },
    remindBefore: {
      name: 'remind_before',
      label: 'Remind Before (Hours)',
    },
    missedAlert: {
      name: 'is_missed_alert',
      label: 'Missed Alert?',
    },
    recipients: {
      name: 'recipients_id',
      label: 'Recipients',
    },
    mo: {
      name: 'mo',
      label: 'Mon',
    },
    tu: {
      name: 'tu',
      label: 'Tue',
    },
    we: {
      name: 'we',
      label: 'Wed',
    },
    th: {
      name: 'th',
      label: 'Thu',
    },
    fr: {
      name: 'fr',
      label: 'Fri',
    },
    sa: {
      name: 'sa',
      label: 'Sat',
    },
    su: {
      name: 'su',
      label: 'Sun',
    },
    atStart: {
      name: 'at_start_mro',
      label: 'At Start',
      label1: 'To Start',
    },
    atReview: {
      name: 'at_review_mro',
      label: 'At Review',
      label1: 'To Review',
    },
    atDone: {
      name: 'at_done_mro',
      label: 'At Done',
      label1: 'To Done',
    },
    enforceTime: {
      name: 'enforce_time',
      label: 'Enforce Time',
    },
    allowFuture: {
      name: 'is_allow_future',
      label: 'Allow Future?',
    },
    allowPast: {
      name: 'is_allow_past',
      label: 'Allow Past?',
    },
    qrScanStart: {
      name: 'qr_scan_at_start',
      label: 'QR Scan at Start',
    },
    qrScanDone: {
      name: 'qr_scan_at_done',
      label: 'QR Scan at Done',
    },
    nfcScanStart: {
      name: 'nfc_scan_at_start',
      label: 'NFC Scan at Start',
    },
    nfcScanDone: {
      name: 'nfc_scan_at_done',
      label: 'NFC Scan at Done',
    },
    enableTimeTracking: {
      name: 'is_enable_time_tracking',
      label: 'Enable Time Tracking?',
    },
    minDuration: {
      name: 'min_duration',
      label: 'Min Duration',
    },
    maxDuration: {
      name: 'max_duration',
      label: 'Min Duration',
    },
  },
};
