/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import WorkPermitBlue from '@images/icons/workPermitBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import { resetImage } from '../helpdesk/ticketService';
import { createProductCategory, resetCreateProductCategory, updateProductCategory } from '../pantryManagement/pantryService';
import { getPartsData } from '../preventiveMaintenance/ppmService';
import {
  extractValueObjects,
  getColumnArrayById,
  getAllowedCompanies,
  getArrayNewFormatUpdateDelete, getDateDiffereceBetweenTwoDaysLocal, getArrayNewFormatUpdateDeleteNew,
  getDateTimeLocalMuI,
  getTimeLocalMuI,
  getDateLocalMuI,
  trimJsonObject,
  getDateTimeUtcMuI,
} from '../util/appUtils';
import { last } from '../util/staticFunctions';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import BasicForm from './forms/basicForm';
import ProductForm from './forms/productForm';
import { checkProductId, getNewRequestArray } from './utils/utils';
import {
  getWorkPermitDetails, getWorkPermitFilters,
} from './workPermitService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWorkPermit = (props) => {
  const {
    editId, isShow, closeModal, afterReset, visibility,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [workPermitRequest, setWorkPermitRequest] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { addProductCategoryInfo, updateProductCategoryInfo } = useSelector((state) => state.pantry);
  const { workPermitDetail, workPermitConfig, partsSelected } = useSelector((state) => state.workpermit);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;
  const isPartRequired = !!(wpConfig && wpConfig.is_parts_required);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length) {
      dispatch(getWorkPermitDetails(addProductCategoryInfo.data[0], appModels.WORKPERMIT));
    }
  }, [userInfo, addProductCategoryInfo]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.parts_id && (typeof item.parts_id === 'number')));
    }
    return result;
  }

  const getSpaceValue = (spaceId) => {
    if (Array.isArray(spaceId)) {
      return last(spaceId);
    }
    return spaceId.id;
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const empId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : '';
      const empName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name ? userInfo.data.employee.name : '';
      const companyId = userInfo.data.company ? userInfo.data.company.id : '';
      formInitialValues.requestor_id = { id: empId, name: empName };
      if (!editId) {
        formInitialValues.reviewer_id = { id: empId, name: empName };
      }
      formInitialValues.company_id = companyId;
      dispatch(getPartsData([]));
    }
  }, [userInfo]);

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function checkExTimehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getTimeLocalMuI(data);
    } else {
      result = moment(data).local().format('HH:mm:ss');
    }
    return result;
  }

  function checkExDatehasObjectLocal(data, isUtc) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeLocalMuI(data);
    } else {
      result = isUtc ? moment.utc(data).local().format('YYYY-MM-DD HH:mm:ss') : moment(data).format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function checkExDatOnlyObjectUtc(data, end) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      const date = getDateLocalMuI(data);
      const time = checkExTimehasObject(end);
      result = checkExDatehasObject(`${date} ${time}`);
    } else {
      const date = getDateLocalMuI(data);
      const time = checkExTimehasObject(end);
      result = checkExDatehasObject(`${date} ${time}`);
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let partsData = [];
      if (values.work_technician_ids && values.work_technician_ids.length > 0) {
        dispatch(getPartsData(values.work_technician_ids));
        partsData = (values.work_technician_ids);
      }
      let orderData = [];
      if (values.parts_lines && values.parts_lines.length > 0) {
        orderData = getNewRequestArray(values.parts_lines);
      }
      const typeValue = values.type;
      const isPlanInNew = trimJsonObject(workPermitDetail.data[0]) && new Date(trimJsonObject(workPermitDetail.data[0]).planned_start_time).getTime() !== new Date(values.planned_start_time).getTime();
      const isPlanOutNew = trimJsonObject(workPermitDetail.data[0]) && new Date(trimJsonObject(workPermitDetail.data[0]).planned_end_time).getTime() !== new Date(values.planned_end_time).getTime();
      const isValidOutNew = trimJsonObject(workPermitDetail.data[0]) && values.valid_through && workPermitDetail.data[0].valid_through && new Date(trimJsonObject(workPermitDetail.data[0]).valid_through).getTime() !== new Date(values.valid_through).getTime();
      const postData = {
        name: values.name,
        requestor_id: extractValueObjects(values.requestor_id),
        equipment_id: typeValue === 'Equipment' ? extractValueObjects(values.equipment_id) : false,
        work_location: values.work_location,
        space_id: typeValue === 'Space' ? extractValueObjects(values.space_id) : false,
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        type_work_id: extractValueObjects(values.type_work_id),
        department_id: extractValueObjects(values.department_id),
        type_of_request: values.type_of_request && values.type_of_request.value ? values.type_of_request.value : values.type_of_request,
        nature_work_id: extractValueObjects(values.nature_work_id),
        type: typeValue,
        vendor_poc: values.vendor_poc,
        vendor_mobile: values.vendor_mobile,
        vendor_email: values.vendor_email,
        // no_vendor_technicians: values.no_vendor_technicians,
        no_vendor_technicians: values.work_technician_ids && values.work_technician_ids.length > 0 ? getArrayNewFormatUpdateDelete(partsData).length : 0,
        planned_start_time: values.planned_start_time ? (isPlanInNew ? checkExDatehasObject(values.planned_start_time) : values.planned_start_time) : false,
        valid_through: values.valid_through ? (isValidOutNew || isPlanOutNew ? checkExDatOnlyObjectUtc(values.valid_through, values.planned_end_time) : values.valid_through) : false,
        planned_end_time: values.planned_end_time ? (isPlanOutNew ? checkExDatehasObject(values.planned_end_time) : values.planned_end_time) : false,
        duration: isPlanInNew || isPlanOutNew ? Number(getDateDiffereceBetweenTwoDaysLocal(checkExDatehasObjectLocal(values.planned_start_time, !isPlanInNew), checkExDatehasObjectLocal(values.planned_end_time, !isPlanOutNew))) : workPermitDetail.data[0].duration,
        job_description: values.job_description,
        ehs_instructions: values.ehs_instructions,
        terms_conditions: values.terms_conditions,
        preparedness_checklist_id: extractValueObjects(values.preparedness_checklist_id),
        issue_permit_checklist_id: extractValueObjects(values.issue_permit_checklist_id),
        task_id: extractValueObjects(values.task_id),
        vendor_id: extractValueObjects(values.vendor_id),
        approval_authority_id: extractValueObjects(values.approval_authority_id),
        issue_permit_approval_id: extractValueObjects(values.issue_permit_approval_id),
        ehs_authority_id: extractValueObjects(values.ehs_authority_id),
        security_office_id: extractValueObjects(values.security_office_id),
        reviewer_id: extractValueObjects(values.reviewer_id),
        work_technician_ids: values.work_technician_ids && values.work_technician_ids.length > 0 ? getArrayNewFormatUpdateDelete(partsData) : false,
        parts_lines: values.parts_lines && values.parts_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };
      if (!isPlanInNew) {
        delete postData.planned_start_time;
      }
      if (!isPlanOutNew) {
        delete postData.planned_end_time;
      }
      if (!isValidOutNew && !isPlanOutNew) {
        delete postData.valid_through;
      }
      if (!isPlanOutNew && !isPlanInNew) {
        delete postData.duration;
      }
      dispatch(updateProductCategory(editId, appModels.WORKPERMIT, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let partsData = [];
      if (values.work_technician_ids && values.work_technician_ids.length > 0) {
        dispatch(getPartsData(values.work_technician_ids));
        partsData = (values.work_technician_ids);
      }
      let orderData = [];
      if (values.parts_lines && values.parts_lines.length > 0) {
        orderData = getNewRequestArray(values.parts_lines);
      }
      const postData = { ...values };

      const typeValue = values.type ? values.type : false;

      const plannedStart = values.planned_start_time ? values.planned_start_time : false;
      const plannedEnd = values.planned_end_time ? values.planned_end_time : false;

      if (postData.has_work_location) delete postData.has_work_location;
      if (postData.has_preparednessCheckList) delete postData.has_preparednessCheckList;
      if (postData.start_valid) delete postData.start_valid;
      if (postData.end_valid) delete postData.end_valid;
      if (postData.valid_valid) delete postData.valid_valid;

      if (wpConfig && wpConfig.is_include_multiple_equipment) {
        postData.equipment_ids = [[6, 0, getColumnArrayById(values.equipment_ids, 'id')]];
      } else {
        delete postData.equipment_ids;
      }

      if (wpConfig && wpConfig.is_include_multiple_space) {
        postData.space_ids = [[6, 0, getColumnArrayById(values.space_ids, 'id')]];
      } else {
        delete postData.space_ids;
      }

      postData.type = typeValue;
      postData.requestor_id = extractValueObjects(values.requestor_id);
      postData.equipment_id = typeValue === 'Equipment' ? extractValueObjects(values.equipment_id) : false;
      postData.work_location = values.work_location;
      postData.space_id = typeValue === 'Space' ? getSpaceValue(values.space_id) : false;
      postData.maintenance_team_id = extractValueObjects(values.maintenance_team_id);
      postData.vendor_id = extractValueObjects(values.vendor_id);
      postData.type_work_id = extractValueObjects(values.type_work_id);
      postData.department_id = extractValueObjects(values.department_id);
      postData.type_of_request = values.type_of_request && values.type_of_request.value ? values.type_of_request.value : false;
      postData.no_vendor_technicians = values.work_technician_ids && values.work_technician_ids.length > 0 ? getArrayNewFormatUpdateDelete(values.work_technician_ids).length : 0;
      postData.nature_work_id = extractValueObjects(values.nature_work_id);
      postData.valid_through = values.valid_through ? checkExDatOnlyObjectUtc(values.valid_through, plannedEnd) : false;
      postData.planned_start_time = checkExDatehasObject(plannedStart);
      postData.planned_end_time = checkExDatehasObject(plannedEnd);
      postData.duration = Number(getDateDiffereceBetweenTwoDaysLocal(checkExDatehasObjectLocal(values.planned_start_time), checkExDatehasObjectLocal(values.planned_end_time)));
      postData.preparedness_checklist_id = extractValueObjects(values.preparedness_checklist_id);
      postData.issue_permit_checklist_id = extractValueObjects(values.issue_permit_checklist_id);
      postData.task_id = extractValueObjects(values.task_id);
      postData.approval_authority_id = extractValueObjects(values.approval_authority_id);
      postData.issue_permit_approval_id = extractValueObjects(values.issue_permit_approval_id);
      postData.ehs_authority_id = extractValueObjects(values.ehs_authority_id);
      postData.security_office_id = extractValueObjects(values.security_office_id);
      postData.reviewer_id = extractValueObjects(values.reviewer_id);
      postData.work_technician_ids = values.work_technician_ids && values.work_technician_ids.length > 0 ? getArrayNewFormatUpdateDelete(values.work_technician_ids) : false;
      postData.parts_lines = values.parts_lines && values.parts_lines.length > 0 ? getArrayNewFormatUpdateDeleteNew(checkArrayhasDataProduct(orderData)) : false;

      const payload = { model: appModels.WORKPERMIT, values: postData };
      dispatch(createProductCategory(appModels.WORKPERMIT, payload));
    }
  }

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'reference',
        value: ename,
        label: 'Reference',
        title: 'Reference',
        type: 'id',
        name: ename,
      }];
      dispatch(getWorkPermitFilters(customFilters));
    }
    //  setWorkPermitRequest(true);
    closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(resetCreateProductCategory());
    dispatch(getPartsData([]));
    dispatch(resetImage());
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  if (workPermitRequest) {
    return (<Redirect to="/workpermits" />);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={editId && workPermitDetail && workPermitDetail.data ? trimJsonObject(workPermitDetail.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, setFieldTouched, resetForm, values,
      }) => (
        <Form id={formId}>
          <Box
            sx={{
              width: '100%',
              padding: '20px 25px',
              flexGrow: 1,
            }}
            className="createFormScrollbar"
          >
            {/* <FormControl
              sx={{
                width: "100%",
                padding: "10px 0px 20px 30px",
                maxHeight: '620px',
                overflowY: 'scroll',
                overflowX: 'hidden',
                borderTop: '1px solid #0000001f',
              }}
            > */}
            <>
              <BasicForm isShow={isShow} formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} visibility={visibility} />
              {isPartRequired && (
                <ProductForm editId={editId} setFieldValue={setFieldValue} />
              )}
            </>
            {(addProductCategoryInfo && addProductCategoryInfo.err) && (
              <SuccessAndErrorFormat response={addProductCategoryInfo} />
            )}
            {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
              <SuccessAndErrorFormat response={updateProductCategoryInfo} />
            )}
            {/* </FormControl> */}
            <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
            {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading)
              && (updateProductCategoryInfo && !updateProductCategoryInfo.data && !updateProductCategoryInfo.loading) && (
                <div className="float-right sticky-button-85drawer">
                  <Button
                    disabled={!editId
                      ? (!(dirty && isValid) || (isPartRequired && partsSelected && !partsSelected.length > 0) || (isPartRequired && !checkProductId(partsSelected)))
                      : (!isValid || (isPartRequired && partsSelected && !partsSelected.length > 0) || (isPartRequired && !checkProductId(partsSelected)))}
                    variant="contained"
                    type="button"
                    onClick={() => handleSubmit(values)}
                  >
                    {!editId ? 'Create' : 'Update'}
                  </Button>
                </div>
            )}
            <SuccessAndErrorModalWindow
              isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
              setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
              type={editId ? 'update' : 'create'}
              newId={workPermitDetail && workPermitDetail.data && workPermitDetail.data.length > 0 ? workPermitDetail.data[0].id : false}
              newName={workPermitDetail && workPermitDetail.data && workPermitDetail.data.length > 0 ? workPermitDetail.data[0].reference : false}
              detailData={workPermitDetail}
              successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
              headerImage={WorkPermitBlue}
              headerText="Work Permit"
              onLoadRequest={onLoadRequest}
              successRedirect={handleReset.bind(null, resetForm)}
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
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddWorkPermit;
