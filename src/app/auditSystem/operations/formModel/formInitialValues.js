import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    system,
    facilityManager,
    facilityManagerContact,
    facilityManagerEmail,
    space,
    auditorName,
    auditorDesignation,
    audtiorContact,
    auditorEmail,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [dateAudit.name]: '',
  [system.name]: '',
  [facilityManager.name]: '',
  [facilityManagerContact.name]: '',
  [facilityManagerEmail.name]: '',
  [space.name]: '',
  [auditorName.name]: '',
  [auditorDesignation.name]: '',
  [audtiorContact.name]: '',
  [auditorEmail.name]: '',
};
