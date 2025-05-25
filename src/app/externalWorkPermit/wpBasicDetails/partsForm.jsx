/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Input,
} from 'reactstrap';

import {
  numToFloat, decimalKeyPress,
} from '../../util/appUtils';

const PartsForm = (props) => {
  const {
    editId,
    spareParts,
    setSpareParts,
  } = props;
  const [partsData, setPartsData] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      setSpareParts(partsData);
    }
  }, [partsAdd]);

  useEffect(() => {
    if (editId && (spareParts && spareParts.length)) {
      const newArrData = spareParts.map((cl) => ({
        ...cl,
        id: cl.id,
        parts_id: cl.parts_id && cl.parts_id.id ? [cl.parts_id.id, cl.parts_id.name] : false,
        product_id_ref: cl.parts_id && cl.parts_id.id ? cl.parts_id.id : '',
        used_qty: numToFloat(cl.used_qty),
        parts_qty: numToFloat(cl.parts_qty),
      }));
      setPartsData(newArrData);
      setSpareParts(newArrData);
      setPartsAdd(Math.random());
    }
  }, [editId]);

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    const qty = parseInt(newData[index].parts_qty);
    newData[index].used_qty = e.target.value && e.target.value <= parseInt(qty) ? e.target.value : '';
    setPartsData(newData);
    setSpareParts(newData);
    setPartsAdd(Math.random());
  };

  return (
    <div>
      <p>Spare Parts</p>
      <Row className="">
        <Col xs={12} sm={12} md={12} lg={12} className="ml-3 small-form-content thin-scrollbar">
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Part*
                </th>
                <th className="p-2 min-width-160 border-0">
                  Allocated Quantity
                </th>
                <th className="p-2 min-width-160 border-0">
                  Used Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td className="p-2">
                        <Input
                          type="text"
                          name="parts_id"
                          value={pl.parts_id && pl.parts_id.length ? pl.parts_id[1] : ''}
                          readOnly
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="text"
                          onKeyPress={decimalKeyPress}
                          name="parts_qty"
                          value={pl.parts_qty}
                          readOnly
                          maxLength="7"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="text"
                          onKeyPress={decimalKeyPress}
                          name="used_qty"
                          value={pl.used_qty}
                          onChange={(e) => onQuantityChange(e, index)}
                          max={pl.parts_qty}
                        />
                      </td>
                    </tr>
                  )}
                </>
              )))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

PartsForm.propTypes = {
  spareParts: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setSpareParts: PropTypes.func.isRequired,
};

export default PartsForm;
