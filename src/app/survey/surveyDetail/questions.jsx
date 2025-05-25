/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOrderCheckLists, getOrderParts } from '../../workorders/workorderService';
import { getDefaultNoValue } from '../../util/appUtils';
import {
  getQuestionTypeLabel,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const Questions = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();
  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);
  const [pageId, setPageId] = useState([]);

  const { orderCheckLists, orderParts } = useSelector((state) => state.workorder);

  useEffect(() => {

    console.log(detail);
    console.log(detail.page_ids);
    if (detail) {
      const ids = detail.page_ids ? detail.page_ids : [];
      dispatch(getOrderCheckLists(ids, appModels.SURVEYPAGE));
    }
  }, [detail]);

  useEffect(() => {
    if (orderCheckLists && orderCheckLists.data) {
      const ids = orderCheckLists.data.length > 0 ? orderCheckLists.data[0].question_ids : [];
      dispatch(getOrderParts(ids, appModels.SURVEYQUESTION));
    }
  }, [orderCheckLists]);

  useEffect(() => {
    if (pageId && pageId.length && pageId.length > 0) {
      dispatch(getOrderParts(pageId, appModels.SURVEYQUESTION));
    }
  }, [pageId]);

  function getRow(assetData, groupId) {
    assetData = assetData.sort((firstEle, secondEle) => parseInt(firstEle.sequence) - parseInt(secondEle.sequence))
    const tableTr = [];
    let gId;
    if (groupId === '') {
      gId = false;
    } else {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].page_id[0] === gId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(assetData[i].question)}</td>
            <td className="p-2">{getDefaultNoValue(getQuestionTypeLabel(assetData[i].type))}</td>
            <td className="p-2">{getDefaultNoValue(assetData[i].constr_mandatory ? 'Yes' : 'No')}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const sections = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 ? orderCheckLists.data : [];

  const toggleAccordion = (tab, sectionId) => {
    setPageId(sectionId);
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
    if (orderCheckLists && orderCheckLists.data) {
      getinitial();
    }
  }, [orderCheckLists]);

  const loading = (detail && detail.loading) || (orderCheckLists && orderCheckLists.loading);

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12">
          {!loading && (accordion.length > 0) && (sections && sections.length > 0) && sections.map((section, index) => (
            <div
              id="accordion"
              className="accordion-wrapper mb-3 border-0"
              key={section.id}
            >
              <Card>
                <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
                  <Button
                    block
                    color="text-dark"
                    id={`heading${index}`}
                    className="text-left m-0 p-0 border-0 box-shadow-none"
                    onClick={() => toggleAccordion(index, section.question_ids)}
                    aria-expanded={accordion[index]}
                    aria-controls={`collapse${index}`}
                  >
                    <span className="collapse-heading font-weight-800">
                      {section && section.display_name ? section.display_name : 'General'}
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
                  className="border-0 comments-list thin-scrollbar"
                  aria-labelledby={`heading${index}`}
                >
                  <Row className="mr-2 ml-2 mt-3 mb-0 ">

                    {orderParts && orderParts.data && (
                      <>
                        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                          <thead>
                            <tr>
                              <th className="p-2 min-width-160">
                                Question Name
                              </th>
                              <th className="p-2 min-width-160">
                                Type of Question
                              </th>
                              <th className="p-2 min-width-160">
                                Mandatory Answer
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getRow(orderParts && orderParts.data ? orderParts.data : [],
                              section && section.id ? section.id : '')}
                          </tbody>
                        </Table>
                        <hr className="m-0" />
                      </>
                    )}
                  </Row>
                  <DetailViewFormat detailResponse={orderParts} />
                </Collapse>
              </Card>
            </div>
          ))}
          <DetailViewFormat detailResponse={detail} />
          {detail && !detail.loading
            ? <DetailViewFormat detailResponse={orderCheckLists} />
            : ''}
        </Col>
      </Row>

    </>
  );
};

Questions.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default Questions;
