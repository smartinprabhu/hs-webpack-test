export default {
  formId: 'wasteForm',
  formField: {
    Operation: {
      name: 'operation',
      label: 'Operation',
      requiredErrorMsg: 'Operation is required',
    },
    Type: {
      name: 'type',
      label: 'Type',
      requiredErrorMsg: 'Type is required',
    },
    Weight: {
      name: 'weight',
      label: 'Weight (KG)',
      requiredErrorMsg: 'Weight is required',
    },
    loggedOn: {
      name: 'logged_on',
      label: 'Logged On',
      requiredErrorMsg: 'Logged On is required',
    },
    Tenant: {
      name: 'tenant',
      label: 'Tenant',
    },
    Vendor: {
      name: 'vendor',
      label: 'Vendor',
    },
    carriedBy: {
      name: 'carried_by',
      label: 'Carried By',
    },
    accompaniedBy: {
      name: 'accompanied_by',
      label: 'Accompanied By',
    },
    securityBy: {
      name: 'security_by',
      label: 'Security By',
    },
  },
};
