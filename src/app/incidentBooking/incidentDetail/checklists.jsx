/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useEffect, Suspense, useMemo, useState, useRef,
} from 'react';
import {
  Col,
  Row,
  Modal,
  Card,
  ModalBody,
  CardBody,
  Progress,
  Input,
} from 'reactstrap';
import { Radio, Tooltip } from 'antd';
import { Markup } from 'interweave';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Emoji } from 'emoji-mart';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import uploadPhotoBlue from '@images/uploadPhotoBlue.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import questionIcon from '@images/icons/questionChecklist.svg';
import editIcon from '@images/icons/edit.svg';

import ModalNoPadHead from '@shared/modalNoPadHead';
import ErrorContent from '@shared/errorContent';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  updateIncidentNoLoad, getIncidentDetail, resetChecklistNoLoad,
} from '../ctService';
import {
  integerKeyPress,
  lettersOnly,
  checkBase64Size,
  truncateStars, truncateFrontSlashs, getColumnArrayById,
} from '../../util/appUtils';
import Documents from '../../commonComponents/documents';
import { resetDocumentCreate, resetDeleteAttatchment } from '../../helpdesk/ticketService';
import { newpercalculate } from '../../util/staticFunctions';
import {
  getChecklistData, getChecklistUpdateData, getChecklistOtherUpdateData, getChecklistOtherUpdateErrData, getChecklistUpdateErrData, getArrayNewFormatUpdateChecklist,
} from '../utils/utils';
import EditorDialog from './editorDialog';

const appModels = require('../../util/appModels').default;

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const styles = {
  dialogWidth: {
    width: '100%',
  },
};

const useStyles = makeStyles({
  radio: {
    '&$checked': {
      color: '#fff',
    },
  },
  checked: {},
  MuiFormControlLabel: {
    label: {
      fontSize: '30px',
    },
  },

});

