/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Result } from 'antd';

const CreateDataEmpty = (props) => {
  const {
    onCreate,
    text
  } = props;

  return (
    <Result
      title={text ? text : "No data found create new record"}
      extra={(
        <Button type="primary" onClick={() => onCreate()} key="console">
          Create
        </Button>
      )}
    />
  );
};

CreateDataEmpty.propTypes = {
  onCreate: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default CreateDataEmpty;
