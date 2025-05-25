/* eslint-disable import/no-unresolved */
import completed from '@images/icons/completed.svg';
import missed from '@images/inspection/missed.svg';
import inProgress from '@images/icons/inprogress.svg';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Badge, Card,
  CardBody, Row,
} from 'reactstrap';
import {
  extractNameObject,
} from '../../util/appUtils';

const SiteDetailTabs = () => {
  const { siteDetails, onBoardCopyInfo } = useSelector((state) => state.site);

  const onBoardData = onBoardCopyInfo && onBoardCopyInfo.data && onBoardCopyInfo.data.length ? onBoardCopyInfo.data : [];

  const getColorCode = (state) => {
    let colorCode = 'secondary';
    if (state === 'Done') {
      colorCode = 'success';
    } else if (state === 'Not Started') {
      colorCode = 'danger';
    } else if (state === 'In Progress') {
      colorCode = 'warning';
    }
    return colorCode;
  };

  const getImageName = (state) => {
    let imageName = '';
    if (state === 'Done') {
      imageName = completed;
    } else if (state === 'Not Started') {
      imageName = missed;
    } else if (state === 'In Progress') {
      imageName = inProgress;
    }
    return imageName;
  };

  const loading = (siteDetails && siteDetails.loading) || (onBoardCopyInfo && onBoardCopyInfo.loading);

  return (
    !loading && (
      <Card className="border-0 globalModal-sub-cards bg-lightblue d-flex h-50">
        {siteDetails && (siteDetails.data && siteDetails.data.length > 0) && (
          <CardBody className="pl-0 pr-0 align-items-center d-flex justify-content-center">
            <Row>
              <div className="col-xs-12 center-block text-center">
                <h4>Please wait! While we are setting up your defaults</h4>
                <br />
                {onBoardData && onBoardData.length && onBoardData.map((actions) => (
                  <Badge color={getColorCode(actions.state)} className="pl-3 mb-3 pt-2 mr-2 pb-1 font-14" pill>
                    {extractNameObject(actions.hx_onboard_module_id, 'name')}
                    <img alt={getImageName(actions.state)} src={getImageName(actions.state)} width="17" height="17" className="ml-1 font-14" />
                  </Badge>
                ))}
              </div>
            </Row>
          </CardBody>
        )}
        <div className="bg-lightblue text-center navbar-link font-11 border-top-0 sticky-button-1250drawer">
          NB: You may close this window and come back here later
        </div>
      </Card>
    )
  );
};

export default SiteDetailTabs;
