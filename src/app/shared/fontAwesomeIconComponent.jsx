import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const FontAwesomeIconComponent = ({ faIcon, iconStyles }) => (
  <FontAwesomeIcon icon={faIcon} className={iconStyles} />
);

FontAwesomeIconComponent.propTypes = {
  faIcon: PropTypes.shape({
    prefix: PropTypes.string,
  }),
  iconStyles: PropTypes.string,
};

FontAwesomeIconComponent.defaultProps = {
  iconStyles: '',
  faIcon: {},
};

export default FontAwesomeIconComponent;
