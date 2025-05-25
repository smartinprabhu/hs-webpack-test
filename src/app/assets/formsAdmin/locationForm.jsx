/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import addIcon from '@images/icons/plusCircleGrey.svg';
import {
  Row, Col,
  Spinner,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { Cascader, Divider } from 'antd';
import 'antd/dist/antd.css';



import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { generateErrorMessage, getAllCompanies, preprocessData } from '../../util/appUtils';
import { getCascader } from '../../helpdesk/ticketService';
import {
  getCategoryList, getTeamList, getUNSPSCCodes, getUNSPSCOtherCodes, getBuildings, getAllSpaces,
} from '../equipmentService';
import { addParents, addChildrens } from '../../helpdesk/utils/utils';
import AdvancedSearchModal from './advancedSearchModal';
import { infoValue } from '../../adminSetup/utils/utils';

import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const BasicForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    spaceId,
    pathName,
    loadEmptyTd,
    isGlobalITAsset,
    visibility,
    formField: {
      Name,
      categoryId,
      maintenanceTeamId,
      locationId,
      equipmentNumber,
      commodityId,
      familyId,
      classId,
      segmentId,
      categoryType,
    },
  } = props;
  const dispatch = useDispatch();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [teamKeyword, setTeamKeyword] = useState('');
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [unspscOpen, setUnspscOpen] = useState(false);
  const [unspscKeyword, setUnspscKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [refresh, setRefresh] = useState(reloadSpace);
  const { values: formValues } = useFormikContext();
  const {
    commodity_id,
    location_id,
    maintenance_team_id,
    category_id,
  } = formValues;

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [childLoad, setChildLoad] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const {
    categoriesInfo, teamsInfo, unspscCodes, unspscOtherCodes, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBuildings(companies, appModels.SPACE, false, ['id', 'space_name']));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
      if (buildingsInfo.data.length) {
        setFieldValue('location_id', [buildingsInfo.data[0].id]);
      }
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && (refresh === '1' || childLoad)) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && categoryOpen) {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, categoryKeyword));
      }
    })();
  }, [categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && unspscOpen) {
      if (unspscKeyword && unspscKeyword.length > 2) {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      } else {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      }
    }
  }, [unspscOpen, unspscKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && commodity_id && commodity_id.id) {
      dispatch(getUNSPSCOtherCodes(companies, appModels.UNSPSC, commodity_id.id));
    }
  }, [userInfo, commodity_id]);

  useEffect(() => {
    if (unspscOtherCodes && unspscOtherCodes.data && commodity_id && commodity_id.id) {
      setFieldValue(familyId.name, unspscOtherCodes.data[0].family_id);
      setFieldValue(classId.name, unspscOtherCodes.data[0].class_id);
      setFieldValue(segmentId.name, unspscOtherCodes.data[0].segment_id);
    } else {
      setFieldValue('family_id', '');
      setFieldValue('class_id', '');
      setFieldValue('segment_id', '');
      setUnspscKeyword('');
    }
  }, [unspscOtherCodes, commodity_id]);

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onUnspscKeywordChange = (event) => {
    setUnspscKeyword(event.target.value);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setColumns(['id', 'name', 'path_name']);
    setFieldName('category_id');
    setModalName('Category List');
    setPlaceholder('Categories');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setCategoryOpen(false);
  };

  const showCommodityModal = () => {
    setModelValue(appModels.UNSPSC);
    setColumns(['id', 'name']);
    setFieldName('commodity_id');
    setModalName('UNSPSC List');
    setPlaceholder('Commodities');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCommodityClear = () => {
    setUnspscKeyword(null);
    setFieldValue('commodity_id', '');
    setFieldValue('family_id', '');
    setFieldValue('class_id', '');
    setFieldValue('segment_id', '');
    setFieldValue('commodity_id', '');
    setUnspscOpen(false);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  let categoryOptions = [];
  let teamOptions = [];
  let unspscOptions = [];

  if (categoriesInfo && categoriesInfo.loading) {
    categoryOptions = [{ path_name: 'Loading..' }];
  }
  if (categoriesInfo && categoriesInfo.data) {
    categoryOptions = categoriesInfo.data;
  }

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    teamOptions = teamsInfo.data;
  }

  if (unspscCodes && unspscCodes.loading) {
    unspscOptions = [{ name: 'Loading..' }];
  }
  if (unspscCodes && unspscCodes.data) {
    unspscOptions = unspscCodes.data;
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceIds(selectedOptions[0].id);
        if (spaceIds !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies, true));
        }
      }
    }
    setFieldValue(locationId.name, value);
  };

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
    </div>
  );

  const loadData = () => { };

  return (
    <>
      <Row className="mb-3 assest-request-form">
        <Col xs={12} sm={12} lg={6} md={12}>
          <Col xs={12} sm={12} lg={12} md={12} className="m-1">
            <span className="font-weight-500 pb-2 d-inline-block">
              Building/Floor/Wing/Room/Space
              <span className="text-danger ml-1">*</span>
              {infoValue('location_id')}
            </span>
            <br />
            {pathName
              ? (
                <Cascader
                  defaultValue={[pathName]}
                  disabled
                  className="thin-scrollbar font-size-13 antd-cascader-width-98"
                  changeOnSelect
                />
              )
              : (
                <Cascader
                  options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                  dropdownClassName="custom-cascader-popup"
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  value={location_id && location_id.length ? location_id : []}
                  placeholder="Select"
                  notFoundContent="No options"
                  dropdownRender={dropdownRender}
                  onChange={onChange}
                  // loadData={loadData}
                  className="thin-scrollbar font-size-13 antd-cascader-width-98"
                  changeOnSelect
                />
              )}
          </Col>
        </Col>
        <Col xs={12} sm={12} lg={6} md={12}>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2">
            <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer float-right mt-4 mb-1" onClick={loadEmptyTd}>
              <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
              <span className="mr-5 font-family-tab">Add Equipment</span>
            </div>
            {/* <div className="float-right">
              <Button
                type="button"
                onClick={loadEmptyTd}
                variant="contained"
                className="header-create-btn float-left mt-4 mr-2 text-white"
              >
                Add a Line
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.defaultProps = {
  spaceId: false,
  pathName: false,
  isGlobalITAsset: false,
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadSpace: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  pathName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isGlobalITAsset: PropTypes.bool,
};

export default BasicForm;
