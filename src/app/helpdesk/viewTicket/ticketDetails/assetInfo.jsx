/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import {
  getTicketOrderStateText, getMTLabel,
} from '../../utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
  getAllowedCompanies,
} from '../../../util/appUtils';
import {
  getSiteBasedCategory,
} from '../../ticketService';

const AssetInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);
  const [category, setCategory] = useState(false);
  const [subCategory, setSubCategory] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const { siteCategoriesInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (detailData && detailData.type_category) {
      dispatch(getSiteBasedCategory(detailData.type_category, false, false, companies));
    }
  }, [detailData]);

  useEffect(() => {
    if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length) {
      const findCateg = siteCategoriesInfo.data.find((categ) => categ.id === detailData.category_id[0]);
      const findSubCateg = findCateg && findCateg.sub_category_id && findCateg.sub_category_id.length && findCateg.sub_category_id.find((categ) => categ.id === detailData.sub_category_id[0]);
      setSubCategory(findSubCateg);
      setCategory(findCateg);
    }
  }, [siteCategoriesInfo]);

  const categoryName = category ? category.cat_display_name ? category.cat_display_name : category.name : getDefaultNoValue(extractTextObject(detailData.category_id));
  const subCategoryName = subCategory ? subCategory.sub_cat_display_name ? subCategory.sub_cat_display_name : subCategory.name : getDefaultNoValue(extractTextObject(detailData.sub_category_id));

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Problem Category
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Problem Sub-Category
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{categoryName}</span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{subCategoryName}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Maintenance Order
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Escalation Level
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.mro_order_id))}</span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.current_escalation_level)}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Maintenance Team
              </span>
            </Col>
            {isVendorShow && (
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 light-text">
                  Vendor
                </span>
              </Col>
            )}
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.maintenance_team_id))}</span>
            </Col>
            {isVendorShow && (
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.vendor_id))}</span>
              </Col>
            )}
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                MO Status
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Maintenance Type
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getTicketOrderStateText(detailData.mro_state))}</span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getMTLabel(detailData.maintenance_type))}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Work Station Number
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.work_location)}</span>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

AssetInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default AssetInfo;
