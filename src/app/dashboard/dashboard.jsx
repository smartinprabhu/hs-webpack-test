/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCity,
  faSearch,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import totalArea from "@images/icons/totalArea.svg";
import allBuildings from "@images/icons/allBuildings.svg";
import ModalHeaderComponent from "@shared/modalHeaderComponent";

import "./dashboard.scss";
import Apps from "./apps";
import GoogleMapView from "./googleMapView";
import Sites from "./sites";
import Notifications from "./notifications";
import { getTotalArrayValue } from "../util/staticFunctions";
import UpdatePassword from "../adminSetup/companyRegistration/updatePassword/updatePassword";
import ViewPrivacy from "../auth/privacy";
import { logout } from "../auth/auth";

import Navbar from "./navbar/navbar";
import { getMenuItems, getSequencedMenuItems } from "../util/appUtils";
import { updateHeaderData } from "../core/header/actions";

const appModels = require("../util/appModels").default;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDashboard, setCurrentDashboard] = useState(0);
  const [currentTab, setActive] = useState(0);
  const [loadDashboard, setLoadDashboard] = useState("");
  const [code, setCode] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const onChangeChkManage = (event) => setViewType(event.target.value);
  const [isPrivacyModal, setPrivacyModalOpen] = useState(false);
  const [updatePasswordModal, showUpdatePasswordModal] = useState(false);
  const history = useHistory();

  const menuList = getMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    "Dashboards",
    "name"
  );
  const menus = getSequencedMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    "Dashboards",
    "name"
  );

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    const text = event.target.value;
    if (text.length > 0) {
      const query = new RegExp(`(\\b${text}\\b)`, "gim");
      if (document.getElementById("sitesList") != null) {
        const list = document.getElementById("sitesList").innerHTML;
        const replaceList = list.replace(/(<span>|<\/span>)/gim, "");
        document.getElementById("sitesList").innerHTML = replaceList;
        const replaceTag = replaceList.replace(query, "<span>$1</span>");
        document.getElementById("sitesList").innerHTML = replaceTag;
      }
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const resetPassword = userInfo.data.reset_password
        ? userInfo.data.reset_password
        : false;
      showUpdatePasswordModal(resetPassword);
    }
  }, [userInfo]);

  const dispatchLogout = () => {
    history.push({ pathname: "/" });
    dispatch(logout());
  };
  const menuListData = getMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    "Dashboards",
    "name"
  );
  const [isOldDashboard, setOldDashboard] = useState(false);
  const { pinEnableData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (menus && menus.length && !currentDashboard) {
      setCurrentDashboard(menus[0]);
    }
  }, [menus]);

  useEffect(() => {
    setActive(sessionStorage.getItem("homeActiveItem") || 0);
    setCurrentDashboard(
      JSON.parse(sessionStorage.getItem("homeActiveDashboard"))
    );
    if (menuListData && menuListData.length === 0) {
      dispatch(updateHeaderData({}));
    }
  }, []);

  return (
    <>
      <div
        style={{
          width: "100%",
        }}
      >
        {!isOldDashboard && menuList && menuList.length > 0 && (
          <Navbar
            setActive={setActive}
            setCurrentDashboard={setCurrentDashboard}
            currentTab={currentTab}
            currentDashboard={currentDashboard}
          />
        )}
        {menuListData && menuListData.length === 0 && (
          <Row>
            <Col sm="12" md="12" lg="6" xs="12" className="pr-1 pl-1">
              <Row className="m-0 bg-azure p-3">
                <Col sm="12" md="12" lg="2" xs="12" className="p-0">
                  <img
                    src={allBuildings}
                    alt="actions"
                    className="mr-1 ml-2 circle-icon"
                    height="10"
                    width="10"
                  />
                </Col>
                <Col sm="12" md="12" lg="10" xs="12" className="p-0">
                  <Row>
                    <Col sm="12" md="12" lg="5" xs="12">
                      <h3 className="text-grey">All Buildings</h3>
                    </Col>
                    <Col sm="12" md="12" lg="7" xs="12">
                      <span className="float-right">
                        <FormGroup check inline className="mt-2">
                          <Label className="custom-radio-btn mr-1">
                            <Input
                              className="form-check-input"
                              type="radio"
                              name="viewType"
                              onChange={onChangeChkManage}
                              value="0"
                              checked={viewType === "0"}
                            />
                            <span className="checkmark" />
                          </Label>
                          <span className="mb-2">List View</span>
                        </FormGroup>
                        <FormGroup check inline className="mt-2">
                          <Label className="custom-radio-btn mr-1">
                            <Input
                              className="form-check-input"
                              type="radio"
                              name="viewType"
                              onChange={onChangeChkManage}
                              value="1"
                              checked={viewType === "1"}
                            />
                            <span className="checkmark" />
                          </Label>
                          <span className="mb-2"> Map View</span>
                        </FormGroup>
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <div className="arrow_box">
                        <Card className="rounded-0">
                          <CardBody className="p-2">
                            <Row className="m-0 pb-0">
                              <Col
                                sm="12"
                                md="12"
                                lg="9"
                                xs="12"
                                className="p-0 mt-1"
                              >
                                <FontAwesomeIcon
                                  className="mr-1 ml-1"
                                  size="sm"
                                  icon={faMapMarkerAlt}
                                />
                                <small>Sites: </small>
                                {userInfo &&
                                  userInfo.data &&
                                  userInfo.data.allowed_companies.length > 0 ? (
                                  <small className="sitescount">
                                    {userInfo.data.allowed_companies.length}
                                  </small>
                                ) : (
                                  ""
                                )}
                                <FontAwesomeIcon
                                  className="mr-1 ml-2"
                                  size="sm"
                                  icon={faCity}
                                />
                                <small>Buildings: </small>
                                {userInfo &&
                                  userInfo.data &&
                                  userInfo.data.allowed_companies.length ? (
                                  <small className="buildingcount">
                                    {getTotalArrayValue(
                                      userInfo.data.allowed_companies,
                                      "buildings"
                                    )}
                                  </small>
                                ) : (
                                  ""
                                )}
                                <img
                                  src={totalArea}
                                  alt="actions"
                                  className="mr-1 ml-2"
                                  height="10"
                                  width="10"
                                />
                                <small>Total Area :</small>
                                {userInfo &&
                                  userInfo.data &&
                                  userInfo.data.allowed_companies.length ? (
                                  <small className="totalarea">
                                    {getTotalArrayValue(
                                      userInfo.data.allowed_companies,
                                      "area_sqft"
                                    )}
                                  </small>
                                ) : (
                                  ""
                                )}
                                {userInfo &&
                                  userInfo.data &&
                                  userInfo.data.allowed_companies.length &&
                                  userInfo.data.allowed_companies.length > 0 ? (
                                  <small className="pl-1">sq.ft</small>
                                ) : (
                                  ""
                                )}
                              </Col>
                              <Col sm="3" md="3" lg="3" xs="12" className="p-0">
                                <Input
                                  className="rounded-pill"
                                  id="company-search-text"
                                  bsSize="sm"
                                  placeholder="Search"
                                  value={searchTerm}
                                  onChange={handleChange}
                                />
                                <span>
                                  <FontAwesomeIcon
                                    color="lightgrey"
                                    className="search-icon bg-white"
                                    icon={faSearch}
                                  />
                                </span>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </Col>
                {viewType === "0" && <Sites search={searchTerm} />}
                {viewType === "1" && <GoogleMapView search={searchTerm} />}
              </Row>
              <Apps />
            </Col>
            <Col sm="12" md="12" lg="6" xs="12" className="pr-1 pl-1">
              <Notifications modelName={false} />
            </Col>
          </Row>
        )}
      </div>
      <Modal
        size="xl"
        className="border-radius-50px modal-dialog-centered"
        isOpen={isPrivacyModal}
      >
        <ModalHeaderComponent
          title="Privacy Policy"
          closeModalWindow={() => {
            setPrivacyModalOpen(false);
          }}
        />
        <ModalBody>
          <ViewPrivacy />
        </ModalBody>
      </Modal>
      <Modal
        size="md"
        className="border-radius-50px lookupModal"
        isOpen={updatePasswordModal}
      >
        <ModalHeader className="modal-cornor-button-header">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12">
              <Row>
                <Col sm="1" md="1" lg="1" xs="12">
                  <FontAwesomeIcon
                    className="mr-3 fa-2x"
                    size="lg"
                    icon={faLock}
                  />
                </Col>
                <Col sm="11" md="11" lg="11" xs="12">
                  <h4 className="font-weight-800 mb-0">
                    Please create a strong password
                  </h4>
                  <p className="font-weight-500 light-text">
                    Minimum 8 Characters
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalHeader>
        <ModalBody className="pt-0">
          <UpdatePassword
            afterReset={() => {
              showUpdatePasswordModal(false);
              dispatchLogout();
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
export default Dashboard;
