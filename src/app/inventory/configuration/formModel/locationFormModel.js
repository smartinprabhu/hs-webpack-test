export default {
  formId: 'locationForm',
  formField: {
    name: {
      name: 'name',
      label: 'Location',
      requiredErrorMsg: 'Location is required',
    },
    locationId: {
      name: 'location_id',
      label: 'Parent Location',
      requiredErrorMsg: 'Location is required',
    },
    locationType: {
      name: 'usage',
      label: 'Location Type',
      requiredErrorMsg: 'Location Type is required',
    },
    partnerId: {
      name: 'partner_id',
      label: 'Owner',
      requiredErrorMsg: 'Owner is required',
    },
    companyId: {
      name: 'company_id',
      label: 'Company',
      requiredErrorMsg: 'Company is required',
    },
    scrapLocation: {
      name: 'scrap_location',
      label: 'Is a Scrap Location?',
      requiredErrorMsg: 'Company is required',
    },
    returnLocation: {
      name: 'return_location',
      label: 'Is a Return Location?',
      requiredErrorMsg: 'Company is required',
    },
    posxLabel: {
      name: 'posx',
      label: 'Corridor (X)',
      requiredErrorMsg: 'Company is required',
    },
    posyLabel: {
      name: 'posy',
      label: 'Shelves (Y)',
      requiredErrorMsg: 'Company is required',
    },
    poszLabel: {
      name: 'posz',
      label: 'Height (Z)',
      requiredErrorMsg: 'Company is required',
    },
    barcode: {
      name: 'barcode',
      label: 'Barcode',
      requiredErrorMsg: 'Company is required',
    },
    comment: {
      name: 'comment',
      label: 'External Note',
      requiredErrorMsg: 'Company is required',
    },
  },
};
