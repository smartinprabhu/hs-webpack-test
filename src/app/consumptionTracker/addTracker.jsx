/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */ 
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Box } from "@mui/system";

import { Button, FormControl } from "@mui/material";
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createConsumptionTracker, getConsumptionTrackerFilters,
} from './ctService';
import {
  trimJsonObject, extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWorkPermit = (props) => {
  const {
    editId, isShow, closeModal, afterReset, esgModule
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const { addCtInfo, ctDetailsInfo, ctExistsRecords } = useSelector((state) => state.consumptionTracker);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee ? userInfo.data.employee.id : '';
  const duplicateExists = ctExistsRecords && ctExistsRecords.data && ctExistsRecords.data.length > 0;

  const history = useHistory();

  function handleSubmit(values) { 
    if (!editId) {
      
     // closeModal();
      const postData = { ...values };

      postData.audit_date = values.audit_date ? moment(values.audit_date).utc().format('YYYY-MM-DD') : false;
      postData.start_date = values.start_date ? moment(values.start_date).format('YYYY-MM-DD') : false;
      postData.end_date = values.end_date ? moment(values.end_date).format('YYYY-MM-DD') : false;
      postData.tracker_template_id = extractValueObjects(values.tracker_template_id);
      // postData.created_by_id = userEmployeeId;
      postData.created_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      postData.company_id = userCompanyId;

      const payload = { model: appModels.CONSUMPTIONTRACKER, values: postData };
      dispatch(createConsumptionTracker(appModels.CONSUMPTIONTRACKER, payload));
      setIsOpenSuccessAndErrorModalWindow(true);
    }
  }

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
        name: ename,
      }];
      dispatch(getConsumptionTrackerFilters(customFilters));
    }
    setAuditRequest(false);
    history.push({ pathname: '/consumption-trackers' });
    closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const closeAddMaintenance = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (

        <Formik
          enableReinitialize
          initialValues={editId && ctDetailsInfo && ctDetailsInfo.data ? trimJsonObject(ctDetailsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                    padding: "20px",
                    width: "100%",
                }}
              >
              <FormControl
                sx={{
                    width: "100%",
                }}
              >
              {(addCtInfo && !addCtInfo.data
                && !addCtInfo.loading) && (
                <BasicForm formField={formField} isShow={isShow} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} values={values}/>              
                
              )}
              {(addCtInfo && addCtInfo.err) && (
                <SuccessAndErrorFormat response={addCtInfo} />
              )}
               </FormControl>  
              {(addCtInfo && !addCtInfo.data && !addCtInfo.loading)
                && (
                  <div className="sticky-button-50drawer">
                        
                      <Button
                        disabled={!editId ? !(isValid && dirty) || (ctExistsRecords && ctExistsRecords.loading) || (duplicateExists && values.audit_date && values.tracker_template_id && values.tracker_template_id.id) : !isValid}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                      
                      {duplicateExists && values.audit_date && values.tracker_template_id && values.tracker_template_id.id && (
                        <p className="m-0 text-danger">A Record for the selected Period and Template already exists.</p>
                      )}
                 </div>  
                )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={addCtInfo && addCtInfo.data && ctDetailsInfo && ctDetailsInfo.data && ctDetailsInfo.data.length > 0 ? ctDetailsInfo.data[0].id : false}
                newName={addCtInfo && addCtInfo.data && ctDetailsInfo && ctDetailsInfo.data && ctDetailsInfo.data.length > 0 ? ctDetailsInfo.data[0].name : false}
                successOrErrorData={editId ? false : addCtInfo}
                headerImage={AuditBlue}
                headerText={esgModule ? `${esgModule} Tracker` : "Consumption Tracker"}
                onLoadRequest={onLoadRequest}
                successRedirect={closeAddMaintenance.bind(null, resetForm)}
              />   
             
              </Box>        
            </Form>            
          )}
        </Formik>     
  );
};

AddWorkPermit.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddWorkPermit;
