import * as Yup from 'yup';
import dayjs from 'dayjs';

const today = dayjs().startOf('day');

const assetValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name is too large'),
  location_id: Yup.string()
    .nullable()
    .required('Space is required'),
  category_id: Yup.string()
    .nullable()
    .required('Category is required'),
  maintenance_team_id: Yup.string()
    .nullable()
    .required('Maintenance Team is required'),
  warranty_start_date: Yup.date()
    .nullable()
    .max(today.toDate(), 'Warranty start date should be equal or lesser than current date'),
  warranty_end_date: Yup.date()
    .nullable()
    .min(Yup.ref('warranty_start_date'), 'End date cannot be before Start date'),
  amc_start_date: Yup.date()
    .nullable()
    .max(today.toDate(), 'AMC start date should be equal or lesser than current date'),
  amc_end_date: Yup.date()
    .nullable()
    .min(Yup.ref('amc_start_date'), 'AMC end date must be after  AMC start date'),
  /* commodity_id: Yup.string()
    .nullable()
    .required('UNSPSC Code is required'), */
});

export default assetValidationSchema;
