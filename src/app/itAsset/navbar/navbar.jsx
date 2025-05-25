/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Button,
  Input,
  Popover,
  PopoverBody,
} from 'reactstrap';
import { Drawer } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import configurationBlack from '@images/icons/configurationBlack.svg';
import searchIcon from '@images/icons/search.svg';
import assetsIcon from '@images/icons/assets.svg';
import locationIcon from '@images/icons/location.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import assetsGreyIcon from '@images/icons/assetsGrey.svg';
import reportsIcon from '@images/icons/reports.svg';
import assetIcon from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import assetLogo from '@images/icons/itAssetBlue.svg';
import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getPagesCountV2,
  getListOfOperations,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  resetAddAssetInfo, getSpaceData, resetSpaceEquipments, resetSpaceData, getEquipmentFilters,
} from '../../assets/equipmentService';
import { getExtraSelectionMultiple, getExtraSelectionMultipleCount } from '../../helpdesk/ticketService';
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import AddEquipment from '../../assets/addAsset';
import actionCodes from '../../assets/data/assetActionCodes.json';

const faActiveIcons = {
  INSIGHTS: searchActiveIcon,
  LOCATIONS: locationIcon,
  ASSETS: assetsGreyIcon,
  REPORTS: reportsIcon,
  MAPVIEW: configurationBlack,
};

