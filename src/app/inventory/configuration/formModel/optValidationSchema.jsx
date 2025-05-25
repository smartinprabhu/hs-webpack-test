import * as Yup from 'yup';
import optFormModel from './optFormModel';

const {
  formField: {
    name,
    sequenceId,
    operationType,
    role,
  },
} = optFormModel;

const optValidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Operation Type is too large'),
  [sequenceId.name]: Yup.string()
    .nullable()
    .required(`${sequenceId.requiredErrorMsg}`),
  [operationType.name]: Yup.string()
    .nullable()
    .required(`${operationType.requiredErrorMsg}`),
  [role.name]: Yup.string().when('is_confirmed', {
    is: true,
    then: Yup.string().required('Role is required'),
  }),
});

export default optValidationSchema;
