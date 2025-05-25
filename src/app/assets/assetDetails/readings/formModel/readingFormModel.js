export default {
  formId: 'readingForm',
  formField: {
    readingId: {
      name: 'reading_id',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Reading is required',
    },
    uomId: {
      name: 'uom_id',
      label: 'Unit of Measure',
    },
    typeValue: {
      name: 'type',
      label: 'Reading Type',
    },
    isActive: {
      name: 'is_active',
      label: 'Active',
      label1: 'Inactive',
    },
    company: {
      name: 'company_id',
      label: 'company',
    },
    toDo: {
      name: 'to_do',
      label: 'To Do',
      requiredErrorMsg: 'To Do is required',
    },
    dataType: {
      name: 'data_type',
      label: 'Data Format',
      requiredErrorMsg: 'Data Format is required',
    },
    manualReading: {
      name: 'is_allow_manual_reading',
      label: 'Allow Smart Logger',
    },
    conditionValue: {
      name: 'condition',
      label: 'Analyze By',
      requiredErrorMsg: 'Analyze By is required',
    },
    validateEntry: {
      name: 'validation_required',
      label: 'Validate Entry',
    },
    minimumValue: {
      name: 'validation_min_float_value',
      label: 'Minimum Value',
    },
    maximumValue: {
      name: 'validation_max_float_value',
      label: 'Maximum Value',
    },
    validationErrMsg: {
      name: 'validation_error_msg',
      label: 'Validation Error Message',
    },
    aggregateTimePeriod: {
      name: 'aggregate_timeperiod',
      label: 'Aggregate Timeperiod',
    },
    thresholdValue: {
      name: 'threshold',
      label: 'ThresholdValue',
    },
    recurrentValue: {
      name: 'recurrent',
      label: 'Recurrent',
    },
    orderGeneratedOn: {
      name: 'order_generated_on_quotient',
      label: 'Order Generated On Quotient',
    },
    propagateValue: {
      name: 'is_propagate',
      label: 'Propagate',
    },
    thresholdMin: {
      name: 'threshold_min',
      label: 'Threshold Min',
    },
    thresholdMax: {
      name: 'threshold_max',
      label: 'Threshold Max',
    },
    checkListId: {
      name: 'check_list_id',
      label: 'Checklist',
    },
    teamCategory: {
      name: 'team_category_id',
      label: 'Team Category',
    },
    mType: {
      name: 'maintenance_type',
      label: 'Maintenace Type',
    },
    mroPropagate: {
      name: 'is_mro_propagate',
      label: 'Mro Propagate',
    },
    alarmName: {
      name: 'alarm_name',
      label: 'Alarm Name',
    },
    priorityValue: {
      name: 'priority',
      label: 'Priority',
    },
    categoryValue: {
      name: 'category_id',
      label: 'Category',
    },
    alarmRecipient: {
      name: 'alarm_recipients',
      label: 'Alarm Recipients',
    },
    propagateAlarm: {
      name: 'is_propagate_alarms',
      label: 'Propagate Alarms',
    },
    notiyMessage: {
      name: 'message',
      label: 'Notification Message',
    },
    descriptionValue: {
      name: 'description',
      label: 'Description',
    },
    alarmAction: {
      name: 'alarm_actions',
      label: 'Alarm Actions',
    },
    fontAwesomeIcon: {
      name: 'font_awesome_icon',
      label: 'Font Awesome Icon',
    },
    ttlMinute: {
      name: 'ttl',
      label: 'TTL (Minutes)',
    },
    measuredOn: {
      name: 'date',
      label: 'Measured On',
      requiredErrorMsg: 'Measured On is required',
      required: true,
    },
    measureValue: {
      name: 'value',
      label: 'Measure Value',
      requiredErrorMsg: 'Measure Value is required',
    },
    measureId: {
      name: 'measure_id',
      label: 'Measure',
    },
    equipmentId: {
      name: 'log_equipment_id',
      label: 'Equipment',
    },
  },
};
