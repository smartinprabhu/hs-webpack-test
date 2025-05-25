/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  generateErrorMessage,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

const MissedChecklists = () => {
  const { userInfo } = useSelector((state) => state.user);
  const {
    inspectionChecklistDetail,
  } = useSelector((state) => state.inspection);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const loading = inspectionChecklistDetail && inspectionChecklistDetail.loading;
  const isErr = ((inspectionChecklistDetail && inspectionChecklistDetail.err) || (inspectionChecklistDetail && inspectionChecklistDetail.data && !inspectionChecklistDetail.data.status));
  const inspDeata = inspectionChecklistDetail && inspectionChecklistDetail.data && inspectionChecklistDetail.data.data
  && inspectionChecklistDetail.data.data.length ? inspectionChecklistDetail.data.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.check_list_id && inspDeata.check_list_id.activity_lines && inspDeata.check_list_id.activity_lines.length > 0);
  
  // const [commonSequenceIds, setCommonSequenceIds] = useState({});
  // const [completedSortingInspsectionData, setCompletedSortingInspsectionData] = useState({});
  const [sortedSequenseData, setSortedSequenceData] = useState({});
  const inspectionActiveLines=inspectionChecklistDetail && inspectionChecklistDetail.data && inspectionChecklistDetail.data.data
  && inspectionChecklistDetail.data.data.length && inspectionChecklistDetail.data.data[0] && inspectionChecklistDetail.data.data[0].check_list_id  && inspectionChecklistDetail.data.data[0].check_list_id.activity_lines
   
  useEffect(() => {
    if(inspectionActiveLines) {
       const sortedInspections = inspectionChecklistDetail.data.data[0].check_list_id.activity_lines.sort(
          (p1, p2) => (p2.sequence - p1.sequence));
          setSortedSequenceData(sortedInspections);
      }
  }, [inspectionActiveLines])

  // useEffect(()=> {
  //   let sequenceUniq;
  //   let array = [];
  //   if(sortedSequenseData !== {}) {
  //     sequenceUniq = uniqBy(sortedSequenseData, 'sequence');
  //     sequenceUniq.map((data) => {
  //       array.push(data.sequence);
  //     })
      
  //   }
  //   setCommonSequenceIds(array.sort(
  //     (p1, p2) => (p1 > p2) ? 1 : (p1 < p2) ? -1 : 0));
  // }, [sortedSequenseData]);

  // useEffect(() => {
  //   if(commonSequenceIds !=='' && commonSequenceIds.length) {
  //     let sortedInspections= [];
  //     commonSequenceIds.map((id) => {
  //       sortedInspections = inspectionActiveLines.sort(
  //         (p1, p2) => p1.sequence === id && p2.sequence === id ? (p1.id < p2.id) ? 1 : -1 : 0
  //         )
  //     })
  //     setCompletedSortingInspsectionData(sortedInspections);
  //   }
  // }, [commonSequenceIds])

  function getTrimmedAnswer(str) {
    let res = '';
    if (str) {
      if (str === 'True') {
        res = 'Yes';
      } else if (str === 'False') {
        res = 'No';
      } else {
        res = str;
      }
    }
    return res;
  }

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  function getRow(assetData, groupId) {
    const tableTr = [];
    let gId;
    if (groupId === '') {
      gId = false;
    } else {
      gId = groupId;
    }
    for (let i = assetData.length-1; i >= 0 ; i -= 1) {
      if (isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData[i].name}</td>
            <td className="p-2">
             -
            </td>
            <td className="p-2">-</td>
            <td className="p-2">-</td>
          </tr>,
        );
      } else if (!isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        if (assetData[i].mro_quest_grp_id && assetData[i].mro_quest_grp_id.id && assetData[i].mro_quest_grp_id.id === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{assetData[i].name}</td>
              <td className="p-2">
               -
              </td>
              <td className="p-2">-</td>
              <td className="p-2">-</td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
  }

  const sections = isChecklist > 0 ? groupByMultiple(inspDeata.check_list_id.activity_lines, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')) : [];

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

  const getinitial = () => {
    if ((sections && sections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < sections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  useEffect(() => {
    if (isChecklist) {
      getinitial();
    }
  }, [inspectionChecklistDetail]);
 
  return (
    <>
      {(!loading && isChecklist) && (
      <div className="ml-0 bg-white">
        {(accordion.length > 0) && (sections && sections.length > 0) && sections.map((section, index) => (
          <div
            id="accordion"
            className="accordion-wrapper mb-3 border-0"
            key={section[0].id}
          >
            <Card>
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
                  <span className="collapse-heading font-weight-800">
                    {section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.name ? section[0].mro_quest_grp_id.name : 'General'}
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
                  className="border-0 med-form-content thin-scrollbar"
                  aria-labelledby={`heading${index}`}
              >
                <Row className="mr-2 ml-2 mb-0 ">
                  {isChecklist && (
                  <>
                    <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                      <thead>
                        <tr>
                          <th className="p-2 min-width-160">
                            Question
                          </th>
                          <th className="p-2 min-width-100">
                            Answer
                          </th>
                          <th className="p-2 min-width-160">
                            Answered By
                          </th>
                          <th className="p-2 min-width-160">
                            Answered on
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRow(sortedSequenseData,
                          section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.id ? section[0].mro_quest_grp_id.id : '')}
                      </tbody>
                    </Table>
                    <hr className="m-0" />
                  </>
                  )}
                </Row>
              </Collapse>
            </Card>
          </div>
        ))}
      </div>
      )}
      {loading && (
      <div className="loader" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {isErr && (
      <ErrorContent errorTxt={generateErrorMessage(inspectionChecklistDetail && inspectionChecklistDetail.err ? inspectionChecklistDetail.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isChecklist && !loading && (
      <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
};

export default MissedChecklists;
