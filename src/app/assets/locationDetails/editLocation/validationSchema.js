/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  space_name: Yup.string()
    .required('Space Name is required')
    .max(30, 'Name is too large'),
  name: Yup.string()
    .required('Short Code is required')
    .max(30, 'Code is too large'),
  asset_category_id: Yup.string()
    .nullable()
    .required('Type is required'),
  maintenance_team_id: Yup.string()
    .nullable()
    .required('Maintenance Team is required'),
  parent_id: Yup.string().when('asset_categ_type', {
    is: 'building',
    then: Yup.string(),
    otherwise: Yup.string().required('Parent location is required'),
  }),
});

export default validationSchema;
