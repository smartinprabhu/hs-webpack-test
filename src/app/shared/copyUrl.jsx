import React, { useState, useEffect } from 'react';
import {
  Col,
  Collapse,
  Label,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import QRCode from 'react-qr-code';
import { } from 'antd';
import { Button, Tooltip } from "@mui/material";


import { extractTextObject, copyTextToClipboard } from '../util/appUtils';
import { ReturnThemeColor } from '../themes/theme';

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;


const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const CopyUrl = ({
  uuid, spaceOptions, detailData, moduleName, isShow, loading, paramName, fieldName,
}) => {
  const [url, setUrl] = useState(false);
  const [selectData, setSelected] = useState(false);
  const [isCollapse, setCollapse] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (uuid) {
      let val = `${WEBAPPAPIURL}${moduleName}/${uuid}`;
      if (selectData && selectData.id) {
        val = `${val}?${paramName}=${selectData.id}`;
      }
      setUrl(val);
    }
  }, [uuid, selectData]);


  useEffect(() => {
    if (isShow) {
      setCollapse(false);
      setSelected(false);
    }
  }, [isShow]);

  useEffect(() => {
    if (isShow && detailData && !detailData.is_show_all_spaces && detailData.category_type && detailData.category_type === 'ah' && spaceOptions && spaceOptions.length && spaceOptions.length === 1) {
      setCollapse(true);
      setSelected(spaceOptions[0]);
    }
  }, [isShow, detailData, spaceOptions]);


  const onSelectChange = (data) => {
    setSelected(data);
  };

  const download = () => {
    const s = new XMLSerializer().serializeToString(document.getElementById('svg'));
    const encodedData = window.btoa(s);
    const element = document.createElement('a');
    element.setAttribute('href', `data:image/svg+xml;base64,${encodedData}`);
    element.setAttribute('download', 'QRCode');
    element.setAttribute('id', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const handleQrPrint = () => {
    setTimeout(() => {
      /* const content = document.getElementById('print_qr_survey_link');
      const pri = document.getElementById('print_qr_survey_link_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML); */

      const div = document.getElementById('print_qr_survey_link_pdf');
      // Create a window object.
      const win = window.open('', '_blank'); // Open the window. Its a popup window.
      document.title = 'QR Code';
      win.document.write(div.outerHTML); // Write contents in the new window.
      win.document.close();
      /* setTimeout(() => {
        const r = win.confirm('Do you want to print this document ?');
        if (r === true) {
          win.print();
        }
      }, 1500); */
      win.print();
      // pri.document.close();
      // pri.focus();
      // pri.print();
    }, 1000);
  };

  return (
    <>
      <div className="p-3 text-center">
        <QRCode value={url} className="" id="svg" size={150} renderAs="svg" includeMargin level="H" />
      </div>
      <div md="12" sm="12" lg="12" className="d-none">
        <div id="print_qr_survey_link_pdf">
          <div style={{ textAlign: 'center' }}>
            <QRCode value={url} renderAs="svg" includeMargin level="H" size={400} />
            <p>
              Link :
              {' '}
              {url}
            </p>
          </div>
        </div>
        <iframe name="print_qr_survey_link_pdf_frame" title="Export" id="print_qr_survey_link_pdf_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      </div>
      <div className='mt-4'>
        {detailData && detailData.category_type && !detailData.is_show_all_spaces && detailData.category_type === 'ah' && spaceOptions && spaceOptions.length > 0
          && (<p className="m-0 font-weight-800 cursor-pointer ml-3" onClick={() => { setCollapse(!isCollapse); setSelected(false); }} style={{ color: ReturnThemeColor(), textDecoration: 'underline' }}>Advanced</p>)}
        <Collapse isOpen={isCollapse}>
          <Col md={12} sm={12} lg={12} xs={12} className="ml-2 mt-2">
            <Label for="category_id">{fieldName}</Label>
            <Autocomplete
              name="category_id"
              isRequired
              labelClassName="m-0"
              formGroupClassName="m-1"
              open={selectOpen}
              classes={{
                option: classes.option,
              }}
              onOpen={() => {
                setSelectOpen(true);
              }}
              onClose={() => {
                setSelectOpen(false);
              }}
              loading={loading}
              value={selectData}
              onChange={(e, data) => onSelectChange(data)}
              renderOption={(option) => (
                <>
                  <h6>{option.name || option.space_name}</h6>
                  <p className="float-left font-tiny">
                    {option.path_name && (
                      <>
                        {option.path_name}
                      </>
                    )}
                  </p>
                  <p className="float-right font-tiny">
                    {option.asset_category_id && (
                      <>
                        {extractTextObject(option.asset_category_id)}
                      </>
                    )}
                  </p>
                </>
              )}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option && option.name ? option.name : '')}
              options={spaceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            />
          </Col>
        </Collapse>
      </div>
      <div
        style={{
          position: 'relative',
          marginTop: '80%'
        }}
        className="text-center"
      >
        {isShow && (
          <div >
            {uuid && (
              <Tooltip title={copySuccess ? 'Copied!' : 'Copy'} arrow>
                <Button
                  variant='contained'
                  onMouseLeave={() => setCopySuccess(false)}
                  onClick={() => { copyTextToClipboard(uuid, moduleName, paramName, selectData && selectData.id ? selectData.id : false); setCopySuccess(true); }}
                >
                  Copy URL
                </Button>
              </Tooltip>
            )}
            <Button
              type="button"
              variant='contained'
              className="ml-2"
              onClick={download}
            >
              Download QR
            </Button>
            <Button
              type="button"
              variant='contained'
              className="ml-2"
              onClick={() => handleQrPrint()}
            >
              Print QR
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
export default CopyUrl;