const faIcons = {
  INSIGHTS: searchIcon,
  LOCATIONS: locationIcon,
  ASSETS: assetsIcon,
  REPORTS: reportsIcon,
  MAPVIEW: configurationBlack,
};
const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { addAssetInfo } = useSelector((state) => state.equipment);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading, listDataMultipleCountErr,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'IT Asset Management', 'name');

  const [addAssetModal, showAddAssetModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [asset, setAsset] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentTab, setActive] = useState('Components');
  const [location, setLocation] = useState(false);
  const [totalDataCount, setTotalCount] = useState(0);

  const columns = ['name', 'state', 'location_id', 'category_id', 'equipment_seq', 'maintenance_team_id', 'category_type'];

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const onReset = () => {
    dispatch(resetAddAssetInfo());
  };
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (searchOpen) {
      let categoryType = false;
      if (currentTab === 'Components') {
        dispatch(setCurrentTab('Components'));
        categoryType = 'Component';
      } else if (currentTab === 'Accessories') {
        categoryType = 'Accessory';
        dispatch(setCurrentTab('Accessories'));
      } else if (currentTab === 'Equipments') {
        dispatch(setCurrentTab('Equipments'));
        categoryType = 'Equipment';
      }
      const searchValueMultiple = `["&",["company_id","in",[${companies}]],["is_itasset","=","true"],["category_type","=","${categoryType}"],"|","|",["name", "ilike", "${keyword}"],["location_id", "ilike", "${keyword}"],["category_id", "ilike", "${keyword}"]]`;
      dispatch(getExtraSelectionMultiple(companies, appModels.EQUIPMENT, limit, offset, columns, searchValueMultiple, true));
      dispatch(getExtraSelectionMultipleCount(companies, appModels.EQUIPMENT, columns, searchValueMultiple));
    }
  }, [searchOpen, offset, keyword, currentTab]);

  const pages = getPagesCountV2(totalDataCount, limit);

  useEffect(() => {
    if (asset) {
      if (asset) {
        const filters = [{
          key: 'id', value: asset.id, label: 'ID', type: 'id',
        }];
        dispatch(getEquipmentFilters(filters));
        history.push({ pathname: '/itasset/equipments', state: { id: asset.id } });
      }
    }
  }, [asset]);

  useEffect(() => {
    if (location) {
      history.push({ pathname: '/assets/locations', state: { id: location.id } });
      dispatch(getSpaceData(appModels.SPACE, location.id));
    }
  }, [location]);

  useEffect(() => {
    if (!searchOpen) {
      setKeyword('');
      setPage(1);
      setOffset(0);
    }
  }, [searchOpen]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  useEffect(() => {
    if (searchOpen && currentTab === 'Locations') {
      const searchValueMultiple = `["&",["company_id","in",[${companies}]],"|",["space_name", "ilike", "${keyword}"],["name", "ilike", "${keyword}"]]`;
      dispatch(getExtraSelectionMultiple(companies, appModels.SPACE, limit, offset, ['space_name', 'name', 'path_name'], searchValueMultiple, true));
      dispatch(getExtraSelectionMultipleCount(companies, appModels.SPACE, ['space_name', 'name', 'path_name'], searchValueMultiple));
      setTotalCount(0);
    }
  }, [searchOpen, offset, keyword, currentTab]);

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  useEffect(() => {
    if ((listDataMultipleInfo && listDataMultipleInfo.err) || (listDataMultipleCountErr)) {
      setTotalCount(0);
    }
  }, [listDataMultipleInfo, listDataMultipleCountErr]);

  useEffect(() => {
    if (listDataMultipleCountInfo && listDataMultipleCountInfo.length) {
      setTotalCount(listDataMultipleCountInfo.length);
    } else if (listDataMultipleCountInfo && (listDataMultipleCountInfo.loading || listDataMultipleCountInfo.err)) {
      setTotalCount(0);
    }
  }, [listDataMultipleCountInfo]);

  return (
    <>
      <Row className="m-0 itAssetsOverview-header">
        <Col md="3" sm="12" lg="3" xs="12" className="p-0">
          <h3 className="mt-1">
            <img src={assetLogo} alt="assets" width="25" height="25" className="mb-1 mr-2" />
            {sideNav.data.title}
          </h3>
        </Col>
        <Col md="6" sm="12" lg="6" xs="12" className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => { dispatch(setInitialValues(false, false, false, false)); dispatch(resetSpaceEquipments()); dispatch(resetSpaceData()); }}>
                    <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                      <img
                        src={sideNav.data[menu].displayname === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
                        className={sideNav.data[menu].displayname === 'Locations' ? 'mt-n6px ml-n6px mr-1' : 'mr-2'}
                        alt={sideNav.data[menu].displayname}
                        width="20"
                        height="20"
                      />
                      {sideNav.data[menu].displayname}
                    </NavLink>
                  </NavItem>
                )
              ))}
            </>
          </Nav>
        </Col>
        {id === 'Insights' ? (
          <Col md="3" sm="12" lg="3" xs="12">
            <Row className="margin-negative-left-90px margin-negative-right-27px">
              <Col md="8" sm="12" lg="8">
                <Input
                  className="rounded-pill mt-2 padding-left-30px"
                  id="asset-search"
                  value={keyword}
                  bsSize="sm"
                  autoComplete="off"
                  placeholder="Search Here"
                  onClick={() => setSearchOpen(!searchOpen)}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <FontAwesomeIcon color="lightgrey" className="insights-search-icon bg-white" icon={faSearch} />
                <Popover trigger="legacy" className="search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className={currentTab === 'Components' ? 'insights-nav-link' : 'insights-nav-link-active'} onClick={() => setActive('Components')} href="#">Components</NavLink>
                      </Nav>
                      <Nav>
                        <NavLink className={currentTab === 'Accessories' ? 'insights-nav-link' : 'insights-nav-link-active'} onClick={() => setActive('Accessories')} href="#">Accessories</NavLink>
                      </Nav>
                      <Nav>
                        <NavLink className={currentTab === 'Equipments' ? 'insights-nav-link' : 'insights-nav-link-active'} onClick={() => setActive('Equipments')} href="#">Equipments</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Components' || currentTab === 'Accessories' || currentTab === 'Equipments' ? (
                      <>
                        {loading && (
                        <Loader />
                        )}
                        {listDataMultipleInfo && listDataMultipleInfo.err && (
                        <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />
                        )}
                        {!loading && listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length && listDataMultipleInfo.data.map((equipment) => (
                          <div key={equipment.id} aria-hidden className="cursor-pointer" onClick={() => setAsset(equipment)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={assetIcon}
                                />
                                {equipment.name}
                              </Col>
                              <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
                                {equipment && equipment.location_id && equipment.location_id.length && equipment.location_id[1]}
                              </Col>
                              <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
                                {equipment && equipment.category_id && equipment.category_id.length && equipment.category_id[1]}
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {keyword === '' || loading || pages === 0 ? (<span />) : (
                          <div className={`${classes.root} float-right`}>
                            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
                          </div>
                        )}
                      </>
                    ) : ''}
                    {currentTab === 'Locations' ? (
                      <>
                        {loading && (
                        <Loader />
                        )}
                        {listDataMultipleInfo && listDataMultipleInfo.err && (
                        <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />
                        )}
                        {!loading && listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length && listDataMultipleInfo.data.map((locations) => (
                          <div key={locations.id} aria-hidden className="cursor-pointer" onClick={() => setLocation(locations)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.LOCATIONS}
                                />
                                {locations.space_name}
                              </Col>
                              <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
                                {locations.path_name}
                              </Col>
                              <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
                                {locations.name}
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {keyword === '' || loading || pages === 0 ? (<span />) : (
                          <div className={`${classes.root} float-right`}>
                            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
                          </div>
                        )}
                      </>
                    ) : ''}
                  </PopoverBody>
                </Popover>
              </Col>
              <Col sm="12" lg="4" md="4">
                {allowedOperations.includes(actionCodes['Add an Asset']) && (
                <Button className="float-right insights-add-icon mt-2" onClick={() => showAddAssetModal(!addAssetModal)}>
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    width="15px"
                    className="cursor-pointer ml-0 mb-1"
                    src={plusCircleMiniIcon}
                  />
                  <span className="float-right pr-1">
                    Add IT Asset
                  </span>
                </Button>
                )}
              </Col>
              <Drawer
                title=""
                closable={false}
                className="drawer-bg-lightblue"
                width={1250}
                visible={addAssetModal}
              >

                <DrawerHeader
                  title="Create IT Asset"
                  imagePath={assetIcon}
                  closeDrawer={() => showAddAssetModal(false)}
                />
                <AddEquipment
                  afterReset={() => { onReset(); }}
                  closeAddModal={() => { showAddAssetModal(false); }}
                  isITAsset
                  isGlobalITAsset
                />
              </Drawer>
              {/*   <Modal size={(addAssetInfo && addAssetInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addAssetModal}>
                <ModalHeaderComponent title="Add IT Asset" imagePath={assetIcon} closeModalWindow={() => { showAddAssetModal(false); onReset(); }} response={addAssetInfo} />
                <ModalBody className="mt-0 pt-0">
                  <AddEquipment
                    isITAsset
                    isGlobalITAsset
                    afterReset={() => { showAddAssetModal(false); onReset(); }}
                  />
                </ModalBody>
                </Modal> */}
            </Row>
          </Col>
        ) : ''}
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
