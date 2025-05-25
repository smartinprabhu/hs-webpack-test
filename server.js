const express = require('express');
const { join } = require('path');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const request = require('request');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const querystring = require('querystring');

const requests = require('./powerBi.js');

const app = express();

app.disable('x-powered-by');

// Use environment variables directly
const isAPIGateway = process.env.REACT_APP_IS_USE_APIGATEWAY || false;
const port = process.env.SERVER_PORT || 3000;

let APIURL = '';
let BASEURL = '';
if (isAPIGateway === 'true') {
  APIURL = process.env.REACT_APP_API_URL || 'https://apigateway.helixsense.com';
  BASEURL = process.env.REACT_APP_WEBAPIURL || 'https://apigateway.helixsense.com';
} else {
  APIURL = process.env.REACT_APP_API_URL || 'https://api-dev.helixsense.com';
  BASEURL = process.env.REACT_APP_WEBAPIURL || 'https://api-dev.helixsense.com';
}

const ACCOUNTIDURL = process.env.REACT_APP_AUTH_ENDPOINT || 'https://api-dev.helixsense.com';
const IOTURL = process.env.IOT_URL || 'https://hs-dev-warehouse.helixsense.com';
const MICROSOFTURL = 'https://login.microsoftonline.com';
const GOOGLEAPIURL = 'https://www.google.com';
const AIURL = process.env.AIURL || 'https://hsense-dev-wf-playground.helixsense.com';
const WASTEURL = process.env.WASTE_URL || 'https://test02-np.helixsense.com/dashboard';
const METERWATERURL = process.env.METERWATER_URL || 'https://test01-np.helixsense.com/dashboard';
const SITEWATERURL = process.env.SITEWATER_URL || 'https://test04-np.helixsense.com/dashboard';
const ENERGYURL = process.env.ENERGY_URL || 'https://api-wipropp.helixsense.com/energy/forecast/dynamic';
const EMISSIONS = process.env.EMISSIONS_URL || 'https://test03-np.helixsense.com';
const ENERGYSITE = process.env.ENERGYSITE_URL || 'https://test05-np.helixsense.com';

const corsConfig = {
  origin: process.env.REACT_APP_WEB_URL || 'http://localhost:3010',
  credentials: true,
  methods: 'GET,PUT,POST,DELETE',
};

app.use(cors(corsConfig));
app.use(cookieParser());
const upload = multer();

app.use(morgan('dev'));
app.use(express.static(join(__dirname, 'dist')));

const setCsp = (req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

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
  '/webhook/62fed599-8e83-4242-a571-4be6fb4b6853',
  createProxyMiddleware({
    target: AIURL,
    changeOrigin: true,
  }),
);

app.use(
  '/webhook/7de1a806-366e-4651-9d07-e8d4ae483987',
  createProxyMiddleware({
    target: AIURL,
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

app.use(
  '/emission',
  createProxyMiddleware({
    target: EMISSIONS,
    changeOrigin: true,
    pathRewrite: {
      '^/emission': '',
    },
  }),
);

app.use(
  '/energysite',
  createProxyMiddleware({
    target: ENERGYSITE,
    changeOrigin: true,
    pathRewrite: {
      '^/energysite': '',
    },
  }),
);

const proxyWithDynamicTarget = () => (req, res, next) => {
  const target = req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL;
  createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
};

app.use('/public/api/v16/getDashboard', proxyWithDynamicTarget());

app.use('/public/api/v2/search', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    const targetUrl = req.headers.ioturl
                      && req.headers.ioturl !== 'false'
                      && req.headers.ioturl !== undefined
                      && req.headers.ioturl !== null
      ? req.headers.ioturl
      : IOTURL;

    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        const originalQuery = querystring.parse(req.url.split('?')[1]);
        originalQuery.token = accessToken;
        const updatedQuery = querystring.stringify(originalQuery);
        const updatedPath = `${req.path}?${updatedQuery}`;
        proxyReq.path = updatedPath;
      },
    });

    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/warehouse/dashboard', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/getanalyticdashboard/ASSET', proxyWithDynamicTarget());

