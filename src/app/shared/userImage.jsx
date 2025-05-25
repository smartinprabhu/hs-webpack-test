import React from 'react';
import PropTypes from 'prop-types';
import avatarImage from '@images/avatar.png';

const UserImage = ({ imageUrl, imageStyle }) => {
  const userImageUrl = imageUrl || avatarImage;
  return (
    <img
      src={userImageUrl}
      className={`${imageStyle}`}
      alt="user"
      data-testid="user"
    />
  );
};

UserImage.propTypes = {
  imageUrl: PropTypes.string,
  imageStyle: PropTypes.string.isRequired,
};

UserImage.defaultProps = {
  imageUrl: undefined,
};

export default UserImage;
