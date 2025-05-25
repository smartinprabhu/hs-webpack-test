/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';

const QrExport = (props) => {
  const {
    data,
  } = props;
  const sizeValue = 90;

  const { qrCodeImageInfo } = useSelector((state) => state.equipment);

  const qrLogo = qrCodeImageInfo && qrCodeImageInfo.data && qrCodeImageInfo.data.length ? qrCodeImageInfo.data[0].qr_code_image : false;

  return (

    <>
      {data && data.map((item) => (
        <React.Fragment key={item.id}>
          <table
            width="200"
            style={{
              width: '200px', height: '100px', float: 'left', pageBreakInside: 'avoid', pageBreakAfter: 'always',
            }}
          >
            <tbody>
              <tr>
                <td style={{ lineHeight: '15px', width: '90px' }}>
                  <QRCode value={item.equipment_seq} renderAs="svg" includeMargin level="H" size={sizeValue} />
                  <br />
                  <span style={{ marginLeft: '15px' }}><b style={{ fontSize: '9px' }}>{item.equipment_seq}</b></span>
                </td>
                <td style={{ lineHeight: '15px', textAlign: 'center' }}>
                  {qrLogo && (
                    <>
                      <img src={`data:image/png;base64,${qrLogo}`} width="100%" height="auto" alt="logo" />
                      <br />
                    </>
                  )}
                  <span style={{ fontSize: '9px' }}><b>{item.name}</b></span>
                  <br />
                  <span style={{ fontSize: '9px' }}><b>{item.location_id[1]}</b></span>
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ))}
    </>
  );
};

QrExport.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

export default QrExport;