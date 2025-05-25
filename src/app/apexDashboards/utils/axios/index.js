import axios from 'axios';
// import { notification } from 'antd'

const apiClient = axios.create({
  baseURL: '/api',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

apiClient.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
    request.headers.AccessToken = accessToken;
  }
  return request;
});

// apiClient.interceptors.response.use(undefined, (error) => {
//   // Errors handling
//   console.log(error)
//   const { response } = error
//   const { data } = response
//   if (data) {
//     notification.warning({
//       message: error.message,
//     })
//   }
// })

export default apiClient;
