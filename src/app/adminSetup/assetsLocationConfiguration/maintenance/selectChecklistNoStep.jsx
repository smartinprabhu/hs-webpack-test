import React, { useEffect, useMemo } from 'react';
// import styles from './StepBasicInfo.module.scss';
import {
  Grid, Drawer, Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '@shared/loading';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import Selection from '../../../commonComponents/multipleFormFields/selection';
import MultipleDataAccordian from '../../../commonComponents/multipleFormFields/multipleDataAccordian';
import StepWrapper from '../../../commonComponents/ReactFormWizard/steps/StepWrapper/StepWrapper';
import { useWizardState, useWizardData } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';
import {
  getOperationsList, resetAddChecklist, getPreventiveCheckList, resetQuestionChecklist, resetUpdateChecklist, setQuestionData, setQuestionList, resetPpmChecklist, resetChecklistQuestion, activeStepInfo,
} from '../../../preventiveMaintenance/ppmService';
import { extractOptionsObject, getAllCompanies, extractOptionsObjectWithName } from '../../../util/appUtils';
import InspectionSchedule from '../../../inspectionSchedule/formsAdmin/addInspection';
import CheckListForm from '../../../inspectionSchedule/formsAdmin/checkListForm';
import PartsForm from '../../../inspectionSchedule/formsAdmin/partsForm';
import ToolsForm from '../../../inspectionSchedule/formsAdmin/toolsForm';
import AddPreventiveCheckList from '../../../preventiveMaintenance/preventiveCheckList/addPreventiveCheckList';

const appModels = require('../../../util/appModels').default;

const StepOneInfo = () => {
  const dispatch = useDispatch();
  const { editValue } = useWizardData();

  const { modifiedData } = useSelector((state) => state.setup);
  const { wizardState, setWizardState } = useWizardState();
  const [toolIds, setToolIds] = React.useState(wizardState?.toolIds || '');
  const [operation, setOperation] = React.useState(wizardState?.operation || '');
  const [checklistData, setChecklistData] = React.useState(wizardState?.checklistData || '');
  const [addLink, setAddLink] = React.useState(false);
  const [editLink, setEditLink] = React.useState(false);
  const [editId, setEditId] = React.useState(false);
  const [editData, setEditData] = React.useState(false);
  const {
    taskInfo, taskCheckLists, checklistSelected, checkList,
  } = useSelector((state) => state.ppm);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const category = wizardState?.category?.id;
  const type = wizardState?.type;

  const bulkJsonEdit = { ...wizardState?.bulkJson, ...{ currentStep: 2 } };

  const onNext = () => setWizardState({
    ...wizardState,
    ...{ bulkJson: bulkJsonEdit },
    ...modifiedData,
    operation,
    checklistData,
  });

  useMemo(() => {
    if (modifiedData && Object.keys(modifiedData).length && editValue && editValue[0].editId) {
      const bJson = modifiedData?.bulkJson;
      if (bJson) {
        bJson.currentStep = 2;
      }
      setChecklistData(modifiedData?.checklistData);
      setOperation(modifiedData?.operation);
      setWizardState({ ...modifiedData, ...{ bulkJson: bJson } });
      onNext();
    }
  }, [modifiedData]);

  useEffect(() => {
    if (checklistData === '') {
      dispatch(resetChecklistQuestion());
    }
    onNext();
  }, [operation, checklistData]);

  useEffect(() => {
    (async () => {
      if ((!wizardState?.operation || wizardState?.operation === '') && editValue && !editValue[0].editId && userInfo && userInfo.data) {
        await dispatch(getOperationsList(companies, appModels.TASK, false, type, category));
      }
      if ((!wizardState?.checklistData || wizardState?.checklistData === '') && editValue && !editValue[0].editId && userInfo && userInfo.data) {
        await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, false, type, category));
      }
    })();
  }, [userInfo]);

  const operationSelection = () => (
    <Selection
      paramsSet={setOperation}
      paramsValue={operation}
      paramsId={Math.random()}
      callData={getOperationsList}
      callDataFields={{ type, category }}
      dropdownsInfo={taskInfo}
      dropdownOptions={extractOptionsObject(taskInfo, operation)}
      moduleName={appModels.TASK}
      labelName="Maintenance Operation"
      columns={['id', 'name']}
      advanceSearchHeader="Maintenance Operation List"
      infoText="MaintenanceOperation"
      advanceSearchCondition={`["company_id","in",[${companies}]],["maintenance_type","=","pm"],["asset_category_id","=",${category}]`}
      // isRequired
    />
  );

  const checklistSelection = () => (
    <Selection
      paramsSet={setChecklistData}
      paramsValue={checklistData}
      paramsId={Math.random()}
      callData={getPreventiveCheckList}
      callDataFields={{ type, category }}
      dropdownsInfo={checkList}
      dropdownOptions={extractOptionsObject(checkList, checklistData)}
      moduleName={appModels.PPMCHECKLIST}
      labelName="Maintenance Checklist"
      columns={['id', 'name']}
      advanceSearchHeader="Maintenance Checklist List"
      infoText="MaintenanceChecklist"
      advanceSearchCondition={`["company_id","in",[${companies}]],["asset_category_id","=",${category}]`}
      isRequired
    />
  );

  useEffect(() => {
    if (taskInfo && taskInfo.data && taskInfo.data.length && !wizardState?.operation && operation === '') {
      const defaultData = taskInfo.data;
      if (defaultData && defaultData.length) {
        setOperation(defaultData[0]);
      }
    }
  }, [taskInfo]);

  useEffect(() => {
    if (checkList && checkList.data && checkList.data.length && !wizardState?.checklistData && checklistData === '') {
      const defaultData = checkList.data;
      if (defaultData && defaultData.length) {
        setChecklistData(defaultData[0]);
      }
    }
  }, [checkList]);

  const onAddReset = () => {
    dispatch(activeStepInfo(0));
    dispatch(setQuestionList([]));
    dispatch(setQuestionData([]));
    dispatch(resetAddChecklist([]));
    dispatch(resetPpmChecklist());
    dispatch(resetQuestionChecklist());
    dispatch(resetUpdateChecklist());
    setAddLink(false);
  };

  const onUpdateReset = () => {
    setEditLink(false);
    setEditId(false);
    dispatch(setQuestionData([]));
    dispatch(resetQuestionChecklist());
    dispatch(resetPpmChecklist());
  };

  const closeEditModal = () => {
    dispatch(setQuestionList([]));
    dispatch(resetPpmChecklist());
    dispatch(resetUpdateChecklist());
    setEditLink(false);
  };

  const closeModal = () => {
    dispatch(activeStepInfo(0));
    dispatch(setQuestionList([]));
    dispatch(setQuestionData([]));
    dispatch(resetPpmChecklist());
    dispatch(resetAddChecklist([]));
    dispatch(resetQuestionChecklist());
    dispatch(resetUpdateChecklist());
    setAddLink(false);
    if (document.getElementById('checklistForm')) {
      document.getElementById('checklistForm').reset();
    }
  };

  const checkListHeader = (
    <>
      <span>
        Check list -
        {checklistData && checklistData.name ? checklistData.name : ''}
      </span>
      {/* <div className="float-right">
        <Button
          onClick={() => { setEditLink(true); setEditId(checklistData && checklistData.id); setEditData(checklistData && checklistData.id); }}
          sx={{ backgroundColor: '#dc3545 !important' }}
          type="button"
          variant="contained"
          className="header-create-btn"
        >
          Edit Checklist
        </Button>
      </div> */}
    </>
  );

  return (
    <>
      <Grid container spacing={2} className="p-0">
        <Grid item xs={12} sm={6} md={6}>
          {operationSelection()}
        </Grid>
        {/* { wizardState?.typeValue?.id === 'PPM' && ( */}
        <Grid item xs={12} sm={6} md={6}>
          {checklistSelection()}
        </Grid>
        {/* )} */}
      </Grid>
      <Grid container spacing={2} className="p-0">
        <Grid item xs={12} sm={12} md={12}>
          <div className="float-right mt-3">
            <Button
              onClick={() => { dispatch(setQuestionData([])); setAddLink(true); }}
              sx={{ backgroundColor: '#dc3545 !important' }}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              Create Checklist
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} className="pt-0">
          {checkList && checkList.loading && checklistData && !checklistData.name ? (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          ) : (
            <>
              <br />
              <MultipleDataAccordian
                className="mb-3"
                indexForm={1}
                defaultExpanded={`panel${1}`}
                summarySx={{ fontSize: '16px' }}
               // summary={`Check list - ${checklistData && checklistData.name ? checklistData.name : ''}`}
                summary={checkListHeader}
                detail={[
                  {
                    id: 1,
                    component: <CheckListForm
                      operation={checklistData}
                    />,
                  }]}
              />
              {/* <br />
              <MultipleDataAccordian
                className="mb-3"
                indexForm={2}
                summarySx={{ fontSize: '16px' }}
                summary="Parts"
                detail={[
                  {
                    id: 1,
                    component: <PartsForm
                      operation={operation}
                    />,
                  }]}
              />
              <br />
              <MultipleDataAccordian
                className="mb-3"
                indexForm={1}
                summarySx={{ fontSize: '16px' }}
                summary="Tools"
                detail={[
                  {
                    id: 1,
                    component: <ToolsForm
                      operation={operation}
                      setToolIds={setToolIds}
                    />,
                  }]}
              /> */}
            </>
          )}
        </Grid>
      </Grid>
      <Drawer
        PaperProps={{
          sx: { width: '75%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName="Create Checklist"
          onClose={() => onAddReset()}
          imagePath={false}
        />
        <AddPreventiveCheckList
          category={category}
          assetType={type}
          isInspection
          afterReset={() => { onAddReset(); }}
          closeModal={() => { closeModal(); }}
        />
      </Drawer>
      {/* <Drawer
        PaperProps={{
          sx: { width: '75%' },
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName="Update Checklist"
          onClose={() => onUpdateReset()}
          imagePath={false}
        />
        <AddPreventiveCheckList
          afterReset={() => { onUpdateReset(); }}
          closeModal={() => { closeEditModal(); }}
          editId={editId}
          editData={editData}
        />
      </Drawer> */}
    </>
  );
};

export default StepOneInfo;
