export default {
  formId: 'slaStateEmailForm',
  formField: {
    helpdeskState: {
      name: 'sla_state',
      label: 'SLA State',
      requiredErrorMsg: 'SLA State is required',
    },
    isRequestee: {
      name: 'is_requestee',
      label: 'Send to Requester',
    },
    isRecipients: {
      name: 'is_recipients',
      label: 'Additional Recipients',
    },
    recipientsName: {
      name: 'recipients_ids',
      label: 'Recipients Name',
    },
    isSendEmail: {
      name: 'is_send_email',
      label: 'Allow Email',
    },
    mailTemplateId: {
      name: 'initiated_template_id',
      label: 'Mail Template',
    },
  },
};
