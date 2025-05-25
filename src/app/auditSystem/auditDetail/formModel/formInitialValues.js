import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    dateDeadline,
    userId,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [dateDeadline.name]: '',
  [userId.name]: '',
};
