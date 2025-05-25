export default {
  formId: 'inventoryStateEmailForm',
  formField: {
    requestState: {
      name: 'request_state',
      label: 'Request Status',
      requiredErrorMsg: 'State is required',
    },
    typeOfOperation: {
      name: 'code',
      label: 'Type of Operation',
      requiredErrorMsg: 'Operation is required',
    },
    requester: {
      name: 'is_requestee',
      label: 'Requester',
    },
    recipientsAdvance: {
      name: 'is_recipients',
      label: 'Recipients',
    },
    isRecipients: {
      name: 'recipients_ids',
      label: 'Recipients',
    },
    isSendEmail: {
      name: 'is_send_email',
      label: 'Send Email',
    },
  },
};
