/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import Box from '@mui/system/Box';
import React, { useState } from 'react';

import locationTemplate from '@images/templates/space_tamplate_new.xlsx';
import GridBulkUpload from '@shared/gridBulkUpload';

import fieldsArgs from '../data/importFields.json';

const appModels = require('../../util/appModels').default;

const SpaceBulkUpload = () => {
  const [reload, showBulkUploadModal] = useState(false);

  return (
    <Box className="insights-box">
      <GridBulkUpload
        atFinish={() => {
          showBulkUploadModal(false);
        }}
        targetModel={appModels.LOCATION}
        modalTitle="Space Bulk Upload"
        modalMsg="Spaces are uploaded successfully..."
        testFields={fieldsArgs.spaceFieldsNew}
        uploadFields={fieldsArgs.spaceUploadFieldsNew}
        sampleTamplate={locationTemplate}
        labels={fieldsArgs.spaceFieldLabelsNew}
        bulkUploadModal
      />
    </Box>
  );
};

export default SpaceBulkUpload;
