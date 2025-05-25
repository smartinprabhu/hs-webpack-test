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
    type,
    ruuid,
    auid,
    accid,
    clearForm,
    lastAnswer,
  } = props;

  return (
    <>

      <ThemeProvider theme={theme}>
        <SurveyForm
          onNext={onNext}
          clearForm={clearForm}
          detailData={detailData}
          accid={accid}
          type={type}
          ruuid={ruuid}
          auid={auid}
          lastAnswer={lastAnswer}
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
  lastAnswer: PropTypes.oneOfType([
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
  auid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default Survey;
