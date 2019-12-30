let util = require("util");
let axios = require("axios");
let converter = require('xml-js');;

exports.get_radius = function(req, res, next) {
    if (!req._body) {
        res.json({ error: "Specify request with 'radius', 'type', 'lat' and 'lon'."});
    }

    let radius = req.body.radius;
    let type = req.body.type;
    let lat = req.body.lat;
    let lon = req.body.lon;

    let overpass_query = util.format("node [%s] (around:%s, %s, %s); out;", type, radius, lat, lon);

    axios.post("http://overpass-api.de/api/interpreter", overpass_query,
        { headers: { "Content-Type": "application/osm3s+xml" }
    })
        .then(response => {
            res.json(JSON.parse(converter.xml2json(response.data)));
        })
        .catch(error => {
            res.json({
                error: error
            });
        });
};