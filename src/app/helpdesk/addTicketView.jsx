import React, { useEffect } from 'react'
import { Box } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";

import CreateTicketForm from './forms/createTicketForm'
import {
    getHeaderTabs,
    getTabs,
    getActiveTab,
} from "../util/appUtils";
import helpdeskNav from "../helpdesk/navbar/navlist.json";
import { updateHeaderData } from '../core/header/actions';

const AddTicketView = () => {
    const { pinEnableData } = useSelector((state) => state.auth);
    const { userRoles } = useSelector((state) => state.user);

    const headerTabs = getHeaderTabs(
        userRoles?.data?.allowed_modules,
        "Helpdesk"
    );
    const dispatch = useDispatch()

    let activeTab;
    let tabs;
    if (headerTabs) {
        tabs = getTabs(headerTabs[0].menu, helpdeskNav.data);
        activeTab = getActiveTab(
            tabs.filter((e) => e),
            "Raise a ticket"
        );
    }

    useEffect(() => {
        dispatch(
            updateHeaderData({
                module: "Helpdesk",
                moduleName: "Helpdesk",
                menuName: "Raise A Ticket",
                link: "/helpdesk-insights-overview",
                headerTabs: tabs.filter((e) => e),
                activeTab,
            })
        );
    }, [activeTab]);

    return (
        <Box
        >
            <CreateTicketForm closeModal={() => { }} />
        </Box>
    )
}
export default AddTicketView