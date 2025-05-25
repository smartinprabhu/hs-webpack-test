import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Col,
    Row,
    Modal,
    ModalBody
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import { TextField, FormHelperText } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import { getEquipmentList } from '../../helpdesk/ticketService';
import { getAllowedCompanies, generateErrorMessage } from '../../util/appUtils';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const EnergyMeters = ({ currentDashboard }) => {
    const module = 'Consumption Dashboards'
    const dispatch = useDispatch()
    const [isOldDashboard, setOldDashboard] = useState(false)
    const [equipmentKeyword, setEquipmentKeyword] = useState('');
    const [selectedEquip, setSelectedEquip] = useState('');
    const [extraModal, setExtraModal] = useState(false);
    const [equipmentOpen, setEquipmentOpen] = useState(false);
    const [defaultValueTrue, setDefaultValueTrue] = useState(true);

    const { userInfo } = useSelector((state) => state.user);
    const { ninjaDashboardCode, ninjaDashboard } = useSelector((state) => state.analytics);
    const { equipmentInfo } = useSelector((state) => state.ticket);

    const companies = getAllowedCompanies(userInfo);
    const categKeyword = 'energy meter'

    const loading = (ninjaDashboard && ninjaDashboard.loading) || (ninjaDashboardCode && ninjaDashboardCode.loading)

    useEffect(() => {
        if (userInfo && userInfo.data) {
            dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, false, false, false, false, categKeyword));
        }
    }, [userInfo, equipmentKeyword])

    const onEquipmentKeywordClear = () => {
        setEquipmentKeyword(null);
        setEquipmentOpen(false);
        setSelectedEquip(false)
    };

    const onEquipmentKeywordChange = (event) => {
        setEquipmentKeyword(event.target.value);
    };

    const showEquipmentModal = () => {
        setExtraModal(true);
    };

    let equipmentOptions = []

    if (equipmentInfo && equipmentInfo.loading) {
        equipmentOptions = [{ name: 'Loading..' }];
    }

    if (equipmentInfo && equipmentInfo.data) {
        const arr = [...equipmentOptions, ...equipmentInfo.data];
        equipmentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }

    if (equipmentInfo && equipmentInfo.err) {
        equipmentOptions = [];
    }

    useEffect(() => {
        if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && defaultValueTrue) {
            setSelectedEquip(equipmentInfo.data[0])
            setDefaultValueTrue(false)
        }
    }, [equipmentInfo])

    return (
        <>
            <Row>
                <Col sm="4" md="4" lg="4" xs="12" className="p-3">
                    <Autocomplete
                        name="Equipment"
                        labelClassName="mb-1"
                        formGroupClassName="mb-1 w-100"
                        value={selectedEquip}
                        open={equipmentOpen}
                        size="small"
                        onOpen={() => {
                            setEquipmentKeyword('');
                            setEquipmentOpen(true)
                        }}
                        onClose={() => {
                            setEquipmentOpen(false);
                            setEquipmentKeyword('');
                        }}
                        onChange={(e, option) => {
                            setSelectedEquip(option)
                        }}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        renderOption={(option) => (
                            <>
                                <h6 className="mb-1">{option.name}</h6>
                                <p className="font-tiny ml-2 mb-0 mt-0">{option.location_id ? option.location_id[1] : ''}</p>
                            </>
                        )}
                        disabled={loading}
                        options={equipmentOptions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                onChange={onEquipmentKeywordChange}
                                variant="outlined"
                                placeholder="Search & Select"
                                value={equipmentKeyword}
                                className={(selectedEquip || (equipmentKeyword && equipmentKeyword.length > 0))
                                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            <InputAdornment position="end">
                                                {(selectedEquip || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={onEquipmentKeywordClear}
                                                        disabled={loading}
                                                    >
                                                        <BackspaceIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    aria-label="toggle search visibility"
                                                    onClick={showEquipmentModal}
                                                    disabled={loading}
                                                >
                                                    <SearchIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    {(equipmentInfo && equipmentInfo.err && equipmentOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}

                </Col>
                <Col sm="12" md="12" lg="12" xs="12" className="p-0">
                    <SharedDashboard
                        moduleName={module}
                        menuName={currentDashboard.name}
                        setOldDashboard={setOldDashboard}
                        isOldDashboard={isOldDashboard}
                        advanceFilter={selectedEquip && selectedEquip.id ? `[('equipment_id.id','=',${selectedEquip.id})]` : false}
                    />
                </Col>
                <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
                    <ModalHeaderComponent title={'Equipment'} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
                    <ModalBody className="mt-0 pt-0">
                        <SingleSearchModal
                            modelName={appModels.EQUIPMENT}
                            afterReset={() => { setExtraModal(false); }}
                            fieldName={'equipment_id'}
                            fields={['id', 'name', 'location_id', 'category_id', 'maintenance_team_id']}
                            headers={['Name', 'Location', 'Maintenance Team']}
                            columns={['name', 'location_id', 'maintenance_team_id']}
                            company={userInfo && userInfo.data ? companies : ''}
                            otherFieldName={'category_id'}
                            otherFieldValue={categKeyword}
                            setFieldValue={setSelectedEquip}
                            setSelectOption={true}
                        />
                    </ModalBody>
                </Modal>
            </Row>
        </>
    )
}
export default EnergyMeters;