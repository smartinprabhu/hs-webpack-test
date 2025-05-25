export default {
  formId: 'configProductCategoryForm',
  formField: {
    name: {
      name: 'name',
      label: 'Category Name',
      requiredErrorMsg: 'Category Name is required',
    },
    teamCategoryId: {
      name: 'team_category_id',
      label: 'Team Category',
    },
    categoryUserId: {
      name: 'cat_user_ids',
      label: 'Category Users',
    },
    incidentType: {
      name: 'incident_type_id',
      label: 'Incident Type',
    },
    incidentCategory: {
      name: 'is_incident',
      label: 'Is an incident Category?',
    },
    accessGroupIds: {
      name: 'access_group_ids',
      label: 'Access Groups',
    },
  },
};
