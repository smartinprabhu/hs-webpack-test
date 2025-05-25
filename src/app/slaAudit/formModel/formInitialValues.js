import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    auditTemplateId,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [dateAudit.name]: '',
  [auditTemplateId.name]: '',
};
