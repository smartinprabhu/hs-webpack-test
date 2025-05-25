export default {
  formId: 'gatePassForm',
  formField: {
    purpose: {
      name: 'description',
      label: 'Purpose',
      requiredErrorMsg: 'Purpose is required',
    },
    Reference: {
      name: 'reference',
      label: 'Reference',
      requiredErrorMsg: 'Reference is required',
    },
    requestor: {
      name: 'requestor_id',
      label: 'Requestor',
      requiredErrorMsg: 'Requestor is required',
    },
    typeValue: {
      name: 'type',
      label: 'Returnable',
      label1: 'Non-Returnable',
    },
    RequestedOn: {
      name: 'requested_on',
      label: 'Requested On',
      requiredErrorMsg: 'Requested On is required',
    },
    space: {
      name: 'space_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    bearerName: {
      name: 'name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    bearerReturnOn: {
      name: 'bearer_return_on',
      label: 'Returned On',
      requiredErrorMsg: 'Returned On is required',
    },
    bearerMobile: {
      name: 'mobile',
      label: 'Mobile',
      requiredErrorMsg: 'Mobile is required',
    },
    bearerEmail: {
      name: 'email',
      label: 'Email',
      requiredErrorMsg: 'Email is required',
    },
    bearerToReturnOn: {
      name: 'to_be_returned_on',
      label: 'To be Returned on',
      requiredErrorMsg: 'To be Returned on is required',
    },
    vendorId: {
      name: 'vendor_id',
      label: 'Vendor',
      requiredErrorMsg: 'Vendor is required',
    },
    gatePassType: {
      name: 'gatepass_type',
      label: 'Asset / Item',
      requiredErrorMsg: 'Asset / Item is required',
    },
  },
};
