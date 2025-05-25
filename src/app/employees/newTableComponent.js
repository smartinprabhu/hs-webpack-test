/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/prefer-default-export */
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  Inject,
  Page,
  Sort,
  ExcelExport,
  PdfExport,
  Toolbar,
  Selection,
  Search,
  Edit,
} from '@syncfusion/ej2-react-grids';
import React, { memo, useEffect, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { PropTypes } from 'prop-types';
// import Loader from '@shared/loading';
// import ErrorContent from '@shared/errorContent';
import {
  CardBody,
} from 'reactstrap';
import COLUMNS from './DataExport/columns';
import { ColumnFilter } from './ColumnFilter';
import '@app/employees/employees.scss';
import tableData from './tableFields.json';
import noData1 from '@images/noData1.png';
import noData2 from '@images/noData2.png';
import noData3 from '@images/noData3.png';


const NewTableComponent = (props) => {
  const {
    employeesInfo, isUserError, loading, errorMsg, setViewId, showFilter, neighbourSpacesInfo, info, setInfo
  } = props;
  const newArray = [];

  if (employeesInfo && employeesInfo.data) {
    employeesInfo.data.map((item) => (
      newArray.push(item)
    ));
  }
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => (employeesInfo.data ? employeesInfo.data : [{}]), [employeesInfo.data]);
  const defaultColumn = useMemo(() => ({
    Filter: ColumnFilter,
  }), []);

  NewTableComponent.propTypes = {
    loading: PropTypes.bool,
    errorMsg: PropTypes.string,
    setViewId: PropTypes.func,
    isUserError: PropTypes.bool,
    employeesInfo: PropTypes.object,
  };

  const {
    page,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination,
  );
  // sync fusion code:
  const pageSettings = { pageSize: 10, pageCount: 1, pageSizes: ['All', '10', '20', '30'] };
  const rowSelected = (args) => {
    showFilter(false);
    const selRecord = args.data;
    setViewId(selRecord.id);
  };
  const FilterOptions = {
   columns: [], mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 500, operators: {},
  };

  const created = () => {
document.querySelector("#value").
addEventListener("keypress",function(e){
  if (e.which === 32 &&  e.target.selectionStart === 0) {
    e.preventDefault();
    return false;
    }  
     else{
      document.querySelector("#id_filterBarcell").addEventListener("keypress",function(e){
         var code = (e.which) ? e.which : e.keyCode;
    if ( e.which ===  32 && e.target.selectionStart === 0 && (code < 33 && code > 47 ) ||  (code < 48 || code > 57)) {
        e.preventDefault();
        return true;
    }
      })
    }
  })
  }

  // useEffect(() => {
  //   const element = document.getElementsByClassName("e-table e-sortfilter");
  //   ReactDOM.findDOMNode(element).className = "e-table col-md-12 e-sortfilter"
  // }, []);
    
  const actionFailure = () => {
    const data=document.getElementById('appendError')
    if(employeesInfo && employeesInfo.err && !data){
      const divElement=document.createElement('div')
      divElement.id='appendError'
      let noDataImageOne = document.createElement("img")
      noDataImageOne.classList.add('noDataImageOne');
      noDataImageOne.src=noData1
      let noDataImageTwo = document.createElement("img");
      noDataImageTwo.classList.add('noDataImageTwo');
      noDataImageTwo.src=noData2
      let noDataImageThree = document.createElement("img");
      noDataImageThree.classList.add('noDataImageThree');
      noDataImageThree.src=noData3
      divElement.appendChild(noDataImageOne)
      divElement.appendChild(noDataImageTwo)
      divElement.appendChild(noDataImageThree)
      document.querySelector('.e-gridcontent').append(divElement);
      const emptyrow = document.querySelector('.e-emptyrow').remove();

    } 
    if(employeesInfo && (employeesInfo.data||employeesInfo.loading) && data && data.parentNode){
      data.parentNode.removeChild(data);
    }
         if(employeesInfo.loading){
            document.querySelector('.e-gridcontent').append()
         }
  };
    
  useEffect(() => {
    const data=document.getElementById('appendError')
    if(employeesInfo && employeesInfo.data && data){
    data.parentNode.removeChild(data);
  }
}, [employeesInfo])


 return (
    <div className="table-responsive">
        <div className="employeGrid">
          <GridComponent
            id='value'
            dataSource={employeesInfo && employeesInfo.data}
            height="100%"
            width="100%"
            hideScroll
            rowHeight={50}
            allowPaging={true}
            pageSettings={pageSettings}
            allowSorting={true}
            allowFiltering={true}
            gridLines="None"
            allowPdfExport={true}
            allowExcelExport={true}
            created={created}
            enableHover={false}
            pageSize={page}
            rowSelected={rowSelected}
            filterSettings={FilterOptions}
            dataBound={actionFailure}
          >
            <ColumnsDirective>
            {tableData.tableColumnDirective.map((data) =>
            (
              <ColumnDirective
                field={data.field}
                headerText={data.headerText}
                width={data.width}
                textAlign={data.textAlign}
                filter={{ operator: 'Contains' }}
              />
            ))}
            </ColumnsDirective>
            <Inject
              services={[
                Page,
                Sort,
                Filter,
                ExcelExport,
                PdfExport,
                Toolbar,
                Selection,
                Search,
                Edit,
              ]}
            />
          </GridComponent>
        </div>
      {/* {loading && (
      <div className="mb-2 mt-3 p-5 text-center" data-testid="loading-case">
        <Loader />
      </div>
      )} */}
      {/* {((employeesInfo && employeesInfo.err) || (isUserError)) && (
      <CardBody>
        <ErrorContent errorTxt={errorMsg} />
      </CardBody>
      )} */}
    </div>
  );
};

export default memo(NewTableComponent);
