/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import {
  Input, CardBody,
  Row, Col,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Redirect, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Select from 'react-select';

import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import closeIcon from '@images/icons/circleClose.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import theme from '../../util/materialTheme';
import {
  decimalKeyPress,
  getAllowedCompanies,
} from '../../util/appUtils';
import { getDefaultState } from '../../preventiveMaintenance/utils/utils';
import {
  resetCreateParts,
  createParts,
  getProductCategories,
  setCurrentTab,
  getCheckListData,
  getActiveStep,
} from '../setupService';

const appModels = require('../../util/appModels').default;

const steps = ['PPM Parts', 'Summary'];

const AddParts = (props) => {
  const { afterReset, closeAddModal } = props;
  const dispatch = useDispatch();
  // const [checkListData, setCheckListData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [checkListOptions, setCheckListOptions] = useState();
  const [isRedirect] = useState(false);
  // const [activeStep, setActiveStep] = useState(0);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const history = useHistory();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    createPartsInfo,
    productCategoryInfo, checkListData, activeStep,
  } = useSelector((state) => state.setup);
  const isLastStep = activeStep === steps.length - 1;
  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  let listTitle = 'Parts';
  let otherTitle = 'Part';
  let mainTitle = 'PPM Parts';
  let pantryProduct = false;
  if (history && history.location && history.location.pathname) {
    const pathName = history.location.pathname;
    if (pathName === '/pantry/configuration') {
      listTitle = 'Products';
      otherTitle = 'Product';
      mainTitle = 'Pantry Products';
      pantryProduct = true;
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductCategories(companies, appModels.PRODUCTCATEGORY));
    }
  }, [userInfo]);

  useEffect(() => {
    if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length > 0) {
      const { data } = productCategoryInfo;
      setCheckListOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [productCategoryInfo]);

  useEffect(() => {
    if (checkListAdd) {
      dispatch(getCheckListData(checkListData));
    }
  }, [checkListAdd]);

  const onReset = () => {
    dispatch(resetCreateParts());
  };

  useEffect(() => {
    onReset();
  }, []);

  function checkPartsFilled() {
    let result = false;
    let count = 0;
    const arrayNew = checkListData || [];
    for (let i = 0; i < arrayNew.length; i += 1) {
      if ((arrayNew[i].categ_id) && (parseInt(arrayNew[i].standard_price) > 0) && (arrayNew[i].name)) {
        count += 1;
      }
    }
    result = count === arrayNew.length;
    return result;
  }

  const onPartsAdd = () => {
    if (isLastStep) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeAddModal(false);
      const payload = { model: appModels.PARTS, values: checkListData };
      dispatch(createParts(appModels.PARTS, payload));
      dispatch(setCurrentTab(pantryProduct ? otherTitle : listTitle));
    } else {
      dispatch(getActiveStep(activeStep + 1));
    }
  };

  const loadEmptyTd = () => {
    const newData = checkListData || [];
    newData.push({
      name: '', categ_id: '', standard_price: 0.00, company_id: companyId, is_pantry_item: pantryProduct,
    });
    dispatch(getCheckListData(newData));
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = checkListData;
    checkData.splice(index, 1);
    dispatch(getCheckListData(checkData));
    setCheckListAdd(Math.random());
  };

  const onChangeCheckList = (e, index) => {
    const newData = checkListData;
    newData[index].categ_id = e.value;
    dispatch(getCheckListData(newData));
    setCheckListAdd(Math.random());
  };

  const onNameChange = (e, index) => {
    const newData = checkListData;
    newData[index].name = e.target.value;
    dispatch(getCheckListData(newData));
    setCheckListAdd(Math.random());
  };

  const [closeParts, setCloseParts] = useState(false);

  const onCostChange = (e, index) => {
    const newData = checkListData;
    newData[index].standard_price = e.target.value;
    dispatch(getCheckListData(newData));
    setCheckListAdd(Math.random());
  };

  const closeAddParts = () => {
    dispatch(setCurrentTab(pantryProduct ? otherTitle : listTitle));
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    // setCloseParts(true);
  };

  if (closeParts) {
    if (pantryProduct) {
      return (<Redirect to="/pantry/configuration" />);
    }
    return (<Redirect to="/maintenance-configuration" />);
  }

  const partsForm = (cl, index, disabled) => (
    <>
      <Row className="ml-2" key={index}>
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="tool_cost_unit">
            {otherTitle}
            {' '}
            Name
            <span className="text-danger">*</span>
          </Label>
          <Input
            disabled={disabled}
            type="input"
            placeholder={`Enter ${otherTitle} Name`}
            name="name"
            value={cl.name}
            onChange={(e) => onNameChange(e, index)}
            maxLength="50"
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="checkList">
            {otherTitle}
            {' '}
            Category
            <span className="text-danger">*</span>
          </Label>
          <Select
            isDisabled={disabled}
            name="checkList"
            placeholder={`Select ${otherTitle} Category`}
            value={getDefaultState(checkListOptions, cl.categ_id)}
            classNamePrefix="react-selects"
            className="react-select-boxcheck"
            onChange={(e) => onChangeCheckList(e, index)}
            options={checkListOptions}
            isClearable={false}
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3}>
          <Label for="cost">
            Cost
            <span className="text-danger">*</span>
          </Label>
          <Input
            disabled={disabled}
            type="input"
            name="cost"
            placeholder="Enter Cost"
            value={cl.standard_price}
            onChange={(e) => onCostChange(e, index)}
            onKeyPress={decimalKeyPress}
            maxLength="5"
          />
        </Col>
        <Col xs={12} sm={3} md={3} lg={3} className="mt-3">
          <img src={closeIcon} className="mr-2 mt-4 cursor-pointer" alt="addequipment" height="15" aria-hidden="true" onClick={(e) => { removeData(e, index); }} width="15" />
        </Col>
      </Row>
      <br />
    </>
  );

  if (isRedirect) {
    return (<Redirect to="/maintenance-configuration" />);
  }

  function handleBack() {
    dispatch(getActiveStep(activeStep - 1));
  }

  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 pb-3 pt-0">
      <Col sm="12" md="12" lg="12" xs="12" className="p-0">
        <div className="p-1">
          <CardBody className="add-parts">
            <Row className="mb-0">
              <Col md={6} xs={7} className="pr-0">
                <Row>
                  <Col md={1} xs={12}>
                    <img src={predictiveMaintenance} className="mr-2" alt="ppm" height="30" width="30" />
                  </Col>
                  <Col md={10} xs={12}>
                    <h4 className="mb-0">
                      {isLastStep ? 'Summary' : mainTitle}
                    </h4>
                    <p className="tab_nav_link">
                      <span className="font-weight-300">
                        {isLastStep ? 'Please check the information before submit' : 'Please enter the required information'}
                      </span>
                    </p>
                  </Col>
                </Row>
              </Col>
              {/* } <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                <span className="text-right desktop-view">
                  <Button  variant="contained" size="sm" onClick={closeAddParts} className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                    <span>Cancel </span>
                    <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                  </Button>
                </span>
  </Col> */}
            </Row>
            <hr className="mt-0" />
          </CardBody>
          {!isLastStep && (
            <div className="bg-lightblue pl-3 pt-1 thin-scrollbar max-height-area">
              <h5 className="mb-3 mt-3">
                Add
                {' '}
                {listTitle}
              </h5>
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
                  partsForm(cl, index)
                )))}
              </ThemeProvider>
            </div>
          )}
          {isLastStep && (
            <div className="bg-lightblue pl-3 pt-1 thin-scrollbar max-height-area">
              <Row>
                <Col sm="12">
                  <h5 className="mb-3 mt-3">
                    Confirm Add
                    {' '}
                    {listTitle}
                  </h5>
                </Col>
                <Col sm="12">
                  {(checkListData.map((cl, index) => (
                    partsForm(cl, index, true)
                  )))}
                </Col>
              </Row>
            </div>
          )}
          <div className="float-right">
            {/* <Button
                  onClick={closeAddParts}
                  type="button"
                  size="sm"
                  className="mr-2 btn-cancel"
                   variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  disabled={checkListData && checkListData.length === 0}
                  type="submit"
                  size="sm"
                  onClick={() => setOpenAddPartsConfirmWindow(true)}
                   variant="contained"
                >
                  Save
              </Button> */}

            {isLastStep && (
              <div className="bg-lightblue sticky-button-1250drawer">
                <Button
                variant="contained"
                  className="mr-1"
                  size="sm"
                  onClick={handleBack}
                  color={activeStep !== steps.length ? 'back' : 'secondary'}
                >
                  Back
                </Button>
                <Button
                  disabled={checkListData && checkListData.length === 0}
                  type="submit"
                  size="sm"
                  onClick={onPartsAdd}
                   variant="contained"
                >
                  Save
                </Button>
              </div>
            )}
            {!isLastStep && (
              <div className="bg-lightblue sticky-button-1250drawer">
                <Button
                  disabled={(checkListData && checkListData.length === 0) || (!checkPartsFilled())}
                  size="sm"
                  onClick={onPartsAdd}
                   variant="contained"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </Col>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        successOrErrorData={createPartsInfo}
        headerImage={predictiveMaintenance}
        headerText={mainTitle}
        successRedirect={closeAddParts}
      />
    </Row>
  );
};

AddParts.propTypes = {
  closeAddModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
};
AddParts.defaultProps = {
};

export default AddParts;
