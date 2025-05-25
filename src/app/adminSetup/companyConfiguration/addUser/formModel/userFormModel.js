export default {
  formId: 'locationForm',
  formField: {
    name: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Email is not valid (e.g. abc@example.com)',
    },
    companyId: {
      name: 'company_id',
      label: 'Current Site',
      required: true,
      requiredErrorMsg: 'Current Site is required',
    },
    roleIds: {
      name: 'user_role_id',
      label: 'Current User Role',
      required: true,
      requiredErrorMsg: 'Current User Role is required',
    },
    employee: {
      name: 'active',
      label: 'Yes',
      label1: 'No',
      required: true,
    },
    shiftId: {
      name: 'resource_calendar_id',
      label: 'Shift',
      required: false,
    },
    departmentId: {
      name: 'hr_department',
      label: 'Department',
      required: false,
    },
    biometricId: {
      name: 'biometric',
      label: 'Biometric ID',
      required: false,
    },
    employeeId: {
      name: 'employee_id_seq',
      label: 'Employee ID',
      required: true,
      requiredErrorMsg: 'Employee ID is required',
    },
    vendorId: {
      name: 'vendor_id_seq',
      label: 'Vendor ID',
      required: false,
    },
    companyIds: {
      name: 'company_ids',
      label: 'Allowed Sites',
      required: true,
      requiredErrorMsg: 'Allowed Sites is required',
    },
    mobileUser: {
      name: 'is_mobile_user',
      label: 'Yes',
      label1: 'No',
      required: false,
    },
    associateId: {
      name: 'vendor_id',
      label: 'Associate Entity',
      required: true,
      requiredErrorMsg: 'Associate Entity is required',
    },
    phoneNumber: {
      name: 'phone_number',
      label: 'Mobile',
      required: false,
    },
    associateTo: {
      name: 'associates_to',
      label: 'Associates To',
      required: true,
      requiredErrorMsg: 'Associates To is required',
    },
    Password: {
      name: 'password',
      label: 'Password',
      required: true,
      requiredErrorMsg: 'Password is required',
    },
    isTempPassword: {
      name: 'autogenerate_temporary_password',
      label: 'Auto generate Temporary Password',
      required: false,
    },
    isSOWEmployee: {
      name: 'is_sow_employee',
      label: 'Is SOW Employee',
      required: false,
    },
    autoSelectCompany: {
      name: 'auto_select_company',
      label: 'Auto select all companies/sites',
      required: false,
    },
    defaultUserRole: {
      name: 'default_user_role_id',
      label: 'Default User Role',
      required: false,
    },
    Designation: {
      name: 'designation_id',
      label: 'Designation',
      required: false,
    },
    teamIds: {
      name: 'maintenance_team_ids',
      label: 'Teams',
    },
  },
};
