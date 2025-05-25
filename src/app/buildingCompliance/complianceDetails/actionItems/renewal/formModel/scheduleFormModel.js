export default {
  formId: 'evidenceForm',
  formField: {
    userId: {
      name: 'user_id',
      label: 'User',
      required: true,
      requiredErrorMsg: 'User is required'
    },
    complianceEvidenceId: {
      name: 'id',
      label: 'Id',
    },
    dateTime: {
      name: 'evidences_date',
      label: 'Date Time',
      required: true,
      requiredErrorMsg: 'Date Time is required',
    },
    description: {
      name: 'description',
      label: 'Description',
      required: true,
      requiredErrorMsg: 'Description is required',
    },
    versionStatus: {
      name: 'version_status',
      label: 'Version Status',
      required: true,
      requiredErrorMsg: 'Version Status is required',
    },
    document: {
      name: 'file_path',
      label: 'Document',
    },
  },
};
