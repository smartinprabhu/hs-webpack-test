/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

import theme from '../util/materialTheme';
import SurveyForm from './surveyForm';

const Survey = (props) => {
  const {
    onNext,
    detailData,
    auditData,
    type,
    accid,
    ruuid,
  } = props;

  return (
    <>

      <ThemeProvider theme={theme}>
        <SurveyForm
          onNext={onNext}
          detailData={detailData}
          auditData={auditData}
          type={type}
          ruuid={ruuid}
          accid={accid}
        />
      </ThemeProvider>
    </>
  );
};

Survey.propTypes = {
  onNext: PropTypes.func.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  auditData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  ruuid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default Survey;
