import { CALL_API } from '../../../middleware/api';

export const OCCUPY_SPACE = 'OCCUPY_SPACE';
export const OCCUPY_SPACE_SUCCESS = 'OCCUPY_SPACE_SUCCESS';
export const OCCUPY_SPACE_FALURE = 'OCCUPY_SPACE_DATA';

export function occupySpace(bookingId) {
  return {
    [CALL_API]: {
      endpoint: `space/occupy?emply_shift_id=${bookingId}`,
      types: [OCCUPY_SPACE, OCCUPY_SPACE_SUCCESS, OCCUPY_SPACE_FALURE],
      method: 'POST',
    },
  };
}
