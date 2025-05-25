/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  extractTextObject,
  getArrayFromValuesByIdIn,
} from '../../../util/appUtils';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const [isShow, setShow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const selectedCompanies = getArrayFromValuesByIdIn(userCompanies, detailData.company_ids, 'id');

  return (
    <Card className="border-0">
      {detailData && (
      <CardBody>
        <h5 className="ml-3">{getDefaultNoValue(detailData.name)}</h5>
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Email</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(detailData.email)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Phone Number</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.phone_number)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Employee ID</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.employee_id_seq)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Associates To</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.associates_to)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Associate Entity</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.vendor_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Default User Role</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.default_user_role_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Current User Role</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.user_role_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Password</span>
            </Row>
            <Row className="m-0 content-center">
              <span className="m-1 p-1 font-weight-800">{isShow ? getDefaultNoValue(detailData.password) : '*****'}</span>
              {isShow && (
              <FontAwesomeIcon onClick={() => setShow(false)} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEyeSlash} />
              )}
              {!isShow && (
              <FontAwesomeIcon onClick={() => setShow(true)} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEye} />
              )}
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Allowed Sites</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">
                {selectedCompanies && selectedCompanies.length > 0 && selectedCompanies.map((item, index) => (
                  <span className="mr-1" key={item.id}>
                    {item.name}
                    {'  '}
                    {selectedCompanies.length !== (index + 1) && (<span>,</span>)}
                    {'  '}
                  </span>
                ))}
                {selectedCompanies && selectedCompanies.length === 0 && (
                <span className="mr-1">{getDefaultNoValue('')}</span>
                )}
              </span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Designation</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.designation_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Status</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-info">{getDefaultNoValue(detailData.state)}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Card>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
