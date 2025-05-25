import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Loader from '@shared/loading';

import AuthService from '../util/authService';

const ImageComponent = React.memo(({
  id, name, type, sourceType, base64, isActive, isExcel,
}) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const base64ToBlob = (base64, mime = 'application/pdf') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${WEBAPPAPIURL}showImage`, {
          params: {
            imageUrl: `/web/content/${id}/${name}`,
          },
          headers: {
            endpoint: window.localStorage.getItem('api-url'),
            // Token: authService.getAccessToken(),
          },
          withCredentials: true,
          responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });

        const objectURL = URL.createObjectURL(blob);

        if (isMounted) {
          setImageData(objectURL);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isActive && sourceType !== 'binary') {
      fetchImage();
    } else if (isActive && sourceType === 'binary') {
      const blobdata = base64ToBlob(base64);
      const url = URL.createObjectURL(blobdata);
      setImageData(url);
    }

    return () => {
      isMounted = false;
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [isActive, id, name]);

  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';
  const apiUrl = window.localStorage.getItem('api-url');
  const Url = `${apiUrl}/web/content/${id}/${name}`;

  console.log(imageData);

  return (
    <div>
      {!loading && imageData && isExcel && (
      <iframe src={`/view-excel?url=${encodeURIComponent(imageData)}`} width="100%" title={name} height="565px"> </iframe>
      )}
      {!loading && imageData && (
      <iframe src={imageData} width="100%" title={name} height="565px" />
      )}
      {loading && (
        <Loader />
      )}
    </div>
  );
});

export default ImageComponent;
