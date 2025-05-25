/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef } from 'react';
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
import { Radio, Skeleton, Tooltip } from 'antd';
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

import uploadPhotoBlue from '@images/uploadPhotoBlue.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import answerIcon from '@images/icons/answerChecklist.svg';
import questionIcon from '@images/icons/questionChecklist.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ModalNoPadHead from '@shared/modalNoPadHead';
import ErrorContent from '@shared/errorContent';

import {
  updateIncidentNoLoad, getIncidentDetail, resetUpdateIncidentInfo,
} from '../ctService';
import {
  integerKeyPress,
  lettersOnly,
  checkBase64Length,
  checkBase64Size,
  truncateStars, truncateFrontSlashs, getColumnArrayById,
} from '../../util/appUtils';
import Documents from '../../commonComponents/documents';
import { resetDocumentCreate, resetDeleteAttatchment } from '../../helpdesk/ticketService';
import { newpercalculate } from '../../util/staticFunctions';

const appModels = require('../../util/appModels').default;

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
    orderCheckLists, type,
  } = props;

  const limit = 5;
  const sizeLimit = 25000;

  const classes = useStyles();

  const dispatch = useDispatch();

  const editor = useRef(null);

  const [questionValues, setQuestions] = useState(orderCheckLists);
  const [isUpload, setUpload] = useState({ isValid: true, id: false });
  const [uploadDatas, setUploadData] = useState('');
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

  const { incidentDetailsInfo, hxIncidentConfig } = useSelector((state) => state.hazards);

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

  const editorConfig = {
    uploader: {
      insertImageAsBase64URI: true, // Insert images as base64 URIs
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image extensions
      imageMaxSize: 1024 * 1024, // Maximum image size in bytes (1 MB)
    },
    spellcheck: true,
    height: 250,
    minHeight: 100,
    allowResizeY: false,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,table,image,spellcheck,cut,copy,paste,undo,redo,fullsize,preview,print',
  };

  const editorConfigNoUpload = {
    spellcheck: true,
    height: 250,
    minHeight: 100,
    allowResizeY: false,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,classSpan,lineHeight,superscript,subscript,table,image,spellcheck,cut,copy,paste,undo,redo,fullsize,preview,print',
  };

  const editorReadConfig = {
    toolbar: false,
    readonly: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    height: 250,
    minHeight: 100,
  };

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;

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
    }
  }, [loadAns, isUpload]);

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
    console.log(documentCreateAttach);
    console.log(equipmentDocuments && equipmentDocuments.data ? equipmentDocuments.data.length : 0);
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
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      setTimeout(() => {
        dispatch(getIncidentDetail(inspDeata.id, appModels.EHSHAZARD));
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
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      setTimeout(() => {
        dispatch(getIncidentDetail(inspDeata.id, appModels.EHSHAZARD));
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
    setLoadAns(Math.random());
    setQuestions(questionValues);
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
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
    }, 2000);
  };

  const handleEditorChange = (data, checklist) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    if (questionValues[detailIndex].answer !== data) {
      setUploadLoading(false);
      setUploadId(false);
      if (!checkBase64Size(data, sizeLimit)) {
        setUpload({ isValid: true, id: checklist.id });
        questionValues[detailIndex].answer = data;
        questionValues[detailIndex].rich_text = data;
        setLoadAns(Math.random());
        setQuestions(questionValues);
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
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
          setUploadLoading(false);
          setUploadId(false);
        }, 1300);
      }
    }
  };

  const handleImageUpload = (data, checklist) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    if (questionValues[detailIndex].answer !== data) {
      const fSize = checkBase64Size(data, sizeLimit);
      if (fSize) {
        setUploadId(checklist.id);
        setUploadLoading(true);
        setUpload({ isValid: false, id: checklist.id });
        alert(fSize);
        setTimeout(() => {
          const datas = questionValues[detailIndex].answer;
          questionValues[detailIndex].answer = datas;
          questionValues[detailIndex].rich_text = datas;
          setQuestions(questionValues);
          setLoadAns(Math.random());
          setUpload({ isValid: false, id: false });
          setUploadLoading(false);
          setUploadId(false);
        }, 1000);
      }
    }
  };

  const handleInputChange = (event, checklist) => {
    const { value } = event.target;
    console.log(value);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer = value;
    setLoadAns(Math.random());
    setQuestions(questionValues);
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
      dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
    }, 2000);
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
      setLoadAns(Math.random());
      setQuestions(questionValues);
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
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      }, 2000);
    }
  };

  const handleCheckChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = lids.value;
      setLoadAns(Math.random());
      setQuestions(questionValues);
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
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      }, 2000);
    } else {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = '';
      setLoadAns(Math.random());
      setQuestions(questionValues);
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
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      }, 2000);
    }
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.value, answer_id: lids.id, answer_type: checklist.type,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer_id, item])).values()]);

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      setLoadAns(Math.random());
      setQuestions(questionValues);

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
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      }, 2000);
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      setLoadAns(Math.random());
      setQuestions(questionValues);

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
        dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
      }, 2000);
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
        setLoadAns(Math.random());
        setQuestions(questionValues);

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
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
        }, 2000);
      } else {
        setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));

        const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
        questionValues[detailIndex].answer = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
        setLoadAns(Math.random());
        setQuestions(questionValues);

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
          dispatch(updateIncidentNoLoad(inspDeata.id, appModels.EHSHAZARD, postData));
        }, 2000);
      }
    }
  };

  const handleInputBlur = (event, checklist) => {
    const { value } = event.target;
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer = value;
    setLoadAns(Math.random());
    setQuestions(questionValues);
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
    <Card className="h-100">
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
      <CardBody className="p-0 calendar-form-content thin-scrollbar">
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
                {item.answer && (
                  <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                )}
              </Col>
            </Row>
            <Row className="font-weight-400">
              <Col md="12" sm="9" xs="9" lg="12" className={item.type === 'boolean' || item.type === 'Rich Text' ? 'mt-0 pt-0' : 'page-actions-header content-center'}>
                <img
                  alt="answerIcon"
                  width="18"
                  height="18"
                  className="mr-2 mb-2 mt-2"
                  src={answerIcon}
                />
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
                      <>
                        {uploadId && (uploadId === item.id) && uploadLoading ? (
                          <div className="mt-3 mb-2 text-center">
                            <Skeleton active />
                          </div>
                        ) : (
                          <JoditEditor
                            key={item.id}
                            config={isUpload && !isUpload.isValid && (isUpload.id && (isUpload.id === item.id)) ? editorConfigNoUpload : editorConfig}
                            value={item.rich_text ? item.rich_text : ''}
                            onChange={(data) => handleImageUpload(data, item)}
                            onBlur={(data) => handleEditorChange(data, item)}
                          />
                        )}
                      </>
                    ) : (
                      <JoditEditor
                        ref={editor}
                        config={editorReadConfig}
                        value={item.rich_text ? item.rich_text : ''}
                      />
                    )}
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
                              className={`${isChecked(item, lid) ? 'bg-cloud-burst text-white' : 'bg-lightblue'}`}
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
                                  classes={{ root: classes.radio, checked: classes.checked }}
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
                            className={`${isMultiChecked(item, lid) ? 'bg-cloud-burst text-white' : 'bg-lightblue'}`}
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
                                classes={{ root: classes.radio, checked: classes.checked }}
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
            <hr className="mt-2 mb-2" />
          </div>
        ))}
        {questionValues && questionValues.length === 0 && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={attachmentModal}>
          <ModalHeaderComponent title={currentName} imagePath={false} closeModalWindow={() => { onCloseAttachment(); }} />
          <ModalBody className="mt-0 pt-0">
            <Documents
              viewId={currentId}
              reference={currentName}
              resModel={type === 'validate' ? 'hx.ehs_hazards_validate_checklist' : 'hx.ehs_hazards_analysis_checklist'}
              model={appModels.DOCUMENT}
              isManagable={isManagable}
            />
          </ModalBody>
        </Modal>
        <Modal size="xl" className="modal-xxl" isOpen={infoModal}>
          <ModalNoPadHead title={currentName} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setInfoModal(false)} />
          <ModalBody className="">
            <Markup content={truncateFrontSlashs(truncateStars(infoDesc))} />
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
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
