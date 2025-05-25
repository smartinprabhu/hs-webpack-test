/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const request = require('request');

function microsoftRequest(req, resp) {
  const powerbiConfig = {
    clientId: process.env.POWERBI_CLIENTID,
    clientSecret: process.env.POWERBI_CLIENTSECRET,
    grantType: process.env.POWERBI_GRANYTYPE,
    servicePrincipalUrl: `https://login.microsoftonline.com/${process.env.POWERBI_TENANTID}/oauth2/token`,
    powerbiGroupUrl: `https://api.powerbi.com/v1.0/myorg/groups/${req.query.power_bi_groupId}/reports/${req.query.power_bi_reportId}/GenerateToken`,
  };

  const email = req.query.email ? req.query.email : false;
  const dataSetId = req.query.power_bi_datasetId ? req.query.power_bi_datasetId : false;
  const companyId = req.query.company ? req.query.company : false;
  const companyType = req.query.companyType ? req.query.companyType : false;

  const loginId = companyType === true ? email : `${email}${companyId}`;

  const accessData = {
    accessLevel: 'View',
    identities: [
      {
        username: loginId,
        roles: ['Roles'],
        datasets: [dataSetId],
      },
    ],
  };

  const initialAccess = {
    accessLevel: 'View',
  };

  const loginAccess = dataSetId === 'false' ? initialAccess : accessData;

  const formData = {
    grant_type: powerbiConfig.grantType,
    client_id: powerbiConfig.clientId,
    resource: 'https://analysis.windows.net/powerbi/api',
    client_secret: powerbiConfig.clientSecret,
  };
  request.post({ url: powerbiConfig.servicePrincipalUrl, formData }, (err, res) => {
    if (err) {
      return resp.send(err);
    }
    request.post({
      url: powerbiConfig.powerbiGroupUrl,
      json: true,
      body: loginAccess,
      headers: {
        Authorization: `Bearer ${JSON.parse(res.body).access_token}`,
      },
    }, (error, response) => resp.send(response.body));
  });
}
module.exports.microsoftRequest = microsoftRequest;
