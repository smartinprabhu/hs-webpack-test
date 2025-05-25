/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  FormGroup,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import JoditEditor from 'jodit-react';


import {
  updateIncidentNoLoad, resetUpdateIncidentInfo,
} from '../ctService';


const appModels = require('../../util/appModels').default;

const CorrectiveAction = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const editor = useRef(null);

  const [desc, setDesc] = useState(detailData.corrective_action ? detailData.corrective_action : '');

  const onCancel = () => {
    dispatch(resetUpdateIncidentInfo());
  };

  const { updateIncidentInfo, hxIncidentConfig } = useSelector((state) => state.hazards);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  const editorConfig = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    spellcheck: true,
    height: configData.is_analyzed_required ? 250 : 400,
    minHeight: configData.is_analyzed_required ? 100 : 200,
    allowResizeY: false,
    toolbarInlineForSelection: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,spellcheck,undo,redo,fullsize,preview',
  };

  const editorReadConfig = {
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    height: configData.is_analyzed_required ? 250 : 300,
    minHeight: configData.is_analyzed_required ? 100 : 200,
  };

  const handleCorrectiveChange = (data) => {
    setDesc(data);
    const postData = {
      corrective_action: data,
    };
    dispatch(updateIncidentNoLoad(detailData.id, appModels.EHSHAZARD, postData));
  };

  const loading = (updateIncidentInfo && updateIncidentInfo.loading);

  const isManagable = detailData && (detailData.state === 'Reported' || detailData.state === 'Acknowledged');

  return (
    <Card className="h-100 mb-3">
      <Row>
        <Col md="9" sm="12" xs="12" lg="9">
          <p className="ml-3 mb-0 mt-2 font-weight-600 text-pale-sky font-size-13">CORRECTIVE ACTION</p>
        </Col>
      </Row>
      <hr className="mb-0 mt-0 mr-2 ml-2" />
      <CardBody className="p-0">
        {detailData && isManagable && (
          <Row className="mt-0">
            <Col md="12" xs="12" sm="12" lg="12">
              <FormGroup className="mb-1">
                <div className="">
                  <JoditEditor
                    ref={editor}
                    value={desc}
                    config={editorConfig}
                    onBlur={handleCorrectiveChange}
                  />
                </div>
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
