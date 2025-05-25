/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Markup } from 'interweave';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';

import {
  truncateStars, truncateFrontSlashs,
} from '../../util/appUtils';

const ImprovePoints = (props) => {
  const {
    content,
  } = props;

  return (
    <>

      <div className="ml-0 bg-white">
        {content && (
          <Markup content={truncateFrontSlashs(truncateStars(content))} />
        )}
        {!content && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        {content === '<p><br></p>' && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </div>
    </>
  );
};

ImprovePoints.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default ImprovePoints;
