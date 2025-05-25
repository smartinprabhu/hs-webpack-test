import * as Yup from 'yup';
import checkoutFormModel from './escalationLevelcheckoutFormModel';

const {
  formField: {
    title,
    space,
    recipients,
    equipmentCategory,
    spaceCategory,
  },
} = checkoutFormModel;

const EscalationLevelvalidationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [space.name]: Yup.string()
    .required(`${space.requiredErrorMsg}`),
  [recipients.name]: Yup.string()
    .required(`${recipients.requiredErrorMsg}`),
  [equipmentCategory.name]: Yup.string().when('type_category', {
    is: 'equipment',
    then: Yup.string().required(`${equipmentCategory.requiredErrorMsg}`),
  }),
  [spaceCategory.name]: Yup.string().when('type_category', {
    is: 'space',
    then: Yup.string().required(`${spaceCategory.requiredErrorMsg}`),
  }),
  // [equipmentCategory.name]: Yup.string()
  //   .required(`${equipmentCategory.requiredErrorMsg}`),
  // [spaceCategory.name]: Yup.string()
  //   .required(`${spaceCategory.requiredErrorMsg}`),
});

export default EscalationLevelvalidationSchema;
