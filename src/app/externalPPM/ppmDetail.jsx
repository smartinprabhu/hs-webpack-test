/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import moment from 'moment-timezone';

import {
  detectMob, extractNameObject, getDateTimeUtc, isJsonString, getDefaultNoValue, getJsonString,
} from '../util/appUtils';
import DialogHeader from '../commonComponents/dialogHeader';
import {
  newpercalculate,
} from '../util/staticFunctions';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import { getEquipmentStateText } from '../assets/utils/utils';
import Checklists from './checklists';
import CaptureImage from './captureImage';
import ScanQRCode from './scanQRCode';

const PpmDetail = ({
  settings, accid, companyData, viewId, ppmData, onResetView1, onResetView,
}) => {
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const isMobileView = detectMob();

  const [acceptInfo, setAcceptInfo] = useState({ loading: false, data: null, err: null });
  const [startInfo, setStartInfo] = useState({ loading: false, data: null, err: null });
  const [resumeInfo, setResumeInfo] = useState({ loading: false, data: null, err: null });
  const [taskConfig, setTaskConfig] = useState({ loading: false, data: null, err: null });
  const [woUpdateInfo, setWoUpdateInfo] = useState({
    loading: false, data: null, err: null, isHold: false,
  });
  const [captureInfo, setCaputureInfo] = useState({ loading: false, data: null, err: null });
  const [captureModal, showCaptureModal] = useState(false);
  const [qrscanInfo, setQrscanInfo] = useState(false);
  const [scanModal, showScanModal] = useState(false);
  const [locationLoading, showLocationLoading] = useState(false);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const getLocation = (interval) => {
    if (navigator.geolocation) {
      showLocationLoading(!interval);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          showLocationLoading(false);
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: 'Unable to retrieve your location',
          });
          showLocationLoading(false);
        },
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
      });
      showLocationLoading(false);
    }
  };

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const stickyFooter = document.getElementById('sticky_footer');

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  useEffect(() => {
    if (viewId) {
      setAcceptInfo({ loading: false, data: null, err: null });
      setStartInfo({ loading: false, data: null, err: null });
      setResumeInfo({ loading: false, data: null, err: null });
      setTaskConfig({ loading: false, data: null, err: null });
      showLocationLoading(false);
      setWoUpdateInfo({
        loading: false, data: null, err: null, isHold: false,
      });
      setCaputureInfo({ loading: false, data: null, err: null });
      setQrscanInfo(false);
      setTaskQuestions([]);
    }
  }, [viewId]);

  function getInsColor() {
    let res = 'info';
    if ((ppmData.state === 'Upcoming' && new Date(ppmData.starts_on) > new Date()) || (ppmData.state === 'Missed' && !(settings && settings.is_perform_missed_ppm)) || (ppmData.state === 'Pause' && new Date(ppmData.ends_on) < new Date()) || (ppmData.is_on_hold_requested && ppmData.state !== 'Pause') || (ppmData.state === 'In Progress' && (new Date(ppmData.starts_on) > new Date() || new Date(ppmData.ends_on) < new Date()))) {
      res = 'warning';
    }
    if ((settings && settings.is_perform_missed_ppm) && (ppmData.state === 'Missed' || (ppmData.state === 'In Progress' && !ppmData.is_on_hold_requested) || (ppmData.state === 'Pause' && !ppmData.is_on_hold_requested))) {
      res = 'info';
    }
    return res;
  }

  function getMapData() {
    let res = false;
    if (companyData && companyData.map_polygon && isJsonString(companyData.map_polygon) && getJsonString(companyData.map_polygon)) {
      res = getJsonString(companyData.map_polygon);
    }
    return res;
  }

  useEffect(() => {
    if (settings && settings.is_fence_to_perform_ppm && ppmData && getInsColor() === 'info' && (ppmData.order_state && (ppmData.order_state === 'in_progress' || ppmData.order_state === 'assigned'))) {
      if (!(location.latitude && location.longitude)) {
        getLocation('interval');
        const interval = setInterval(() => {
          getLocation('interval');

          // Clear interval if location is found
          if (location.latitude && location.longitude) {
            clearInterval(interval);
          }
        }, 1500);

        // Cleanup the interval on component unmount or re-renders
        return () => clearInterval(interval);
      }
    }
  }, [ppmData, location]);

  useEffect(() => {
    if (ppmData && getInsColor() === 'info' && ppmData.order_id && ppmData.order_id.id && ppmData.task_id && ppmData.task_id.id) {
      setTaskConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id", "name", ["check_list_ids", ["id", ("check_list_id", ["id", ["activity_lines", ["id","name", "sequence", "type", ("mro_quest_grp_id", ["id", "name"]),"has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]]])]]]';
      const payload = `domain=[["id","=",${ppmData.task_id.id}]]&model=mro.task&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setTaskConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setTaskConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [ppmData]);

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };

  function getChecklistData() {
    let res = false;
    if (ppmData && ppmData.order_id && ppmData.order_id.checklist_json_data && isJsonString(ppmData.order_id.checklist_json_data) && getJsonString(ppmData.order_id.checklist_json_data)) {
      res = getJsonString(ppmData.order_id.checklist_json_data);
    }
    return res;
  }

  function getChecklistAnswer(id) {
    let res = false;
    if (id && getChecklistData() && getChecklistData().length) {
      const data = getChecklistData();
      const ansData = data.filter((item) => item.check_list_id === id);
      if (ansData && ansData.length) {
        res = ansData[0].answer_common;
      }
    }
    return res;
  }

  const taskData = taskConfig && taskConfig.data && taskConfig.data.length ? taskConfig.data[0] : false;
  const taskChecklists = taskData && taskData.check_list_ids && taskData.check_list_ids.length && taskData.check_list_ids[0].check_list_id && taskData.check_list_ids[0].check_list_id.activity_lines && taskData.check_list_ids[0].check_list_id.activity_lines.length ? taskData.check_list_ids[0].check_list_id.activity_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.type,
        answer_common: getChecklistAnswer(cl.id),
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: cl.constr_error_msg,
          constr_mandatory: cl.constr_mandatory,
          has_attachment: cl.has_attachment,
          is_attachment_mandatory: cl.is_attachment_mandatory,
          id: cl.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.name,
          parent_id: cl.parent_id,
          validation_error_msg: cl.validation_error_msg,
          validation_length_max: cl.validation_length_max,
          validation_length_min: cl.validation_length_min,
          validation_max_float_value: cl.validation_max_float_value,
          validation_min_float_value: cl.validation_min_float_value,
          validation_required: cl.validation_required,
          type: cl.type,
          labels_ids: cl.labels_ids,
          sequence: cl.sequence,
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: [],
        value_text: false,
        type: false,
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [taskConfig]);

  function getAllowedPeriod() {
    let res = '';
    if (ppmData) {
      res = `You are allowed to perform this PPM during the period ${getDefaultNoValue(ppmData.week)} ( ${moment.utc(ppmData.starts_on).local().format('DD-MMM-YYYY')} to ${moment.utc(ppmData.ends_on).local().format('DD-MMM-YYYY')} )`;
    }
    return res;
  }

  const acceptWo = () => {
    if (ppmData && ppmData.order_id && ppmData.order_id.id) {
      if (settings && settings.is_fence_to_perform_ppm) {
        getLocation();
      }
      setAcceptInfo({ loading: true, data: null, err: null });

      const postDataValues = {
        review_status: false,
        reviewed_by: false,
        reviewed_remark: '',
        reviewed_on: false,
        checklist_json_data: false,
        state: 'assigned',
      };

      const data = {
        id: ppmData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));

      postData.append('id', data.id);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setAcceptInfo({ loading: false, data: response.data.data, err: null });
          } else if (response.data && response.data.error && response.data.error.message) {
            setAcceptInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setAcceptInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const startWo = () => {
    if (ppmData && ppmData.order_id && ppmData.order_id.id) {
      if (ppmData.qr_scan_at_start && !qrscanInfo) {
        showScanModal(true);
      } else if (ppmData.at_start_mro && !(captureInfo && captureInfo.data)) {
        showCaptureModal(true);
      } else {
        setStartInfo({ loading: true, data: null, err: null });

        const postDataValues = {
          mro_timesheet_ids: [[0, 0, { start_date: getDateTimeUtc(new Date()), reason: 'Start', company_id: companyData && companyData.id }]],
          review_status: false,
          reviewed_by: false,
          reviewed_remark: '',
          reviewed_on: false,
          state: 'in_progress',
        };

        const data = {
          id: ppmData.order_id.id,
          values: postDataValues,
        };

        const postData = new FormData();
        postData.append('values', JSON.stringify(data.values));

        postData.append('id', data.id);
        const config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
          headers: {
            'Content-Type': 'multipart/form-data',
            portalDomain: window.location.origin,
            accountId: accid,
          },
          data: postData,
        };

        axios(config)
          .then((response) => {
            if (response.data.data) {
              setStartInfo({ loading: false, data: response.data.data, err: null });
              onResetView1();
            } else if (response.data && response.data.error && response.data.error.message) {
              setStartInfo({ loading: false, data: null, err: response.data.error.message });
            }
          })
          .catch((error) => {
            setStartInfo({ loading: false, data: null, err: error });
          });
      }
    }
  };

  const startWo1 = () => {
    if (ppmData && ppmData.order_id && ppmData.order_id.id) {
      if (ppmData.at_start_mro && !(captureInfo && captureInfo.data)) {
        showCaptureModal(true);
      } else {
        setStartInfo({ loading: true, data: null, err: null });

        const postDataValues = {
          mro_timesheet_ids: [[0, 0, { start_date: getDateTimeUtc(new Date()), reason: 'Start', company_id: companyData && companyData.id }]],
          review_status: false,
          reviewed_by: false,
          reviewed_remark: '',
          reviewed_on: false,
          state: 'in_progress',
        };

        const data = {
          id: ppmData.order_id.id,
          values: postDataValues,
        };

        const postData = new FormData();
        postData.append('values', JSON.stringify(data.values));

        postData.append('id', data.id);
        const config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
          headers: {
            'Content-Type': 'multipart/form-data',
            portalDomain: window.location.origin,
            accountId: accid,
          },
          data: postData,
        };

        axios(config)
          .then((response) => {
            if (response.data.data) {
              setStartInfo({ loading: false, data: response.data.data, err: null });
              onResetView1();
            } else if (response.data && response.data.error && response.data.error.message) {
              setStartInfo({ loading: false, data: null, err: response.data.error.message });
            }
          })
          .catch((error) => {
            setStartInfo({ loading: false, data: null, err: error });
          });
      }
    }
  };

  const resumeWo = () => {
    if (ppmData && ppmData.order_id && ppmData.order_id.id) {
      if (settings && settings.is_fence_to_perform_ppm) {
        getLocation();
      }
      setResumeInfo({ loading: true, data: null, err: null });

      const postDataValues = {
        mro_timesheet_ids: [[0, 0, { start_date: getDateTimeUtc(new Date()), reason: 'Start', company_id: companyData && companyData.id }]],
        review_status: false,
        reviewed_by: false,
        reviewed_remark: '',
        reviewed_on: false,
        state: 'in_progress',
      };

      const data = {
        id: ppmData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));

      postData.append('id', data.id);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setResumeInfo({ loading: false, data: response.data.data, err: null });
            onResetView1();
          } else if (response.data && response.data.error && response.data.error.message) {
            setResumeInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setResumeInfo({ loading: false, data: null, err: error });
        });
    }
  };

  // Haversine formula to calculate the distance between two coordinates
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  const isPointInPolygon = (point, polygon) => {
    const x = point[0]; const
      y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0]; const
        yi = polygon[i][1];
      const xj = polygon[j][0]; const
        yj = polygon[j][1];

      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  };

  const checkIfWithinRange = () => {
    let res = false;
    if (getMapData() && getMapData().type && getMapData().type === 'radius') {
      const distance = haversineDistance(location.latitude, location.longitude, getMapData().lat, getMapData().long);
      console.log(distance);
      const km = getMapData().radius / 1000;
      console.log(km);
      res = distance <= km;
    } else if (getMapData() && getMapData().type && getMapData().type === 'polygon') {
      const isInPolygon = isPointInPolygon([location.latitude, location.longitude], getMapData().points);
      res = isInPolygon;
    } else {
      const distance = haversineDistance(location.latitude, location.longitude, companyData.latitude, companyData.longitude);
      const km = getMapData() && getMapData().type && getMapData().type === 'radius' ? getMapData().radius / 1000 : 5;
      res = distance <= km;
    }
    return res;
  };

  return (
    <>
      <Card className="mb-2">
        <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-0'}>
          <p className="font-family-tab font-weight-800">{getDefaultNoValue(ppmData.name)}</p>
          {isMobileView ? (
            <Table responsive className="text-center">
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Asset Name</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.category_type === 'e' ? extractNameObject(ppmData.equipment_id, 'name') : extractNameObject(ppmData.space_id, 'space_name'))}</p>
                </td>
              </tr>
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Asset Code</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.asset_code)}</p>
                </td>
              </tr>
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Location</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.category_type === 'e' && ppmData.equipment_id && ppmData.equipment_id.location_id ? extractNameObject(ppmData.equipment_id.location_id, 'path_name') : extractNameObject(ppmData.space_id, 'path_name'))}</p>
                </td>
              </tr>
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">PPM Status</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.is_on_hold_requested && ppmData.state !== 'Pause' ? 'On-Hold Requested' : (ppmData.state === 'Pause' ? 'On-Hold' : ppmData.state))}</p>
                </td>
              </tr>
              {!ppmData.is_on_hold_requested && ppmData.state === 'Pause' && ppmData.pause_reason_id && ppmData.pause_reason_id.name && (
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">On-Hold Reason</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.pause_reason_id.name)}</p>
                </td>
              </tr>
              )}
            </Table>
          ) : (
            <table>
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Asset Name</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.category_type === 'e' ? extractNameObject(ppmData.equipment_id, 'name') : extractNameObject(ppmData.space_id, 'space_name'))}</p>
                </td>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Location</p>
                </td>
                <td className="min-width-250">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.category_type === 'e' && ppmData.equipment_id && ppmData.equipment_id.location_id ? extractNameObject(ppmData.equipment_id.location_id, 'path_name') : extractNameObject(ppmData.space_id, 'path_name'))}</p>
                </td>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">PPM Status</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.is_on_hold_requested && ppmData.state !== 'Pause' ? 'On-Hold Requested' : (ppmData.state === 'Pause' ? 'On-Hold' : ppmData.state))}</p>
                </td>
              </tr>
              <tr>
                <td className="min-width-100">
                  <p className="font-family-tab mb-0 font-tiny">Asset Number</p>
                </td>
                <td className="min-width-200">
                  <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.asset_code)}</p>
                </td>
                {!ppmData.is_on_hold_requested && ppmData.state === 'Pause' && ppmData.pause_reason_id && ppmData.pause_reason_id.name && (
                <>
                  <td className="min-width-100">
                    <p className="font-family-tab mb-0 font-tiny">On-Hold Reason</p>
                  </td>
                  <td className="min-width-200">
                    <p className="font-family-tab mb-0 font-weight-800 font-tiny">{getDefaultNoValue(ppmData.pause_reason_id.name)}</p>
                  </td>
                </>
                )}
              </tr>
            </table>
          )}
        </CardBody>
      </Card>
      {!(woUpdateInfo && woUpdateInfo.data) && (
      <CardBody className="p-0 mb-2">
        <Stack>
          <Alert icon={false} severity={getInsColor()}>
            <p className="font-family-tab font-tiny">Instructions</p>
            {ppmData.state === 'Upcoming' && new Date(ppmData.starts_on) > new Date() && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You cannot perform this PPM now</li>
              <li className="font-family-tab">{getAllowedPeriod()}</li>
            </ul>
            )}
            {ppmData.state === 'Upcoming' && new Date(ppmData.starts_on) <= new Date() && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You can perform this PPM now</li>
              <li className="font-family-tab">{getAllowedPeriod()}</li>
            </ul>
            )}
            {ppmData.state === 'Pause' && new Date(ppmData.ends_on) < new Date() && (
            <ul className="font-family-tab">
              <li className="font-family-tab">{settings && settings.is_perform_missed_ppm ? 'You can resume this PPM and perform now' : 'You cannot perform this PPM. SLA Elapsed'}</li>
              <li className="font-family-tab">{getAllowedPeriod()}</li>
            </ul>
            )}
            {ppmData.state === 'Pause' && new Date(ppmData.starts_on) <= new Date() && new Date(ppmData.ends_on) >= new Date() && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You can resume this PPM and perform now</li>
              <li className="font-family-tab">{getAllowedPeriod()}</li>
            </ul>
            )}
            {ppmData.state === 'Completed' && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You have completed this PPM</li>
              <li className="font-family-tab">You may print the PPM Report</li>
            </ul>
            )}
            {ppmData.state === 'Missed' && !(settings && settings.is_perform_missed_ppm) && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You have missed this PPM. You are not allowed to perform this PPM as the SLA is elapsed</li>
              <li className="font-family-tab">You may contact the facility SPOC for further support</li>
            </ul>
            )}
            {ppmData.state === 'Missed' && (settings && settings.is_perform_missed_ppm) && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You have missed this PPM. You are allowed to perform this PPM though SLA is elapsed</li>
              <li className="font-family-tab">You may contact the facility SPOC for further support</li>
            </ul>
            )}
            {ppmData.state === 'In Progress' && !ppmData.is_on_hold_requested && new Date(ppmData.starts_on) <= new Date() && new Date(ppmData.ends_on) >= new Date() && (
              <ul className="font-family-tab">
                <li className="font-family-tab">You can perform this PPM now</li>
                <li className="font-family-tab">{getAllowedPeriod()}</li>
              </ul>
            )}
            {ppmData.state === 'In Progress' && !ppmData.is_on_hold_requested && (new Date(ppmData.starts_on) > new Date() || new Date(ppmData.ends_on) < new Date()) && (
            <ul className="font-family-tab">
              <li className="font-family-tab">{settings && settings.is_perform_missed_ppm ? 'You can perform this PPM now' : 'You cannot perform this PPM now'}</li>
              <li className="font-family-tab">{settings && settings.is_perform_missed_ppm ? getAllowedPeriod() : 'You may contact the facility SPOC for further support'}</li>
            </ul>
            )}
            {ppmData.is_on_hold_requested && ppmData.state !== 'Pause' && (
            <ul className="font-family-tab">
              <li className="font-family-tab">You cannot perform this PPM now</li>
              <li className="font-family-tab">You may contact the facility SPOC for further support</li>
            </ul>
            )}
          </Alert>
        </Stack>
      </CardBody>
      )}
      <div className="text-center p-2">
        {ppmData && getInsColor() === 'info' && !(resumeInfo && resumeInfo.data) && !(startInfo && startInfo.data) && ((ppmData.order_state && (ppmData.order_state === 'in_progress' || ppmData.order_state === 'assigned')) || (acceptInfo && acceptInfo.data)) && (
        <>
          <LoadingButton disabled={settings && settings.is_fence_to_perform_ppm && (!(location.latitude && location.longitude) || !checkIfWithinRange())} loading={startInfo.loading} onClick={() => startWo()} variant="contained" size="medium">
            Start Now
          </LoadingButton>
          {settings && settings.is_fence_to_perform_ppm && !(location.latitude && location.longitude) && !locationLoading && (
          <p className="mt-2 font-family-tab text-info font-weight-800">(Location Permission is required to fetch the location. You can only perform the PPM when you are within site)</p>
          )}
          {settings && settings.is_fence_to_perform_ppm && !(location.latitude && location.longitude) && locationLoading && (
          <p className="mt-2 font-family-tab text-info font-weight-800">(Fetching the current location please wait..)</p>
          )}
          {settings && settings.is_fence_to_perform_ppm && (location.latitude && location.longitude) && !locationLoading && !checkIfWithinRange() && (
          <p className="mt-2 font-family-tab text-danger font-weight-800">(You can perform the PPM only when you are within the site location)</p>
          )}
        </>
        )}
        {ppmData && getInsColor() === 'info' && ppmData.order_state && ppmData.order_state === 'ready' && !(acceptInfo && acceptInfo.data) && (
        <>
          <LoadingButton loading={acceptInfo.loading} onClick={() => acceptWo()} variant="contained" size="medium">
            Accept to perform PPM
          </LoadingButton>
          {settings && settings.is_fence_to_perform_ppm && (
          <p className="mt-2 font-family-tab text-info font-weight-800">(Location Permission is required to fetch the location. You can only perform the PPM when you are within site)</p>
          )}
        </>
        )}
        {ppmData && getInsColor() === 'info' && !(resumeInfo && resumeInfo.data) && ppmData.order_state && ppmData.order_state === 'pause' && (
        <LoadingButton loading={resumeInfo.loading} onClick={() => resumeWo()} variant="contained" size="medium">
          Resume
        </LoadingButton>
        )}
      </div>
      {ppmData && getInsColor() === 'info' && ppmData.state !== 'Completed' && !(woUpdateInfo && woUpdateInfo.data) && !(startInfo && startInfo.data) && !(resumeInfo && resumeInfo.data) && (
        <>
          {taskQuestions && taskQuestions.length > 0 && (
          <Card className="mb-4">
            <CardBody className={isMobileView ? 'p-2 mb-1 instructions-scroll thin-scrollbar' : 'p-2 mb-0 instructions-scroll thin-scrollbar'}>
              <p className="font-family-tab">Checklists</p>
              {sortSections(taskQuestions).map((item, index) => (
                <p className="font-family-tab font-weight-800">
                  {index + 1}
                  .
                  {' '}
                  {getDefaultNoValue(extractNameObject(item.mro_activity_id, 'name'))}
                </p>
              ))}
            </CardBody>
          </Card>
          )}
          {taskConfig && taskConfig.loading && (
          <Card className="mb-4">
            <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-0'}>
              <p className="font-family-tab">Checklists</p>
              <Stack spacing={1}>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} animation="wave" />
              </Stack>
            </CardBody>
          </Card>
          )}
        </>
      )}
      {ppmData && ppmData.state !== 'Completed' && getInsColor() === 'info' && !(woUpdateInfo && woUpdateInfo.data) && ((startInfo && startInfo.data) || (resumeInfo && resumeInfo.data)) && taskQuestions && taskQuestions.length > 0 && (
      <Card className="mb-4">
        <CardBody className={isMobileView ? 'p-2 mb-1 font-family-tab' : 'p-2 mb-0 font-family-tab'}>
          <p className="font-family-tab">Checklists</p>
          <Checklists accid={accid} settings={settings} setWoUpdateInfo1={setWoUpdateInfo} onResetView={onResetView} orderCheckLists={taskQuestions} detailData={ppmData} companyData={companyData} />
        </CardBody>
      </Card>
      )}
      {(woUpdateInfo && woUpdateInfo.data) && (
      <CardBody className="p-0 mb-2">
        <Stack>
          <Alert severity="info">
            <p className="font-family-tab mb-0 font-weight-800">Thank you.</p>
            {!woUpdateInfo.isHold ? (
              <p className="font-family-tab mb-0 font-weight-800">PPM has been updated successfully.</p>
            ) : (
              <>
                <p className="font-family-tab mb-0 font-weight-800">
                  As a Service Report is mandatory to be attached, this PPM is placed ON-HOLD.
                </p>
                <p className="font-family-tab mb-0 font-weight-800">
                  You can resume on or before
                  {' '}
                  {moment.utc(ppmData.ends_on).local().format('DD-MMM-YYYY')}
                  {' '}
                  {' '}
                  {' '}
                  to complete this PPM.
                </p>
              </>
            )}
            <p aria-hidden className="text-info mb-0 cursor-pointer font-family-tab font-tiny" onClick={() => onResetView()}>You may click here to View All PPMs</p>
          </Alert>
        </Stack>
      </CardBody>
      )}
      <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={captureModal}>
        <DialogHeader title="Start PPM" onClose={() => showCaptureModal(false)} response={captureInfo} imagePath={false} />
        <CaptureImage accid={accid} captureInfo={captureInfo} startWo={() => startWo()} toggle={() => showCaptureModal(false)} setCaputureInfo={setCaputureInfo} companyId={companyData.id} detailData={ppmData} />
      </Dialog>
      <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={scanModal}>
        <DialogHeader title="Start PPM" onClose={() => showScanModal(false)} response={startInfo} imagePath={false} />
        <ScanQRCode qrscanInfo={qrscanInfo} startWo={() => startWo1()} toggle={() => showScanModal(false)} setQrscanInfo={setQrscanInfo} detailData={ppmData} />
      </Dialog>
    </>
  );
};

export default PpmDetail;
