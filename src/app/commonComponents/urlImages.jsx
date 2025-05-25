import React, { useState, useMemo } from 'react';
import axios from 'axios';

import Loader from '@shared/loading';

import AuthService from '../util/authService';

const ImageComponent = React.memo(({
  id, name, type, isActive,
}) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const authService = AuthService();

  /* useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch the image using Axios and send token
        const response = await axios.get(imageServerURL, {
          headers: {
            Authorization: `Bearer ${authService.getAccessToken()}`,
          },
          maxRedirects: 0, // Disable automatic redirects
        });

        // If response status is not 2xx, throw an error
        if (!response.status.toString().startsWith('2')) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        console.log(response.status);

        // If the image URL redirected to another URL
        if (response.status === 401) {
          const redirectUrl = response.headers.location;
          // Make another request to the redirect URL to fetch the image
          const imageResponse = await axios.get(redirectUrl, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the same token to redirect URL
            },
            responseType: 'blob', // Ensure response is treated as a blob
          });
          // Convert the image blob to object URL
          const objectURL = URL.createObjectURL(imageResponse.data);
          setImageData(objectURL);
        } else {
          // Convert the image blob to object URL
          const objectURL = URL.createObjectURL(response.data);
          setImageData(objectURL);
        }
      } catch (error) {
        console.log('Error fetching image:', error.response);
        if (error.response.status === 401) {
          const redirectUrl = error.response.request.responseURL;
          console.log(redirectUrl);
          // Make another request to the redirect URL to fetch the image
          const imageResponse = await axios.get(redirectUrl, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the same token to redirect URL
            },
            responseType: 'blob', // Ensure response is treated as a blob
          });
          console.log(imageResponse);
          // Convert the image blob to object URL
          const objectURL = URL.createObjectURL(imageResponse.data);
          setImageData(objectURL);
        }
      }
    };

    fetchImage();

    // Clean up the object URL when component unmounts
    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [id, token]); */

  useMemo(() => {
    let isMounted = true; // Flag to track if the component is mounted
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

        let blob = new Blob([response.data]);
        if (type === 'image/svg+xml') {
          blob = new Blob([response.data], { type: 'image/svg+xml' });
        }
        const objectURL = URL.createObjectURL(blob);
        setLoading(false);
        setImageData(objectURL);
      } catch (error) {
        console.error('Error fetching image:', error);
        setLoading(false);
      }
    };

    console.log(isActive);

    if (isActive) {
      fetchImage();
    }

    return () => {
      // Cleanup function to cancel any ongoing tasks
      isMounted = false; // Set the flag to indicate the component is unmounted
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [isActive, type, id]);

  return (
    <div>
      {!loading && imageData && (
      <img
        height="100%"
        width="100%"
        alt={name}
        src={imageData}
      />
      )}
      {loading && (
        <Loader />
      )}
    </div>
  );
});

export default ImageComponent;
