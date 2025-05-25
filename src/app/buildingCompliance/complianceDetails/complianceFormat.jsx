/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState, useRef } from 'react';
import {
  Col,
  FormGroup,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import { getComplianceDetail } from '../complianceService';
import {
  updateTenant, resetUpdateTenant,
} from '../../adminSetup/setupService';

const appModels = require('../../util/appModels').default;

const ComplianceFormat = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const editor = useRef(null);
  const { complianceDetails } = useSelector((state) => state.compliance);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  useEffect(() => {
    if (complianceDetails && complianceDetails.data) {
      const cFormat = complianceDetails.data.length > 0 ? complianceDetails.data[0].compliance_format : [];
      if (cFormat) {
        setComment(cFormat);
      }
    }
  }, []);

  useEffect(() => {
    if (tenantUpdateInfo && tenantUpdateInfo.data) {
      const viewId = complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 ? complianceDetails.data[0].id : '';
      dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
      dispatch(resetUpdateTenant());
    }
  }, [tenantUpdateInfo]);

  const onCommontChange = (data) => {
    setComment(data);
  };

  const sendComment = () => {
    const viewId = complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 ? complianceDetails.data[0].id : '';
    const postData = { compliance_format: comment };
    dispatch(updateTenant(viewId, postData, appModels.BULIDINGCOMPLIANCE));
  };

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12">
          <>
            <FormGroup className="mt-2">
              <JoditEditor
                ref={editor}
                value={comment}
                onChange={onCommontChange}
                onBlur={onCommontChange}
              />
            </FormGroup>
            <Button
              disabled={!comment || (tenantUpdateInfo && tenantUpdateInfo.loading)}
              type="button"
              onClick={() => sendComment()}
              size="sm"
              className="pull-right border-color-red-gray bg-white text-dark rounded-pill"
               variant="contained"
            >
              Add
            </Button>
          </>
          {(tenantUpdateInfo && tenantUpdateInfo.err) && (
          <SuccessAndErrorFormat response={tenantUpdateInfo} />
          )}
          {(tenantUpdateInfo && tenantUpdateInfo.data) && (
          <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage="Compliance format successfully.." />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ComplianceFormat;
