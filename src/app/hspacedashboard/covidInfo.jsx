/* eslint-disable react/no-danger */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux';

import covidInfoLogo from '@images/covidInfo.svg';
import warningIcon from '@images/warning.ico';
import Loading from '@shared/loading';

const CovidInfo = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [covidData, setCovidData] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  let covidInfoObj;
  if (userRoles && userRoles.data && userRoles.data.covid) covidInfoObj = userRoles.data.covid;

  const copyToClipboard = (mobile) => {
    navigator.clipboard.writeText(mobile);
    setCopySuccess(true);
  };

  return (
    <div className="p-3 border-cinnabar-1px rounded ml-3 mr-0 h-100 covid-information dashboardTileHeight">
      <Row>
        <Col xs="12" sm="4" md="4" lg="3" className="pl-0 pr-0 mt-3">
          <img
            src={covidInfoLogo}
            width="100%"
            alt="doctors"
          />
        </Col>
        <Col xs="12" sm="8" md="8" lg="6" className="p-0">
          <Row className="mt-4">
            <Col sm="3" xs="2" md="3" lg="4">
              <img src={warningIcon} width="50" height="50" alt="warning" />
            </Col>
            <Col sm="9" xs="10" md="9" lg="8">
              <h2 className="text-cinnabar">{covidInfoObj.title || 'COVID 19 INFORMATION'}</h2>
            </Col>
          </Row>
        </Col>

        <Col sm="12" className="m-0 p-3 mt-3">
          <div>
            {userRoles && !userRoles.data.loading && covidInfoObj && covidInfoObj.title && (
              <div dangerouslySetInnerHTML={{ __html: covidInfoObj.landing_page.content_html }} />
            )}
            {covidInfoObj && covidInfoObj.helpline && !covidInfoObj.helpline.id && (
              <div className="text-center mt-3 covid-text">
                No  COVID 19 information found
              </div>
            )}
          </div>
        </Col>
        {/* <Col sm="12">
            <Row className="m-0 my-2"> */}
        {/* <Col sm="2" xs="2">
                <img src={helpdesk} height="60" width="60" alt="helpdesk" />
              </Col> */}
        {/* <Col sm="9" xs="10">
                {covidInfoObj && covidInfoObj.helpline && covidInfoObj.helpline.mobile
                  && covidInfoObj.helpline.name && (
                    <Tooltip
                      title={copySuccess ? 'Copied' : covidInfoObj.helpline.mobile}
                      placement="top"
                      aria-label="success"
                    >
                      <Button
                        color="red"
                        className="roundCorners text-uppercase ml-2 mt-3"
                        size="sm"
                        href={`tel:${covidInfoObj.helpline.mobile}`}
                        onClick={() => copyToClipboard(covidInfoObj.helpline.mobile)}
                        onMouseLeave={() => setCopySuccess(false)}
                      >
                        {covidInfoObj.helpline.name}
                      </Button>
                    </Tooltip>
                )}
              </Col> */}
        {/* </Row>
          </Col> */}
      </Row>
      {userRoles && userRoles.loading && !covidInfoObj && (
        <div className="loader-position">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CovidInfo;
