import * as Yup from 'yup';
import accountIdLogin from './accountIdFormModel';
import { getMaxLenghtForFields } from '../../util/appUtils';

const maxLengthValues = getMaxLenghtForFields()

const {
  formFields:
    {
      accountId,
    },
} = accountIdLogin;

const AccountIdValidatiomSchema = Yup.object({
  [accountId.name]: Yup.string().required(`${accountId.requiredErrorMsg}`).max(maxLengthValues.accountId, accountId.maxLengthError),
});

export default AccountIdValidatiomSchema;
