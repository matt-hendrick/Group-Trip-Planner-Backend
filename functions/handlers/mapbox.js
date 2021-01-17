const request = require('request');

exports.pinGeocode = (req, res) => {
  request(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      req.body.address +
      '.json?access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q',
    (error, response, body) => {
      res.send(JSON.parse(body));
    }
  );
};

exports.mapCenterGeocode = (req, res) => {
  request(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      req.body.address +
      '.json?types=country,region,district,place&access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q',
    (error, response, body) => {
      res.send(JSON.parse(body));
    }
  );
};

exports.directions = (req, res) => {
  const route = req.body.coordinates.join(';');
  request(
    'https://api.mapbox.com/directions/v5/mapbox/' +
      req.body.movementType +
      '/' +
      route +
      '.json?access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q',
    (error, response, body) => {
      res.send(JSON.parse(body));
    }
  );
};