const CheckLists = (props) => {
  const {
    orderCheckLists, setQuestionsView, isSave, type, setSave, isCancel, setCancel,
  } = props;

  const limit = 5;
  const sizeLimit = 5000;

  const classes = useStyles();

  const dispatch = useDispatch();

  const editor = useRef([]);

  const [questionValues1, setQuestions1] = React.useState(orderCheckLists ? JSON.stringify(orderCheckLists) : {});

  const [questionValues, setQuestions] = useState(orderCheckLists);
  const [isUpload, setUpload] = useState({ isValid: true, id: false });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadId, setUploadId] = useState(false);

  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [currentId, setCurrentId] = useState(false);
  const [currentName, setCurrentName] = useState(false);

  const [loadAns, setLoadAns] = useState(false);

  const [infoModal, setInfoModal] = useState(false);
  const [infoDesc, setInfoDesc] = useState('');

  const [answerMultiValues, setMultiAnswerValues] = useState([]);

  const [currentCount, setCurrentCount] = useState(0);
  const [sizeValidation, setSizeValidation] = useState(false);

  const [editorModalQuestion, setEditorModalQuestion] = useState(false);
  const [editorModalId, setEditorModalId] = useState(false);

  const handleValidationClose = () => setSizeValidation(false);

  const {
    incidentDetailsInfo, hxIncidentConfig, updateIncidentNoInfoNo, updateIncidentNoInfo,
  } = useSelector((state) => state.hxIncident);

  const {
    documentCreateAttach,
    documentCreate,
    equipmentDocuments,
  } = useSelector((state) => state.ticket);

  const { userInfo } = useSelector((state) => state.user);

  const handleFileUpload = (file, successCallback, errorCallback) => {
    // Check if the file size exceeds the maximum allowed size
    const maxFileSize = 1024 * 1024; // 1 MB in bytes
    if (file.size > maxFileSize) {
      errorCallback('File size exceeds the maximum allowed size');
      return;
    }

    // Proceed with the upload
    // Simulate a successful upload
    const uploadedFileUrl = 'https://example.com/uploaded-file.txt';
    successCallback(uploadedFileUrl);
  };

  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;

  function getPendingQtns() {
    let res = false;
    const data = questionValues.filter((item) => item.isNew === 'yes');
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  const handleFileSelection = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Convert the image to a base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result;

        // Insert the image into the editor at the current cursor position
        console.log(uploadId);

        const detailIndex = questionValues.findIndex((obj) => (obj.id === uploadId));
        const data = `<img src="${dataURL}" height="200" width="200" alt="Uploaded Image" />&nbsp;&nbsp;${questionValues[detailIndex].answer ? questionValues[detailIndex].answer : ''}`;
        questionValues[detailIndex].answer = data;
        questionValues[detailIndex].rich_text = data;
        setLoadAns(Math.random());
        setQuestions(questionValues);

        let postData = {
          analysis_checklist_ids: [[1, uploadId, {
            answer: data,
            rich_text: data,
          }]],
        };
        if (type === 'validate') {
          postData = {
            validate_checklist_ids: [[1, uploadId, {
              answer: data,
              rich_text: data,
            }]],
          };
        }
        setTimeout(() => {
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData));
          setUploadLoading(false);
          // setUploadId(false);
        }, 300);
      };

      reader.readAsDataURL(file);
    }
  };

  const editorReadConfig = useMemo(() => ({
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,inline-popup,add-new-line',
    height: 200,
    minHeight: 100,
  }), []);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  function isValidateUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.validator_role_id && configData.validator_role_id.id && userRoleId === configData.validator_role_id.id) {
      res = true;
    }
    return res;
  }

  let isManagable = inspDeata && (inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged' || inspDeata.state === 'Work in Progress');
  if (type === 'validate') {
    isManagable = inspDeata && inspDeata.state === 'Resolved' && isValidateUser();
  }

  useEffect(() => {
    if (questionValues && questionValues.length && loadAns) {
      setQuestions(questionValues);
      setQuestionsView(questionValues);
    }
  }, [loadAns, isUpload]);

  useEffect(() => {
    if (updateIncidentNoInfo && updateIncidentNoInfo.data) {
      setQuestions(getChecklistUpdateData(questionValues));
      setQuestionsView(getChecklistUpdateData(questionValues));
    } else if (updateIncidentNoInfo && updateIncidentNoInfo.err) {
      setQuestions(getChecklistUpdateErrData(questionValues));
      setQuestionsView(getChecklistUpdateErrData(questionValues));
    }
  }, [updateIncidentNoInfo]);

  useEffect(() => {
    if (updateIncidentNoInfoNo && updateIncidentNoInfoNo.data) {
      setQuestions(getChecklistOtherUpdateData(questionValues));
      setQuestionsView(getChecklistOtherUpdateData(questionValues));
    } else if (updateIncidentNoInfoNo && updateIncidentNoInfoNo.err) {
      setQuestions(getChecklistOtherUpdateErrData(questionValues));
      setQuestionsView(getChecklistOtherUpdateErrData(questionValues));
    }
  }, [updateIncidentNoInfoNo]);

  const onOpenAttachment = (id, name, count) => {
    setCurrentId(id);
    setCurrentCount(count);
    setCurrentName(name);
    setAttachmentModal(true);
    dispatch(resetDocumentCreate());
    dispatch(resetDeleteAttatchment());
  };

  const onCloseAttachment = () => {
    setAttachmentModal(false);
    const totalCount = equipmentDocuments && equipmentDocuments.data ? equipmentDocuments.data.length : 0;
    if ((documentCreateAttach && documentCreateAttach.data) || (documentCreate && documentCreate.data)) {
      let postData = {
        analysis_checklist_ids: [[1, currentId, {
          doc_count: parseInt(totalCount) !== parseInt(currentCount) + 1 ? parseInt(totalCount) : parseInt(currentCount) + 1,
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, currentId, {
            doc_count: parseInt(totalCount) !== parseInt(currentCount) + 1 ? parseInt(totalCount) : parseInt(currentCount) + 1,
          }]],
        };
      }
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      setTimeout(() => {
        dispatch(getIncidentDetail(inspDeata.id, appModels.HXINCIDENT));
      }, 1200);
    } else if (parseInt(totalCount) !== parseInt(currentCount)) {
      let postData = {
        analysis_checklist_ids: [[1, currentId, {
          doc_count: parseInt(totalCount),
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, currentId, {
            doc_count: parseInt(totalCount),
          }]],
        };
      }
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      setTimeout(() => {
        dispatch(getIncidentDetail(inspDeata.id, appModels.HXINCIDENT));
      }, 1200);
    }
  };

  const onOpenInfo = (name, desc) => {
    setCurrentName(name);
    setInfoDesc(desc);
    setInfoModal(true);
  };

  const handleCheckboxChange = (event, checklist) => {
    const { checked, value } = event.target;
    let checkValue = 'False';
    if (checked && value === 'True') {
      checkValue = 'True';
    }
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer = checkValue;
    questionValues[detailIndex].isNew = 'yes';
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setQuestionsView(questionValues);
    let postData = {
      analysis_checklist_ids: [[1, checklist.id, {
        answer: checkValue,
      }]],
    };
    if (type === 'validate') {
      postData = {
        validate_checklist_ids: [[1, checklist.id, {
          answer: checkValue,
        }]],
      };
    }
    setTimeout(() => {
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
    }, 1000);
  };

  const scrollToFocusedDiv = (focusedDivIndex) => {
    console.log(focusedDivIndex);
    /* console.log(editor.current);
    console.log(focusedDivIndex !== null && editor.current[focusedDivIndex]);
    if (focusedDivIndex !== null && editor.current[focusedDivIndex]?.current) {
      editor.current[focusedDivIndex].current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } */
  };

  const handleEditorChange = (data, checklist) => {
    setUploadId(checklist.id);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    // const newCondent = removeDuplicatesBetweenStrings(data, questionValues[detailIndex].answer);
    if (questionValues[detailIndex].answer !== data) {
      setUploadLoading(true);
      // setUploadId(checklist.id);
      if (checkBase64Size(data, sizeLimit).isMax) {
        setUpload({ isValid: false, id: checklist.id });
        questionValues[detailIndex].answer = data;
        questionValues[detailIndex].isNew = 'yes';
        questionValues[detailIndex].rich_text = data;
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setQuestionsView(questionValues);
        let postData = {
          analysis_checklist_ids: [[1, checklist.id, {
            answer: data,
            rich_text: data,
          }]],
        };
        if (type === 'validate') {
          postData = {
            validate_checklist_ids: [[1, checklist.id, {
              answer: data,
              rich_text: data,
            }]],
          };
        }
        /* setTimeout(() => {
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData));
          setUploadLoading(false);
          // setUploadId(false);
        }, 100); */
      }
    }
  };

  const onModalEditorSave = (data, id) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === id));
    questionValues[detailIndex].answer = data;
    questionValues[detailIndex].isNew = 'no';
    questionValues[detailIndex].rich_text = data;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setQuestionsView(questionValues);

    setEditorModalId(false);
    setEditorModalQuestion(false);
  };

  const onModalEditorClose = (data, id) => {
   /* const detailIndex = questionValues.findIndex((obj) => (obj.id === id));
    questionValues[detailIndex].answer = data;
    questionValues[detailIndex].isNew = 'yes';
    questionValues[detailIndex].rich_text = data;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setQuestionsView(questionValues); */

    setEditorModalId(false);
    setEditorModalQuestion(false);
  };

  const onModalEditorOpen = (item) => {
    setEditorModalId(item.id);
    setEditorModalQuestion(item.mro_activity_id && item.mro_activity_id.name ? item.mro_activity_id.name : '');
  };

  const handleEditorChangeLeave = (checklist) => {
    setUploadId(checklist.id);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    setUploadLoading(true);
    // setUploadId(checklist.id);
    setUpload({ isValid: false, id: checklist.id });
    const data = questionValues[detailIndex].answer;
    let postData = {
      analysis_checklist_ids: [[1, checklist.id, {
        answer: data,
        rich_text: data,
      }]],
    };
    if (type === 'validate') {
      postData = {
        validate_checklist_ids: [[1, checklist.id, {
          answer: data,
          rich_text: data,
        }]],
      };
    }
    setTimeout(() => {
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData));
      setUploadLoading(false);
      // setUploadId(false);
    }, 2000);
  };

  const handleImageUpload = (data, checklist) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    setUploadId(checklist.id);
    /* if (questionValues[detailIndex].answer !== data) {
      if (!checkBase64Size(data, sizeLimit).isMax) {
        setUploadId(checklist.id);
        setUploadLoading(true);
        setUpload({ isValid: false, id: checklist.id });
        setSizeValidation(true);
        questionValues[detailIndex].answer = data;
        questionValues[detailIndex].isNew = 'yes';
        questionValues[detailIndex].rich_text = data;
        setQuestions(questionValues);
        setQuestionsView(questionValues);
        console.log(questionValues);
        console.log(data);
        setLoadAns(Math.random());
        /* setTimeout(() => {
          const datas = questionValues[detailIndex].answer;
          questionValues[detailIndex].answer = data;
          questionValues[detailIndex].rich_text = data;
          setQuestions(questionValues);
          setLoadAns(Math.random());
          setUpload({ isValid: false, id: false });
          setUploadLoading(false);
          setUploadId(false);
        }, 1000); */
    // } */
    // }
  };

  const handleInputChange = (event, checklist) => {
    const { value } = event.target;
    console.log(value);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer = value;
    questionValues[detailIndex].isNew = 'yes';
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setQuestionsView(questionValues);
    let postData = {
      analysis_checklist_ids: [[1, checklist.id, {
        answer: value,
      }]],
    };
    if (type === 'validate') {
      postData = {
        validate_checklist_ids: [[1, checklist.id, {
          answer: value,
        }]],
      };
    }
    setTimeout(() => {
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
    }, 1000);
    if (!value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.constr_mandatory) {
      setValidationMessage(checklist.mro_activity_id.constr_error_msg);
      setErrorId(checklist.id);
    } else {
      setValidationMessage('');
      setErrorId(false);
    }
  };

  const handleCheckIconChange = (checklist, lids) => {
    if (isManagable) {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = lids.value;
      questionValues[detailIndex].isNew = 'yes';
      setLoadAns(Math.random());
      setQuestions(questionValues);
      setQuestionsView(questionValues);
      let postData = {
        analysis_checklist_ids: [[1, checklist.id, {
          answer: lids.value,
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, checklist.id, {
            answer: lids.value,
          }]],
        };
      }
      setTimeout(() => {
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      }, 1000);
    }
  };

  const onSaveChecklists = () => {
    const unSavedqtns = questionValues.filter((item) => item.isNew === 'yes');
    let postData = {
      analysis_checklist_ids: getArrayNewFormatUpdateChecklist(getChecklistData(unSavedqtns)),
    };
    if (type === 'validate') {
      postData = {
        validate_checklist_ids: getArrayNewFormatUpdateChecklist(getChecklistData(unSavedqtns)),
      };
    }
    dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData));
    setSave(false);
    setCancel(false);
  };

  useEffect(() => {
    if (isSave && getPendingQtns()) {
      onSaveChecklists();
    }
  }, [isSave]);

  const onChecklistsCancel = () => {
    setQuestions(JSON.parse(questionValues1));
    setQuestionsView(JSON.parse(questionValues1));
    setSave(false);
    setCancel(false);
  };

  useEffect(() => {
    if (isCancel && getPendingQtns()) {
      onChecklistsCancel();
    }
  }, [isCancel]);

  const onChecklistsDone = () => {
    dispatch(resetChecklistNoLoad());
  };

  const handleCheckChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = lids.value;
      questionValues[detailIndex].isNew = 'yes';
      setLoadAns(Math.random());
      setQuestions(questionValues);
      setQuestionsView(questionValues);
      let postData = {
        analysis_checklist_ids: [[1, checklist.id, {
          answer: lids.value,
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, checklist.id, {
            answer: lids.value,
          }]],
        };
      }
      setTimeout(() => {
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      }, 1000);
    } else {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = '';
      questionValues[detailIndex].isNew = 'yes';
      setLoadAns(Math.random());
      setQuestions(questionValues);
      setQuestionsView(questionValues);
      let postData = {
        analysis_checklist_ids: [[1, checklist.id, {
          answer: '',
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, checklist.id, {
            answer: '',
          }]],
        };
      }
      setTimeout(() => {
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      }, 1000);
    }
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.value, answer_id: lids.id, answer_type: checklist.type,
      }];
      const arr1 = [...answerMultiValues, ...data];
      const arr3 = questionValues.filter((item) => (item.type === 'multiple_choice' && item.id === checklist.id));
      const arr4 = arr3 && arr3.length ? arr3[0].mro_activity_id.labels_ids.filter((item) => (arr3[0].answer && arr3[0].answer.toString().includes(item.value))) : [];
      const arr2 = arr4 && arr4.length ? arr4.map((cl) => ({
        question_id: arr3[0].id,
        answer: cl.value,
        answer_id: cl.id,
        answer_type: arr3[0].type,
      })) : [];
      console.log(arr2);
      const arr = [...arr1, ...arr2];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer_id, item])).values()]);

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      questionValues[detailIndex].isNew = 'yes';
      setLoadAns(Math.random());
      setQuestions(questionValues);
      setQuestionsView(questionValues);

      let postData = {
        analysis_checklist_ids: [[1, checklist.id, {
          answer: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, checklist.id, {
            answer: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
          }]],
        };
      }
      setTimeout(() => {
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      }, 1000);
    } else {
      const arr3 = questionValues.filter((item) => (item.type === 'multiple_choice' && item.id === checklist.id));
      const arr4 = arr3 && arr3.length ? arr3[0].mro_activity_id.labels_ids.filter((item) => (arr3[0].answer && arr3[0].answer.toString().includes(item.value))) : [];
      const arr2 = arr4 && arr4.length ? arr4.map((cl) => ({
        question_id: arr3[0].id,
        answer: cl.value,
        answer_id: cl.id,
        answer_type: arr3[0].type,
      })) : [];
      const arr1 = [...answerMultiValues, ...arr2];
      const arr = [...new Map(arr1.map((item) => [item.answer_id, item])).values()];
      setMultiAnswerValues(arr.filter((item) => (item.answer_id !== lids.id)));

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = getColumnArrayById(arr.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      questionValues[detailIndex].isNew = 'yes';
      setLoadAns(Math.random());
      setQuestions(questionValues);
      setQuestionsView(questionValues);

      let postData = {
        analysis_checklist_ids: [[1, checklist.id, {
          answer: getColumnArrayById(arr.filter((item) => (item.answer_id !== lids.id)), 'answer').toString(),
        }]],
      };
      if (type === 'validate') {
        postData = {
          validate_checklist_ids: [[1, checklist.id, {
            answer: getColumnArrayById(arr.filter((item) => (item.answer_id !== lids.id)), 'answer').toString(),
          }]],
        };
      }
      setTimeout(() => {
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
      }, 1000);
    }
  };

  const handleCheckMultiIconChange = (checklist, lids) => {
    if (isManagable) {
      const isData = answerMultiValues.filter((item) => (item.answer_id === lids.id));

      const isIconChecked = isData && isData.length;

      if (!isIconChecked) {
        const data = [{
          question_id: checklist.id, answer: lids.value, answer_id: lids.id, answer_type: checklist.type,
        }];
        const arr = [...answerMultiValues, ...data];
        setMultiAnswerValues([...new Map(arr.map((item) => [item.answer_id, item])).values()]);

        const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
        questionValues[detailIndex].answer = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
        questionValues[detailIndex].isNew = 'yes';
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setQuestionsView(questionValues);

        let postData = {
          analysis_checklist_ids: [[1, checklist.id, {
            answer: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
          }]],
        };
        if (type === 'validate') {
          postData = {
            validate_checklist_ids: [[1, checklist.id, {
              answer: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
            }]],
          };
        }
        setTimeout(() => {
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
        }, 1000);
      } else {
        setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));

        const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
        questionValues[detailIndex].answer = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
        questionValues[detailIndex].isNew = 'yes';
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setQuestionsView(questionValues);

        let postData = {
          analysis_checklist_ids: [[1, checklist.id, {
            answer: getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString(),
          }]],
        };
        if (type === 'validate') {
          postData = {
            validate_checklist_ids: [[1, checklist.id, {
              answer: getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString(),
            }]],
          };
        }
        setTimeout(() => {
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.HXINCIDENT, postData, 'yes'));
        }, 1000);
      }
    }
  };

  const handleInputBlur = (event, checklist) => {
    const { value } = event.target;
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer = value;
    questionValues[detailIndex].isNew = 'yes';
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setQuestionsView(questionValues);
    if (value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.validation_required) {
      if ((checklist.type === 'textbox' && checklist.mro_activity_id.validation_length_min && value.length < checklist.mro_activity_id.validation_length_min)
        || (checklist.type === 'textbox' && checklist.mro_activity_id.validation_length_max && value.length > checklist.mro_activity_id.validation_length_max)
        || (checklist.type === 'numerical_box' && checklist.mro_activity_id.validation_min_float_value && (parseInt(value) < parseInt(checklist.mro_activity_id.validation_min_float_value)))
        || (checklist.type === 'numerical_box' && checklist.mro_activity_id.validation_max_float_value
          && (parseInt(value) > parseInt(checklist.mro_activity_id.validation_max_float_value)))) {
        setValidationMessage(checklist.mro_activity_id.validation_error_msg);
        setErrorId(checklist.id);
      } else {
        setValidationMessage('');
        setErrorId(false);
      }
    }

    if (!value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.constr_mandatory) {
      setValidationMessage(checklist.mro_activity_id.constr_error_msg);
      setErrorId(checklist.id);
    }
  };

  const getInputType = (type) => {
    let inputType = 'text';
    if (type === 'date') {
      inputType = 'date';
    }
    if (type === 'free_text') {
      inputType = 'textarea';
    }
    if (type === 'boolean') {
      inputType = 'checkbox';
    }
    return inputType;
  };

  const getmaxLength = (type, qtn) => {
    let maxlength = 50;
    if (type === 'textbox' && qtn && qtn.validation_required && qtn.validation_length_max) {
      maxlength = qtn.validation_length_max;
    } else if (type === 'numerical_box' && qtn && qtn.validation_required && qtn.validation_max_float_value) {
      maxlength = qtn.validation_max_float_value;
    } else if (type === 'numerical_box' && qtn && !qtn.validation_required && !qtn.validation_max_float_value) {
      maxlength = 7;
    }
    return maxlength;
  };

  const getAnswer = (checklist) => {
    const { answer } = checklist;

    return answer;
  };

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };

  function isChecked(checklist, lids) {
    let res = false;
    const isData = questionValues.filter((item) => (item.id === checklist.id && item.answer === lids.value));
    if (isData && isData.length) {
      res = true;
    }
    return res;
  }

  function isMultiChecked(checklist, lids) {
    let res1 = false;
    const isData = answerMultiValues.filter((item) => (item.answer_id === lids.id));
    const mcQtns = questionValues.filter((item) => (item.type === 'multiple_choice' && item.id === checklist.id && item.answer && item.answer.toString().includes(lids.value)));
    if (isData && isData.length) {
      res1 = true;
    } else if (mcQtns && mcQtns.length) {
      res1 = true;
    }

    return res1;
  }

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  const totalQtns = questionValues && questionValues.length ? questionValues.length : 0;
  const ansQtns = totalQtns ? questionValues.filter((item) => item.answer) : false;
  const percentage = newpercalculate(totalQtns, ansQtns && ansQtns.length ? ansQtns.length : 0);

  return (
    <>
      <Card className="border-0">
        <Row>
          <Col md="9" sm="12" xs="12" lg="9">
            <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">
              {type === 'validate' ? 'VALIDATION' : 'RCFA'}
              {' '}
              CHECKLISTS
            </p>
          </Col>
          <Col md="3" sm="12" xs="12" lg="3" className="mb-1 mt-2">
            <p className="mb-0 mr-3">
              <Progress value={percentage} color={getProgressColor(percentage)}>
                {percentage}
                {' '}
                %
              </Progress>
            </p>
          </Col>
        </Row>
        <hr className="mb-0 mt-0 mr-2 ml-2" />
        <CardBody className="p-0">
          {questionValues && questionValues.length > 0 && sortSections(questionValues).map((item, index) => (
            <div key={item.id} className="bg-white p-3">
              <Row className="font-weight-600">
                <Col md="10" sm="6" xs="6" lg="10">
                  <img
                    alt="questionIcon"
                    width="18"
                    height="18"
                    className="mr-2 mb-2 mt-2"
                    src={questionIcon}
                  />
                  {item.mro_activity_id && item.mro_activity_id.name ? item.mro_activity_id.name : ''}

                  {item.is_attachment_requried && (item.doc_count > 0 || isManagable) && (
                    <Tooltip title={item.doc_count > 0 ? 'View Attachments' : 'Upload Attachments'}>
                      <span className="text-info cursor-pointer" aria-hidden onClick={() => onOpenAttachment(item.id, item.mro_activity_id.name, item.doc_count)}>
                        <img
                          aria-hidden
                          alt="uploadPhotoBlue"
                          className="ml-2 mr-1"
                          height="14"
                          width="14"
                          src={uploadPhotoBlue}
                        />
                        {item.doc_count > 0 && (
                          <>
                            (
                            {item.doc_count}
                            )
                          </>
                        )}
                      </span>
                    </Tooltip>
                  )}
                  { /* item.type === 'Rich Text' && (
                  <Tooltip title="Info">
                    <span className="text-info cursor-pointer">
                      <FontAwesomeIcon onClick={() => onOpenInfo(item.mro_activity_id.name, item.rich_text)} className="ml-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                ) */}
                </Col>
                <Col md="2" sm="3" xs="3" lg="2" className="text-right">
                  {isManagable && item.type === 'Rich Text' && (
                  <Tooltip title="Edit">
                    <img src={editIcon} aria-hidden="true" className="mr-2 cursor-pointer" alt="addequipment" height="15" width="15" onClick={() => onModalEditorOpen(item)} />
                  </Tooltip>
                  )}
                  {item.answer && (
                    <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                  )}
                </Col>
              </Row>
              <Row className="font-weight-400">
                <Col md="12" sm="9" xs="9" lg="12" className={item.type === 'boolean' || item.type === 'Rich Text' ? 'mt-0 pt-0' : 'page-actions-header content-center'}>
                  { /* <img
                    alt="answerIcon"
                    width="18"
                    height="18"
                    className="mr-2 mb-2 mt-2"
                    src={answerIcon}
                  /> */}
                  {item.type === 'boolean' && (
                    <Radio.Group onChange={(e) => handleCheckboxChange(e, item)} defaultValue={getAnswer(item)} disabled={!isManagable} buttonStyle="solid">
                      <Radio.Button value="True">Yes</Radio.Button>
                      <Radio.Button value="False">
                        No
                      </Radio.Button>
                    </Radio.Group>
                  )}
                  {item.type === 'Rich Text' && (
                    <>

                      {isManagable ? (
                        <div>

                          <Suspense fallback={<p>Loading...</p>}>
                            <JoditEditor
                              ref={editor.current[index]}
                              config={editorReadConfig}
                              value={item.rich_text ? item.rich_text : ''}
                            />
                          </Suspense>
                          {editorModalId === item.id && (
                            <EditorDialog
                              currentId={editorModalId}
                              questionName={editorModalQuestion}
                              type={type}
                              editorContent={item.rich_text ? item.rich_text : ''}
                              incidentId={inspDeata.id}
                              onSave={onModalEditorSave}
                              onClose={onModalEditorClose}
                            />
                          )}

                        </div>
                      ) : (
                        <JoditEditor
                          ref={editor.current[index]}
                          config={editorReadConfig}
                          value={item.rich_text ? item.rich_text : ''}
                        />
                      )}
                      <Stack spacing={2} sx={{ width: '100%' }}>

                        <Snackbar open={sizeValidation} autoHideDuration={2000} onClose={handleValidationClose}>
                          <Alert onClose={handleValidationClose} severity="error" sx={{ width: '100%' }}>
                            File size exceeds the maximum allowed size of 5MB
                          </Alert>
                        </Snackbar>

                      </Stack>
                    </>
                  )}
                  {item.type !== 'Rich Text' && item.type !== 'simple_choice' && item.type !== 'multiple_choice' && item.type !== 'boolean' && (
                    <>
                      <Input
                        type={getInputType(item.type)}
                        className="m-0 position-relative"
                        name="answerValue"
                        disabled={!isManagable}
                        maxLength={getmaxLength(item.type, item.mro_activity_id)}
                        required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                        onKeyPress={item.type === 'numerical_box' ? integerKeyPress : lettersOnly}
                        value={item.answer ? item.answer : ''}
                        onBlur={(e) => (handleInputChange(e, item))}
                        onChange={(e) => handleInputBlur(e, item)}
                      />

                      {errorId && errorId === item.id && validationMessage && (
                        <p className="text-danger mt-1 mb-0">{validationMessage}</p>
                      )}
                    </>
                  )}
                  {item.type === 'simple_choice' && (
                    <>
                      {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                        (lid.favicon || lid.emoji) && (
                          <Col
                            md="3"
                            sm="6"
                            lg="3"
                            xs="6"
                            key={lid.id}
                            className="text-center cursor-pointer"
                            onClick={() => handleCheckIconChange(item, lid)}
                          >

                            <div
                              style={isChecked(item, lid) ? { border: `2px solid ${lid.color}` } : {}}
                              className={`${isChecked(item, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                            >
                              {lid.favicon && (
                                <>
                                  <FontAwesomeIcon
                                    icon={lid.favicon}
                                    style={isChecked(item, lid) ? { color: lid.color } : {}}
                                    className="fa-2x"
                                    size="lg"
                                  />
                                  <p
                                    style={isChecked(item, lid) ? { color: lid.color } : {}}
                                    className="mt-2 mb-0 text-capital word-break-content"
                                  >
                                    {lid.value}
                                  </p>
                                </>
                              )}
                              {lid.emoji && (
                                <>
                                  <p
                                    style={isChecked(item, lid) ? { color: lid.color } : {}}
                                    className="mb-0 fa-2x "
                                  >
                                    {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                  </p>
                                  <p
                                    style={isChecked(item, lid) ? { color: lid.color } : {}}
                                    className="mt-2 mb-0 text-capital word-break-content"
                                  >
                                    {lid.value}
                                  </p>
                                </>
                              )}
                            </div>
                          </Col>
                        )))}
                      {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                        <>
                          {!lid.favicon && !lid.emoji && (
                            <Col
                              md="3"
                              sm="6"
                              lg="3"
                              xs="6"
                              key={lid.id}
                              className="text-center cursor-pointer"
                            >
                              <FormControlLabel
                                key={lid.id}
                                className={`${isChecked(item, lid) ? 'bg-cloud-burst ' : 'bg-lightblue'}`}
                                checked={isChecked(item, lid)}
                                name={item.mro_activity_id.name}
                                value={lid.value}
                                control={(
                                  <Radio
                                    size="small"
                                    disabled={!isManagable}
                                    required={item.mro_activity_id.constr_mandatory}
                                    onChange={(e) => handleCheckChange(e, item, lid)}
                                    color="default"
                                    classes={{ root: classes.radio }}
                                  />
                                )}
                                label={lid.value}
                              />
                            </Col>
                          )}
                        </>
                      ))}
                      {errorId && errorId === item.id && validationMessage && (
                        <p className="text-danger mt-3 mb-0">{validationMessage}</p>
                      )}
                    </>
                  )}
                  {item.type === 'multiple_choice' && (
                    <>

                      {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                        (lid.favicon || lid.emoji) && (
                          <Col
                            md="3"
                            sm="6"
                            lg="3"
                            xs="6"
                            key={lid.id}
                            className="cursor-pointer"
                            onClick={() => handleCheckMultiIconChange(item, lid)}
                          >

                            <div
                              style={isMultiChecked(item, lid) ? { border: `2px solid ${lid.color}` } : {}}
                              className={`${isMultiChecked(item, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                            >
                              {lid.favicon && (
                                <>
                                  <FontAwesomeIcon
                                    icon={lid.favicon}
                                    className="fa-2x"
                                    style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                    size="lg"
                                  />
                                  <p
                                    style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                    className="mt-2 mb-0 text-capital word-break-content"
                                  >
                                    {lid.value}
                                  </p>
                                </>
                              )}
                              {lid.emoji && (
                                <>
                                  <p
                                    style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                    className="fa-2x mb-0"
                                  >
                                    {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                  </p>
                                  <p
                                    style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                    className="mt-2 mb-0 text-capital word-break-content"
                                  >
                                    {lid.value}
                                  </p>
                                </>
                              )}
                            </div>
                          </Col>
                        )))}
                      {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                        <>
                          {!lid.favicon && !lid.emoji && (
                            <Col
                              md="3"
                              sm="6"
                              lg="3"
                              xs="6"
                              key={lid.id}
                            >
                              <FormControlLabel
                                key={lid.id}
                                className={`${isMultiChecked(item, lid) ? 'bg-cloud-burst' : 'bg-lightblue'}`}
                                name={lid.value}
                                value={lid.value}
                                control={(
                                  <Checkbox
                                    size="small"
                                    disabled={!isManagable}
                                    defaultChecked={isMultiChecked(item, lid)}
                                    required={item.mro_activity_id.constr_mandatory}
                                    onChange={(e) => handleCheckMultiChange(e, item, lid)}
                                    color="default"
                                    classes={{ root: classes.radio }}
                                  />
                                )}
                                label={lid.value}
                              />
                            </Col>
                          )}
                        </>
                      ))}
                    </>
                  )}
                </Col>
              </Row>

            </div>
          ))}
          { /* updateIncidentNoInfo && updateIncidentNoInfo.data && (
            <div className="text-center mt-3">
              <SuccessAndErrorFormat response={updateIncidentNoInfo} successMessage="The Checklists are saved successfully." />
            </div>
          ) */ }
          {questionValues && questionValues.length === 0 && (
            <ErrorContent errorTxt="No Data Found" />
          )}
          { /* updateIncidentNoInfo && updateIncidentNoInfo.err && (
            <div className="text-center mt-3">
              <SuccessAndErrorFormat response={updateIncidentNoInfo} />
            </div>
          )}
          {updateIncidentNoInfo && updateIncidentNoInfo.loading && (
          <div className="text-center mt-3">
            <Loader />
          </div>
          ) */}
          <Modal size="xl" className="modal-xxl" isOpen={infoModal}>
            <ModalNoPadHead title={currentName} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setInfoModal(false)} />
            <ModalBody className="">
              <Markup content={truncateFrontSlashs(truncateStars(infoDesc))} />
            </ModalBody>
          </Modal>
        </CardBody>
        {/*  <hr />
        <Row>
          <Col md="4" sm="12" xs="12" lg="4" />
          <Col md="8" sm="12" xs="12" lg="8" className="pull-right">
            {getPendingQtns() && updateIncidentNoInfo && !updateIncidentNoInfo.data && (
              <>
                <Button
                  disabled={!(questionValues && questionValues.length > 0) || (updateIncidentNoInfo && updateIncidentNoInfo.loading)}
                  type="submit"
                  variant="contained"
                  className="float-right submit-btn-lg mr-2"
                  onClick={() => onSaveChecklists()}
                >
                  {type === 'validate' ? 'Save Validation Checklist' : 'Save RCFA Checklist'}
                </Button>
                <Button
                  disabled={!(questionValues && questionValues.length > 0) || (updateIncidentNoInfo && updateIncidentNoInfo.loading)}
                  type="submit"
                  variant="contained"
                  className="reset-btn float-right mr-2"
                  onClick={() => onChecklistsCancel()}
                >
                  Cancel
                </Button>
              </>
            )}
            {updateIncidentNoInfo && updateIncidentNoInfo.data && (
            <Button
              disabled={!(questionValues && questionValues.length > 0) || (updateIncidentNoInfo && updateIncidentNoInfo.loading)}
              type="submit"
              variant="contained"
              className="float-right mr-2"
              onClick={() => onChecklistsDone()}
            >
              Ok
            </Button>
            )}
          </Col>
            </Row> */ }
      </Card>
      <Dialog className="dialog-width-800" sx={{ paddingTop: '10px' }} maxWidth="xl" open={attachmentModal} style={styles.dialogWidth}>
        <DialogHeader title={currentName} onClose={() => { onCloseAttachment(); }} disableClose={(equipmentDocuments && equipmentDocuments.loading) || (documentCreateAttach && documentCreateAttach.loading)} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {currentId && (
              <Documents
                viewId={currentId}
                ticketNumber={currentName}
                resModel={type === 'validate' ? 'hx.incident_validate_checklist' : 'hx.incident_analysis_checklist'}
                model={appModels.DOCUMENT}
                isManagable={isManagable}
              />
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

CheckLists.propTypes = {
  orderCheckLists: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default CheckLists;
