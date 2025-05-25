/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import JoditEditor from 'jodit-react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
} from '@mui/material';

import {
  checkBase64Size,
  truncateHTMLTags,
} from '../../util/appUtils';
import {
  updateIncidentNoLoad,
} from '../ctService';
import DialogHeader from '../../commonComponents/dialogHeader';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const appModels = require('../../util/appModels').default;

const EditorDialog = React.memo((props) => {
  const {
    editorContent, currentId, questionName, type, onClose, onSave, incidentId,
  } = props;
  const dispatch = useDispatch();
  const [newContent, setNewContent] = useState(editorContent);
  let editor = useRef(null);

  const [sizeValidation, setSizeValidation] = useState(false);
  const [lengthValidation, setLengthValidation] = useState(false);

  let jEditor;

  const editorConfig = useMemo(() => ({
    uploader: {
      insertImageAsBase64URI: true, // Insert images as base64 URIs
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif'], // Allowed image extensions
      imageMaxSize: 1024 * 1024, // Maximum image size in bytes (1 MB)
    },
    spellcheck: true,
    height: 350,
    minHeight: 200,
    autofocus: true,
    allowResizeY: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,add-new-line',
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: 'eraser,ul,ol,image,table,link,undo,redo,fullsize',
    events:
           {
             afterInit: (instance) => { editor = instance; },
           },
  }), []);

  useEffect(() => {
    if (editor && editor.current) {
      editor.current.events.on('ready', () => {
        console.log('Editor is ready');
      });
    }
  }, []);

  const handleValidationClose = () => setSizeValidation(false);
  const handleValidationClose1 = () => setLengthValidation(false);

  const insertImage = (url) => {
    if (editor && editor.current && editor.current.editor) {
      const jodit = editor.current.editor;

      // Insert the image at the current cursor position
      jodit.selection.insertHTML(`<img src="${url}" alt="Uploaded Image" />`);
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result;

        // Insert the image into the editor at the current cursor position
        insertImage(dataURL);
      };

      reader.readAsDataURL(file);
    }
  };

  const sizeLimit = 5000;

  const { updateIncidentNoInfo } = useSelector((state) => state.hxIncident);

  const handleEditorChange = (data) => {
    if (newContent !== data) {
      if (checkBase64Size(data, sizeLimit).isMax && checkBase64Size(data, sizeLimit).isImage <= 5) {
        setSizeValidation(false);
        setLengthValidation(false);
        setNewContent(data);
      } else if (!checkBase64Size(data, sizeLimit).isMax) {
        setSizeValidation(true);
        setNewContent(newContent);
      } else if (!(checkBase64Size(data, sizeLimit).isImage <= 5)) {
        setLengthValidation(true);
        setNewContent(newContent);
      }
    }
  };

  const handleEditorOnChange = (data) => {
    if (newContent !== data) {
      if (checkBase64Size(data, sizeLimit).isMax && checkBase64Size(data, sizeLimit).isImage <= 5) {
        setSizeValidation(false);
        setLengthValidation(false);
        setNewContent(data);
      } else if (!checkBase64Size(data, sizeLimit).isMax) {
        setSizeValidation(true);
        // setNewContent(newContent);
      } else if (!(checkBase64Size(data, sizeLimit).isImage <= 5)) {
        setLengthValidation(true);
        // setNewContent(newContent);
      }
    }
  };

  const onContentSave = () => {
    let postData = {
      analysis_checklist_ids: [[1, currentId, {
        answer: newContent, rich_text: newContent,
      }]],
    };
    if (type === 'validate') {
      postData = {
        validate_checklist_ids: [[1, currentId, {
          answer: newContent, rich_text: newContent,
        }]],
      };
    }
    dispatch(updateIncidentNoLoad(incidentId, appModels.HXINCIDENT, postData));
    onSave(newContent, currentId);
  };

  const loading = (updateIncidentNoInfo && updateIncidentNoInfo.loading);

  console.log(newContent);

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="xl"
      fullWidth
      open
    >
      <DialogHeader fontAwesomeIcon={faCheckCircle} title={questionName} onClose={() => onClose(newContent, currentId)} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <JoditEditor
              ref={editor}
              tabIndex={1}
              config={editorConfig}
              value={editorContent || ''}
              onChange={(data) => handleEditorOnChange(data)}
              onBlur={(data) => handleEditorChange(data)}
            />
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar open={sizeValidation}>
                <Alert severity="error" sx={{ width: '100%' }}>
                  Files size are exceeds the maximum allowed size of 5MB.
                </Alert>
              </Snackbar>
            </Stack>
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar open={lengthValidation}>
                <Alert severity="error" sx={{ width: '100%' }}>
                  Only five attachments can be uploaded.
                </Alert>
              </Snackbar>
            </Stack>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        <Button
          type="button"
          disabled={!newContent || (!truncateHTMLTags(newContent)) || sizeValidation || lengthValidation}
          variant="contained"
          onClick={() => onContentSave()}
          style={{ width: 'auto', height: '40px' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditorDialog;
