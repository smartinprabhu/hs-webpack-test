import * as Yup from 'yup';
import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    recipients,
  },
} = checkoutFormModel;

const InventorySettingsValidationSchema = Yup.object().shape({
  [recipients.name]: Yup.string().when('include_reminder_alert_items', {
    is: true,
    then: Yup.string().required('Recipients is required'),
  }),
});

export default InventorySettingsValidationSchema;
