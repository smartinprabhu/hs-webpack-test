import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { FaTimesCircle } from 'react-icons/fa'
import { AiFillCheckCircle } from 'react-icons/ai'
import { Drawer, Button } from "@mui/material";

import Loader from "@shared/loading";
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';
import ErrorContent from "@shared/errorContent";

import DrawerHeader from "../../commonComponents/drawerHeader";
import actionCodes from '../data/actionCodes.json';
import {
    getDefaultNoValue,
    extractNameObject,
    getCompanyTimezoneDate,
    TabPanel,
    getTimeFromDecimal,
    generateErrorMessage,
    getListOfOperations
} from "../../util/appUtils";
import DetailViewHeader from "../../commonComponents/detailViewHeader";
import DetailViewTab from "../../commonComponents/detailViewTab";
import DetailViewRightPanel from "../../commonComponents/detailViewRightPanel";
import DetailViewLeftPanel from "../../commonComponents/detailViewLeftPanel";
import CancelDateRange from "./cancelDateRange";
import { workOrderPrioritiesJson } from '../../commonComponents/utils/util';
import AddInspectionChecklist from '../addInspectionChecklist';
import { detailViewHeaderClass } from "../../commonComponents/utils/util";

const InspectionDetails = ({ editId, setEditId, onEditReset, isWarehouse = false }) => {
    const tabs = ["Inspection Overview", "Options","Cancel Date Range"];
    const { userInfo, userRoles } = useSelector((state) => state.user);
    const {
        inspectionSchedulerDetail,
    } = useSelector((state) => state.inspection);

    const [value, setValue] = useState(0);

    const detailedData = inspectionSchedulerDetail?.data?.[0];
    const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    const checkWorkOrderPriority = (val) => {
        return (
            <Box>
                {workOrderPrioritiesJson.map(
                    (priority) =>
                        val === priority.priority && (
                            <Typography
                                sx={{
                                    color: priority.color,
                                }}
                            >
                                {priority.text}
                            </Typography>
                        )
                )}
            </Box>
        );
    };
    const returnCheckIcon = (showGreen, showText) => (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                margin: "5px 0px 5px 0px",
                minHeight: "50px",
            }}
        >
            <Typography>
                {showGreen ? <AiFillCheckCircle
                    size={15}
                    cursor="pointer"
                    className="mr-1"
                    style={{ color: "green" }}

                /> :
                    <FaTimesCircle
                        size={15}
                        cursor="pointer"
                        className="mr-1"
                        style={{ color: "red" }}
                    />}
                {showText}
            </Typography>
        </Box>
    )
    const [editLink, setEditLink] = useState(false);

    return (
        <>
            {detailedData && (
                <>
                    <Box>
                        <DetailViewHeader
                            mainHeader={getDefaultNoValue(detailedData.category_type === 'Equipment' ? extractNameObject(detailedData.equipment_id, 'name') : extractNameObject(detailedData.space_id, 'space_name'))}
                            subHeader={
                                <>
                                    {detailedData.category_type === 'Equipment' ? getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'equipment_seq'))
                                        : getDefaultNoValue(extractNameObject(detailedData.space_id, 'sequence_asset_hierarchy'))}
                                </>
                            }
                            actionComponent={
                                <Box>
                                    {allowedOperations.includes(actionCodes['Edit Inspection Schedule']) && !isWarehouse && (
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                '&:hover': {
                                                    backgroundColor: "#fff",
                                                }
                                            }}
                                            className="ticket-btn"
                                            onClick={() => {
                                                setEditId(detailedData.id);
                                                setEditLink(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>
                            }
                        />
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                height: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "75%",
                                }}
                            >
                                <DetailViewTab
                                    value={value}
                                    handleChange={handleTabChange}
                                    tabs={tabs}
                                />
                                <TabPanel value={value} index={0}>
                                    <DetailViewLeftPanel
                                        panelData={[
                                            {
                                                header: "Asset Information",
                                                leftSideData:
                                                    [
                                                        {
                                                            property: "Type",
                                                            value: getDefaultNoValue(detailedData.category_type),
                                                        },
                                                        {
                                                            property: detailedData.category_type === 'Equipment' ? "Equipment" : "Space",
                                                            value: detailedData.category_type === 'Equipment' ? getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'name')) : getDefaultNoValue(extractNameObject(detailedData.space_id, 'path_name')),
                                                        },                                                        
                                                        {
                                                            property: "Region",
                                                            value: getDefaultNoValue(extractNameObject(detailedData.region_id, 'name')),
                                                        },
                                                    ],
                                                rightSideData:
                                                    [
                                                        {
                                                            property: "Asset Number",
                                                            value: getDefaultNoValue(detailedData.asset_number),
                                                        },
                                                        {
                                                            property: "Company",
                                                            value: extractNameObject(detailedData.company_id, 'name')
                                                        },
                                                    ]
                                            },
                                            {
                                                header: "Maintenance Information",
                                                leftSideData:
                                                    [
                                                        {
                                                            property: "Maintenance Team",
                                                            value: getDefaultNoValue(extractNameObject(detailedData.maintenance_team_id, 'name')),
                                                        },
                                                        {
                                                            property: "Checklist",
                                                            value: getDefaultNoValue(extractNameObject(detailedData.check_list_id, 'name')),
                                                        },
                                                        {
                                                            property: "Duration",
                                                            value: getTimeFromDecimal(detailedData.duration),
                                                        },
                                                    ],
                                                rightSideData:
                                                    [
                                                        {
                                                            property: "Maintenance Operation",
                                                            value: getDefaultNoValue(extractNameObject(detailedData.task_id, 'name')),
                                                        },
                                                        {
                                                            property: "Starts At",
                                                            value: getTimeFromDecimal(detailedData.starts_at)
                                                        },
                                                        {
                                                            property: "Exclude Holidays?",
                                                            value: <span className={` ${detailedData.is_exclude_holidays ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{detailedData.is_exclude_holidays ? 'Yes' : 'No'}</span>,
                                                        },
                                                    ]
                                            },
                                            {
                                                header: "Schedule Information",
                                                leftSideData:
                                                    [
                                                        {
                                                            property: "Commences On",
                                                            value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.commences_on, userInfo, 'datetime')),
                                                        },
                                                        {
                                                            property: "Parent Schedule",
                                                            value: getDefaultNoValue(detailedData.parent_id && detailedData.parent_id.group_id && detailedData.parent_id.group_id.name ? detailedData.parent_id.group_id.name : '')
                                                        },
                                                        {
                                                            property: "Description",
                                                            value: getDefaultNoValue(detailedData.description),
                                                        },

                                                    ],
                                                rightSideData:
                                                    [
                                                        {
                                                            property: "Ends On",
                                                            value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.ends_on, userInfo, 'datetime')),
                                                        },
                                                        {
                                                            property: "Enable Time Tracking?",
                                                            value: <span className={` ${detailedData.is_enable_time_tracking ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{detailedData.is_enable_time_tracking ? 'Yes' : 'No'}</span>,
                                                        },

                                                    ]
                                            },
                                            {
                                                header: "Notifications",
                                                leftSideData:
                                                    [
                                                        {
                                                            property: "Remind Before",
                                                            value: getTimeFromDecimal(detailedData.remind_before)
                                                        },
                                                        {
                                                            property: "Missed Alert?",
                                                            value: < span className={` ${detailedData.is_missed_alert ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`
                                                            } > {detailedData.is_missed_alert ? 'Yes' : 'No'}</span>,
                                                        },

                                                    ],
                                                rightSideData:
                                                    [
                                                        {
                                                            property: "Recipients",
                                                            value: getDefaultNoValue(extractNameObject(detailedData.recipients_id, 'name')),
                                                        },

                                                    ]
                                            }
                                        ]}
                                    />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >

                                                Photo Required
                                            </Typography>
                                            {returnCheckIcon(detailedData.at_start_mro, 'At Start')}
                                            {returnCheckIcon(detailedData.at_review_mro, 'At Review')}
                                            {returnCheckIcon(detailedData.at_done_mro, 'At Done')}
                                        </Box>
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >
                                                Enforce Time
                                            </Typography>
                                            {returnCheckIcon(detailedData.enforce_time, 'Enforce Time')}
                                            {returnCheckIcon(detailedData.is_allow_future, 'Allow Future')}
                                            {returnCheckIcon(detailedData.is_allow_past, 'Allow Past')}
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >
                                                QR
                                            </Typography>
                                            {returnCheckIcon(detailedData.qr_scan_at_start, 'QR Scan At Start')}
                                            {returnCheckIcon(detailedData.qr_scan_at_done, 'QR Scan At Done')}
                                        </Box>
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >
                                                NFC
                                            </Typography>
                                            {returnCheckIcon(detailedData.nfc_scan_at_start, 'NFC Scan At Start')}
                                            {returnCheckIcon(detailedData.nfc_scan_at_done, 'NFC Scan At Done')}
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >
                                                EXCLUDE DAYS
                                            </Typography>
                                           
                                            <Box sx={{ width: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, auto)',  mt: 1 }}>
  {returnCheckIcon(detailedData.mo, 'Monday')}
  {returnCheckIcon(detailedData.tu, 'Tuesday')}
  {returnCheckIcon(detailedData.we, 'Wednesday')}
  {returnCheckIcon(detailedData.th, 'Thursday')}

  {returnCheckIcon(detailedData.fr, 'Friday')}
  {returnCheckIcon(detailedData.sa, 'Saturday')}
  {returnCheckIcon(detailedData.su, 'Sunday')}
  <Box /> {/* Empty cell to keep 4-column structure */}
</Box>                      </Box>
                                        <Box
                                            sx={{
                                                width: "50%",
                                            }}
                                        >
                                            <Typography
                                                sx={detailViewHeaderClass}
                                            >
                                                Abnormal
                                            </Typography>
                                            {returnCheckIcon(detailedData.is_create_alarm, 'Create Alarm?')}
                                            {returnCheckIcon(detailedData.is_send_email, 'Send Email?')}
                                        </Box>
                                    </Box>
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                        }}
                                    >
                                       
                                    </Box>
<CancelDateRange detailData={detailedData.date_range_ids} />
                                </TabPanel>
                            </Box>
                            <Box
                                sx={{
                                    width: "25%",
                                    height: "100%",
                                    backgroundColor: "#F6F8FA",
                                }}
                            >
                                <DetailViewRightPanel
                                    panelOneHeader="Location"
                                    panelOneLabel={detailedData.category_type === 'Equipment'
                                        ? getDefaultNoValue(detailedData.equipment_id && detailedData.equipment_id.location_id && detailedData.equipment_id.location_id.path_name
                                            ? detailedData.equipment_id.location_id.path_name : '')
                                        : getDefaultNoValue(extractNameObject(detailedData.space_id, 'path_name'))}
                                    panelOneValue1={getDefaultNoValue(detailedData.asset_number)}
                                    panelThreeHeader="Inspection Information"
                                    panelThreeData={[
                                        {
                                            header: "Priority",
                                            value:
                                                <>
                                                    {checkWorkOrderPriority(detailedData.priority)}
                                                </>
                                        },
                                    ]}
                                />
                            </Box>

                        </Box>
                    </Box >
                </>
            )}
            {inspectionSchedulerDetail && inspectionSchedulerDetail.loading && <Loader />}
            {inspectionSchedulerDetail && inspectionSchedulerDetail.err && (
                <ErrorContent errorTxt={generateErrorMessage(inspectionSchedulerDetail)} />
            )}
            <Drawer
                PaperProps={{
                    sx: { width: "85%" },
                }}
                anchor="right"
                open={editLink}
            >
                <DrawerHeader
                    headerName={"Update Inspection Checklist"}
                    imagePath={InspectionIcon}
                    onClose={() => {
                        setEditLink(false);
                    }}
                />
                <AddInspectionChecklist
                    editId={editId}
                    closeModal={() => setEditLink(false)}
                    isShow={editLink}
                    afterReset={() => { setEditLink(false), onEditReset() }}
                />
            </Drawer>
        </>
    )
}
export default InspectionDetails