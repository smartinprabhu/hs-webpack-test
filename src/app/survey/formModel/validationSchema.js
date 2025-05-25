import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    Day,
    deadLine,
    recurrentRule,
    startsOn,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .nullable()
    .required(`${title.requiredErrorMsg}`),
  [startsOn.name]: Yup.string().when('is_send_email', {
    is: true,
    then: Yup.string().required('starts On is required'),
  }),
  [recurrentRule.name]: Yup.mixed().when('is_send_email', {
    is: true,
    then: Yup.mixed().test('is-valid-recurrent-rule', 'Repeats On is required', (value) => {
    // Check if recurrentRule is an object and validate
      if (typeof value === 'object' && value !== null) {
        return Yup.object()
          .shape({
            value: Yup.string().required('Repeats On is required'),
            label: Yup.string().required('Repeats On is required'),
          })
          .isValidSync(value); // Validate the object
      }

      // If recurrentRule is a string, validate as a string
      if (typeof value === 'string') {
        return Yup.string().required('Repeats On is required').isValidSync(value);
      }

      return false; // Return false if it's neither a valid object nor string
    }),
  }),
  [Day.name]: Yup.number().when('recurrent_rule', {
    is: (recurrent_rule) => recurrent_rule?.value !== 'weekly' || recurrent_rule === 'weekly', // Check for 'weekly'
    then: Yup.number()
      .required('Day is required')
      .moreThan(0, 'Day count must be greater than 0'),
    otherwise: Yup.number(),
  }),
  [deadLine.name]: Yup.number()
    .nullable()
    .when('recurrent_rule', {
      is: (recurrent_rule) => recurrent_rule?.value === 'weekly' || recurrent_rule === 'weekly', // Check for 'weekly'
      then: Yup.number()
        .required('Deadline (Days) is required')
        .min(1, 'Deadline(Days) must be at least 1')
        .max(7, 'Deadline(Days) must be 7 or less'),
      otherwise: Yup.number().nullable().required('Deadline (Days) is required').moreThan(0, 'Deadline(Days) count must be greater than 0'),
    }),
});

export default validationSchema;
