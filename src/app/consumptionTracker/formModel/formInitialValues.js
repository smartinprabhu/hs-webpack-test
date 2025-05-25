import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateAudit,
    trackerTemplateId,
    startDate,
    endDate,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [dateAudit.name]: '',
  [trackerTemplateId.name]: '',
  [startDate.name]: '',
  [endDate.name]: '',
};
