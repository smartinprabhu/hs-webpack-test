/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Spinner,
} from 'reactstrap';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText
} from '@mui/material';

import DialogHeader from '../commonComponents/dialogHeader';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

const SuccessAndErrorModalWindow = (props) => {
  const {
    isOpenSuccessAndErrorModalWindow,
    setIsOpenSuccessAndErrorModalWindow,
    successOrErrorData,
    staticErrorMsg,
    apiErrorMsg,
    type,
    headerImage,
    headerText,
    successRedirect,
    onLoadRequest,
    newId,
    newName,
    actionMsg,
    response,
    detailData,
    customErrMsg,
  } = props;

  let txtMsg = 'created';

  if (type && type === 'update') {
    txtMsg = 'updated';
  }

  return (
    <Dialog maxWidth="sm" open={isOpenSuccessAndErrorModalWindow}>
      <DialogHeader
        title={headerText}
        onClose={() => setIsOpenSuccessAndErrorModalWindow(false)}
        imagePath={headerImage}
        response={successOrErrorData}
      />
      <DialogContent className="text-center" style={{ width: '400px' }}>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <div className="py-4">
            <SuccessAndErrorFormat response={successOrErrorData} successMessage={`${headerText} ${actionMsg || txtMsg} successfully..`} customErrMsg={customErrMsg} staticErrorMsg={staticErrorMsg} apiErrorMsg={apiErrorMsg} />
              {(successOrErrorData && successOrErrorData.loading || detailData && detailData.loading || (successOrErrorData && (!successOrErrorData.data && !successOrErrorData.err))) && (
                <Spinner size="md" />
              )}
              {successOrErrorData && !successOrErrorData.loading && type !== 'update' && newId && newId && (
                <p className="text-center mt-2 mb-0 tab_nav_link">
                  Click here to view
                  {' '}
                  :
                  <span
                    aria-hidden="true"
                    className="ml-2 cursor-pointer text-info"
                    onClick={() => onLoadRequest(newId, newName)}
                  >
                    {newName}
                  </span>
                  {' '}
                  details
                </p>
              )}
            </div>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {successOrErrorData && (successOrErrorData.data || successOrErrorData.err) && (
          <Button
            size="sm"
            type="button"
            variant='contained'
            className="submit-btn"
            onClick={successRedirect}
            disabled={successOrErrorData && successOrErrorData.loading}
          >
            OK
          </Button>
        )}
        {/* {successOrErrorData && successOrErrorData.err && (
          <Button
            size="sm"
            type="button"
             variant="contained"
            onClick={() => setIsOpenSuccessAndErrorModalWindow(false)}
            disabled={successOrErrorData && successOrErrorData.loading}
          >
            OK
          </Button>
        )} */}
      </DialogActions>
    </Dialog>
  );
};

export default SuccessAndErrorModalWindow;
