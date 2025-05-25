/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col, Row, Card, CardImg, CardBody,
  CardTitle, CardSubtitle,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import building from '@images/building.jpg';
import { getSiteDetail } from '../setupService';

const appModels = require('../../util/appModels').default;

const Sites = (props) => {
  const {
    afterReset,
  } = props;
  const { sitesListInfo } = useSelector((state) => state.setup);
  const dispatch = useDispatch();

  const getSiteDetails = (siteData) => {
    dispatch(getSiteDetail(siteData.id, appModels.COMPANY));
    if (afterReset) afterReset();
  };

  return (
    <>
      <Row>
        {sitesListInfo && sitesListInfo.data && sitesListInfo.data.map((site, index) => (
          <Col sm="4" md="4" lg="4" className="pb-3" key={site.name}>
            <Card className="cursor-pointer" onClick={() => getSiteDetails(site)}>
              <CardImg top width="100%" height="120px" src={site.logo ? `data:image/png;base64,${site.logo}` : building} alt="site" />
              <CardBody className="p-2">
                <CardSubtitle tag="small" className="mb-2 text-muted font-weight-500 font-style-italic">
                  Site
                  {' '}
                  {index + 1}
                </CardSubtitle>
                <CardTitle tag="h6" className="mb-0">{site.name}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

Sites.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default Sites;
