/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  getLocalTime, getDefaultNoValue, exportExcelTableToXlsx,
} from '../../util/appUtils';
import customData from '../../apexDashboards/data/customData.json';

const tabletd = {

  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};
const tabletdhead = {

  border: '1px solid white',
  borderBottom: '1px solid #4ebbfb',
  fontSize: '17px',
  backgroundColor: '#4ebbfb',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'uppercase',
  padding: '2px',
};

const DynamicDataExport = React.memo((props) => {
  const {
    listName, modelName, data, onFinish, setExportingId, setType,
  } = props;

  const [isShow, setIsShow] = useState(false);
   const { userInfo, userRoles } = useSelector((state) => state.user);

  const propertyAsKey = 'id';

  useEffect(() => {
    if (data) {
      setIsShow(Math.random());
    }
  }, [data]);

  const columns = customData && customData[modelName] ? customData[modelName] : [];

  function showCustomizedLabel(item, col) {
    let value = '';
    if (typeof item[col.property] === 'object') {
      if (item[col.property].length && item[col.property].length > 1) {
        const array = item[col.property];
        // eslint-disable-next-line no-unused-vars
        const [id, name] = array;
        value = name;
      } else if (item[col.property].id && (item[col.property].name || item[col.property].alias_name || item[col.property].asset_name || item[col.property].space_name || item[col.property].path_name)) {
        value = item[col.property].space_name || item[col.property].path_name || item[col.property].name || item[col.property].alias_name || item[col.property].asset_name;
      }
    } else {
      value = getDefaultNoValue(item[col.property]);
    }
    return value;
  }

   const exportTableToExcel = async (tableID, fileTitle = '') => {
      try {
        setType('excel');
  
        //await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay if needed
  
        exportExcelTableToXlsx(tableID, fileTitle);
        setType('');
  
        const reportElement = document.getElementById(tableID);
        if (reportElement) {
          reportElement.remove();
        }
      } catch (e) {
        console.log(e);
      } finally {
        setExportingId(null); // Hide loader
      }
    };

  useEffect(() => {
    if (data) {
      const currentDate = getLocalTime(new Date());
      const title = `${listName || ''} ${currentDate}`;
      exportTableToExcel(listName || 'print_report', title);
      setIsShow(false);
      onFinish();
    }
  }, [data]);

  return (
    <>
      {(modelName) && (
        <div className="hidden-div" id={listName || 'print_report'}>
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              <tr>
                <td style={{ textAlign: 'left' }} ><b>{listName}</b></td>
              </tr>
              <tr>
              <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                {columns && columns.map((col) => (
                  <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                    <div className="font-weight-bold font-size-11">
                      {col.heading}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && data.map((item) => (
                <tr key={`${item[propertyAsKey]}-row`}>
                  {columns.map((col) => <td style={tabletd} key={`${item[propertyAsKey]}-${col.property}`}>{showCustomizedLabel(item, col)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});

DynamicDataExport.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  listName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  onFinish: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
};
export default DynamicDataExport;
