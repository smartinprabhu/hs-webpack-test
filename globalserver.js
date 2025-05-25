/* eslint-disable import/extensions */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');
const { join } = require('path');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const request = require('request');
const multer = require('multer');
// const helmet = require('helmet');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const querystring = require('querystring');

const app = express();

app.disable('x-powered-by');

const isAPIGateway = process.env.IS_USE_APIGATEWAY || false;

const port = process.env.SERVER_PORT || 3000;

let APIURL = '';
let BASEURL = '';
if (isAPIGateway === 'true') {
  APIURL = process.env.API_URL || 'https://apigateway.helixsense.com';
  BASEURL = process.env.BASE_URL || 'https://apigateway.helixsense.com';
} else {
  APIURL = process.env.API_URL || 'https://api-dev.helixsense.com';
  BASEURL = process.env.BASE_URL || 'https://api-dev.helixsense.com';
}

const ACCOUNTIDURL = process.env.ACCOUNTID_URL || 'https://api-dev.helixsense.com';

const IOTURL = process.env.IOT_URL || 'https://hs-dev-warehouse.helixsense.com';

const MICROSOFTURL = 'https://login.microsoftonline.com';

const GOOGLEAPIURL = 'https://www.google.com';

const corsConfig = {
  origin: process.env.REACT_APP_WEB_URL || 'http://localhost:3010',
  credentials: true,
  methods: 'GET,PUT,POST,DELETE',
};

app.use(cors(corsConfig));
const upload = multer();
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/v3', express.static(join(__dirname, 'v3', 'dist')));

app.use('/', express.static(join(__dirname, 'v2', 'dist')));
 

const setCsp = (req, res, next) => {
  // Generate a nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  // Set the Content Security Policy
  const csp = `
    default-src 'self' helixsense.com;
    script-src 'self' 'nonce-${nonce}' dev-94956947.okta.com logondev.bcg.com;
    style-src 'self' 'nonce-${nonce}' cdn.jsdelivr.net/npm/maptalks/dist/ dev-94956947.okta.com logondev.bcg.com cdnjs.cloudflare.com/ajax/libs/ cdn.syncfusion.com fonts.googleapis.com fonts.gstatic.com;
    img-src 'self' helixsense.com data: dev-94956947.okta.com logondev.bcg.com blob:;
    font-src 'self' fonts.odoocdn.com fonts.googleapis.com fonts.gstatic.com data:;
    connect-src 'self' helixsense.com dev-94956947.okta.com logondev.bcg.com login.microsoftonline.com fonts.googleapis.com fonts.gstatic.com;
    frame-src 'self' view.officeapps.live.com www.gstatic.com ww.google.com;
    object-src 'none';
    media-src 'self';
    form-action 'self';
    frame-ancestors 'self' view.officeapps.live.com;
    base-uri 'self';
    manifest-src 'self';
    worker-src 'self' blob:;
    child-src 'self' dev-94956947.okta.com logondev.bcg.com fonts.googleapis.com fonts.gstatic.com;
    upgrade-insecure-requests;
    block-all-mixed-content;
  `;

  // Set the CSP header
  res.set('Content-Security-Policy', csp.replace(/\n\s+/g, ' '));
  next();
};

app.use('/api', setCsp);
app.use('/account/getByAccountId', setCsp);
app.use('/public', setCsp);
app.use('/web', setCsp);
app.use('/auth', setCsp);

app.use('/images', (req, res, next) => {
  res.setHeader('Cache-control', 'private, max-age=3600, must-revalidate');
  next();
});

app.use(
  '/account/getByAccountId',
  createProxyMiddleware({
    target: BASEURL,
    changeOrigin: true,
  }),
);

app.use(
  '/recaptcha/api/siteverify',
  createProxyMiddleware({
    target: GOOGLEAPIURL,
    changeOrigin: true,
  }),
);

app.use(
  '/api/authProviders/getByAccountId',
  createProxyMiddleware({
    target: BASEURL,
    changeOrigin: true,
  }),
);

app.use(
  '/api/authProviders/allVersions',
  createProxyMiddleware({
    target: APIURL,
    changeOrigin: true,
  }),
);

const proxyWithDynamicTarget = () => (req, res, next) => {
  const target = req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL;
  createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
};

app.use('/public/api/v16/getDashboard', proxyWithDynamicTarget());

app.use('/public/api/v16/getDashboard', proxyWithDynamicTarget());

