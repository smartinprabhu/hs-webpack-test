import React, { useState, useEffect } from 'react';
import {
  Col,
  Collapse,
  Row,
  Input,
  Label,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import QRCode from 'react-qr-code';
import { Tooltip } from 'antd';
import { getAllowedCompanies, getAccountId } from '../util/appUtils';
import { getHostCompany } from './visitorManagementService';

const appModels = require('../util/appModels').default;
const appConfig = require('../config/appConfig').default;

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

const CopyVisitorManagementUrl = (props) => {
  const { resetData } = props;
  const [url, setUrl] = useState(false);
  const [isCollapse, setCollapse] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hostComOpen, setHostComOpen] = useState(false);
  const [hostComKeyword, setHostComKeyword] = useState('');
  const [selectedHostCompany, setSelectedHostCompany] = useState(false);
  const dispatch = useDispatch();
  const {
    visitorConfiguration, visitHostCompany,
  } = useSelector((state) => state.visitorManagement);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

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

  useEffect(() => {
    setCollapse(false);
    setSelectedHostCompany(false);
  }, [resetData]);

  let hostCompanyOptions = [];

  if (visitHostCompany && visitHostCompany.data && visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].allowed_sites_ids && visitorConfiguration.data[0].allowed_sites_ids.length) {
    hostCompanyOptions = visitHostCompany.data;
  }
  if (visitHostCompany && visitHostCompany.loading) {
    hostCompanyOptions = [{ name: 'Loading' }];
  }
  if (visitHostCompany && visitHostCompany.err) {
    hostCompanyOptions = [];
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        const ids = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].allowed_sites_ids && visitorConfiguration.data[0].allowed_sites_ids;
        await dispatch(getHostCompany(companies, appModels.HOSTCOMPANY, hostComKeyword, ids));
      }
    })();
  }, [userInfo, hostComKeyword, visitorConfiguration]);

  const onHostCompanyChange = (e, options) => {
    setSelectedHostCompany(options);
  };

  useEffect(() => {
    if (visitorConfiguration && !visitorConfiguration.loading && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].uuid) {
      // const isBasePath = !!window.location.pathname.includes('/v3');
      let val = `${WEBAPPAPIURL}visitorpass/${visitorConfiguration.data[0].uuid}`;
      if (selectedHostCompany && selectedHostCompany.id) {
        val = `${val}?hcid=${selectedHostCompany.id}`;
      }
      setUrl(val);
    }
  }, [visitorConfiguration, selectedHostCompany]);

  const copyUrl = async (uuid, name, sid, cid, hcid) => {
    // const isBasePath = !!window.location.pathname.includes('/v3');
    const accountId = await getAccountId();
    let val = `${WEBAPPAPIURL}${name}/${uuid}`;
    if (sid) {
      val = `${val}?sid=${sid}?accid=${encodeURIComponent(accountId)}`;
    }
    if (cid) {
      val = `${val}${cid}?accid=${encodeURIComponent(accountId)}`;
    }
    if (hcid) {
      val = `${val}?hcid=${hcid}?accid=${encodeURIComponent(accountId)}`;
    }
    if (!sid && !cid && !hcid) {
      val = `${val}?accid=${encodeURIComponent(accountId)}`;
    }
    navigator.clipboard.writeText(val)
      .then(() => {
        console.log('Text copied to clipboard:', val);
      })
      .catch((err) => {
        console.log('Unable to copy text to clipboard:', val);
      });
  };

  return (
    <>
      <Row className="mt-2">
        <Col sm={8} md={8} lg={8}>
          <Input type="input" name="VisitorUrl" value={url} id="VisitorUrl" disabled />
        </Col>
        <Col sm={3} md={3} lg={3} className="p-0">
          {visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0] && visitorConfiguration.data[0].uuid && (
          <Tooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
            <Button
              type="button"
              size="sm"
              variant="contained"
              className=""
              onMouseLeave={() => setCopySuccess(false)}
              onClick={() => { copyUrl(visitorConfiguration.data[0].uuid, 'visitorpass', false, false, selectedHostCompany && selectedHostCompany.id); setCopySuccess(true); }}
            >
              Copy URL
            </Button>
          </Tooltip>
          )}
        </Col>
        <Col sm={1} md={1} lg={1} className="mt-2 pl-0">
          <Tooltip title="Download QR">
            <FontAwesomeIcon
              className="mr-2 cursor-pointer"
              size="lg"
              icon={faDownload}
              onClick={download}
            />
          </Tooltip>
        </Col>
      </Row>
      <Row className="my-3 ml-5">
        <Col sm={1} md={1} lg={1} />
        <Col sm={4} md={4} lg={4}>
          <QRCode value={url} className="ml-5" id="svg" size={100} renderAs="svg" includeMargin level="H" />
        </Col>
      </Row>
      { /* <Row>
                {visitHostCompany && visitHostCompany.data && (<p className="m-0 font-weight-800 collapse-heading cursor-pointer ml-3 advancedUrl" onClick={() => { setCollapse(!isCollapse); setSelectedHostCompany(false) }}>Advanced</p>)}
    </Row> */ }
      <Collapse isOpen={isCollapse}>
        <Col md={12} sm={12} lg={12} xs={12}>
          <Label for="category_id">Host Company</Label>
          <Autocomplete
            name="hostCompany"
            label="hostCompany"
            formGroupClassName="m-1"
            open={hostComOpen}
            size="small"
            onOpen={() => {
              setHostComOpen(true);
            }}
            onClose={() => {
              setHostComOpen(false);
            }}
            value={selectedHostCompany}
            onChange={onHostCompanyChange}
            loading={visitHostCompany && visitHostCompany.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hostCompanyOptions}
            disableClearable={!!((selectedHostCompany === false || selectedHostCompany === null))}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className={selectedHostCompany && selectedHostCompany.id ? 'without-padding' : 'without-padding'}
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {visitHostCompany && visitHostCompany.loading && hostComOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
      </Collapse>
    </>
  );
};
export default CopyVisitorManagementUrl;
