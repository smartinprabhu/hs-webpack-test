/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import ErrorContent from '@shared/errorContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faUser,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '@shared/loading';
import '../../purchase.scss';
import {
  getDefaultNoValue, generateErrorMessage,
} from '../../../util/appUtils';
import customData from '../data/customData.json';
import {
  getQuotationFilters, setIsRequestQuotation,
} from '../../purchaseService';

const DetailInfo = (props) => {
  const dispatch = useDispatch();
  const {
    detail,
  } = props;
  const [modal, setModal] = useState(false);

  const { vendorTags } = useSelector((state) => state.purchase);

  const toggle = () => {
    setModal(!modal);
  };

  const onLoadPurchaseOrders = () => {
    if (detail && detail.data && detail.data.length) {
      const filters = [{
        id: detail.data[0].id,
        label: detail.data[0].name,
      }];
      dispatch(getQuotationFilters([], [], filters, []));
      dispatch(setIsRequestQuotation(true));
    }
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Card className="border-0">
      {detailData && (
        <CardBody>
          <h5 className="ml-3 content-center page-actions-header">
            {detailData.image_small
              ? (
                <img
                  aria-hidden="true"
                  src={`data:image/png;base64,${detailData.image_small}`}
                  alt="vendor"
                  className="mr-2 cursor-pointer"
                  width="50"
                  height="50"
                  onClick={() => toggle()}
                />
              )
              : <FontAwesomeIcon size="lg" color="info" className="mr-2" icon={faUser} />}
            {detailData.name}
          </h5>
          <Modal isOpen={modal} size="lg">
            <ModalHeader toggle={toggle}>{detailData.name}</ModalHeader>
            <ModalBody>
              <img
                src={`data:image/png;base64,${detailData.image}`}
                alt={detailData.name}
                width="100%"
                height="100%"
                aria-hidden="true"
              />
            </ModalBody>
          </Modal>
          <Row className="ml-1 mr-1">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(customData && detailData.company_type && detailData.companyTypeNames
                        && customData.companyTypeNames[detailData.company_type] ? customData.companyTypeNames[detailData.company_type].label : '')}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Company Name</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.company_name ? detailData.company_name : '')}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Phone</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.phone)}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Address</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.street)}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Country</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.country_id ? detailData.country_id[1] : '')}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">City</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.city)}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Total Purchase Orders</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {detailData.purchase_order_count}
                  {detailData.purchase_order_count && (
                    <Link to="/purchase/requestforquotation">
                      <FontAwesomeIcon onClick={() => onLoadPurchaseOrders()} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEye} />
                    </Link>
                  )}
                </span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Website</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {' '}
                  {getDefaultNoValue(detailData.website)}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Language</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {' '}
                  {getDefaultNoValue(customData && detailData.lang && customData.langugageTypes
                        && customData.langugageTypes[detailData.lang] ? customData.langugageTypes[detailData.lang].label : '')}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Email</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {' '}
                  {getDefaultNoValue(detailData.email)}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Tags</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {(vendorTags && vendorTags.data) && vendorTags.data.map((cont) => (
                    <span className="mr-2">{cont.name}</span>
                  ))}
                  {vendorTags && vendorTags.err ? getDefaultNoValue('') : '-'}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">State</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.state_id ? detailData.state_id[1] : '')}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">ZIP Code</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(detailData.zip)}
                </span>
              </Row>
              <hr className="mt-0" />
            </Col>
          </Row>
        </CardBody>
      )}
      {detail && detail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(detail && detail.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(detail)} />
        </CardBody>
      )}
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