app.use('/api/v4/write_multi', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/create_multi', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/unlink_multi', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/warehouse/getDashboardv1', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/api/v4/ninjadashboard/onchange', async (req, res) => {
  try {
    const targetUrl = req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL;
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/warehouse/drill_down_data', upload.none(), async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    req.body.token = accessToken;
    const proxy = createProxyMiddleware({
      target: req.headers.ioturl && req.headers.ioturl !== 'false' && req.headers.ioturl !== undefined && req.headers.ioturl !== null ? req.headers.ioturl : IOTURL,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

async function fetchTargetUrl(headers) {
  const weburl = headers.get('portalDomain') || headers.get('origin');
  const WEBURL = weburl === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : weburl;
  const accid = headers.get('accountId') && headers.get('accountId') !== 'false' && headers.get('accountId') !== 'undefined' && headers.get('accountId') !== null ? headers.get('accountId') : '';
  let accUrl = `${ACCOUNTIDURL}/api/authProviders/getAccountByPortalUrl?portal_domain=${WEBURL}`;
  if (accid) {
    accUrl = `${ACCOUNTIDURL}/api/authProviders/getAccountByPortalUrl?portal_domain=${WEBURL}&accid=${accid}`;
  }
  const response = await axios.get(accUrl);
  return response && response.data && response.data.data && response.data.data.endpoint ? response.data.data.endpoint : APIURL;
}

app.use('/api/v5/search', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/web/image', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    const weburl = process.env.REACT_APP_WEB_URL;
    console.error('Proxy Error:', error);
    res.status(500).send(`${weburl}/${ACCOUNTIDURL}`);
  }
});

app.use('/api/v4/public', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/api/v4', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/public/hsense_airquality/search', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/auth/check_reset_password_link', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/check_reset_password_link', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/forgot_password', upload.none(), async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    req.body.token = '45g1FGWa8ILBJQl9sNEaevmYo2TgYP';
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
          const bodyData = new URLSearchParams(req.body).toString();
          proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
        }
      },
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/reset_password', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
  }
});

app.use('/api/v4/user/password_policy', async (req, res) => {
  try {
    const targetUrl = await fetchTargetUrl(req);
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    });
    proxy(req, res);
  } catch (error) {
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
  const accessToken = req.cookies.access_token;

  req.headers.Authorization = `Bearer ${accessToken}`;
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

app.use('/oauth2/token/', requests.microsoftRequest);

app.use('/web', (req, res) => {
  const newURL = req.headers.endpoint + req.originalUrl;
  const { method } = req;
  const accessToken = req.cookies.access_token;

  req.headers.Authorization = `Bearer ${accessToken}`;
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login/public/api/auth_saml/signin', (req, res) => {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  res.clearCookie('server_error_count');
  res.clearCookie('uid');
  res.clearCookie('microsoft_uid');
  res.clearCookie('session_id');
  res.clearCookie('Session');
  res.clearCookie('sessionExpiry', { path: '/' });
  const jsonEmptyData = '';
  fs.writeFile(
    join(__dirname, 'jumpcloud', 'jumpdata.json'),
    jsonEmptyData,
    (error) => {
      if (error) throw error;
      console.log('complete');
    },
  );
  fs.writeFile(
    join(__dirname, 'jumpcloud', 'sessiondata.json'),
    jsonEmptyData,
    (error) => {
      if (error) throw error;
      console.log('complete');
    },
  );
  fs.readFile(join(__dirname, 'jumpcloud', 'jumpdata.json'), (ferr, fdata) => {
    const isEmpty = Object.keys(fdata).length === 0;
    if (isEmpty) {
      if (req.body && req.body.RelayState && req.body.SAMLResponse) {
        const SITEURL = process.env.REACT_APP_WEB_URL || 'https://portal.qa.helixsense.com';
        const paramdata = {
          method: 'POST',
          url: `${APIURL}/auth/saml/signin`,
          formData: {
            RelayState: req.body.RelayState,
            SAMLResponse: req.body.SAMLResponse,
            portalDomain: SITEURL,
          },
        };

        console.log('Empty');

        let data = [];
        let orgdata = [];

        request(paramdata, (err, result, body) => {
          if (body && result.statusCode !== '500') {
            data = body;
            if (data.code && data.code === '401') {
              orgdata = { code: '401' };
            } else if (data) {
              orgdata = data;
              data.session_cookie = result.headers['set-cookie'][0];
              const jsonData = JSON.stringify(data);
              fs.writeFile(
                join(__dirname, 'jumpcloud', 'jumpdata.json'),
                jsonData,
                (error) => {
                  if (error) throw error;
                  console.log('complete');
                },
              );
              const sdata = { session_value: result.headers['set-cookie'][0] };
              fs.writeFile(
                join(__dirname, 'jumpcloud', 'sessiondata.json'),
                JSON.stringify(sdata),
                (error) => {
                  if (error) throw error;
                  console.log('complete');
                },
              );
            } else if (err) {
              orgdata = { code: '401' };
            }
          } else {
            orgdata = { code: '401' };
          }

          res.redirect('/saml/signin');
        });
      }
    } else {
      res.status(400).send('No Data');
    }
  });
});

app.use('/aws/getToken', upload.none(), async (req, res) => {
  try {
    const {
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
    } = req.body;

    const tokenUrl = req.headers.tokenurl;

    if (!client_id || !client_secret || !tokenUrl) {
      return res.status(400).send('Missing client_id, client_secret, or tokenurl');
    }

    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const codeVerifier = req.cookies.code_verifier;

    const params = new URLSearchParams();
    params.append('grant_type', grant_type || 'authorization_code');
    params.append('code', code);
    params.append('client_id', client_id);
    params.append('redirect_uri', redirect_uri);
    params.append('code_verifier', codeVerifier);

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Token fetch error:', error?.response?.data || error.message);
    const errorMessage = error.response
      ? `${error.response.status} - ${JSON.stringify(error.response.data)}`
      : error.message;
    res.status(500).send(`Token exchange failed: ${errorMessage}`);
  }
});

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
    expires: accessTokenExp,
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: refreshTokenExp,
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

  res.status(200).send('Login successful, cookies set');
});

