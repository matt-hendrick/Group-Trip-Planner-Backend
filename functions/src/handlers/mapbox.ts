import request = require('request');
import { Request, Response } from 'express';

export const pinGeocode = (req: Request, res: Response) => {
  request(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      req.body.address +
      '.json?limit=10&access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q',
    (error, response, body) => {
      res.send(JSON.parse(body));
    }
  );
};

export const mapCenterGeocode = (req: Request, res: Response) => {
  request(
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      req.body.address +
      '.json?types=country,region,district,place,locality,neighborhood&limit=10&access_token=pk.eyJ1IjoiZ3JvdXB0cmlwcGxhbm5lciIsImEiOiJja2pyNnF4cGIweXFkMnlwa3pwdmdoaW56In0.OrgMxKRGDBF73KUVTXb13Q',
    (error, response, body) => {
      res.send(JSON.parse(body));
    }
  );
};

export const directions = (req: Request, res: Response) => {
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
