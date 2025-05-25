// useDocumentUploader.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  prepareDocuments,
} from '../util/appUtils';
import {
  resetImage,
  onDocumentCreatesAttach,
} from '../helpdesk/ticketService';

const AsyncFileUpload = (addInfo, uploadPhoto) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDocuments = async () => {
      if (addInfo?.data?.length && uploadPhoto?.length) {
        const documents = prepareDocuments(uploadPhoto, addInfo.data[0]);
        try {
        // Dispatch documents sequentially
          documents.reduce(async (promise, doc) => {
            await promise;
            return dispatch(onDocumentCreatesAttach(doc));
          }, Promise.resolve());
          dispatch(resetImage());
        } catch (error) {
          console.error('Error dispatching documents:', error);
        }
      }
    };

    handleDocuments();
  }, [addInfo]);
};

export default AsyncFileUpload;
