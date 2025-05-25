import React from 'react';
import * as PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { generateErrorMessageDetail } from '../util/appUtils';

const SuccessAndErrorFormatMui = (props) => {
  const {
    response, successMessage,
    showCreate,
    isCreate,
    onCreate,
    createName,
    staticErrorMsg,
    staticInfoMessage,
    staticSuccessMessage,
    apiErrorMsg,
    customErrMsg,
  } = props;

  return (
    <>
      {response && (response.data || response.status) && successMessage && (
      <Stack className="mt-2">
        <Alert severity="success" sx={{ justifyContent: 'center' }}>
          <p className="font-family-tab mb-0 font-weight-800">{successMessage}</p>

        </Alert>
      </Stack>
      )}
      {response && response.err && (response.err.data || response.err.error || response.err.statusText) && (
      <Stack className="mt-3">
        <Alert severity="error" sx={{ justifyContent: 'center' }}>
          <p className="font-family-tab mb-0 font-weight-800">
            {apiErrorMsg && staticErrorMsg
            && generateErrorMessageDetail(response).includes(apiErrorMsg)
              ? (
                <>
                  {staticErrorMsg}
                </>
              )
              : (
                <>
                  {customErrMsg || generateErrorMessageDetail(response)}
                </>
              )}
          </p>

        </Alert>
      </Stack>

      )}
      {!response && staticErrorMsg && (
      <Stack className="mt-2">
        <Alert severity="error" sx={{ justifyContent: 'center', width: '100%' }}>
          <p className="font-family-tab mb-0 font-weight-800">{staticErrorMsg}</p>
        </Alert>
      </Stack>
      )}
      {!response && staticSuccessMessage && (
      <Stack className="mt-2">
        <Alert severity="success" sx={{ justifyContent: 'center', width: '100%' }}>
          <p className="font-family-tab mb-0 font-weight-800">{staticSuccessMessage}</p>
        </Alert>
      </Stack>
      )}
      {!response && staticInfoMessage && (
      <Stack className="mt-2">
        <Alert severity="info" sx={{ justifyContent: 'center', width: '100%' }}>
          <p className="font-family-tab mb-0 font-weight-800">{staticInfoMessage}</p>
        </Alert>
        {showCreate && isCreate && (
        <Button
          variant="contained"
          className="font-family-tab text-center"
          type="button"
          sx={{
            maxWidth: '300px', margin: 'auto', position: 'relative', top: '10px', bottom: '20px',
          }}
          onClick={onCreate}
        >
          {createName}
        </Button>
        )}
      </Stack>
      )}
    </>
  );
};

SuccessAndErrorFormatMui.defaultProps = {
  successMessage: undefined,
};

SuccessAndErrorFormatMui.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  response: PropTypes.any.isRequired,
  successMessage: PropTypes.string,
};

export default SuccessAndErrorFormatMui;
