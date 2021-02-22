"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directions = exports.mapCenterGeocode = exports.pinGeocode = void 0;
const request = require("request");
const pinGeocode = (req, res) => {
    request('https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        req.body.address +
        '.json?limit=10&access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q', (error, response, body) => {
        res.send(JSON.parse(body));
    });
};
exports.pinGeocode = pinGeocode;
const mapCenterGeocode = (req, res) => {
    request('https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        req.body.address +
        '.json?types=country,region,district,place,locality,neighborhood&limit=10&access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q', (error, response, body) => {
        res.send(JSON.parse(body));
    });
};
exports.mapCenterGeocode = mapCenterGeocode;
const directions = (req, res) => {
    const route = req.body.coordinates.join(';');
    request('https://api.mapbox.com/directions/v5/mapbox/' +
        req.body.movementType +
        '/' +
        route +
        '.json?access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q', (error, response, body) => {
        res.send(JSON.parse(body));
    });
};
exports.directions = directions;
//# sourceMappingURL=mapbox.js.map