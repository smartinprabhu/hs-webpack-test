/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
// import ReactFileReader from 'react-file-reader';
import {
  FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ExcelRenderer } from 'react-excel-renderer';
import {
  Button, DialogActions,
} from '@mui/material';
import { ReactGrid, Column, TextCell } from '@silevis/reactgrid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '@silevis/reactgrid/styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faFile,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import fileMini from '@images/icons/fileMini.svg';

import {
  getDefaultNoValue,
  getTableScrollHeight,
} from '../util/appUtils';
import { bytesToSize } from '../util/staticFunctions';
import { createImportId, uploadImport, resetUploadImport } from '../assets/equipmentService';
import ErrorGroupMessages from '../assets/assetDetails/errorGroupMessages';
import { AddThemeColor } from '../themes/theme';

const appModels = require('../util/appModels').default;
const appConfig = require('../config/appConfig').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const GridBulkUpload = (props) => {
  const {
    bulkUploadModal, atFinish, targetModel, modalTitle, modalMsg, testFields, uploadFields, sampleTamplate, labels,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modal, setModal] = useState(bulkUploadModal);
  const [moveNext, setMoveNext] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileName, setFileName] = useState(false);
  const [uploadInfo, setUploadInfo] = useState({});
  const [fileObjectData, setFileData] = useState(false);
  const [isMainCalled, setMainCalled] = useState(false);
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const contextMenuRef = useRef(null);

  const fileInput = React.createRef();

  const { userInfo } = useSelector((state) => state.user);
  const { bulkImportInitiateInfo, bulkUploadInfo } = useSelector((state) => state.equipment);

  const loading = ((uploadInfo && uploadInfo.loading) || (bulkUploadInfo && bulkUploadInfo.loading));

  const MessagesList = bulkUploadInfo && bulkUploadInfo.data && bulkUploadInfo.data.messages && bulkUploadInfo.data.messages.length ? bulkUploadInfo.data.messages : false;
  const errorMessages = MessagesList ? MessagesList.filter((item) => item.type === 'error') : false;
  const isError = errorMessages && errorMessages.length;
  const isFilesUploaded = bulkUploadInfo && bulkUploadInfo.data && (!isError && isMainCalled);
  const Messages = !isMainCalled && isError ? errorMessages : false;

  function getQueryInArrays(array) {
    let result = false;
    if (array && array.length) {
      result = array.reduce((h, obj) => Object.assign(h, { [obj.field]: (h[obj.field] || []).concat(obj) }), {});
    }
    return result;
  }

  const isFieldMessages = !!(Messages && Messages.length && Messages.filter((item) => item.field) && Messages.filter((item) => item.field).length);

  const groupErrorFields = Messages ? getQueryInArrays(Messages) : false;
  const groupMessages = groupErrorFields ? Object.values(groupErrorFields) : false;

  const commonError = !isFieldMessages && isError && Messages && Messages.length && Messages[0].message ? Messages[0].message : false;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(resetUploadImport());
    }
  }, []);

  useEffect(() => {
    if (labels) {
      // Convert columns to ReactGrid format
      const columnsFill = labels.map((col, index) => ({
        columnId: `col${index + 1}`,
        width: 200,
        resizable: true,
        title: col,
      }));
      setColumns(columnsFill);
    }
  }, [labels]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const payload = {
        model: appModels.BASEIMPORT,
        args: [{ res_model: targetModel }],
        values: { res_model: targetModel },
      };
      dispatch(createImportId(appModels.BASEIMPORT, payload));
    }
  }, []);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const handleUploadData = () => {
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: testFields,
        ids: `[${bulkImportInitiateInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
    }
  };

  const handleUploadDataOrg = () => {
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      const payload = {
        model: appModels.BASEIMPORT,
        method: 'do',
        args: uploadFields,
        ids: `[${bulkImportInitiateInfo.data[0]}]`,
      };
      dispatch(uploadImport(payload));
      setMainCalled(true);
    }
  };

  const handleFileUpload = () => {
    setMoveNext(true);
    if (bulkImportInitiateInfo && bulkImportInitiateInfo.data && bulkImportInitiateInfo.data.length) {
      setUploadInfo({ loading: true, data: null, err: null });
      const data = {
        import_id: bulkImportInitiateInfo.data[0], file: fileObjectData,
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}base_import/set_file_api`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          endpoint: window.localStorage.getItem('api-url'),
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          setUploadInfo({ loading: false, data: response.data.status, err: null });
          handleUploadData();
        })
        .catch((error) => {
          setUploadInfo({ loading: false, data: null, err: error });
          handleUploadData();
        });
    }
  };

  const handleUploadReset = () => {
    setMoveNext(false);
    setimgValidation(false);
    setimgSize(false);
    setFileData(false);
    setFileName(false);
    dispatch(resetUploadImport());
    setModal(!modal);
    setMainCalled(false);
    atFinish();
  };

  const handleBack = () => {
    setMoveNext(false);
    setMainCalled(false);
    dispatch(resetUploadImport());
  };

  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const onFileSet = (e) => {
    e.target.value = null;
  };

  const renderFile = (fileObj) => {
    // just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        const rowData = resp.rows.slice(1).filter((item) => item && item.length); // Skip first row
        const headerRow = {
          rowId: 'header',
          cells: labels.map((label) => ({
            type: 'header',
            text: label,
          })),
        };

        const rowsFill = rowData.map((row, rowIndex) => ({
          rowId: `row${rowIndex + 1}`,
          cells: labels.map((col, colIndex) => ({
            columnId: `col${colIndex + 1}`, // Ensure columnId matches column definition
            type: 'text',
            text: row[colIndex] !== undefined && row[colIndex] !== null ? String(row[colIndex]) : '',
          })),
        }));

        setRows([headerRow, ...rowsFill]);
      }
    });
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      const fileObj = event.target.files[0];
      const { name } = event.target.files[0];
      setFileName(name);
      renderFile(fileObj);
      setimgValidation(false);
      setimgSize(false);
      if (name && !name.match(/.(csv|xls|xlsx)$/i)) {
        setimgValidation(true);
      } else if (!bytesToSize(event.target.files[0].size)) {
        setimgSize(true);
      } else {
        setFileData(fileObj);
        setFileName(name);
      }
    }
  };

  const labelsLength = labels && labels.length ? labels.length : 0;

  const getRowData = (item) => {
    const tableTd = [];
    if (labelsLength && item) {
      for (let i = 0; i < labelsLength; i += 1) {
        tableTd.push(
          <td className="p-2 font-weight-400">{getDefaultNoValue(item[i])}</td>,
        );
      }
    }
    return tableTd;
  };

  const getRow = (assetData) => {
    const tableTr = [];
    if (assetData.length && assetData.length >= 1) {
      for (let i = 1; i < assetData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            {getRowData(assetData[i])}
          </tr>,
        );
      }
    }
    return tableTr;
  };

  // Function to update the grid when a cell is edited
  const handleChanges = (changes) => {
    setRows((prevRows) => prevRows.map((row) => {
      const updatedCells = row.cells.map((cell, colIndex) => {
        const change = changes.find((c) => c.rowId === row.rowId && c.columnId === `col${colIndex + 1}`);
        return change ? { ...cell, text: change.newCell.text } : cell;
      });
      return { ...row, cells: updatedCells };
    }));
  };

  // Function to export the updated grid data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(rows.map((row) => row.cells.map((cell) => cell.text)));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Create a Blob and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(fileData, 'Editable_ReactGrid.xlsx');
  };

  console.log(rows);
  console.log(columns);

  // Handle Fill Handle (Autofill)
  const handleFillHandle = (target, sources) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      sources.forEach(({ rowId, columnId }) => {
        const sourceRowIndex = updatedRows.findIndex((r) => r.rowId === rowId);
        const targetRowIndex = updatedRows.findIndex(
          (r) => r.rowId === target.rowId,
        );
        const columnIdx = updatedRows[sourceRowIndex].cells.findIndex(
          (c) => c.columnId === columnId,
        );

        if (sourceRowIndex >= 0 && targetRowIndex >= 0) {
          updatedRows[targetRowIndex].cells[columnIdx] = {
            ...updatedRows[sourceRowIndex].cells[columnIdx],
          };
        }
      });
      return updatedRows;
    });
  };

  const handleColumnResize = (ci, width) => {
    setColumns((prevColumns) => prevColumns.map((col) => (col.columnId === ci ? { ...col, width } : col)));
  };

  // Context Menu Handlers
  const handleContextMenu = (e, cell) => {
    e.preventDefault();
    setSelectedCell(cell);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleContextMenuClick = (action) => {
    if (action === 'copy' && selectedCell) {
      navigator.clipboard.writeText(selectedCell.text);
    }
    setContextMenu(null);
  };

  const tableHeight = getTableScrollHeight(30, 400, rows && rows.length > 0 ? rows.length : 1);

  const gridContainerStyle = {
    height: `${tableHeight}px`,
    overflow: 'auto', // Enables scrolling
  };

  return (
    <>
      <Card className="border-0 pr-3 pl-3">
        {!moveNext
          ? (
            <>
              <Row>
                <Stack sx={{ width: '100%' }} className="mb-4">

                  <Alert severity="info">
                    <AlertTitle>Upload</AlertTitle>
                    1.Upload the Excel file with data that is less than 20 MB and validate it.
                    <br />
                    2.To find the appropriate upload data format, click on the download template and verify it.
                  </Alert>

                </Stack>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <FormControl className={classes.margin}>
                    {!fileObjectData && (
                      <div aria-hidden="true" onClick={openFileBrowser.bind(this)} className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                        <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                        <p className="font-weight-500 mb-0 font-family-tab">Select a Excel file</p>
                        <p className="font-weight-500 font-family-tab">(Upload files less than 20 MB)</p>
                        <input type="file" accept=".csv,.xls,.xlsx" ref={fileInput} hidden onChange={fileHandler} onClick={(event) => onFileSet(event)} />
                      </div>
                    )}
                    {fileObjectData && (
                      <div className="position-relative text-center">
                        <img
                          src={fileMini}
                          height="150"
                          width="150"
                          className="ml-3"
                          alt="uploaded"
                        />
                        <p>{fileName}</p>
                        <div className="position-absolute topright-img-close">
                          <img
                            aria-hidden="true"
                            src={closeCircleIcon}
                            className="cursor-pointer"
                            onClick={() => {
                              setimgValidation(false);
                              setimgSize(false);
                              setFileData(false);
                              setFileName(false);
                            }}
                            alt="remove"
                          />
                        </div>
                      </div>
                    )}
                  </FormControl>
                  {imgValidation && (<FormHelperText><span className="text-danger font-family-tab">Choose Excel Only...</span></FormHelperText>)}
                  {imgSize && (<FormHelperText><span className="text-danger font-family-tab">Upload files less than 20 MB</span></FormHelperText>)}
                </Col>

              </Row>
              <Row className="pl-3">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Button
                    type="button"
                    size="sm"
                    variant="contained"
                  >
                    <FontAwesomeIcon
                      color="primary"
                      className="mr-2"
                      icon={faQuestion}
                    />
                    Help
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="ticket-btn float-right"
                    variant="outlined"
                    sx={{
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                    }}
                  >
                    <a href={sampleTamplate} style={AddThemeColor({})} target="_blank" rel="noreferrer" download={sampleTamplate}>
                      <FontAwesomeIcon
                        color="primary"
                        className="mr-2"
                        icon={faFile}
                      />
                      Download Template
                    </a>
                  </Button>
                </Col>
              </Row>
            </>
          ) : ''}
        {moveNext && fileObjectData && (
        <>
          {!loading && (
          <Stack sx={{ width: '100%' }} className="mb-4">

            <Alert severity={isError || (bulkUploadInfo && bulkUploadInfo.err) ? 'error' : 'success'}>
              <AlertTitle>Validation</AlertTitle>
              {!(isError || (bulkUploadInfo && bulkUploadInfo.err)) && (
              <>
                1.The Uploaded excel file has been validated successfully.
                <br />
                2.The data has no issues it&rsquo;s ready to upload and create records.
                <br />
                3.No of Records:
                {' '}
                {rows.length}
              </>
              )}
              {(isError || (bulkUploadInfo && bulkUploadInfo.err)) && (
              <>
                1.The Uploaded excel file has been validated successfully.
                <br />
                2.The data has some issues listed below. Please try to clear those issues to upload and create records.
              </>
              )}
            </Alert>

          </Stack>
          )}
          {loading && (
          <div className="text-center mt-3">
            <Loader />
          </div>
          )}
          {bulkUploadInfo && bulkUploadInfo.err && (
          <SuccessAndErrorFormat response={bulkUploadInfo} />
          )}
          {isFieldMessages && isError && Messages && (
          <ErrorGroupMessages data={groupMessages || []} />
          )}
          {commonError && (
          <div className="p-2">
            <p className="text-danger">
              <FontAwesomeIcon
                color="danger"
                className="mr-2"
                icon={faInfoCircle}
              />
              <span className="text-danger font-family-tab">
                {commonError}
              </span>
            </p>
          </div>
          )}
          {!isFilesUploaded && !loading && (
          <div className="p-2">
            <div className="text-right">
              <Button
                type="button"
                variant="contained"
                size="sm"
                onClick={exportToExcel}
                sx={{ marginBottom: '10px' }}
              >
                Export to Excel
              </Button>
            </div>
            <div style={gridContainerStyle}>
              <ReactGrid
                rows={rows}
                stickyTopRows={1}
                stickyLeftColumns={1}
                columns={columns}
                onColumnResized={handleColumnResize}
                enableRangeSelection
                enableFillHandle
                onFillHandle={handleFillHandle}
                onCellsChanged={handleChanges}
                onCellContextMenu={handleContextMenu}
              />
            </div>
            {contextMenu && (
            <ul
              ref={contextMenuRef}
              style={{
                position: 'absolute',
                top: contextMenu.y,
                left: contextMenu.x,
                background: '#fff',
                border: '1px solid #ccc',
                listStyle: 'none',
                padding: '5px',
                zIndex: 1000,
              }}
            >
              <li onClick={() => handleContextMenuClick('copy')}>📋 Copy</li>
              <li onClick={() => handleContextMenuClick('paste')}>📋 Paste</li>
              <li onClick={() => handleContextMenuClick('delete')}>🗑 Delete</li>
            </ul>
            )}
          </div>
          )}

          {(isFilesUploaded) && (
          <SuccessAndErrorFormat
            response={bulkUploadInfo}
            successMessage={modalMsg}
          />
          )}
        </>
        )}
      </Card>

      <DialogActions className="mr-3 ml-3">
        {!moveNext
          ? (
            <Button
              type="button"
              variant="contained"
              size="sm"
              disabled={!fileObjectData}
              className="float-right"
              onClick={() => handleFileUpload()}
            >
              Validate
            </Button>
          )
          : (
            <>
              {!isFilesUploaded && (
                <>
                  <Button
                    type="button"
                    variant="contained"
                    size="sm"
                    className="float-right"
                    onClick={() => handleBack()}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    size="sm"
                    disabled={loading || isError || (bulkUploadInfo && bulkUploadInfo.err)}
                    className="float-right"
                    onClick={() => handleUploadDataOrg()}
                  >
                    Upload
                  </Button>
                </>
              )}
              {isFilesUploaded && (
                <Button
                  type="button"
                  variant="contained"
                  size="sm"
                  className="float-right"
                  onClick={() => handleUploadReset()}
                >
                  Ok
                </Button>
              )}
            </>
          )}
      </DialogActions>
    </>
  );
};

GridBulkUpload.propTypes = {
  bulkUploadModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  targetModel: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalTitle: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  testFields: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  uploadFields: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  sampleTamplate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  labels: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};
export default GridBulkUpload;
