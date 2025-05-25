import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Divider, FormControl, Box, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ReactFileReader from 'react-file-reader';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeSvg,
  BsFiletypePdf,
  BsFiletypeXlsx,
  BsFiletypeXls,
  BsFiletypePpt,
  BsFiletypeDocx,
  BsCloudArrowDown,
  BsTrash3,
  BsFillEyeFill,
} from 'react-icons/bs';
import axios from 'axios';

import MuiTooltip from '@shared/muiTooltip';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ticketIconBlack from '@images/icons/ticketBlack.svg';

import DialogHeader from './dialogHeader';

import {
  getEquipmentDocument, fileDownloads, onDocumentCreatesAttach, resetAttachementUpload, resetDeleteAttatchment, getDeleteAttatchment,
} from '../helpdesk/ticketService';
import {
  getTypeOfDocument, getExtensionFromMimeType, splitDocument, getCompanyTimezoneDate, getLocalTimeSeconds, generateErrorMessageDetail,
} from '../util/appUtils';
import { getImages, getDocuments } from '../helpdesk/utils/utils';
import { bytesToSize } from '../util/staticFunctions';
import URLImages from './urlImages';
import URLPdf from './urlPdf';
// import URLExcel from './urlExcel';
import AuthService from '../util/authService';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const Documents = (props) => {
  const dispatch = useDispatch();
  const {
    equipmentDocuments, documentCreateAttach, downloadDocument, deleteAttatchmentInfo,
  } = useSelector((state) => state.ticket);
  const {
    viewId, ticketId, reference, resModel, model, appModuleName, isCreateAllowed, isDownloadAllowed, isDeleteAllowed,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  const [finishDownload, setFinishDownload] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedDocName, setSelectedDocName] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [downloadLoading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [finishView, setFinishView] = useState(false);
  const accessRightsCheckModule = ['bcs.compliance.obligation'];

  const authService = AuthService();

  useEffect(() => {
    if (documentCreateAttach && (documentCreateAttach.data || documentCreateAttach.err)) {
      setOpen(true);
    }
  }, [documentCreateAttach]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(resetAttachementUpload());
  };

  useEffect(() => {
    setOpen(false);
    setimgValidation(false);
    setimgSize(false);
    dispatch(resetAttachementUpload());
  }, []);

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'docx':
        return <BsFiletypeDocx size={25} color="#0938e3" />;
      case 'pdf':
        return <BsFiletypePdf size={25} color="#EF1515" />;
      case 'xlsx':
        return <BsFiletypeXlsx size={25} color="#ba9d1a" />;
      case 'jpg':
        return <BsFiletypeJpg size={25} color="#f27d25" />;
      case 'jpeg':
        return <BsFiletypeJpg size={25} color="#f27d25" />;
      case 'png':
        return <BsFiletypePng size={25} color="#15966F" />;
      case 'svg':
        return <BsFiletypeSvg size={25} color="#b516b0" />;
      case 'ppt':
        return <BsFiletypePpt size={25} color="#1dd1a4" />;
      case 'xls':
        return <BsFiletypeXls size={25} color="#1dd1a4" />;
      default:
        break;
    }
  };

  const imageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  const docusTypes = ['xlsx', 'ppt', 'xls', 'docx'];
  const pdfTypes = ['pdf'];
  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';
  const pdfViewerApiLink = 'http://docs.google.com/viewer';

  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const mimeTypesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

  const getPreview = (previewVisible) => {
    let previewFile = '';
    if (imageTypes.includes(previewVisible?.data?.mimetype) && responseData && responseData !== null) {
      if (previewVisible && previewVisible.data && previewVisible.data.type === 'binary') {
        previewFile = <img src={`data:${previewVisible?.data?.mimetype};base64,${responseData?.datas}`} height="100%" width="100%" />;
      } else {
        previewFile = <URLImages isActive={previewVisible?.model} type={previewVisible?.data?.mimetype} id={previewVisible?.data?.id} name={previewVisible?.data?.datas_fname} />;
      }
    } else if (responseData && responseData !== null) {
      if (docusTypes.includes(getTypeOfDocument(responseData))) {
        const apiUrl = window.localStorage.getItem('api-url');
        const Url = `/web/content/${responseData.id}/${responseData.datas_fname}`;
        const filepath = `${apiUrl}${Url}`;
        previewFile = <iframe src={`${officeViewerApiLink}?src=${filepath}`} width="100%" title={responseData.datas_fname} height="565px"> </iframe>;
      // previewFile = <URLExcel isExcel isActive={previewVisible?.model} type={previewVisible?.data?.mimetype} id={previewVisible?.data?.id} name={previewVisible?.data?.datas_fname} />;
        // previewFile = <iframe src={filepath} width="100%" title={responseData.datas_fname} height="565px" > </iframe>;
      } else if (pdfTypes.includes(getTypeOfDocument(responseData))) {
        const apiUrl = window.localStorage.getItem('api-url');
        const Url = `/web/content/${responseData.id}/${responseData.datas_fname}`;
        const filepath = `${apiUrl}${Url}`;
        // previewFile = <iframe src={filepath} width="100%" title={responseData.datas_fname} height="565px"> </iframe>;
        previewFile = <URLPdf base64={responseData.datas} sourceType={previewVisible?.data?.type} isActive={previewVisible?.model} type={previewVisible?.data?.mimetype} id={previewVisible?.data?.id} name={previewVisible?.data?.datas_fname} />;
      }
    }
    return previewFile;
  };

  const handleDocRemove = (id, name) => {
    setSelectedDocId(id);
    setSelectedDocName(name);
    setModalDelete(true);
  };

  const TicketAttachmentItem = (props) => {
    const {
      fileName, uploader, fileType, id, dateTime, data,
    } = props.data;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            wordBreak: 'break-word',
          }}
        >
          <div>
            {getDocumentIcon(fileType)}
          </div>
          <Box>
            <Typography
              sx={{
                font: "normal normal normal 20px/26px Suisse Int'l",
                letterSpacing: '0.7px',
                color: '#000000',
              }}
            >
              {fileName}
            </Typography>
            <Typography
              sx={{
                font: "normal normal 300 20px/26px Suisse Int'l",
                letterSpacing: '0.7px',
                color: '#707070',
              }}
            >
              Uploaded by
              {' '}
              {uploader}
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            width: '10%',
            font: "normal normal normal 20px/26px Suisse Int'l",
            letterSpacing: '0.7px',
            color: '#000000',
          }}
        >
          {fileType}
        </Typography>
        <Box
          sx={{
            width: '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              font: "normal normal normal 20px/26px Suisse Int'l",
              letterSpacing: '0.7px',
              color: '#000000',
              width: '30%',
            }}
          >
            {dateTime}
            {' '}
          </Typography>
          {/* {(mimeTypesAllowed.includes(data.mimetype) || docusTypes.includes(fileType) || pdfTypes.includes(fileType)) && ( */}
          {(mimeTypesAllowed.includes(data.mimetype) || pdfTypes.includes(fileType)) && (
            <MuiTooltip title={(
              <Typography>
                View
              </Typography>
            )}
            >
              <IconButton sx={{ width: '20%' }} onClick={() => { setSelectedViewId(id); setFinishView(true); setPreviewVisible({ model: true, data, fileName }); }}>
                <BsFillEyeFill size={25} />
              </IconButton>
            </MuiTooltip>
          )}
          {(docusTypes.includes(fileType)) && (

          <IconButton sx={{ width: '20%', visibility: 'hidden' }} onClick={() => { setSelectedViewId(id); setFinishView(true); setPreviewVisible({ model: true, data, fileName }); }}>
            <BsFillEyeFill size={25} />
          </IconButton>
          )}

          {(accessRightsCheckModule.includes(appModuleName))
            ? isDownloadAllowed
              ? (
                <MuiTooltip title={(
                  <Typography>
                    Download
                  </Typography>
                )}
                >
                  {data.type === 'binary' ? (
                    <IconButton sx={{ width: '20%', marginLeft: '0px' }} onClick={() => { setSelectedDocId(id); setFinishDownload(true); }}>
                      <BsCloudArrowDown size={25} />
                    </IconButton>
                  ) : (
                    <IconButton sx={{ width: '20%', marginLeft: '0px' }} onClick={() => fetchImage(data.id, data.datas_fname, data.mimetype)}>
                      <BsCloudArrowDown size={25} />
                    </IconButton>
                  )}

                </MuiTooltip>
              )
              : ''
            : (
              <MuiTooltip title={(
                <Typography>
                  Download
                </Typography>
              )}
              >
                {data.type === 'binary' ? (
                  <IconButton sx={{ width: '20%', marginLeft: '0px' }} onClick={() => { setSelectedDocId(id); setFinishDownload(true); }}>
                    <BsCloudArrowDown size={25} />
                  </IconButton>
                ) : (
                  <IconButton sx={{ width: '20%', marginLeft: '0px' }} onClick={() => fetchImage(data.id, data.datas_fname, data.mimetype)}>
                    <BsCloudArrowDown size={25} />
                  </IconButton>
                )}

              </MuiTooltip>
            )}

          {(accessRightsCheckModule.includes(appModuleName))
            ? isDeleteAllowed
              ? (
                <MuiTooltip title={(
                  <Typography>
                    Delete
                  </Typography>
                )}
                >
                  <IconButton sx={{ width: '20%' }} onClick={() => { handleDocRemove(id, fileName); }}>
                    <BsTrash3 size={25} />
                  </IconButton>
                </MuiTooltip>
              ) : '' : (
                <MuiTooltip title={(
                  <Typography>
                    Delete
                  </Typography>
          )}
                >
                  <IconButton sx={{ width: '20%' }} onClick={() => { handleDocRemove(id, fileName); }}>
                    <BsTrash3 size={25} />
                  </IconButton>
                </MuiTooltip>
            ) }

        </Box>
      </Box>
    );
  };

  function documentDownload(datas, type, filename) {
    if (selectedDocId) {
      let fName = filename;
      if (!filename.includes('.')) {
        const extension = getExtensionFromMimeType(type);
        fName += `.${extension}`;
      }
      const element = document.createElement('a');
      element.setAttribute('href', `data:${type};base64,${encodeURIComponent(datas)}`);
      element.setAttribute('download', fName);
      element.setAttribute('id', 'file');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      setSelectedDocId(false);
      document.body.removeChild(element);
    }
  }

  const toggleDelete = () => {
    documentsList.splice(0, documentsList.length);
    setModalDelete(!modalDelete);
    setSelectedDocId(false);
    if (deleteAttatchmentInfo && deleteAttatchmentInfo.data) {
      dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
    }
    dispatch(resetDeleteAttatchment());
  };

  const onLoadRequest = (eid, ename) => { };

  const toggleAlert = () => {
    setModalAlert(!modalAlert);
    document.getElementById('fileUploadsv1').value = null;
    setFinish(false);
  };

  const removeFile = (id) => {
    dispatch(getDeleteAttatchment(id));
  };

  useEffect(() => {
    if (viewId) {
      dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
    }
  }, [viewId]);

  useEffect(() => {
    if (finishDownload) {
      dispatch(fileDownloads(viewId, selectedDocId, resModel, model));
      setFinishDownload(false);
    }
  }, [finishDownload]);

  useEffect(() => {
    if (finishView) {
      dispatch(fileDownloads(viewId, selectedViewId, resModel, model));
      setFinishView(false);
    }
  }, [finishView]);

  useEffect(() => {
    if ((downloadDocument && downloadDocument.data) && downloadDocument.data.length > 0) {
      setResponseData(downloadDocument.data[0]);
      documentDownload(downloadDocument.data[0].datas, downloadDocument.data[0].mimetype, downloadDocument.data[0].datas_fname);
    }
  }, [downloadDocument]);

  const handleChange = (e, options) => {
    if (e.target.value === 'image' && equipmentDocuments && equipmentDocuments.data) {
      setDocumentsList(getImages(equipmentDocuments.data));
    } else if (e.target.value === 'document' && equipmentDocuments && equipmentDocuments.data) {
      setDocumentsList(getDocuments(equipmentDocuments.data));
    } else {
      setDocumentsList(equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length ? equipmentDocuments.data : []);
    }
    setFilterValue(e.target.value);
  };

  useEffect(() => {
    if (equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length) {
      setDocumentsList(equipmentDocuments.data);
    } else {
      setDocumentsList([]);
    }
  }, [equipmentDocuments]);

  const handleValidationClose = () => setimgValidation(false);
  const handleSizeClose = () => setimgSize(false);

  useEffect(() => {
    if (documentCreateAttach && documentCreateAttach.data) {
      setTimeout(() => {
        dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
      }, 1500);
    }
  }, [documentCreateAttach]);

  function documentDownloadLink(link, filename, type) {
    if (link) {
      let fName = filename;
      if (!filename.includes('.')) {
        const extension = getExtensionFromMimeType(type);
        fName += `.${extension}`;
      }
      const element = document.createElement('a');
      element.setAttribute('href', link);
      element.setAttribute('download', fName);
      element.setAttribute('id', 'file');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      setSelectedDocId(false);
      document.body.removeChild(element);
    }
  }

  const fetchImage = async (id, name, type) => {
    const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
    try {
      setLoading(true);
      const response = await axios.get(`${WEBAPPAPIURL}showImage`, {
        params: {
          imageUrl: `/web/content/${id}/${name}`,
        },
        headers: {
          endpoint: window.localStorage.getItem('api-url'),
          // Token: authService.getAccessToken(),
        },
        withCredentials: true,
        responseType: 'arraybuffer',
      });

      let blob = new Blob([response.data]);
      if (type === 'image/svg+xml') {
        blob = new Blob([response.data], { type: 'image/svg+xml' });
      }
      const objectURL = URL.createObjectURL(blob);
      setLoading(false);
      documentDownloadLink(objectURL, name, type);
      setFinishDownload(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching image:', error);
    }
  };

  const handleFilesDoc = (files) => {
    if (files !== undefined) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(pdf|xlsx|xls|ppt|docx|jpg|jpeg|svg|png)$/i)) {
        setimgValidation(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        const fname = `${getLocalTimeSeconds(new Date())}-${reference}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        const values = {
          datas: filedata, mimetype: files.fileList[0].type, datas_fname: photoname, name: fname, company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, res_model: resModel, res_id: viewId,
        };
        if (bytesToSize(fileSize)) {
          dispatch(onDocumentCreatesAttach(values));
          setOpen(false);
        } else {
          setimgSize(true);
        }
      }
      setFilterValue('');
    }
  };

  const equipmentImages = (equipmentDocuments && equipmentDocuments.data) ? getImages(equipmentDocuments.data) : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (equipmentDocuments && equipmentDocuments.loading);
  const userErrorMsg = generateErrorMessageDetail(userInfo);
  const errorMsg = (equipmentDocuments && equipmentDocuments.err) ? generateErrorMessageDetail(equipmentDocuments) : userErrorMsg;
  const greeting = `Are you sure, you want to remove, ${selectedDocName} document?`;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '15px',
          marginTop: '10px',
        }}
      >
        <FormControl
          sx={{
            width: '120px',
          }}
          size="small"
        >
          <InputLabel id="filter-by">Filter by</InputLabel>
          <Select id="filter-by" label="Filter by" onChange={handleChange} value={filterValue}>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="document">Document</MenuItem>
          </Select>
        </FormControl>
        {(accessRightsCheckModule.includes(appModuleName))
          ? isCreateAllowed
            ? (
              <ReactFileReader handleFiles={handleFilesDoc} elementId="fileHsCommonUpload" fileTypes="*" base64>
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload
                </Button>
              </ReactFileReader>
            ) : '' : (
              <ReactFileReader handleFiles={handleFilesDoc} elementId="fileHsCommonUpload" fileTypes="*" base64>
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload
                </Button>
              </ReactFileReader>
          )}
      </Box>
      <Divider />
      <Box
        sx={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <Typography
          sx={{
            width: '50%',
            font: "normal normal normal 20px/26px Suisse Int'l",
            letterSpacing: '0.7px',
            color: '#000000',
          }}
        >
          File name
        </Typography>
        <Typography
          sx={{
            width: '10%',
            font: "normal normal normal 20px/26px Suisse Int'l",
            letterSpacing: '0.7px',
            color: '#000000',
          }}
        >
          File type
        </Typography>
        <Typography
          sx={{
            width: '30%',
            font: "normal normal normal 20px/26px Suisse Int'l",
            letterSpacing: '0.7px',
            color: '#000000',
          }}
        >
          Date & Time
        </Typography>
      </Box>
      <Divider />
      {equipmentDocuments && !equipmentDocuments.loading && documentsList && documentsList.length > 0 && documentsList.map((data, index) => (
        <TicketAttachmentItem
          data={{
            fileName: splitDocument(data),
            uploader: data.create_uid && data.create_uid.length ? data.create_uid[1] : '',
            fileType: getTypeOfDocument(data),
            dateTime: getCompanyTimezoneDate(data.create_date, userInfo, 'datetime'),
            id: data.id,
            data,
          }}
        />
      ))}
      <Dialog size="lg" fullWidth={!!(documentCreateAttach && !documentCreateAttach.loading && !imageTypes.includes(responseData?.mimetype))} open={isPreviewVisible?.model}>
        <DialogHeader title={isPreviewVisible?.fileName} imagePath={false} onClose={() => { setPreviewVisible(false); }} />
        <DialogContent>
          {(downloadDocument && !downloadDocument.loading) && getPreview(isPreviewVisible)}
          {(downloadDocument && downloadDocument.loading) && (
            <Loader />
          )}
        </DialogContent>
      </Dialog>
      {((equipmentDocuments && equipmentDocuments.loading) || (documentCreateAttach && documentCreateAttach.loading)) && (
        <Loader />
      )}
      {!(equipmentDocuments && equipmentDocuments.loading) && ((equipmentDocuments && equipmentDocuments.err) || isUserError || (equipmentDocuments && equipmentDocuments.data && documentsList && documentsList.length === 0)) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
      {(equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length === 0) && (equipmentImages.length === 0) && (
        <ErrorContent errorTxt="No Data Found" />
      )}
      <Stack spacing={2} sx={{ width: '100%' }}>
        {(documentCreateAttach.data || documentCreateAttach.err) && (
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={documentCreateAttach.data ? 'success' : 'error'} sx={{ width: '100%' }}>
              {documentCreateAttach && documentCreateAttach.data ? 'Attachment Uploaded Successfully...' : documentCreateAttach.err ? generateErrorMessageDetail(documentCreateAttach.err) : ' '}
            </Alert>
          </Snackbar>
        )}
        <Snackbar open={imgValidation} autoHideDuration={5000} onClose={handleValidationClose}>
          <Alert onClose={handleValidationClose} severity="error" sx={{ width: '100%' }}>
            Upload pdf,excel,word,ppt only
          </Alert>
        </Snackbar>
        <Snackbar open={imgSize} autoHideDuration={5000} onClose={handleSizeClose}>
          <Alert onClose={handleSizeClose} severity="error" sx={{ width: '100%' }}>
            Upload files less than 20 MB
          </Alert>
        </Snackbar>
      </Stack>
      <Dialog maxWidth="md" open={modalDelete}>
        <DialogHeader
          title="Delete Document"
          onClose={() => { setModalDelete(!modalDelete); }}
          imagePath={ticketIconBlack}
          response={deleteAttatchmentInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && !deleteAttatchmentInfo.loading && !deleteAttatchmentInfo.err && (
              <span>
                Are you sure, you want to remove
                {'  '}
                {selectedDocName}
                {'  '}
                document?
              </span>
            )}
            {deleteAttatchmentInfo && deleteAttatchmentInfo.loading && (
              <Loader />
            )}
            {deleteAttatchmentInfo && deleteAttatchmentInfo.err && (
              <SuccessAndErrorFormat response={deleteAttatchmentInfo} />
            )}
            {(deleteAttatchmentInfo && deleteAttatchmentInfo.data) && (
              <SuccessAndErrorFormat
                response={deleteAttatchmentInfo}
                successMessage="Document removed successfully..."
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && (
            <Button variant="contained" disabled={deleteAttatchmentInfo.loading} onClick={() => removeFile(selectedDocId)}>Remove</Button>
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.data && (
            <Button variant="contained" onClick={() => toggleDelete()}>Ok</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Documents;
