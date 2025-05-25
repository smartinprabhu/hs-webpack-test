import React from "react";
import { Box } from "@mui/system";
import { Typography, Divider } from "@mui/material";

import PropertyAndValue from "./propertyAndValue";
import { detailViewHeaderClass } from "./utils/util";

const DetailViewLeftPanel = ({ panelData, addtionalData }) => {
    return (
        <>
            {panelData && panelData.length ? panelData.map((data) => (
                <>
                    {data?.header && (
                        <>
                            <Typography
                                sx={detailViewHeaderClass}
                            >
                                {data?.header}
                            </Typography>
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
                                    {data.leftSideData && data.leftSideData.length ? data.leftSideData.map((leftData) => leftData.property && (
                                        <PropertyAndValue
                                            data={{
                                                property: leftData.property,
                                                value: leftData.value
                                            }}
                                        />
                                    )) : ''}
                                </Box>
                                <Box
                                    sx={{
                                        width: "50%",
                                    }}
                                >
                                    {data.rightSideData && data.rightSideData.length ? data.rightSideData.map((rightData) => rightData.property && (
                                        <PropertyAndValue
                                            data={{
                                                property: rightData.property,
                                                value: rightData.value
                                            }}
                                        />
                                    )) : ''}
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )) : ''
            }
            {addtionalData ? addtionalData : ''}
        </>
    )
}
export default DetailViewLeftPanel