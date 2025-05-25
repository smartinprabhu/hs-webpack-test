import React, { useState, useEffect } from 'react';
import {
  Col,
  Collapse,
  Row,
  Input,
  Label,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
} from '@mui/material';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import QRCode from 'react-qr-code';
import { Tooltip } from 'antd';
import { uniqBy } from 'lodash';
import { getAccountId } from '../../util/appUtils';

const appConfig = require('../../config/appConfig').default;

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

const CopyHelpdeskUrl = () => {
  const [url, setUrl] = useState(false);
  const [category, setCategory] = useState(false);
  const [isCollapse, setCollapse] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState({ loading: false, data: null, err: null });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const { maintenanceConfigurationData } = useSelector((state) => state.ticket);
  const {
    getSpaceInfo,
  } = useSelector((state) => state.equipment);

  const getCidAttach = () => {
    let urlAttach = '';
    if (selectedCategory && selectedCategory.length > 0) {
      selectedCategory.map((categ) => {
        urlAttach = `${urlAttach}&cid=${categ.id}`;
      });
    }
    return urlAttach;
  };

  useEffect(() => {
    const fetchAccountIdAndSetUrl = async () => {
      if (
        maintenanceConfigurationData
        && !maintenanceConfigurationData.loading
        && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length > 0
        && maintenanceConfigurationData.data[0].uuid
      ) {
        let val = `${WEBAPPAPIURL}ticket/${maintenanceConfigurationData.data[0].uuid}?sid=${getSpaceInfo.data[0].id}`;

        if (selectedCategory && selectedCategory.length > 0) {
          val = `${val}${getCidAttach()}`;
        }

        try {
          const accountId = await getAccountId();
          setUrl(`${val}?accid=${encodeURIComponent(accountId)}`);
          setCategory(getSpaceInfo.data[0].asset_category_id[0]);
        } catch (error) {
          console.error('Error fetching account ID:', error);
        }
      }
    };

    fetchAccountIdAndSetUrl(); // Call the async function inside useEffect
  }, [maintenanceConfigurationData, selectedCategory]);

  useEffect(() => {
    if (category) {
      setCategoryInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/getProblemCategory?uuid=${maintenanceConfigurationData.data[0].uuid}&space_category_id=${category}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };

      axios(config)
        .then((response) => setCategoryInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setCategoryInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    } else {
      setCategoryInfo({ loading: false, data: null, err: null });
    }
  }, [category, isCollapse, categoryOpen]);

  let categoryOptions = [];

  if (categoryInfo && categoryInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (categoryInfo && categoryInfo.data && categoryInfo.data.length) {
    categoryInfo.data = categoryInfo.data.filter((item) => item.is_incident === false);
    const arr = [...categoryOptions, ...categoryInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (categoryInfo && categoryInfo.err) {
    categoryOptions = [];
  }
  const onCategoryChange = (options) => {
    setSelectedCategory(uniqBy(options, 'id'));
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



  const copyUrl = async (uuid, name, sid, cid, hcid) => {
    const isBasePath = !!window.location.pathname.includes('/v3');
    let val = isBasePath ? `${WEBAPPAPIURL}v3${name}/${uuid}` : `${WEBAPPAPIURL}${name}/${uuid}`;
    const accountId = await getAccountId();
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
      <Row>
        <Col sm={8} md={8} lg={8}>
          <Input type="input" name="helpdeskUrl" value={url} id="helpdeskUrl" disabled />
        </Col>
        <Col sm={3} md={3} lg={3} className="p-0">
          {maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].uuid && (
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
              <Button
                type="button"
                size="sm"
                variant="outlined"
                onMouseLeave={() => setCopySuccess(false)}
                onClick={() => { copyUrl(maintenanceConfigurationData.data[0].uuid, 'ticket', getSpaceInfo.data[0].id, getCidAttach()); setCopySuccess(true); }}
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
      <Row>
        {categoryInfo && categoryInfo.data && (<p className="m-0 font-weight-800 collapse-heading cursor-pointer ml-3 advancedUrl" onClick={() => { setCollapse(!isCollapse); setSelectedCategory([]); }}>Advanced</p>)}
      </Row>
      <Collapse isOpen={isCollapse}>
        <Col md={12} sm={12} lg={12} xs={12}>
          <Label for="category_id">Category</Label>
          <Autocomplete
            name="category_id"
            isRequired
            labelClassName="m-0"
            formGroupClassName="m-1"
            multiple
            filterSelectedOptions
            open={categoryOpen}
            onOpen={() => {
              setCategoryOpen(true);
            }}
            onClose={() => {
              setCategoryOpen(false);
            }}
            value={selectedCategory}
            onChange={(e, data) => onCategoryChange(data)}
            loading={categoryInfo && categoryInfo.loading}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option && option.name ? option.name : '')}
            options={categoryOptions}
            getOptionDisabled={(option) => (!!(option?.id && selectedCategory && selectedCategory.length && selectedCategory.find((categ) => categ.id === option.id)))}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoryInfo && categoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
export default CopyHelpdeskUrl;
