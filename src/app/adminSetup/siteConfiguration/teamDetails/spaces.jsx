/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';

import Loader from '@shared/loading';
import {
  extractTextObject, getAllowedCompanies,
  getDefaultNoValue,
} from '../../../util/appUtils';
import { getTeamSpaces } from '../../setupService';

const appModels = require('../../../util/appModels').default;

const Spaces = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { teamDetail, teamSpaces } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (teamDetail && teamDetail.data) {
      const ids = teamDetail.data.length > 0 ? teamDetail.data[0].location_ids : [];
      dispatch(getTeamSpaces(companies, ids, appModels.SPACE));
    }
  }, [teamDetail]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].space_name)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].path_name)}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Card>
      <CardBody className="pl-0 pb-0 pt-0 pr-0">
        <Row>
          <Col sm="12" md="12" lg="12" xs="12" className="comments-list thin-scrollbar">
            {(teamSpaces && teamSpaces.loading) || (teamDetail && teamDetail.loading) && (
            <div className="text-center mt-3 mb-3">
              <Loader />
            </div>
            )}
            {(teamSpaces && teamSpaces.data && teamSpaces.data.length)  && (teamSpaces && !teamSpaces.loading) && (teamDetail && !teamDetail.loading) ? (
              <div>
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-160">
                        Space Name
                      </th>
                      <th className="p-2 min-width-100">
                        Path Name
                      </th>
                      <th className="p-2 min-width-100">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(teamSpaces && teamSpaces.data ? teamSpaces.data : [])}
                  </tbody>
                </Table>
              </div>
            ) : <ErrorContent errorTxt="No Data Found" />}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Spaces;
