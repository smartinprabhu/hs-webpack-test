import React from 'react';
import { useSelector } from 'react-redux';
import questionMark from '@images/icons/questionMark.svg';
import { Tooltip } from 'antd';
import { getSequencedMenuItems } from '../util/appUtils';

const DocumentViewer = (props) => {
  const { module } = props;
  const { userRoles } = useSelector((state) => state.user);

  const getMenus = getSequencedMenuItems(userRoles?.data?.allowed_modules || [], module, 'name');
  const menuWithLogo = getMenus.find((menu) => menu.name === 'Help');
  const logoUrl = menuWithLogo?.logo_url || null;

  const handleClick = () => {
    if (logoUrl) {
      window.open(logoUrl, '_blank');
    }
  };

  return (
    <div id="bitdoc-embed">
      <Tooltip title="View User Manual">
        {logoUrl && (
          <img
            src={questionMark}
            logoUrl={logoUrl}
            onClick={handleClick}
            alt=""
            className="ml-2 mt-3"
            width="20"
            height="20"
            style={{ cursor: 'pointer' }}
          />
        )}
      </Tooltip>
    </div>
  );
};

export default DocumentViewer;
