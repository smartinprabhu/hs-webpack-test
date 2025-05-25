export default {
  formId: 'hxAuditform',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      required: true,
      requiredErrorMsg: 'Title is required',
    },
    auditType: {
      name: 'audit_type',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    auditCategoryId: {
      name: 'audit_category_id',
      label: 'Category',
    },
    auditSpocId: {
      name: 'audit_spoc_id',
      label: 'Audit SPOC',
      required: true,
      requiredErrorMsg: 'Audit SPOC is required',
    },
    auditSystemId: {
      name: 'audit_system_id',
      label: 'Audit System',
      required: true,
      requiredErrorMsg: 'Audit System is required',
    },
    plannedStartDate: {
      name: 'planned_start_date',
      label: 'Planned Start Date',
      required: true,
      requiredErrorMsg: 'Planned Start Date is required',
    },
    plannedEndDate: {
      name: 'planned_end_date',
      label: 'Planned End Date',
      required: true,
      requiredErrorMsg: 'Planned End Date is required',
    },
    departmentId: {
      name: 'department_id',
      label: 'Department',
      required: false,
      requiredErrorMsg: 'Department is required',
    },
    Scope: {
      name: 'scope',
      label: 'Scope',
    },
    Objective: {
      name: 'objective',
      label: 'Objective',
    },
    monthCount: {
      name: 'month',
      label: 'Repeat Every (Months)',
    },
    repeatUntil: {
      name: 'repeat_until',
      label: 'Repeats Until',
    },
  },
};
