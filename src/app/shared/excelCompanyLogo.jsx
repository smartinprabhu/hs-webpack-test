/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useSelector } from 'react-redux';

const ExcelCompanyLogo = () => {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? window.localStorage.getItem('company_logo') : false;

  const { userInfo } = useSelector((state) => state.user);

  const companyLogo = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.file_path ? userInfo.data.company.file_path : false;

  return (
    <>
      {companyLogo && (
        <tr>
          <td colSpan={14} style={{ textAlign: 'center' }}>
            <img
              src={companyLogo}
              width="100"
              height="100"
              alt="Cover Logo"
            />
          </td>
        </tr>
      )}
      { /* ipcLogo && (
        <tr>
          <td rowSpan={3} colSpan={2} align="center">
            <img
              src={`data:image/png;base64,${ipcLogo}`}
              width="100"
              height="50"
              alt="Cover Logo"
            />
          </td>
        </tr>
      ) */ }
    </>
  );
};

export default ExcelCompanyLogo;
