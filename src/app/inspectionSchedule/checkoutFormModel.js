export default {
  formId: 'checkoutForm',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
      required: true,
    },
    categoryType: {
      name: 'category_type',
      label: 'Inspection For',
      required: true,
      requiredErrorMsg: 'Inspection for is required',
    },
    assetCategoryId: {
      name: 'asset_category_id',
      label: 'Asset Category',
    },
    equipmentCategoryId: {
      name: 'category_id',
      label: 'Equipment Category',
    },
    Priority: {
      name: 'priority',
      label: 'Priority',
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      requiredErrorMsg: 'Maintenance Team is required',
    },
    taskId: {
      name: 'task_id',
      label: 'Maintenance Operations',
      requiredErrorMsg: 'Maintenance Operations is required',
    },
    PPMBy: {
      name: 'ppm_by',
      label: 'Inspection By',
      requiredErrorMsg: 'Inspection By is required',
      required: true,
    },
    SchedulerOperationType: {
      name: 'scheduler_operation_type',
      label: 'Scheduler Operation Type',
    },
    ScoreType: {
      name: 'sla_score_type',
      label: 'SLA Score Type',
    },
    type: {
      name: 'is_all_records',
      label: 'All',
      label1: 'Multiple',
    },
    startingDate: {
      name: 'start_datetime',
      label: 'Starting at',
      requiredErrorMsg: 'Start is required',
      required: true,
    },
    endDate: {
      name: 'stop_datetime',
      label: 'End at',
      requiredErrorMsg: 'End is required',
      required: true,
    },
    Duration: {
      name: 'duration',
      label: 'Duration (Hours)',
    },
    timePeriod: {
      name: 'time_period',
      label: 'Scheduled Period',
    },
    Hourly: {
      name: 'is_hourly',
      label: 'Is Hourly?',
    },
    HourlyConfiguration: {
      name: 'hours_ids',
      label: 'Hourly Configuration',
      requiredErrorMsg: 'Hourly Configuration is required',
      required: true,
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
    },
    atDone: {
      name: 'at_done_mro',
      label: 'At Done',
    },
    atReview: {
      name: 'at_review_mro',
      label: 'At Review',
    },
    Recurrency: {
      name: 'recurrency',
      label: 'Recurrent',
    },
    interval: {
      name: 'interval',
      label: 'Repeat Every',
    },
    ruleType: {
      name: 'rrule_type',
      label: 'Options',
    },
    monthBy: {
      name: 'month_by',
      label: 'Month By',
    },
    dayBy: {
      name: 'byday',
      label: '',
    },
    Day: {
      name: 'day',
      label: '',
    },
    enforceTime: {
      name: 'enforce_time',
      label: 'Enforce Time',
    },
    nfcScanStart: {
      name: 'nfc_scan_at_start',
      label: 'NFC Scan at Start',
    },
    nfcScanDone: {
      name: 'nfc_scan_at_done',
      label: 'NFC Scan at Done',
    },
    qrScanStart: {
      name: 'qr_scan_at_start',
      label: 'QR Scan at Start',
    },
    qrScanDone: {
      name: 'qr_scan_at_done',
      label: 'QR Scan at Done',
    },
    weekList: {
      name: 'week_list',
      label: '',
    },
    schedulerType: {
      name: 'scheduler_type',
      label: 'Scheduler Type',
      requiredErrorMsg: 'Scheduler Type is required',
    },
  },
};
