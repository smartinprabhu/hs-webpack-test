/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Card,
  CardHeader,
  Collapse,
  Row,
  Table,
  Tooltip,
  Modal,
  ModalBody,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  faAngleDown, faAngleUp, faTools,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import assetIcon from '@images/icons/assetDefault.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleMini.svg';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getSpaceAssetsGroups, getSpaceEquipments, getEquipmentFilters, resetAddAssetInfo,
} from '../equipmentService';
import { getStateLabel, getEquipmentStateColor } from '../utils/utils';
import {
  getDefaultNoValue, generateErrorMessage, getListOfOperations,
  getAllCompanies,
} from '../../util/appUtils';
import './styles.scss';
import AddEquipment from '../addAsset';
import actionCodes from '../data/assetActionCodes.json';

const appModels = require('../../util/appModels').default;

const Assets = () => {
  const dispatch = useDispatch();
  const [accordion, setAccordian] = useState([]);
  const [category, setCategory] = useState(false);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [icon, setIcon] = useState(faAngleDown);
  const [isRedirect, setRedirect] = useState(false);
  const [addAssetModal, showAddAssetModal] = useState(false);
  const [openValues, setOpenValues] = useState([]);
  const [load, setLoad] = useState('');
  const [loadAssets, setLoadAssets] = useState('');

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    getSpaceInfo, getFloorsInfo, assetsCategoryGroups, spaceEquipments, addAssetInfo,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if ((userInfo && userInfo.data) && (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0)) {
      setCategory(false);
      dispatch(getSpaceAssetsGroups(companies, getSpaceInfo.data[0].id, appModels.EQUIPMENT));
    }
  }, [userInfo, getSpaceInfo, loadAssets]);

  const getinitial = () => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0)) {
      const assets = assetsCategoryGroups.data;
      const accordn = [];
      for (let i = 0; i < assets.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  useEffect(() => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0)) {
      if (assetsCategoryGroups.data[0].category_id[0]) {
        const categoryValue = assetsCategoryGroups.data[0].category_id[0];
        setCategory(categoryValue);
        setLoad(Math.random());
      }
      getinitial();
    }
  }, [assetsCategoryGroups]);

  useEffect(() => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0) && (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0) && load) {
      dispatch(getSpaceEquipments(companies, getSpaceInfo.data[0].id, category, appModels.EQUIPMENT, sortBy, sortField));
    }
  }, [load, sortBy, sortField]);

  const onChangeAssetId = (id) => {
    const filters = [{
      key: 'id',
      value: id,
      label: 'ID',
      type: 'id',
      refer_link: '/asset-configuration',
      refer_id: getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : '',
      refer_label: getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].space_name : '',
    }];
    dispatch(getEquipmentFilters(filters));
    setCategory(false);
    setRedirect(true);
  };

  const toggleAccordion = (tab, categoryValue) => {
    setCategory(categoryValue);
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleDown);
      } else {
        setIcon(faAngleUp);
      }
    }
    setAccordian(state);
    setLoad(Math.random());
  };

  const getRow = (assetData) => {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td aria-hidden="true" className="p-2 font-weight-700 cursor-pointer" onClick={() => onChangeAssetId(assetData[i].id)}>{assetData[i].name}</td>
          <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i].category_id[1])}</td>
          <td className="p-2 font-weight-400">
            <div className="page-actions-header content-center">
              <FontAwesomeIcon className={`text-${getEquipmentStateColor(assetData[i].state)} font-weight-800 mr-1 badge-small`} size="sm" icon={faCircle} />
              {getStateLabel(assetData[i].state)}
            </div>
          </td>
          <td className="p-2 font-weight-400">{getDefaultNoValue(assetData[i].vendor_id[1])}</td>
        </tr>,
      );
    }
    return tableTr;
  };

  const onReset = () => {
    dispatch(resetAddAssetInfo());
  };

  if (isRedirect) {
    return (<Redirect to="/assets/equipments" />);
  }

  const isUserError = (userInfo && userInfo.err) || (getFloorsInfo && getFloorsInfo.err) || (getSpaceInfo && getSpaceInfo.err) || (assetsCategoryGroups && assetsCategoryGroups.err);
  const isUserLoading = (userInfo && userInfo.loading) || (getFloorsInfo && getFloorsInfo.loading) || (getSpaceInfo && getSpaceInfo.loading) || (assetsCategoryGroups && assetsCategoryGroups.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const floorsErrmsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;
  const spaceErrorMsg = (getSpaceInfo && getSpaceInfo.err) ? generateErrorMessage(getSpaceInfo) : floorsErrmsg;
  const errorMsg = (assetsCategoryGroups && assetsCategoryGroups.err) ? generateErrorMessage(assetsCategoryGroups) : spaceErrorMsg;

  return (
    <>
      {((assetsCategoryGroups && assetsCategoryGroups.loading) || isUserLoading) && (
        <div className="mb-2 mt-4">
          <Loader />
        </div>
      )}
      <Row>
        <Col md="12" sm="12" lg="12" xs="12" className="mb-2 mt-0">
          {allowedOperations.includes(actionCodes['Add an Asset']) && (
            <>
              <img
                aria-hidden="true"
                alt="Add"
                src={plusCircleMiniIcon}
                height="15"
                id="Add"
                className="cursor-pointer mr-2 float-right"
                onClick={() => { showAddAssetModal(true); }}
                onMouseOver={() => toggle(3)}
                onMouseLeave={() => setOpenValues([])}
                onFocus={() => toggle(3)}
              />
              <Tooltip
                placement="top"
                isOpen={openValues.some((selectedValue) => selectedValue === 1)}
                target="Add"
              >
                Add an Asset
              </Tooltip>
            </>
          )}
        </Col>
      </Row>
      {(accordion.length > 0) && (assetsCategoryGroups && assetsCategoryGroups.data) && assetsCategoryGroups.data.map((asset, index) => (
        <div
          id="accordion"
          className="accordion-wrapper mb-3 border-0"
          key={asset.category_id[0]}
        >
          <Card className="border-0">
            <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
              <Button
                block
                color="text-dark"
                id={`heading${index}`}
                className="text-left m-0 p-0 border-0 box-shadow-none"
                onClick={() => toggleAccordion(index, asset.category_id[0])}
                aria-expanded={accordion[index]}
                aria-controls={`collapse${index}`}
              >
                <FontAwesomeIcon className="mr-3 ml-2 font-weight-800" size="lg" icon={faTools} />
                <span className="collapse-heading font-weight-800">
                  {asset.category_id[1]}
                  {' '}
                </span>
                {accordion[index]
                  ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                  : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
              </Button>
            </CardHeader>

            <Collapse
              isOpen={accordion[index]}
              data-parent="#accordion"
              id={`collapse${index}`}
              className="border-0 comments-list thin-scrollbar"
              aria-labelledby={`heading${index}`}
            >
              {spaceEquipments && spaceEquipments.data && (
                <>
                  <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                    <thead>
                      <tr>
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Name
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('category_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Category
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Status
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('vendor_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Vendor
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRow(spaceEquipments.data)}
                    </tbody>
                  </Table>
                  <hr className="m-0" />
                </>
              )}
              {spaceEquipments && spaceEquipments.loading && (
              <div className="mb-3 mt-3">
                <Loader />
              </div>
              )}
              {(spaceEquipments && spaceEquipments.err) && (
              <ErrorContent errorTxt={generateErrorMessage(spaceEquipments)} />
              )}
            </Collapse>
          </Card>
        </div>
      ))}
      {((assetsCategoryGroups && assetsCategoryGroups.err) || isUserError) && (
      <ErrorContent errorTxt={errorMsg} />
      )}
      <Modal size={(addAssetInfo && addAssetInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={addAssetModal}>
        <ModalHeaderComponent title="Add Asset" imagePath={assetIcon} closeModalWindow={() => { showAddAssetModal(false); setLoadAssets(Math.random()); onReset(); }} response={addAssetInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddEquipment
            spaceId={getDefaultNoValue(getSpaceInfo.data[0].id ? getSpaceInfo.data[0].id : false)}
            pathName={getDefaultNoValue(getSpaceInfo.data[0].id ? getSpaceInfo.data[0].display_name : false)}
            afterReset={() => { showAddAssetModal(false); setLoadAssets(Math.random()); onReset(); }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
export default Assets;
