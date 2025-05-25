export function generateErrorMessageWhileUploading(error){
    if(error.includes('categ_id')){
      return 'Product Category should not be empty'
    } else {
      return error
    }
}

export function generateChecklistErrorMessage(errData, checklistName) {
    if (errData && errData.err) {
      if (errData.err.data && !errData.err.data.status) {
        return (
          <span>
            Failed to delete.
            <br />
            <br />
            {`The checklist \"${checklistName}\" is configured in Inspection checklists.`}
          </span>
        );
      }
      if (errData.err.data && errData.err.data.error) {
        return errData.err.data.error.message;
      }
      if (errData.err.statusText) {
        return errData.err.statusText;
      }
      return 'Something went Wrong..';
    }
    return '';
  }