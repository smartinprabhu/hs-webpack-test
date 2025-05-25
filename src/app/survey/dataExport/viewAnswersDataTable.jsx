import React from 'react';
import * as PropTypes from 'prop-types';

const tabletd = {

  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};

const tabletdMail = {

  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', padding: '2px',
};

const tabletdhead = {

  border: '1px solid #495057',
  borderBottom: '1px solid #4ebbfb',
  fontSize: '15px',
  backgroundColor: '#4ebbfb',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'capitalize',
  padding: '2px',
};

const DataTable = (props) => {
  const {
    columns, data, propertyAsKey, answersFiltersByQues,
  } = props;
  return (

    <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" width="100%" align="left" id="table-to-xls_report">
      <thead>
        <tr>{columns.map((col) => <th data-type={col.type && (col.type === 'date' || col.type === 'datetime') ? col.dataType : 'string'} style={tabletdhead}>{col.heading}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <>
                {item.questionsArray && (
                <>
                  {item.questionsArray[col.heading] ? (
                    <td data-type={col.type && (col.type === 'date' || col.type === 'datetime') ? col.dataType : 'string'} style={col.heading === 'Email' ? tabletdMail : tabletd}>{item.questionsArray[col.heading]}</td>
                  ) : (
                    <td data-type={col.type && (col.type === 'date' || col.type === 'datetime') ? col.dataType : 'string'} style={col.heading === 'Email' ? tabletdMail : tabletd}>{item[col.id]}</td>
                  )}
                </>
                )}
              </>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DataTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  propertyAsKey: PropTypes.string.isRequired,
};

export default DataTable;
