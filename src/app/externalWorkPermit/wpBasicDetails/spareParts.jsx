/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

import ProductForm from './productForm';

import {
  getDefaultNoValue, extractNameObject, numToFloat,
} from '../../util/appUtils';

const SpareParts = (props) => {
  const {
    workPermitDetail,
    accid,
    ruuid,
    atSuccess,
    updateStatus,
    workPermitConfig,
  } = props;

  const [showModal, setModal] = useState(false);

  const inspDeata = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : false;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].parts_id, 'name'))}</td>
          <td className="p-2">{numToFloat(assetData[i].parts_qty)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].parts_uom, 'name'))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <>
        <h5>
          Spare Parts
          {updateStatus && updateStatus === 'Approved' ? ''
            : <FontAwesomeIcon size="sm" onClick={() => setModal(true)} className="mr-2 float-right cursor-pointer" icon={faEdit} />}
        </h5>
        <div className="ml-0 bg-white">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12" className="products-list-tab comments-list thin-scrollbar product-orders">

              <div>
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-160">
                        Spare Part
                      </th>
                      <th className="p-2 min-width-160">
                        Quantity
                      </th>
                      <th className="p-2 min-width-160">
                        UOM
                      </th>
                      <th className="p-2 min-width-160">
                        Short Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(workPermitDetail.data.length > 0 ? workPermitDetail.data[0].parts_lines : [])}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            </Col>
          </Row>
        </div>

        {showModal && (
        <ProductForm
          editId
          accid={accid}
          workPermitDetail={workPermitDetail}
          workPermitConfig={workPermitConfig}
          companyId={inspDeata && inspDeata.company_id && inspDeata.company_id.id ? inspDeata.company_id.id : ''}
          atClose={() => setModal(false)}
          atSuccess={() => atSuccess()}
          ruuid={ruuid}
        />
        )}

      </>
    </>
  );
};

SpareParts.propTypes = {
  workPermitDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  workPermitConfig: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  ruuid: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  updateStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  atSuccess: PropTypes.func.isRequired,
};

export default SpareParts;
