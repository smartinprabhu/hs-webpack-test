/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    categoryId,
    equipmentId,
    assetId,
    incidentTypeId,
  },
} = checkoutFormModel;

const validationSchema = () => {
  const CreateValidationSchema = {
    [title.name]: Yup.string()
      .required(`${title.requiredErrorMsg}`),
    [incidentTypeId.name]: Yup.string().when('has_incident_type ', {
      is: 'Required',
      then: Yup.string().required('Type of Activity / Hazard is required'),
    }),
    [categoryId.name]: Yup.string()
      .required('Category is required'),
    [equipmentId.name]: Yup.string().when('type_category', {
      is: 'equipment',
      then: Yup.string().required('Equipment is required'),
    }),
    [assetId.name]: Yup.string().when('type_category', {
      is: 'asset',
      then: Yup.string().required('Space is required'),
    }),
  };

  /* if (edit) {
    CreateValidationSchema[severityId.name] = Yup.string()
      .required(`${severityId.requiredErrorMsg}`)
  } */

  return Yup.object().shape(CreateValidationSchema);
};

export default validationSchema;