app.use('/public/api/v4/ninjadashboard/onchange', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/api/v2/search', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;

    // Determine the target URL
    const targetUrl = req.headers.ioturl
                      && req.headers.ioturl !== 'false'
                      && req.headers.ioturl !== undefined
                      && req.headers.ioturl !== null
      ? req.headers.ioturl
      : IOTURL;

    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req) => {
        // Modify the query parameters
        const originalQuery = querystring.parse(req.url.split('?')[1]);
        originalQuery.token = accessToken; // Add or modify a query parameter
        // Rebuild the query string and update the path
        const updatedQuery = querystring.stringify(originalQuery);
        const updatedPath = `${req.path}?${updatedQuery}`;
        proxyReq.path = updatedPath; // Update the proxy request path
      },
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/warehouse/dashboard', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/getanalyticdashboard/ASSET', proxyWithDynamicTarget());

app.use('/api/v4/write_multi', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/create_multi', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/unlink_multi', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/warehouse/getDashboardv1', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});
app.use('/api/v4/warehouse/drill_down_data', proxyWithDynamicTarget());

app.use('/api/v4/warehouse/getDashboard', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: IOTURL,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});


// Function to fetch the target URL from another API
async function fetchTargetUrl(headers) {
  // Implement the logic to fetch the target URL here
  // For example, make an axios request to another API
  const weburl = headers.get('portalDomain') || headers.get('origin');
  console.log(weburl);
  const WEBURL = weburl === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : weburl;
  const accid = headers.get('accountId') && headers.get('accountId') !== 'false' && headers.get('accountId') !== 'undefined' && headers.get('accountId') !== null ? headers.get('accountId') : '';
  let accUrl = `${ACCOUNTIDURL}/api/authProviders/getAccountByPortalUrl?portal_domain=${WEBURL}`;
  if (accid) {
    accUrl = `${ACCOUNTIDURL}/api/authProviders/getAccountByPortalUrl?portal_domain=${WEBURL}&accid=${accid}`;
  }
  console.log(accUrl);
  const response = await axios.get(accUrl);
  return response && response.data && response.data.data && response.data.data.endpoint ? response.data.data.endpoint : APIURL;
}

app.use('/api/v5/search', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/api/v4', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/web/image', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    const weburl = process.env.REACT_APP_WEB_URL;
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send(`${weburl}/${ACCOUNTIDURL}`);
  }
});

app.use('/api/v4/public', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/hsense_airquality/search', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/auth/check_reset_password_link', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function

    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });

    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/check_reset_password_link', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function
    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/forgot_password', upload.none(), async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function
    req.body.token = '45g1FGWa8ILBJQl9sNEaevmYo2TgYP';
    // Set up the proxy middleware
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      logLevel: 'debug', // Optional: to log proxy details
      onProxyReq: (proxyReq, req, res) => {
        // Forward the form data to the target server
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString(); // Convert form data to URL-encoded string
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData); // Write the form data to the proxy request
          proxyReq.end(); // End the proxy request
        }
      },
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/reset_password', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function
    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/password_policy', async (req, res) => {
  try {
    // Fetch the target URL from another API
    const targetUrl = await fetchTargetUrl(req); // Implement this function
    // Create a proxy middleware for the target URL
    console.log(targetUrl);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true, // Change the "Host" header to the target host
    });
    // Use the proxy middleware to forward the request and response
    proxy(req, res);
  } catch (error) {
    // Handle any errors here
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/auth', (req, res) => {
  const newURL = APIURL + req.originalUrl;
  const { method } = req;
  req.pipe(request(
    {
      method,
      uri: newURL,
      qs: req.query,
    },
  ))
    .on('error', (err) => {
      res.status(400).send(err);
    })
    .pipe(res);
});

app.use('/api', (req, res) => {
  let newURL = req.headers.endpoint + req.originalUrl;
  if (isAPIGateway === 'true') {
    newURL = process.env.API_URL ? APIURL + req.originalUrl : req.headers.endpoint + req.originalUrl;
  }

  const { method } = req;
  if(req.cookies && req.cookies.access_token){
    const accessToken = req.cookies.access_token;

    req.headers.Authorization = `Bearer ${accessToken}`;
  }

  req.pipe(request(
    {
      method,
      uri: newURL,
      qs: req.query,
    },
  ))
    .on('error', (err) => {
      res.status(400).send(err);
    })
    .pipe(res);
});

