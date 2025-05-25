export default {
  formId: 'InventorySettingsForm',
  formField: {
    productBatch: {
      name: 'import_batch_size',
      label: 'Import Products per Batch',
    },
    productAccess: {
      name: 'products_list_access',
      label: 'Product Access Level',
      label1: 'Own Site Level',
      label2: 'Company Level',
    },
    accessCompany: {
      name: 'product_list_company_id',
      label: 'Access Product From Company',
    },
    reorderLevel: {
      name: 'is_reorder_level_email',
      label: 'Send an email when reorder Level Reached',
    },
    remainderAlert: {
      name: 'include_reminder_alert_items',
      label: 'Include Remainder Alert Products in Low Stock Email?',
    },
    recipients: {
      name: 'recipients_ids',
      label: 'Email Recipients Group',
      requiredErrorMsg: 'Recipients is required',
    },
  },
};
