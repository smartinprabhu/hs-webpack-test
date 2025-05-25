/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import readingFormModel from './readingFormModel';

const {
  formField: {
    readingId,
    measuredOn,
    measureValue,
  },
} = readingFormModel;

const readingValidationSchema = Yup.object().shape({
  [readingId.name]: Yup.string()
    .nullable()
    .required(`${readingId.requiredErrorMsg}`),
  [measuredOn.name]: Yup.date().when('to_do', {
    is: 'Reading Logs',
    then: Yup.date().required(`${measuredOn.requiredErrorMsg}`),
  }),
  [measureValue.name]: Yup.string().when('to_do', {
    is: 'Reading Logs',
    then: Yup.string().required(`${measureValue.requiredErrorMsg}`),
  }),
});

export default readingValidationSchema;
