const K_WIDTH = 100;
const K_HEIGHT = 100;

const googleMapLocationStyles = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  // border: '5px solid #f44336',
  // borderRadius: K_HEIGHT,
  // backgroundColor: '#3f51b5',
  textAlign: 'center',
  color: '#212529',
  fontSize: 15,
  fontWeight: 'bold',
  // padding: 4
};

export default googleMapLocationStyles;
