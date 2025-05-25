/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-duplicate-props */
import {
  Input, CardBody,
  Row, Col,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider } from '@material-ui/core/styles';
import Select from 'react-select';

import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import closeIcon from '@images/icons/circleClose.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import theme from '../../util/materialTheme';
import {
  decimalKeyPress,
} from '../../util/appUtils';
import {
  resetCreateTools,
  createTools,
  setCurrentTab,
} from '../setupService';
import { getDefaultState } from '../../preventiveMaintenance/utils/utils';

const appModels = require('../../util/appModels').default;

const steps = ['PPM Tools', 'Summary'];

const AddTools = () => {
  const dispatch = useDispatch();
  const [checkListData, setCheckListData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [isRedirect] = useState(false);
  const checkListOptions = [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }];
  const [closeTools, setCloseTools] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    createToolsinfo,
  } = useSelector((state) => state.setup);

  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if (checkListAdd) {
      setCheckListData(checkListData);
    }
  }, [checkListAdd]);
  const onReset = () => {
    dispatch(resetCreateTools());
  };

  useEffect(() => {
    onReset();
  }, []);

  function checkToolsFilled() {
    let result = false;
    let count = 0;
    const arrayNew = checkListData || [];
    for (let i = 0; i < arrayNew.length; i += 1) {
      if ((arrayNew[i].active) && (parseInt(arrayNew[i].tool_cost_unit) > 0) && (arrayNew[i].name)) {
        count += 1;
      }
    }
    result = count === arrayNew.length;
    return result;
  }

  const onToolsAdd = () => {
    if (isLastStep) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const payload = { model: appModels.TOOL, values: checkListData };
      dispatch(createTools(appModels.TOOL, payload));
      dispatch(setCurrentTab('Tools'));
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  function handleBack() {
    setActiveStep(activeStep - 1);
  }

  const loadEmptyTd = () => {
    const newData = checkListData;
    newData.push({
      name: '', tool_cost_unit: 0.00, active: '', company_id: companyId,
    });
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = checkListData;
    checkData.splice(index, 1);
    setCheckListData(checkData);
    setCheckListAdd(Math.random());
  };

  const onChangeCheckList = (e, index) => {
    const newData = checkListData;
    newData[index].active = e.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onNameChange = (e, index) => {
    const newData = checkListData;
    newData[index].name = e.target.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onCostChange = (e, index) => {
    const newData = checkListData;
    newData[index].tool_cost_unit = e.target.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const closeAddTools = () => {
    dispatch(setCurrentTab('Tools'));
    setCloseTools(true);
  };

  if (closeTools) {
    return (<Redirect to="/maintenance-configuration" />);
  }

  const ToolsForm = (cl, index, disabled) => (
    <React.Fragment key={index}>
      <Row className="ml-2">
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="name">
            Name
            <span className="text-danger">*</span>
          </Label>
          <Input
            disabled={disabled}
            type="input"
            placeholder="Enter Name"
            name="name"
            value={cl.name}
            onChange={(e) => onNameChange(e, index)}
            maxLength="50"
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="tool_cost_unit">
            Hourly Cost Unit
            <span className="text-danger">*</span>
          </Label>
          <Input
            disabled={disabled}
            type="input"
            placeholder="Enter Cost"
            name="tool_cost_unit"
            value={cl.tool_cost_unit}
            placeholder=""
            onChange={(e) => onCostChange(e, index)}
            onKeyPress={decimalKeyPress}
            maxLength="5"
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="checkList">
            Status
            <span className="text-danger">*</span>
          </Label>
          <Select
            isDisabled={disabled}
            name="checkList"
            placeholder="Select Status"
            value={getDefaultState(checkListOptions, cl.active)}
            classNamePrefix="react-selects"
            className="react-select-boxcheck"
            onChange={(e) => onChangeCheckList(e, index)}
            options={checkListOptions}
            isClearable={false}
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3} className="mt-3">
          <img src={closeIcon} className="mr-2 mt-4 cursor-pointer" alt="addequipment" height="15" aria-hidden="true" onClick={(e) => { removeData(e, index); }} width="15" />
        </Col>
      </Row>
      <br />
    </React.Fragment>
  );

  if (isRedirect) {
    return (<Redirect to="/maintenance-configuration" />);
  }

  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 pb-3 pt-0 border">
      <Col sm="12" md="12" lg="12" xs="12" className="p-0">
        <div className="p-1">
          <CardBody  className="add-parts">
            <Row className="mb-0">
              <Col md={6} xs={7} className="pr-0">
                <Row>
                  <Col md={1} xs={12}>
                    <img src={predictiveMaintenance} className="mr-2" alt="ppm" height="30" width="30" />
                  </Col>
                  <Col md={10} xs={12}>
                    <h4 className="mb-0">
                      {isLastStep ? 'Summary' : 'PPM Tools'}
                    </h4>
                    <p className="tab_nav_link">
                      <span className="font-weight-300">
                        {isLastStep ? 'Please check the information before submit' : 'Please enter the required information'}
                      </span>
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                <span className="text-right desktop-view">
                  <Button  variant="contained" onClick={closeAddTools} size="sm" className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                    <span>Cancel </span>
                    <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                  </Button>
                </span>
              </Col>
            </Row>
            <hr className="mt-0" />
            {!isLastStep && (
              <div className="bg-lightblue pl-3 pt-1 thin-scrollbar max-height-area">
                <h5 className="mb-3 mt-3">Add Tools</h5>
                <ThemeProvider theme={theme}>
                  <Row className="ml-2">
                    <Col xs={4} sm={4} md={4} lg={4}>
                      <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="text-lightblue mr-5">Add a Line</span>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  {(checkListData.map((cl, index) => (
                    ToolsForm(cl, index)
                  )))}
                </ThemeProvider>
              </div>
            )}
            {isLastStep && (
              <div className="bg-lightblue pl-3 pt-1 thin-scrollbar max-height-area">
                <Row>
                  <Col sm="12">
                    <h5 className="mb-3 mt-3">
                      Confirm Add Tools
                    </h5>
                  </Col>
                  <Col sm="12" className="bg-lightblue pl-3 pt-1 thin-scrollbar max-height-area">
                    {(checkListData.map((cl, index) => (
                      ToolsForm(cl, index, true)
                    )))}
                  </Col>
                </Row>
              </div>
            )}
            <hr />
            <div className="float-right">
              <>
                {isLastStep && (
                  <Button
                   variant="contained"
                    className="mr-1"
                    size="sm"
                    onClick={handleBack}
                    color={activeStep !== steps.length ? 'back' : 'secondary'}
                  >
                    Back
                  </Button>
                )}
                {isLastStep && (
                  <Button
                    disabled={checkListData && checkListData.length === 0}
                    type="submit"
                    size="sm"
                    onClick={onToolsAdd}
                     variant="contained"
                  >
                    Save
                  </Button>
                )}
                {!isLastStep && (
                  <Button
                    disabled={(checkListData && checkListData.length === 0) || (!checkToolsFilled())}
                    size="sm"
                    onClick={onToolsAdd}
                     variant="contained"
                  >
                    Next
                  </Button>
                )}
              </>
            </div>
          </CardBody>
        </div>
      </Col>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        successOrErrorData={createToolsinfo}
        headerImage={predictiveMaintenance}
        headerText="PPM Tools"
        successRedirect={closeAddTools}
      />
    </Row>
  );
};

export default AddTools;
