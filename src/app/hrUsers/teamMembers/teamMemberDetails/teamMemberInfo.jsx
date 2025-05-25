import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';


import {
  getDefaultNoValue,
  extractTextObject,
  getArrayFromValuesByIdIn
} from '../../../util/appUtils';

const TeamMemberInfo = (props) => {
  const {
    detail,
  } = props;
  const [isShow, setShow] = useState(false);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];


  const selectedCompanies = getArrayFromValuesByIdIn(userCompanies, detailData.company_ids, 'id');
  return (
    <>
      <Col>
        {detailData && (
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pb-1 pr-04 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">BASIC INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <Row className="ml-1 mr-1 mt-3">
                      <Col sm="6" md="6" xs="6" lg="6" className="pl-0">
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Email
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700 text-break">{getDefaultNoValue(detailData.email)}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Mobile
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.phone_number)}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Department
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.hr_department))}</span>
                        </Row>
                        <p className="mt-2" />
                      </Col>
                      <Col sm="6" md="6" xs="6" lg="6" className="pl-0">
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Allowed Sites
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="font-weight-800">
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
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Current Site
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
                        </Row>
                        <p className="mt-2" />
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pb-1 pr-04 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <Row className="ml-1 mr-1 mt-3">
                      <Col sm="6" md="6" xs="6" lg="6" className="pl-0">
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Employee ID
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.employee_id_seq)}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Associates To
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.associates_to)}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Designation
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.designation_id))}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Mobile User Only
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-1 p-1 font-weight-800 text-capital">{detailData.is_mobile_user ? 'Yes' : 'No'}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Vendor ID
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(detailData.vendor_id_seq)}</span>
                        </Row>
                        <p className="mt-2" />

                      </Col>
                      <Col sm="6" md="6" xs="6" lg="6" className="pl-0">
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Shift
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.resource_calendar_id))}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Associate Entity
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.vendor_id))}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Department
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.hr_department))}</span>
                        </Row>
                        <p className="mt-2" />
                        <Row className="m-0">
                          <span
                            className="m-0 p-0 light-text"
                            aria-hidden
                          >
                            Is SOW Employee
                          </span>
                        </Row>
                        <Row className="m-0">
                          <span className="m-1 p-1 font-weight-800 text-capital">{detailData.is_sow_employee ? 'Yes' : 'No'}</span>
                        </Row>
                        <p className="mt-2" />
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Col>
    </>
  )
}
export default TeamMemberInfo