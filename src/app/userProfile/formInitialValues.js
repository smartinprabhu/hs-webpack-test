import checkoutFormModel from "./checkoutFormModel";


const {
  formField: {
    firstName,
    lastName,
    email,
    mobile,
    password,
    designation,
    company,
    anotherName
  },
} = checkoutFormModel;

export default {
  [firstName.name]: '',
  [lastName.name]: '',
  [email.name]: '',
  [mobile.name]: '',
  [password.name]:'',
  [designation.name]:'',
  [company.name]:'',
  [anotherName.name]:''
};
