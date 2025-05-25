/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog, DialogContent, DialogContentText, DialogActions, Button, Checkbox,
} from '@mui/material';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import DialogHeader from '../../../commonComponents/dialogHeader';

import {
  extractTextObject, getAllowedCompanies,
  getArrayNewFormat,
  getArrayNewFormatUpdateDelete,
  getColumnArrayByIdWithArray,
  getDefaultNoValue,
} from '../../../util/appUtils';
import { MemberColumns } from '../../../commonComponents/gridColumnsEditable';
import { getEmployeeMembers } from '../../../workorders/workorderService';
import {
  editTeam, getTeamDetail, resetEditTeam, resetSelectedMembers,
} from '../../setupService';
import SearchModal from './searchModal';

const appModels = require('../../../util/appModels').default;

const Members = () => {
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
  const [deleteModalBulk, setDeleteModalBulk] = useState(false);
  const [removeId, setRemoveId] = useState(false);
  const [removeName, setRemoveName] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const columns = ['name', 'work_email', 'user_id'];

  const { userInfo } = useSelector((state) => state.user);
  const { siteDetails } = useSelector((state) => state.site);

  // const companies = getAllowedCompanies(userInfo);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  const { teamDetail, selectedMembers, editTeamInfo } = useSelector((state) => state.setup);

  const { employeeMembers } = useSelector((state) => state.workorder);

  useEffect(() => {
    dispatch(resetSelectedMembers());
    dispatch(resetEditTeam());
    setMembersData([]);
    setCheckRows([]);
  }, []);

  useEffect(() => {
    if (membersData && membersData.length) {
      setRows(membersData);
    } else {
      setRows([]);
    }
  }, [membersData]);

  useEffect(() => {
    if (teamDetail && teamDetail.data && teamDetail.data.length) {
      dispatch(getEmployeeMembers(companies, appModels.EMPLOYEEMEMBERS, false, teamDetail.data[0].member_ids, 200));
      setMembersData([]);
    }
  }, [teamDetail]);

  useEffect(() => {
    if (employeeMembers && employeeMembers.data) {
      const arr = [...membersData, ...employeeMembers.data];
      setMembersData([...new Map(arr.map((item) => [item.id, item])).values()]);
    } else if (employeeMembers && employeeMembers.err) {
      setMembersData([]);
    } else if (employeeMembers && employeeMembers.loading) {
      setMembersData([]);
    }
  }, [employeeMembers]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      const total = employeeMembers && employeeMembers.data ? employeeMembers.data.length : 0;
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
      const data = employeeMembers && employeeMembers.data ? employeeMembers.data : [];
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
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].employee_id))}</td>
          {/* <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].user_id))}</td> */}
          <td className="p-2">
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => {
                  setRemoveId(assetData[i].id);
                  setRemoveName(assetData[i].employee_id ? assetData[i].employee_id[1] : false);
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
    const tid = teamDetail && teamDetail.data && teamDetail.data.length ? teamDetail.data[0].id : '';
    if (selectedMembers && selectedMembers.length > 0) {
      const newArr = selectedMembers.map((cl) => ({
        employee_id: cl.id,
      }));
      const postData = { member_ids: getArrayNewFormat(newArr) };
      dispatch(editTeam(tid, appModels.TEAM, postData));
      dispatch(resetSelectedMembers());
    }
  };

  const deleteTeamMember = () => {
    const tid = teamDetail && teamDetail.data && teamDetail.data.length ? teamDetail.data[0].id : '';
    if (removeId) {
      const postData = { member_ids: [[2, removeId, false]] };
      dispatch(editTeam(tid, appModels.TEAM, postData));
      setRemoveId(false);
      setRemoveName(false);
    }
  };

  const deleteTeamMemberBulk = () => {
    const tid = teamDetail && teamDetail.data && teamDetail.data.length ? teamDetail.data[0].id : '';
    if (checkedRows && checkedRows.length) {
      const newArr = checkedRows.map((cl) => ({
        id: cl.id, isRemove: true,
      }));
      const postData = { member_ids: getArrayNewFormatUpdateDelete(newArr) };
      dispatch(editTeam(tid, appModels.TEAM, postData));
      setCheckRows([]);
    }
  };

  const cancelUpdate = (loadDetails) => {
    setUpdateModal(false);
    dispatch(resetSelectedMembers());
    dispatch(resetEditTeam());
    if (loadDetails) {
      dispatch(getTeamDetail(teamDetail.data[0].id, appModels.TEAM));
    }
  };

  const cancelDelete = (loadDetails) => {
    setDeleteModal(false);
    dispatch(resetSelectedMembers());
    dispatch(resetEditTeam());
    if (loadDetails) {
      dispatch(getTeamDetail(teamDetail.data[0].id, appModels.TEAM));
    }
  };

  const cancelBulkDelete = (loadDetails) => {
    setDeleteModalBulk(false);
    setCheckRows([]);
    dispatch(resetSelectedMembers());
    dispatch(resetEditTeam());
    if (loadDetails) {
      dispatch(getTeamDetail(teamDetail.data[0].id, appModels.TEAM));
    }
  };

  const showExtraModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setModalName('Team Members');
    setOtherFieldName('not_in');
    setOtherFieldValue(membersData && membersData.length > 0 ? getColumnArrayByIdWithArray(membersData, 'employee_id') : []);
    setCompanyValue(companies);
    setExtraModal(true);
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

  const onSearchChange = (e) => {
    if (e && e.quickFilterValues && e.quickFilterValues.length && e.quickFilterValues[0].length > 1) {
      const filterValue = e?.quickFilterValues?.[0];
      if (filterValue && filterValue.length > 0) {
        const ndata = membersData.filter((item) => {
          const searchValue = item.employee_id ? item.employee_id[1].toString().toUpperCase() : '';
          const s = filterValue.toString().toUpperCase();
          return (searchValue.search(s) !== -1);
        });
        setMembersData(ndata);
      } else {
        setMembersData(employeeMembers && employeeMembers.data ? employeeMembers.data : []);
      }

      if (e.key === 'Enter') {
        if (filterValue && filterValue.length > 0) {
          const ndata = membersData.filter((item) => {
            const searchValue = item.employee_id ? item.employee_id[1].toString().toUpperCase() : '';
            const s = filterValue.toString().toUpperCase();
            return (searchValue.search(s) !== -1);
          });
          setMembersData(ndata);
        } else {
          setMembersData(employeeMembers && employeeMembers.data ? employeeMembers.data : []);
        }
      }
    } else {
      setMembersData(employeeMembers && employeeMembers.data ? employeeMembers.data : []);
    }
  };

  const teamLoading = teamDetail && teamDetail.loading;

  const onClickDelete = (id, employee_id) => {
    setRemoveId(id);
    setRemoveName(employee_id ? employee_id[1] : false);
    setDeleteModal(true);
  };

  const tableColumns = MemberColumns(onClickDelete);

  return (
    teamLoading ? <Loader />
      : (
        <Card>
          <CardBody className="pl-3 pb-0 pt-0 pr-0">
            <Row>
              <Col sm="12" md="12" lg="12" xs="12" className="comments-list thin-scrollbar">
                {/* <Row>
                   <Col sm="12" md="7" lg="7" xs="12">
                    <span aria-hidden="true" className="cursor-pointer" onClick={() => showExtraModal()}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addteam" height="15" width="15" />
                      <span className="text-lightblue mr-5">Add Team Members</span>
                    </span>
                  </Col>
                  {/* <Col sm="12" md="5" lg="5" xs="12" className="mt-n15px">
                    {employeeMembers && employeeMembers.data && employeeMembers.data.length > 10 && (
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
                <div>
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
                            Technician
                          </th>
                          {/* <th className="p-2 min-width-160">
                        User
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
                    moduleName="Team Members List"
                    appModelsName={appModels.TEAM}
                    listCount={membersData && membersData.length}
                    createOption={{
                      enable: true,
                      text: 'Add Team Members',
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
                </div>
                <Dialog size="lg" fullWidth open={extraModal}>
                  <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <SearchModal
                        modelName={modelValue}
                        afterReset={() => { setExtraModal(false); }}
                        fields={columns}
                        company={companyValue}
                        otherFieldName={otherFieldName}
                        otherFieldValue={otherFieldValue}
                        modalName={modalName}
                      />

                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    {selectedMembers && selectedMembers.length && selectedMembers.length > 0
                      ? (
                        <Button
                          type="button"
                          variant="contained"
                          size="sm"
                          onClick={() => { setUpdateModal(true); setExtraModal(false); }}
                        >
                          {' '}
                          Add
                        </Button>
                      ) : ''}
                  </DialogActions>
                </Dialog>
                <Dialog size={(editTeamInfo && editTeamInfo.data) ? 'sm' : 'md'} open={updateModal}>
                  <DialogHeader title="Add Team Members" imagePath={false} onClose={() => cancelUpdate()} response={editTeamInfo} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      {editTeamInfo && (!editTeamInfo.data && !editTeamInfo.loading && !editTeamInfo.err) && (
                        <p className="text-center">
                          Are you sure, you want to add selected (
                          {selectedMembers ? selectedMembers.length : 0}
                          ) members ?
                        </p>
                      )}
                      {editTeamInfo && editTeamInfo.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                      )}
                      {(editTeamInfo && editTeamInfo.err) && (
                        <SuccessAndErrorFormat response={editTeamInfo} />
                      )}
                      {(editTeamInfo && editTeamInfo.data) && (
                        <SuccessAndErrorFormat response={editTeamInfo} successMessage="Members added successfully.." />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    {editTeamInfo && !editTeamInfo.data && (
                      <Button size="sm" variant="contained" disabled={editTeamInfo && editTeamInfo.loading} onClick={() => updateTeam()}>Confirm</Button>
                    )}
                    {editTeamInfo && editTeamInfo.data && (
                      <Button size="sm" variant="contained" onClick={() => cancelUpdate('loadDetails')}>Ok</Button>
                    )}
                  </DialogActions>
                </Dialog>
                <Dialog size={(editTeamInfo && editTeamInfo.data) ? 'sm' : 'md'} open={deleteModal}>
                  <DialogHeader title="Delete Team Member" imagePath={false} onClose={() => { cancelDelete(); }} response={editTeamInfo} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      {editTeamInfo && (!editTeamInfo.data && !editTeamInfo.loading && !editTeamInfo.err) && (
                        <p className="text-center">
                          {`Are you sure, you want to remove ${removeName} member ?`}
                        </p>
                      )}
                      {editTeamInfo && editTeamInfo.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                      )}
                      {(editTeamInfo && editTeamInfo.err) && (
                        <SuccessAndErrorFormat response={editTeamInfo} />
                      )}
                      {(editTeamInfo && editTeamInfo.data) && (
                        <SuccessAndErrorFormat response={editTeamInfo} successMessage="Member deleted successfully.." />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    {editTeamInfo && !editTeamInfo.data && (
                      <Button size="sm" variant="contained" disabled={editTeamInfo && editTeamInfo.loading} onClick={() => deleteTeamMember()}>Confirm</Button>
                    )}
                    {editTeamInfo && editTeamInfo.data && (
                      <Button size="sm" variant="contained" onClick={() => cancelDelete('loadDetails')}>Ok</Button>
                    )}
                  </DialogActions>
                </Dialog>
                <Dialog size={(editTeamInfo && editTeamInfo.data) ? 'sm' : 'md'} open={deleteModalBulk}>
                  <DialogHeader title="Delete Team Members" imagePath={false} onClose={() => cancelBulkDelete()} response={editTeamInfo} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      {editTeamInfo && (!editTeamInfo.data && !editTeamInfo.loading && !editTeamInfo.err) && (
                        <p className="text-center">
                          Are you sure, you want to remove selected (
                          {checkedRows ? checkedRows.length : 0}
                          ) members ?
                        </p>
                      )}
                      {editTeamInfo && editTeamInfo.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                      )}
                      {(editTeamInfo && editTeamInfo.err) && (
                        <SuccessAndErrorFormat response={editTeamInfo} />
                      )}
                      {(editTeamInfo && editTeamInfo.data) && (
                        <SuccessAndErrorFormat response={editTeamInfo} successMessage="Members deleted successfully.." />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    {editTeamInfo && !editTeamInfo.data && (
                      <Button size="sm" variant="contained" disabled={editTeamInfo && editTeamInfo.loading} onClick={() => deleteTeamMemberBulk()}>Confirm</Button>
                    )}
                    {editTeamInfo && editTeamInfo.data && (
                      <Button size="sm" variant="contained" onClick={() => cancelBulkDelete('loadDetails')}>Ok</Button>
                    )}
                  </DialogActions>
                </Dialog>
                <DetailViewFormat detailResponse={employeeMembers} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )
  );
};

Members.propTypes = {
  memberIds: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

Members.defaultProps = {
  memberIds: false,
};

export default Members;
