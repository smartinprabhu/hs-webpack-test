/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import fileMiniIcon from '@images/icons/fileMini.svg';
import {
  getDefaultNoValue, getFileExtension,
} from '../../util/appUtils';

const TicketDetails = (props) => {
  const { formValues } = props;

  const { uploadPhoto } = useSelector((state) => state.ticket);

  return (
    <Row className="mb-3">
      <Col xs={12} sm={12} md={4} lg={4}>
        <Row className="m-0">
          <span className="text-label-blue m-1 m-1">Attachments</span>
        </Row>
        <Row className="m-0">
          {uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && uploadPhoto.map((fl) => (
            <Col sm="12" md="12" lg="12" xs="12" className="p-1" key={fl.photoname}>
              {(getFileExtension(fl.datas_fname) !== 'png' && getFileExtension(fl.datas_fname) !== 'svg' && getFileExtension(fl.datas_fname) !== 'jpeg' && getFileExtension(fl.datas_fname) !== 'jpg')
                ? (
                  <>
                    <img
                      src={fileMiniIcon}
                      alt={fl.name}
                      aria-hidden="true"
                      height="80"
                      width="100"
                      className="cursor-pointer"
                    />
                    <p className="m-0">{fl.datas_fname}</p>
                  </>
                )
                : (
                  <img
                    src={fl.database64}
                    alt={fl.name}
                    height="80"
                    width="100"
                  />
                )}
            </Col>
          ))}
        </Row>
      </Col>
      <Col xs={12} sm={12} md={8} lg={8}>
        <Row className="m-0">
          <span className="text-label-blue m-1 m-1">Description</span>
        </Row>
        <Row className="m-0">
          <span className="m-1 bw-2 font-weight-500" dangerouslySetInnerHTML={{ __html: getDefaultNoValue(formValues.description) }} />
        </Row>
        <hr className="m-1" />
      </Col>
    </Row>
  );
};

TicketDetails.propTypes = {
  formValues: PropTypes.shape({
    subject: PropTypes.string,
    maintenance_team_id: PropTypes.string,
    category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    description: PropTypes.string,
    sub_category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    priority_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    parent_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    equipment_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    channel: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    issue_type: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    isIncident: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
  }).isRequired,
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default TicketDetails;
