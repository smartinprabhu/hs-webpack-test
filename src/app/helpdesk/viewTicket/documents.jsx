/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as PropTypes from 'prop-types';
import { Button, Divider } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';

import imageBlack from '@images/icons/imageBlack.svg';
import documentBlack from '@images/icons/documentBlack.svg';
import { getEquipmentDocument, fileDownloads, onDocumentCreatesAttach, resetAttachementUpload, resetDeleteAttatchment, getDeleteAttatchment } from '../ticketService';
import { getTypeOfDocument, splitDocument, getCompanyTimezoneDate, getLocalTimeSeconds, generateErrorMessage } from '../../util/appUtils';
import { getImages, getDocuments } from '../utils/utils';
import { bytesToSize } from '../../util/staticFunctions';
import documentTypes from '../data/documents.json';
import Images from './images';
import Attachments from './attachments';
import ComplianceFormat from '../../buildingCompliance/complianceDetails/complianceFormat';
import { FormControl } from "@mui/material";
import { Box, IconButton, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ReactFileReader from 'react-file-reader';
import InputLabel from "@mui/material/InputLabel";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import DialogHeader from '../../commonComponents/dialogHeader';
import {
    BsFiletypeJpg,
    BsFiletypePng,
    BsFiletypeSvg,
    BsFiletypePdf,
    BsFiletypeXls,
    BsFiletypeXlsx,
    BsFiletypePpt,
    BsFiletypeDocx,
    BsCloudArrowDown,
    BsTrash3,
} from "react-icons/bs";

import MuiTooltip from "@shared/muiTooltip";
import Loader from "@shared/loading";
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ticketIconBlack from '@images/icons/ticketBlack.svg';
import { AddThemeColor } from '../../themes/theme'


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Documents = (props) => {
    const {
        viewId, ticketId, reference, ticketNumber, resModel, model, complianceFormat, isManagable, isModule, isCreateAllowed, isDownloadAllowed, isDeleteAllowed,
    } = props;

    const {
        equipmentDocuments, documentCreateAttach, downloadDocument, deleteAttatchmentInfo,
    } = useSelector((state) => state.ticket);
    const { userInfo } = useSelector((state) => state.user);
    const [accordion, setAccordian] = useState([]);
    const [icon, setIcon] = useState(faAngleDown);
    const documentTypeImageDocuments = documentTypes.filter((item) => item.head !== 'Compliance Format');
    const documentType = complianceFormat ? documentTypes : documentTypeImageDocuments;

    const dispatch = useDispatch();

    useEffect(() => {
        if (viewId) {
            dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
        }
    }, [viewId]);

    const [finishDownload, setFinishDownload] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState(false);
    const [documentsList, setDocumentsList] = useState([])
    const [modalDelete, setModalDelete] = useState(false);
    const [selectedDocName, setSelectedDocName] = useState(false);
    const [modalAlert, setModalAlert] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [imgValidation, setimgValidation] = useState(false);
    const [imgSize, setimgSize] = useState(false);
    const [filterValue, setFilterValue] = useState('')

    useEffect(() => {
        if (documentCreateAttach && (documentCreateAttach.data || documentCreateAttach.err)) {
            setOpen(true)
        }
    }, [documentCreateAttach])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        dispatch(resetAttachementUpload())
    };

    const toggleAccordion = (tab) => {
        const prevState = accordion;
        const state = prevState.map((x, index) => (tab === index ? !x : false));
        for (let i = 0; i < state.length; i += 1) {
            if (state[i] === false) {
                setIcon(faAngleDown);
            } else {
                setIcon(faAngleUp);
            }
        }
        setAccordian(state);
    };

    useEffect(() => {
        setOpen(false)
        setimgValidation(false)
        setimgSize(false)
        dispatch(resetAttachementUpload())
    }, [])

    useEffect(() => {
        if (finishDownload) {
            dispatch(fileDownloads(viewId, selectedDocId, resModel, model));
            setFinishDownload(false)
        }
    }, [finishDownload]);

    useEffect(() => {
        if ((downloadDocument && downloadDocument.data) && downloadDocument.data.length > 0) {
            documentDownload(downloadDocument.data[0].datas, downloadDocument.data[0].mimetype, downloadDocument.data[0].datas_fname);
        }
    }, [downloadDocument]);
    const InventoryAttachmentItem = (props) => {
        const { fileName, uploader, fileType, id, dateTime } = props.data;

        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                }}
            >
                <Box
                    sx={{
                        width: "50%",
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                    }}
                >
                    {getDocumentIcon(fileType)}
                    <Box>
                        <Typography
                            sx={{
                                font: "normal normal normal 20px/26px Suisse Int'l",
                                letterSpacing: "0.7px",
                                color: "#000000",
                            }}
                        >
                            {fileName}
                        </Typography>
                        <Typography
                            sx={{
                                font: "normal normal 300 20px/26px Suisse Int'l",
                                letterSpacing: "0.7px",
                                color: "#707070",
                            }}
                        >
                            Uploaded by {uploader}
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    sx={{
                        width: "10%",
                        font: "normal normal normal 20px/26px Suisse Int'l",
                        letterSpacing: "0.7px",
                        color: "#000000",
                    }}
                >
                    {fileType}
                </Typography>
                <Box
                    sx={{
                        width: "40%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        sx={{
                            font: "normal normal normal 20px/26px Suisse Int'l",
                            letterSpacing: "0.7px",
                            color: "#000000",
                        }}
                    >
                        {dateTime}{" "}
                    </Typography>
                    <MuiTooltip title={
                        <Typography>
                            Download
                        </Typography>
                    }>
                        <IconButton onClick={() => { setSelectedDocId(id); setFinishDownload(true) }}>
                            <BsCloudArrowDown size={25} />
                        </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title={
                        <Typography>
                            Delete
                        </Typography>
                    }>
                        <IconButton onClick={() => { handleDocRemove(id, fileName); }}>
                            <BsTrash3 size={25} />
                        </IconButton>
                    </MuiTooltip>
                </Box>
            </Box>
        );
    };
    function documentDownload(datas, type, filename) {
        if (selectedDocId) {
            const element = document.createElement('a');
            element.setAttribute('href', `data:${type};base64,${encodeURIComponent(datas)}`);
            element.setAttribute('download', filename);
            element.setAttribute('id', 'file');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            setSelectedDocId(false);
            document.body.removeChild(element);
        }
    }

    const getDocumentIcon = (type) => {
        switch (type) {
            case "docx":
                return <BsFiletypeDocx size={25} color="#0938e3" />;
            case "pdf":
                return <BsFiletypePdf size={25} color="#EF1515" />;
            case "xlsx":
                return <BsFiletypeXlsx size={25} color="#ba9d1a" />;
            case "jpg":
                return <BsFiletypeJpg size={25} color="#f27d25" />;
            case "jpeg":
                return <BsFiletypeJpg size={25} color="#f27d25" />;
            case "png":
                return <BsFiletypePng size={25} color="#15966F" />;
            case "svg":
                return <BsFiletypeSvg size={25} color="#b516b0" />;
            case "ppt":
                return <BsFiletypePpt size={25} color="#1dd1a4" />;
            case "xls":
                return <BsFiletypeXls size={25} color="#1dd1a4" />;
            default:
                break;
        }
    };
    const removeFile = (id) => {
        dispatch(getDeleteAttatchment(id));
    };

    const handleDocRemove = (id, name) => {
        setSelectedDocId(id);
        setSelectedDocName(name);
        setModalDelete(true);
    };

    const toggleDelete = () => {
        documentsList.splice(0, documentsList.length);
        setModalDelete(!modalDelete);
        setSelectedDocId(false);
        if (deleteAttatchmentInfo && deleteAttatchmentInfo.data) {
            dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
        }
        dispatch(resetDeleteAttatchment());
        setFilterValue('');
    };



    useEffect(() => {
        if (documentCreateAttach && documentCreateAttach.data) {
            dispatch(getEquipmentDocument(viewId, resModel, model, ticketId));
        }
    }, [documentCreateAttach]);


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
                    datas: filedata, datas_fname: photoname, name: fname, company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, res_model: resModel, res_id: viewId,
                };

                if (bytesToSize(fileSize)) {
                    dispatch(onDocumentCreatesAttach(values));
                    setOpen(false);
                } else {
                    setimgSize(true);
                }
            }
            setFilterValue('')
        }

    };

    const handleChange = (e, options) => {
        if (e.target.value === 'image' && equipmentDocuments && equipmentDocuments.data) {
            setDocumentsList(getImages(equipmentDocuments.data))
        } else if (e.target.value === 'document' && equipmentDocuments && equipmentDocuments.data) {
            setDocumentsList(getDocuments(equipmentDocuments.data))
        } else {
            setDocumentsList(equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length ? equipmentDocuments.data : [])
        }
        setFilterValue(e.target.value)
    }


    useEffect(() => {
        if (equipmentDocuments && equipmentDocuments.data && equipmentDocuments.data.length) {
            setDocumentsList(equipmentDocuments.data)
        } else if ((equipmentDocuments && equipmentDocuments.err) || (equipmentDocuments && equipmentDocuments.loading)) {
            setDocumentsList([])
        }
    }, [equipmentDocuments])

    const handleValidationClose = () => setimgValidation(false)
    const handleSizeClose = () => setimgSize(false)

    function getinitial() {
        const accordn = [];
        for (let i = 0; i < documentType.length + 1; i += 1) {
            if (i === 0) {
                accordn.push(true);
            } else {
                accordn.push(false);
            }
        }
        setAccordian(accordn);
    }
    useEffect(() => {
        getinitial();
    }, []);

    const equipmentImages = (equipmentDocuments && equipmentDocuments.data) ? getImages(equipmentDocuments.data) : [];
    const isUserError = userInfo && userInfo.err;
    const loading = (userInfo && userInfo.loading) || (equipmentDocuments && equipmentDocuments.loading);
    const userErrorMsg = generateErrorMessage(userInfo);
    const errorMsg = (equipmentDocuments && equipmentDocuments.err) ? generateErrorMessage(equipmentDocuments) : userErrorMsg;
    const greeting = `Are you sure, you want to remove, ${selectedDocName} document?`;

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    paddingTop: '10px'
                }}
            >

                <FormControl
                    sx={{
                        width: "120px",
                    }}
                    size="small"
                >
                    <InputLabel id="filter-by">Filter by</InputLabel>
                    <Select id="filter-by" label="Filter by" onChange={handleChange} value={filterValue}>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="document">Document</MenuItem>
                    </Select>
                </FormControl>

                <ReactFileReader handleFiles={handleFilesDoc} elementId="fileUpload" fileTypes="*" base64>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload
                    </Button>
                </ReactFileReader>
            </Box>
            <Divider />
            <Box
                sx={{
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <Typography
                    sx={{
                        width: "50%",
                        font: "normal normal normal 20px/26px Suisse Int'l",
                        letterSpacing: "0.7px",
                        color: "#000000",
                    }}
                >
                    File name
                </Typography>
                <Typography
                    sx={{
                        width: "10%",
                        font: "normal normal normal 20px/26px Suisse Int'l",
                        letterSpacing: "0.7px",
                        color: "#000000",
                    }}
                >
                    File type
                </Typography>
                <Typography
                    sx={{
                        width: "40%",
                        font: "normal normal normal 20px/26px Suisse Int'l",
                        letterSpacing: "0.7px",
                        color: "#000000",
                    }}
                >
                    Date & Time
                </Typography>
            </Box>
            <Divider />
            {equipmentDocuments && !equipmentDocuments.loading && documentCreateAttach && !documentCreateAttach.loading && documentsList && documentsList.length > 0 && documentsList.map((data) => (
                <InventoryAttachmentItem
                    data={{
                        fileName: splitDocument(data),
                        uploader: data.create_uid && data.create_uid.length ? data.create_uid[1] : '',
                        fileType: getTypeOfDocument(data),
                        dateTime: getCompanyTimezoneDate(data.create_date, userInfo, 'datetime'),
                        id: data.id
                    }}
                />
            ))}
            {((equipmentDocuments && equipmentDocuments.loading) || (documentCreateAttach && documentCreateAttach.loading)) && (
                <Loader />
            )}
            {/* {((equipmentDocuments && equipmentDocuments.err) || isUserError) && (
                <ErrorContent errorTxt={errorMsg} />
            )} */}
            {(documentsList && documentsList.length === 0) && equipmentDocuments && !equipmentDocuments.loading && documentCreateAttach && !documentCreateAttach.loading && (
                <ErrorContent errorTxt="No Data Found" />
            )}
            <Stack spacing={2} sx={{ width: '100%' }}>
                {(documentCreateAttach.data || documentCreateAttach.err) && (<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={documentCreateAttach.data ? "success" : "error"} sx={{ width: '100%' }}>
                        {documentCreateAttach && documentCreateAttach.data ? "Attachment Uploaded Successfully..." : documentCreateAttach.err ? generateErrorMessage(documentCreateAttach.err) : " "}
                    </Alert>
                </Snackbar>)}
                <Snackbar open={imgValidation} autoHideDuration={5000} onClose={handleValidationClose}>
                    <Alert onClose={handleValidationClose} severity={"error"} sx={{ width: '100%' }}>
                        Upload pdf,excel,word,ppt only
                    </Alert>
                </Snackbar>
                <Snackbar open={imgSize} autoHideDuration={5000} onClose={handleSizeClose}>
                    <Alert onClose={handleSizeClose} severity={"error"} sx={{ width: '100%' }}>
                        Upload files less than 20 MB
                    </Alert>
                </Snackbar>
            </Stack>

            <Dialog maxWidth={'md'} open={modalDelete} >
                <DialogHeader title={'Delete Document'}
                    onClose={() => { setModalDelete(!modalDelete) }} imagePath={ticketIconBlack} response={deleteAttatchmentInfo} />
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
                        <Button variant='contained' disabled={deleteAttatchmentInfo.loading} onClick={() => removeFile(selectedDocId)}>Remove</Button>
                    )}
                    {deleteAttatchmentInfo && deleteAttatchmentInfo.data && (
                        <Button variant='contained' onClick={() => toggleDelete()} value={filterValue}>Ok</Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* <Row>
        <Col md="12" xs="12" sm="12" lg="12">
          <div>
            {(documentType.map((documentlist, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
                key={documentlist.id}
              >
                <Card className="border-0">
                  <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
                    <Button
                      block
                      color="text-dark"
                      id={`heading${index}`}
                      className="text-left m-0 p-0 border-0 box-shadow-none"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={accordion[index]}
                      aria-controls={`collapse${index}`}
                    >
                      {index === 0
                        ? <img src={imageBlack} className="mr-2" alt="issuecategory" height="15" width="15" />
                        : <img src={documentBlack} className="mr-2" alt="issuecategory" height="15" width="15" />}
                      <span className="collapse-heading font-weight-800">
                        {documentlist.head}
                        {' '}
                      </span>
                      {accordion[index]
                        ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                        : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
                    </Button>
                  </CardHeader>

                  <Collapse
                    isOpen={accordion[index]}
                    data-parent="#accordion"
                    id={`collapse${index}`}
                    className="border-0"
                    aria-labelledby={`heading${index}`}
                  >
                    {documentlist.id === 1
                      && (
                        <Images
                          viewId={viewId}
                          ticketId={ticketId}
                          ticketNumber={ticketNumber}
                          resModel={resModel}
                          model={model}
                          isManagable={isManagable}
                        />
                      )}
                    {documentlist.id === 2
                        && (
                        <Attachments
                          viewId={viewId}
                          ticketId={ticketId}
                          ticketNumber={ticketNumber}
                          resModel={resModel}
                          model={model}
                          isManagable={isManagable}
                          additionalExtensions={additionalExtensions}
                        />
                        )}
                    {documentlist.id === 3 && complianceFormat
                        && (
                        <ComplianceFormat />
                        )}
                  </Collapse>
                </Card>
              </div>
            )))}

          </div>
        </Col>
      </Row> */}

        </>
    );
};

Documents.defaultProps = {
    ticketId: false,
};

Documents.propTypes = {
    viewId: PropTypes.number.isRequired,
    ticketId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
    ]),
    resModel: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    ticketNumber: PropTypes.string.isRequired,
    complianceFormat: PropTypes.bool.isRequired,
};

export default Documents;