app.post('/saveAwsCode', upload.none(), (req, res) => {
  const {
    code_verifier,
  } = req.body;

  if (!code_verifier) {
    return res.status(400).send('Missing tokens');
  }
  res.cookie('code_verifier', code_verifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).send('cookies set');
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
        res.clearCookie('code_verifier');
        res.clearCookie('sessionExpiry');
        res.status(200).send('Cleared');
      } else {
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        res.clearCookie('code_verifier');
        res.clearCookie('sessionExpiry');
        res.status(500).send('Failed');
      }
    } else {
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      res.clearCookie('code_verifier');
      res.clearCookie('sessionExpiry');
      res.status(200).send('Cleared');
    }
  } catch (error) {
    console.log(error);
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    res.clearCookie('code_verifier');
    res.clearCookie('sessionExpiry');
    res.status(500).send('Failed');
  }
});

app.get('/getAccount', (req, res) => {
  const accountId = req.cookies.accountId;
  res.status(200).send(accountId);
});

app.get('/getToken', (req, res) => {
  const accountId = req.cookies.access_token;
  res.status(200).send(accountId);
});

app.get('/getjumpresult', (req, res) => {
  fs.readFile(join(__dirname, 'jumpcloud', 'jumpdata.json'), (err, data) => {
    if (err) throw err;

    const isEmpty = Object.keys(data).length === 0;
    const users = !isEmpty ? JSON.parse(data) : [];

    res.send(users);
  });
});

app.get('/getsessionresult', (req, res) => {
  fs.readFile(join(__dirname, 'jumpcloud', 'sessiondata.json'), (err, data) => {
    if (err) throw err;

    const isEmpty = Object.keys(data).length === 0;
    const users = !isEmpty ? JSON.parse(data) : [];

    res.send(users);
  });
});

app.get('/clearjumpresult', (req, res) => {
  const jsonData = '';
  fs.writeFile(
    join(__dirname, 'jumpcloud', 'jumpdata.json'),
    jsonData,
    (error) => {
      if (error) throw error;
      console.log('complete');
      res.send('complete');
    },
  );
});

app.get('/clearsessionresult', (req, res) => {
  const jsonData = '';
  fs.writeFile(
    join(__dirname, 'jumpcloud', 'sessiondata.json'),
    jsonData,
    (error) => {
      if (error) throw error;
      console.log('complete');
      res.send('complete');
    },
  );
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

app.post('/forecastData', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized: No access token provided' });
    }
    console.log(accessToken, 'accessToken');

    const { option, ...body } = req.body;
    const targetUrl = ENERGYURL;

    console.log('Selected Forecast URL:', targetUrl);

    const finalPayload = {
      ...body,
      access_token: accessToken,
    };
    console.log('Final Payload:', finalPayload);

    const response = await axios.post(targetUrl, finalPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(body, 'body');
    res.json(response.data);
  } catch (error) {
    console.error('Error in /forecastData:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.post('/dashboard', async (req, res) => {
  const accessToken = req.cookies.access_token;
  const body = req.body;
  const targetUrl = WASTEURL;
  const finalPayload = { ...body, token: accessToken };
  const response = await axios.post(targetUrl, finalPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res.json(response.data);
});

app.post('/meterWater', async (req, res) => {
  const accessToken = req.cookies.access_token;
  const body = req.body;
  const targetUrl = METERWATERURL;
  const finalPayload = { ...body, token: accessToken };
  const response = await axios.post(targetUrl, finalPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res.json(response.data);
});

app.post('/siteWater', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      console.error('No access token found in cookies');
      return res.status(401).json({ error: 'Unauthorized: No access token provided' });
    }

    const body = req.body;
    const targetUrl = SITEWATERURL;
    const finalPayload = { ...body, token: accessToken };

    console.log('Forwarding to target URL:', targetUrl);
    console.log('Payload:', finalPayload);

    const response = await axios.post(targetUrl, finalPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Response from target:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Proxy error',
    });
  }
});

app.use((_, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
