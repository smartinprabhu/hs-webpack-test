/* eslint-disable react/forbid-prop-types */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import {
  truncate,
} from '../util/appUtils';

const ReadMoreText = (props) => {
  const {
    text,
  } = props;

  return (
    <>
      {text && text.length && text.length > 30 && (
      <Tooltip title={text} placement="top">
        <span>{truncate(text, 30)}</span>
      </Tooltip>
      )}
      {text && text.length && text.length < 30 && (
      <span>{text}</span>
      )}
    </>
  );
};

ReadMoreText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ReadMoreText;