app.use('/common', createProxyMiddleware({
  target: MICROSOFTURL,
  changeOrigin: true,
}));


app.use('/web', (req, res) => {
  const newURL = req.headers.endpoint + req.originalUrl;
  const { method } = req;
  req.pipe(request(
    {
      method,
      uri: newURL,
      qs: req.query,
    },
  ))
    .on('error', (err) => {
      res.status(400).send(err);
    })
    .pipe(res);
});

app.use('/hsense_airquality/search', (req, res) => {
  const newURL = req.headers.endpoint + req.originalUrl;
  const { method } = req;
  req.pipe(request(
    {
      method,
      uri: newURL,
      qs: req.query,
    },
  ))
    .on('error', (err) => {
      res.status(400).send(err);
    })
    .pipe(res);
});

app.use('/base_import/set_file_api', (req, res) => {
  const newURL = req.headers.endpoint + req.originalUrl;
  const { method } = req;
  req.pipe(request(
    {
      method,
      uri: newURL,
      qs: req.query,
    },
  ))
    .on('error', (err) => {
      res.status(400).send(err);
    })
    .pipe(res);
});

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/saveToken', upload.none(), (req, res) => {
  const { access_token, refresh_token, expires_in } = req.body;

  if (!access_token || !refresh_token) {
    return res.status(400).send('Missing tokens');
  }
  const accessTokenExp = new Date();
  const refreshTokenExp = new Date();
  accessTokenExp.setTime(accessTokenExp.getTime() + (expires_in * 1000));
  refreshTokenExp.setTime(refreshTokenExp.getTime() + (28800 * 1000));
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: accessTokenExp, // 1 day
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: refreshTokenExp, // 7 days
  });

  res.cookie('sessionExpiry', 1, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).send('Login successful, cookies set');
});

app.post('/saveAccount', upload.none(), (req, res) => {
  const {
    accountId, client_id, client_secret,
  } = req.body;

  if (!accountId || !client_id) {
    return res.status(400).send('Missing tokens');
  }
  res.cookie('client_id', client_id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.cookie('accountId', accountId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.cookie('client_secret', client_secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.cookie('sessionExpiry', 0, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).send('V3');
});

app.get('/clearAccount', (req, res) => {
  res.clearCookie('client_id');
  res.clearCookie('client_secret');
  res.clearCookie('accountId');
  res.status(200).send('Cleared');
});

app.get('/clearUser', async (req, res) => {
  const newURL = `${req.headers.endpoint}/api/v4/bearertoken/unlink`;
  const accessToken = req.cookies.access_token;
  try {
    if (accessToken && accessToken !== 'false' && accessToken !== undefined && accessToken !== null) {
      const params = { beare_token: accessToken };
      const response = await axios.delete(newURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
      console.log(response && response.data);
      if (response && response.data) {
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        res.clearCookie('sessionExpiry');
        res.status(200).send('Cleared');
      } else {
        res.status(500).send('Failed');
      }
    } else {
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      res.clearCookie('sessionExpiry');
      res.status(200).send('Cleared');
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/getAccount', (req, res) => {
  const accountId = req.cookies.accountId;
  res.status(200).send(accountId);
});


app.get('/showImage', async (req, res) => {
  const imageUrl = `${req.headers.endpoint}${req.query.imageUrl}`;
  const token = req.cookies.access_token;

  try {
    const response = await axios.get(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      maxRedirects: 0,
    });

    if (!response.status.toString().startsWith('2')) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    if (response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.location;
      const imageResponse = await axios.get(redirectUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });
      res.set('Content-Type', imageResponse.headers['content-type']);
      res.send(imageResponse.data);
    } else {
      res.set('Content-Type', response.headers['content-type']);
      res.send(response.data);
    }
  } catch (error) {
    if (error.response && error.response.status && (error.response.status === 302 || error.response.status === 301)) {
      const redirectUrl = error.response.headers.location;
      try {
        const imageResponse = await axios.get(redirectUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        });
        res.set('Content-Type', imageResponse.headers['content-type']);
        res.send(imageResponse.data);
      } catch (error2) {
        res.status(error2.response.status).send('Error fetching image');
      }
    } else {
      res.status(500).send('Error fetching image');
    }
  }
});

app.get('/v3/*', (req, res) => {
  res.sendFile(join(__dirname, 'v3', 'dist', 'index.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'v2', 'dist', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
