export default {
  formId: 'helpdeskStateEmailForm',
  formField: {
    helpdeskState: {
      name: 'helpdesk_state',
      label: 'Helpdesk Status',
      requiredErrorMsg: 'State is required',
    },
    isRequestee: {
      name: 'is_requestee',
      label: 'Send to Requester',
    },
    isMaintenanceTeam: {
      name: 'is_maintenance_team',
      label: 'Send to Maintenance Team',
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
      name: 'mail_template_id',
      label: 'Mail Template',
    },
    isPushNotify: {
      name: 'is_push_notify',
      label: 'Allow Push Notification',
    },
    isSendSms: {
      name: 'is_send_sms',
      label: 'Allow SMS',
    },
    smsTemplateId: {
      name: 'sms_template_id',
      label: 'SMS Template',
    },
  },
};
