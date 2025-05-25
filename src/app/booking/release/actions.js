import { CALL_API } from '../../../middleware/api';

export const SAVE_RELEASE = 'SAVE_RELEASE_DATA';
export const SAVE_RELEASE_SUCCESS = 'SAVE_RELEASE_SUCCESS';
export const SAVE_RELEASE_FALURE = 'SAVE_RELEASE_FALURE';

export function saveRelease(spaceId, bookingId) {
  return {
    [CALL_API]: {
      endpoint: `space/release?space_id=${spaceId}&emply_shift_id=${bookingId}`,
      types: [SAVE_RELEASE, SAVE_RELEASE_SUCCESS, SAVE_RELEASE_FALURE],
      method: 'post',
    },
  };
}
