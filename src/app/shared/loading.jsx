import React from "react";
import * as PropTypes from "prop-types";
// import { Circles } from "react-loader-spinner";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = (props) => {
  const { color } = props;
  return (
    <div className="content-inner-box">
      <CircularProgress color="primary" disableShrink />
    </div>
  );
};

Loading.defaultProps = {
  color: false,
};

Loading.propTypes = {
  color: PropTypes.bool,
};

export default Loading;
