/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Markup } from "interweave";
import { Modal, ModalBody } from "reactstrap";

import ModalHeaderComponent from "@shared/modalHeaderComponent";

import {
  truncateStars,
  getCompanyTimezoneDate,
  truncateFrontSlashs,
} from "../util/appUtils";
import AuthService from "../util/authService";
import ViewTermsOfServices from "../auth/termsOfService";
import ViewPrivacy from "../auth/privacy";
import { getClientName } from "../util/getDynamicClientData";
import "./footer.scss";
const appConfig = require("../config/appConfig").default;

const Footer = () => {
  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const [isPrivacyModal, setPrivacyModalOpen] = useState(false);

  const [vpConfig, setVpConfig] = useState({
    loading: false,
    data: null,
    err: null,
  });
  const [isModal, setModalOpen] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const code = getClientName();

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && code) {
      setVpConfig({
        loading: true,
        data: null,
        count: 0,
        err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}api/authProviders/allVersions?code=${code}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false,
            data: null,
            count: 0,
            err: error.response,
          });
        });
    }
  }, [isAuthenticated]);

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : false;
  const currentVerionData =
    detailData && detailData.endpoints && detailData.endpoints.length > 0
      ? detailData.endpoints.filter((item) => item.release_status === "Current")
      : false;
  const currentVersion =
    currentVerionData && currentVerionData.length
      ? currentVerionData[0].web.web_version
      : false;
  const selectedVersion =
    currentVerionData && currentVerionData.length
      ? currentVerionData[0]
      : false;

  const { pinEnableData } = useSelector((state) => state.auth);

  return (
    <>
      <div className={pinEnableData ? "fixed-bottom-right2" : "fixed-bottom-right"} id="sticky_footer">
        {isAuthenticated ? (
          <div>
            <div className="float-right">
              <div
                className={
                  isAuthenticated
                    ? "text-black desktop-footer"
                    : "text-white desktop-footer"
                }
              >
                {/* Powered by */}
                {"  "}
                <a
                  className={
                    isAuthenticated
                      ? "text-black desktop-footer"
                      : "text-white desktop-footer"
                  }
                  // href="#"
                  href="/"
                  rel="noreferrer"
                  // onClick={() => setModalOpen(true)}
                >
                  Powered by HelixSense
                  {"  "}
                  {/* {currentVersion || ''} */}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* <div className="float-right">
                <Button
                  onClick={() => setModalOpen(true)}
                  color="link"
                  className={!isAuthenticated ? 'text-black pl-0 pr-0 pt-4' : 'text-white pl-0 pr-0 pt-1'}
                >
                  <span className="text-center font-weight-600">Terms of Service</span>
                </Button>
                <Button
                  color="black"
                  className={!isAuthenticated ? 'text-black pl-0 pr-0 pt-4' : 'text-white pl-0 pr-0 pt-1'}
                >
                  <span className="text-center font-weight-600">|</span>
                </Button>
                <Button
                  onClick={() => setPrivacyModalOpen(true)}
                  color="link"
                  className={!isAuthenticated ? 'text-black pl-0 pr-0 pt-4' : 'text-white pl-0 pr-0 pt-1'}
                >
                  <span className="text-center font-weight-600">Privacy</span>
                </Button>
              </div> */}
          </div>
        )}
      </div>
      <Modal
        size="xl"
        className="border-radius-50px modal-dialog-centered"
        isOpen={isModal}
      >
        <ModalHeaderComponent
          title="Terms of Service"
          closeModalWindow={() => {
            setModalOpen(false);
          }}
        />
        <ModalBody>
          <ViewTermsOfServices />
        </ModalBody>
      </Modal>
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
      {selectedVersion && (
        <Modal
          size="lg"
          className="border-radius-50px modal-dialog-centered purchase-modal"
          isOpen={isModal}
        >
          <ModalHeaderComponent
            title={selectedVersion.web.web_version}
            imagePath={false}
            closeModalWindow={() => setModalOpen(false)}
          />
          <ModalBody className="mt-0 pt-0">
            <div className="mb-3">
              <span className="text-left">
                <FontAwesomeIcon
                  className={`mr-2 ${
                    selectedVersion.release_status === "Current"
                      ? "text-success"
                      : ""
                  }`}
                  size="sm"
                  icon={faCheckCircle}
                />
                {selectedVersion.release_status}
              </span>
              <span className="float-right">
                <small>
                  Released on :{" "}
                  {selectedVersion.released_on &&
                  selectedVersion.released_on !== "False"
                    ? getCompanyTimezoneDate(
                        selectedVersion.released_on,
                        userInfo,
                        "datetime"
                      )
                    : "-"}
                </small>
              </span>
            </div>
            <Markup
              content={truncateFrontSlashs(
                truncateStars(selectedVersion.web.web_release_notes)
              )}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default Footer;
