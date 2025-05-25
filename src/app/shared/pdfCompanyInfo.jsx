import React from 'react';

const PdfCompanyInfo = () => {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? window.localStorage.getItem('company_logo') : false;

  return (

    <div className>
      {ipcLogo && (
      <img
        src={`data:image/png;base64,${ipcLogo}`}
        width="70"
        height="30"
        alt="Cover Logo"
      />
      )}
      <h4 style={{ textAlign: 'center' }}>
      </h4>
    </div>
  );
};

export default PdfCompanyInfo;
