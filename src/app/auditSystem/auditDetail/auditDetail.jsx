import * as PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '@shared/loading';
import AuditDetailInfo from './auditDetailInfo';

const AuditDetail = ({ setViewModal, editModal, closeEditAudit, editId, showEditModal, setEditId}) => {
  const { auditDetail } = useSelector((state) => state.audit);

  return (
    <>
    {auditDetail && auditDetail.loading ? <Loader/> : 
      <AuditDetailInfo detailData={auditDetail} setDetailModal={setViewModal} editModal={editModal} closeEditAudit={closeEditAudit} editId={editId} showEditModal={showEditModal} setEditId={setEditId}/>
    }
    </>
  );
};

AuditDetail.propTypes = {
  setViewModal: PropTypes.func.isRequired,
  closeEditAudit: PropTypes.func.isRequired,
  setEditId: PropTypes.func.isRequired,
};

export default AuditDetail;
