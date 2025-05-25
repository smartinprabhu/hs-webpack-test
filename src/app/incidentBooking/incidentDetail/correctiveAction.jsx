/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useRef } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  FormGroup,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import JoditEditor from 'jodit-react';


import {
  updateIncidentNoLoad, resetUpdateIncidentInfo,
} from '../ctService';

import {
  checkBase64Size,
} from '../../util/appUtils';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const appModels = require('../../util/appModels').default;

const CorrectiveAction = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  let editor = useRef(null);

  const [desc, setDesc] = useState(detailData.corrective_action ? detailData.corrective_action : '');

  const [sizeValidation, setSizeValidation] = useState(false);
  const [lengthValidation, setLengthValidation] = useState(false);

  const onCancel = () => {
    dispatch(resetUpdateIncidentInfo());
  };

  const { updateIncidentInfo } = useSelector((state) => state.hxIncident);

  const handleFileSelection = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Convert the image to a base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result;
        const data = `<img src="${dataURL}" height="200" width="200" alt="Uploaded Image" />&nbsp;&nbsp;${desc || ''}`;
        setDesc(data);

        const postData = {
          corrective_action: data,
        };
        dispatch(updateIncidentNoLoad(detailData.id, appModels.HXINCIDENT, postData));
      };

      reader.readAsDataURL(file);
    }
  };

  const editorConfig = useMemo(() => ({
    uploader: {
      insertImageAsBase64URI: true, // Insert images as base64 URIs
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image extensions
      imageMaxSize: 1024 * 1024, // Maximum image size in bytes (1 MB)
    },
    spellcheck: true,
    height: 250,
    minHeight: 200,
    autofocus: true,
    allowResizeY: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,add-new-line',
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: 'eraser,ul,ol,image,table,link,undo,redo,fullsize',
    events:
           {
             afterInit: (instance) => { editor = instance; },
           },
  }), []);

  const editorReadConfig = {
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    toolbarButtonSize: 'small',
    disablePlugins: 'enter,inline-popup,add-new-line',
    height: detailData.probability_id.is_analysis_required ? 150 : 200,
    minHeight: detailData.probability_id.is_analysis_required ? 150 : 200,
  };

  const sizeLimit = 5000;

  const handleCorrectiveChange = (data) => {
    if (checkBase64Size(data, sizeLimit).isMax && checkBase64Size(data, sizeLimit).isImage <= 5) {
      setSizeValidation(false);
      setLengthValidation(false);
      setDesc(data);
      const postData = {
        corrective_action: data,
      };
      dispatch(updateIncidentNoLoad(detailData.id, appModels.HXINCIDENT, postData, 'yes'));
    } else if (!checkBase64Size(data, sizeLimit).isMax) {
      setSizeValidation(true);
    } else if (!(checkBase64Size(data, sizeLimit).isImage <= 5)) {
      setLengthValidation(true);
    }
  };

  const handleCorrectiveOnChange = (data) => {
    if (checkBase64Size(data, sizeLimit).isMax && checkBase64Size(data, sizeLimit).isImage <= 5) {
      setSizeValidation(false);
      setLengthValidation(false);
      setDesc(data);
    } else if (!checkBase64Size(data, sizeLimit).isMax) {
      setSizeValidation(true);
    } else if (!(checkBase64Size(data, sizeLimit).isImage <= 5)) {
      setLengthValidation(true);
    }
  };

  const loading = (updateIncidentInfo && updateIncidentInfo.loading);

  const isManagable = detailData && (detailData.state === 'Reported' || detailData.state === 'Acknowledged');

  return (
    <Card className="mb-3 border-0">
      <Row>
        <Col md="9" sm="12" xs="12" lg="9">
          <p className="ml-3 mb-0 mt-2 font-weight-600 text-pale-sky font-size-13">CORRECTIVE ACTION</p>
        </Col>
      </Row>
      <hr className="mb-0 mt-0 mr-2 ml-2" />
      <CardBody className="p-0">
        {detailData && isManagable && (
          <Row className="mt-0 p-3">
            <Col md="12" xs="12" sm="12" lg="12">
              <FormGroup className="mb-1">
                <div className="">
                  <JoditEditor
                    ref={editor}
                    value={desc}
                    config={editorConfig}
                    onChange={handleCorrectiveOnChange}
                    onBlur={handleCorrectiveChange}
                  />
                </div>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Snackbar open={sizeValidation}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                      Files size are exceeds the maximum allowed size of 5MB.
                    </Alert>
                  </Snackbar>
                </Stack>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Snackbar open={lengthValidation}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                      Only five attachments can be uploaded.
                    </Alert>
                  </Snackbar>
                </Stack>
              </FormGroup>
            </Col>
          </Row>
        )}
        {!isManagable && (
        <Row className="mt-0 p-3">
          <Col md="12" xs="12" sm="12" lg="12">
            <FormGroup className="mb-1">
              <div className="">
                <JoditEditor
                  ref={editor}
                  value={detailData.corrective_action ? detailData.corrective_action : ''}
                  config={editorReadConfig}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        )}
      </CardBody>
    </Card>
  );
};

CorrectiveAction.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default CorrectiveAction;
