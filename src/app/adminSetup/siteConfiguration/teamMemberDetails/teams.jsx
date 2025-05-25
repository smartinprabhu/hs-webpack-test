/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
} from '@mui/material';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';


import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../../commonComponents/dialogHeader';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import { teamsUserColumns } from '../../../commonComponents/gridColumnsEditable';

import {
  extractTextObject,
  generateErrorMessage,
  getAllowedCompanies, getAllowedCompaniesCase,
  getColumnArrayById,
  getDefaultNoValue,
} from '../../../util/appUtils';
import {
  getMemberTeams,
  getUserCompanyTeams,
  getUserDetails,
  resetDeleteTeam,
  resetSelectedMembers,
  resetUpdateTeams,
  resetUpdateUser,
  teamDelete,
  updateUserTeams,
} from '../../setupService';
import SearchModal from './searchModal';

const appModels = require('../../../util/appModels').default;

const Teams = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [rowselected, setRowselected] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [removeId, setRemoveId] = useState(false);
  const [removeName, setRemoveName] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [deleteModalBulk, setDeleteModalBulk] = useState(false);

  const columns = ['name', 'team_type', 'team_category_id', 'company_id'];

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    userDetails, selectedMembers, userTeams, updateTeamsInfo,
    deleteTeamInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if (membersData && membersData.length) {
      setRows(membersData);
    } else {
      setRows([]);
    }
  }, [membersData]);

  useEffect(() => {
    dispatch(resetSelectedMembers());
    dispatch(resetUpdateUser());
    dispatch(resetDeleteTeam());
    setMembersData([]);
    setRowselected([]);
  }, []);

  useEffect(() => {
    if (userDetails && userDetails.data && userDetails.data.length) {
      dispatch(getMemberTeams(companies, userDetails.data[0].maintenance_team_ids, appModels.TEAM));
      setMembersData([]);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.data && userDetails.data.length) {
      dispatch(getUserCompanyTeams(userDetails.data[0].user_id[0]));
      setMembersData([]);
    }
  }, [userDetails]);

  useEffect(() => {
    if (updateTeamsInfo && updateTeamsInfo.data) {

    }
  }, [updateTeamsInfo]);

  useEffect(() => {
    if (userTeams && userTeams.data) {
      const arr = [...membersData, ...userTeams.data];
      setMembersData([...new Map(arr.map((item) => [item.id, item])).values()]);
    } else if (userTeams && userTeams.err) {
      setMembersData([]);
    } else if (userTeams && userTeams.loading) {
      setMembersData([]);
    }
  }, [userTeams]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      const total = userTeams && userTeams.data ? userTeams.data.length : 0;
      if ((checkedRows && checkedRows.length + 1 === total)) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = userTeams && userTeams.data ? userTeams.data : [];
      setCheckRows(data);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(assetData[i])}
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={assetData[i].name}
              checked={checkedRows && checkedRows.length && checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              onChange={handleTableCellChange}
            />
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].team_type)}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].team_category_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].company_id))}</td>
          <td className="p-2">
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => {
                  setRemoveId(assetData[i].id);
                  setRemoveName(assetData[i].name);
                  setDeleteModal(true);
                }}
              />
            </Tooltip>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const updateTeam = () => {
    const tid = userDetails && userDetails.data && userDetails.data.length ? userDetails.data[0].id : '';
    if (selectedMembers && selectedMembers.length > 0) {
      const arr = [...selectedMembers, ...membersData];
      const postData = { maintenance_team_ids: [[6, 0, getColumnArrayById(arr, 'id')]] };
      dispatch(updateUserTeams(appModels.TEAMMEMEBERS, tid, postData));
      dispatch(resetSelectedMembers());
    }
  };

  const deleteTeamMember = () => {
    const tid = userDetails && userDetails.data && userDetails.data.length ? userDetails.data[0].id : '';
    if (removeId) {
      // const fData = generateArrayFromValueNotIn(membersData, 'id', removeId);
      // const postData = { maintenance_team_ids: [[6, 0, getColumnArrayById(fData, 'id')]] };
      // dispatch(updateUser(tid, postData, appModels.TEAMMEMEBERS));
      dispatch(teamDelete(tid, removeId));
      setRemoveId(false);
      setRemoveName(false);
    }
  };

  const deleteTeamMemberBulk = () => {
    const tid = userDetails && userDetails.data && userDetails.data.length ? userDetails.data[0].id : '';
    if (rowselected && rowselected.length) {
      const ids = getColumnArrayById(rowselected, 'id');
      // const fData = getArrayFromValuesById(membersData, ids, 'id');
      // const postData = { maintenance_team_ids: [[6, 0, getColumnArrayById(fData, 'id')]] };
      dispatch(teamDelete(tid, ids));
      setRowselected([]);
    }
  };

  const cancelUpdate = (loadDetails) => {
    setUpdateModal(false);
    dispatch(resetSelectedMembers());
    dispatch(resetUpdateUser());
    if (loadDetails) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, userDetails.data[0].id));
    }
    dispatch(resetUpdateTeams());
  };

  const cancelDelete = (loadDetails) => {
    setDeleteModal(false);
    dispatch(resetSelectedMembers());
    dispatch(resetDeleteTeam());
    if (loadDetails) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, userDetails.data[0].id));
    }
  };

  const cancelBulkDelete = (loadDetails) => {
    setDeleteModalBulk(false);
    setRowselected([]);
    dispatch(resetSelectedMembers());
    dispatch(resetDeleteTeam());
    if (loadDetails) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, userDetails.data[0].id));
    }
  };

  const showExtraModal = () => {
    setModelValue(appModels.TEAM);
    setModalName('Teams');
    setOtherFieldName('not_in');
    setOtherFieldValue(membersData && membersData.length > 0 ? getColumnArrayById(membersData, 'id') : []);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onSearchChange = (e) => {
    if (e && e.quickFilterValues && e.quickFilterValues.length && e.quickFilterValues[0].length > 1) {
      const filterValue = e?.quickFilterValues?.[0];
      if (filterValue && filterValue.length > 0) {
        const ndata = membersData.filter((item) => {
          const searchValue = item.name ? item.name.toString().toUpperCase() : '';
          const s = filterValue.toString().toUpperCase();
          return (searchValue.search(s) !== -1);
        });
        setMembersData(ndata);
      } else {
        setMembersData(userTeams && userTeams.data ? userTeams.data : []);
      }

      if (e.key === 'Enter') {
        if (filterValue && filterValue.length > 0) {
          const ndata = membersData.filter((item) => {
            const searchValue = item.name ? item.name.toString().toUpperCase() : '';
            const s = filterValue.toString().toUpperCase();
            return (searchValue.search(s) !== -1);
          });
          setMembersData(ndata);
        } else {
          setMembersData(userTeams && userTeams.data ? userTeams.data : []);
        }
      }
    } else {
      setMembersData(userTeams && userTeams.data ? userTeams.data : []);
    }
  };

  const onClickDelete = (id, name) => {
    setRemoveId(id);
    setRemoveName(name || false);
    setDeleteModal(true);
  };

  const handlePageChange = (data) => {
    const { page, pageSize } = data;
    if (pageSize !== limit) {
      setLimit(pageSize);
    }
    const offsetValue = page * pageSize;
    setOffset(offsetValue);
    setPage(page);
  };

  const userLoading = userDetails && userDetails.loading;
  const tableColumns = teamsUserColumns(onClickDelete);

  return (
    userLoading ? <Loader />
      : (
        <Row className="ml-2 mr-2">
          <Col sm="12" md="12" lg="12" xs="12" className="comments-list thin-scrollbar">
            {/* <Row>
              <Col sm="12" md="7" lg="7" xs="12">
                <span aria-hidden="true" className="cursor-pointer" onClick={() => showExtraModal()}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="text-lightblue mr-5">Add Teams</span>
                </span>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="mt-n15px">
                {userTeams && userTeams.data && userTeams.data.length > 10 && (
                  <FormGroup>
                    <Input
                      type="input"
                      name="search"
                      id="exampleSearch"
                      placeholder="Search"
                      onKeyDown={onSearchChange}
                      onChange={onSearchChange}
                      className="subjectticket bw-2 mt-2"
                    />
                  </FormGroup>
                )}
              </Col>
            </Row>
            {checkedRows && checkedRows.length > 0 && (
              <div aria-hidden="true" className="cursor-pointer float-right" onClick={() => setDeleteModalBulk(true)}>
                <FontAwesomeIcon
                  className="mr-1 ml-1 cursor-pointer"
                  size="sm"
                  icon={faTrashAlt}
                />
                Delete (
                {checkedRows.length}
                )
              </div>
            )} */}
            {/* {(membersData && membersData.length > 0) && ( */}
            <div>
              <CommonGrid
                className="tickets-table"
                tableData={
                        membersData && membersData.length
                          ? membersData
                          : []
        }
                componentClassName="commonGrid"
                rows={rows}
                columns={tableColumns}
                rowHeight={45}
                setRows={setRows}
                      // loadingData={loadingData}
                moduleName="Teams List"
                appModelsName={appModels.TEAM}
                listCount={membersData && membersData.length}
                createOption={{
                  enable: true,
                  text: 'Add Team',
                  func: () => showExtraModal(true),
                }}
                deleteOption={rowselected && rowselected.length > 0 ? {
                  enable: true,
                  text: 'Bulk Delete',
                  count: rowselected.length,
                  func: () => setDeleteModalBulk(true),
                } : false}
                handlePageChange={handlePageChange}
                page={currentPage}
                rowCount={membersData && membersData.length}
                limit={limit}
                ishideEditable
                onFilterChanges={onSearchChange}
                      // visibleColumns={visibleColumns}
                      // setVisibleColumns={setVisibleColumns}
                setRowselected={setRowselected}
                rowselected={rowselected}
                isStickyFooter
                ishideDateFilter
                ishideColumns
                ishideExport
                ishidePagination
              />
              {/* <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="w-5">
                        <Checkbox
                          sx={{
                            transform: 'scale(0.9)',
                            padding: '0px',
                          }}
                          value="all"
                          name="checkall"
                          id="checkboxtkhead1"
                          checked={isAllChecked}
                          onChange={handleTableCellAllChange}
                        />
                      </th>
                      <th className="p-2 min-width-160">
                        Name
                      </th>
                      <th className="p-2 min-width-160">
                        Type
                      </th>
                      <th className="p-2 min-width-160">
                        Category
                      </th>
                      <th className="p-2 min-width-100">
                        Company
                      </th>
                      <th className="p-2 min-width-100">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(membersData && membersData.length > 0 ? membersData : [])}
                  </tbody>
                </Table> */}
              <hr className="m-0" />
            </div>
            {/* )} */}
            {userTeams && ((userTeams.data && userTeams.data.length === 0) || userTeams.err) && (
              <ErrorContent errorTxt={userTeams.err ? generateErrorMessage(userTeams) : 'No Data Found'} />
            )}
            <Dialog size="lg" fullWidth open={extraModal}>
              <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <SearchModal
                    modelName={modelValue}
                    afterReset={() => { setExtraModal(false); }}
                    fields={columns}
                    company={getAllowedCompaniesCase(userInfo)}
                    otherFieldName={otherFieldName}
                    otherFieldValue={otherFieldValue}
                    modalName={modalName}
                    detailData={userDetails && userDetails.data && userDetails.data.length ? userDetails.data[0] : ''}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {selectedMembers && selectedMembers.length && selectedMembers.length > 0
                  ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="contained"
                      onClick={() => { setUpdateModal(true); setExtraModal(false); }}
                    >
                      {' '}
                      Add
                    </Button>
                  ) : ''}
              </DialogActions>
            </Dialog>
            <Dialog size={(updateTeamsInfo && updateTeamsInfo.data) ? 'sm' : 'md'} open={updateModal}>
              <DialogHeader title="Add Team" imagePath={false} onClose={() => { cancelUpdate(); }} response={updateTeamsInfo} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {updateTeamsInfo && (!updateTeamsInfo.data && !updateTeamsInfo.loading && !updateTeamsInfo.err) && (
                    <p className="text-center">
                      Are you sure, you want to add selected teams ?
                    </p>
                  )}
                  {updateTeamsInfo && updateTeamsInfo.loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(updateTeamsInfo && updateTeamsInfo.err) && (
                    <SuccessAndErrorFormat response={updateTeamsInfo} />
                  )}
                  {(updateTeamsInfo && updateTeamsInfo.data) && (
                    <SuccessAndErrorFormat response={updateTeamsInfo} successMessage="Teams added successfully.." />
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {updateTeamsInfo && !updateTeamsInfo.data && (
                  <Button size="sm" disabled={updateTeamsInfo && updateTeamsInfo.loading} variant="contained" onClick={() => updateTeam()}>Confirm</Button>
                )}
                {updateTeamsInfo && updateTeamsInfo.data && (
                  <Button size="sm" variant="contained" onClick={() => cancelUpdate('loadDetails')}>Ok</Button>
                )}
              </DialogActions>
            </Dialog>
            <Dialog size={(deleteTeamInfo && deleteTeamInfo.data) ? 'sm' : 'md'} open={deleteModal}>
              <DialogHeader title="Delete Team" imagePath={false} onClose={() => { cancelDelete(); }} response={deleteTeamInfo} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {deleteTeamInfo && (!deleteTeamInfo.data && !deleteTeamInfo.loading && !deleteTeamInfo.err) && (
                    <p className="text-center">
                      {`Are you sure, you want to remove ${removeName} team ?`}
                    </p>
                  )}
                  {deleteTeamInfo && deleteTeamInfo.loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(deleteTeamInfo && deleteTeamInfo.err) && (
                    <SuccessAndErrorFormat response={deleteTeamInfo} />
                  )}
                  {(deleteTeamInfo && deleteTeamInfo.data) && (
                    <SuccessAndErrorFormat response={deleteTeamInfo} successMessage="Team deleted successfully.." />
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {deleteTeamInfo && !deleteTeamInfo.data && (
                  <Button size="sm" disabled={deleteTeamInfo && deleteTeamInfo.loading} variant="contained" onClick={() => deleteTeamMember()}>Confirm</Button>
                )}
                {deleteTeamInfo && deleteTeamInfo.data && (
                  <Button size="sm" variant="contained" onClick={() => cancelDelete('loadDetails')}>Ok</Button>
                )}
              </DialogActions>
            </Dialog>
            <Dialog size={(deleteTeamInfo && deleteTeamInfo.data) ? 'sm' : 'md'} open={deleteModalBulk}>
              <DialogHeader title="Delete Teams" imagePath={false} onClose={() => { cancelBulkDelete(); }} response={deleteTeamInfo} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {deleteTeamInfo && (!deleteTeamInfo.data && !deleteTeamInfo.loading && !deleteTeamInfo.err) && (
                    <p className="text-center">
                      Are you sure, you want to remove selected
                      (
                      {rowselected ? rowselected.length : 0}
                      ) teams ?
                    </p>
                  )}
                  {deleteTeamInfo && deleteTeamInfo.loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(deleteTeamInfo && deleteTeamInfo.err) && (
                    <SuccessAndErrorFormat response={deleteTeamInfo} />
                  )}
                  {(deleteTeamInfo && deleteTeamInfo.data) && (
                    <SuccessAndErrorFormat response={deleteTeamInfo} successMessage="Teams deleted successfully.." />
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {deleteTeamInfo && !deleteTeamInfo.data && (
                  <Button size="sm" disabled={deleteTeamInfo && deleteTeamInfo.loading} variant="contained" onClick={() => deleteTeamMemberBulk()}>Confirm</Button>
                )}
                {deleteTeamInfo && deleteTeamInfo.data && (
                  <Button size="sm" variant="contained" onClick={() => cancelBulkDelete('loadDetails')}>Ok</Button>
                )}
              </DialogActions>
            </Dialog>
            <DetailViewFormat detailResponse={userTeams} />
          </Col>
        </Row>
      )
  );
};

export default Teams;
