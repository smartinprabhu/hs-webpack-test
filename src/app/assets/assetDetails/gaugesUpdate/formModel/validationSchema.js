/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import gaugeFormModel from './gaugeFormModel';

const {
  formField: {
    gaugeId,
    thresholdMin,
    thresholdMax,
  },
} = gaugeFormModel;

const validationSchema = Yup.object().shape({
  [gaugeId.name]: Yup.string()
    .nullable()
    .required(`${gaugeId.requiredErrorMsg}`),
  [thresholdMin.name]: Yup.number()
    .nullable()
    .required(`${thresholdMin.requiredErrorMsg}`),
  [thresholdMax.name]: Yup.number()
    .nullable()
    .required(`${thresholdMax.requiredErrorMsg}`),
});

export default validationSchema;
