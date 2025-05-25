/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { getDefinitonByLabel } from '../../../assets/utils/utils';
import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  numToFloat,
  extractTextObject,
} from '../../../util/appUtils';
import { getTaxes } from '../../purchaseService';

const appModels = require('../../../util/appModels').default;

const AdditionalInfo = (props) => {
  const {
    detail,
  } = props;
  const [openReOrdersList, setOpenResordersList] = useState(false);
  const [currentTooltip, setCurrentTip] = useState('');

  const dispatch = useDispatch();

  const {
    taxesInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (detail && detail.data && detail.data.length > 0 && detail.data[0].taxes_id && detail.data[0].taxes_id.length) {
      dispatch(getTaxes(detail.data[0].taxes_id, appModels.TAX));
    }
  }, [detail]);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  if (openReOrdersList) {
    return (
      <Redirect to={`/purchase/products/reordering-rules/${detailData.id}`} />
    );
  }

  return (
    <Row>
      {detailData && !openReOrdersList && (
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchased Product Quantity</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(numToFloat(detailData.purchased_product_qty))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Internal Reference</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.default_code)}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Sales Price</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(numToFloat(detailData.list_price))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Country Of Origin</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.origin_country_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver" aria-hidden onMouseEnter={() => setCurrentTip('cost_info')}
              onFocus={() => setCurrentTip('cost_info')}>Cost</span>
               {currentTooltip === 'cost_info' && (
              <Tooltip title={getDefinitonByLabel('cost_info')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
            )}
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(numToFloat(detailData.standard_price))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Can Be Sold</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{detailData.sale_ok ? 'Yes' : 'No'}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Can Be Purchased</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{detailData.purchase_ok ? 'Yes' : 'No'}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Unit of Measure</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.uom_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Responsible</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.responsible_id))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Sold Product Quantity</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(numToFloat(detailData.sales_count))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Barcode</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(detailData.barcode)}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Customer Taxes</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {detailData.taxes_id && detailData.taxes_id.length > 0 ? (
                    taxesInfo && taxesInfo.data && taxesInfo.data.length && taxesInfo.data.map((tax) => (
                      <React.Fragment key={tax.id}>
                        {tax.name}
                      </React.Fragment>
                    ))
                  ) : '-'}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">HS Code</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.hs_code_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
              </Row>
              <hr className="mt-0" />
              {detailData && detailData.type === 'product' && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Total Reordering Rules</span>
                </Row>
                <Row className="m-0 content-center">
                  <span className="m-1 p-1 font-weight-800">{detailData.nbr_reordering_rules}</span>
                  {detailData.nbr_reordering_rules ? (
                    <FontAwesomeIcon onClick={() => setOpenResordersList(true)} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEye} />
                  ) : (<span />)}
                </Row>
                <hr className="mt-0" />
              </>
              )}
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Can Be Maintenance</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{detailData.maintenance_ok ? 'Yes' : 'No'}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchase Unit of Measure</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.uom_po_id))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
          </Row>
        </Col>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Row>
  );
};

AdditionalInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default AdditionalInfo;
