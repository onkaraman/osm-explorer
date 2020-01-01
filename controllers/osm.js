let util = require("util");
let axios = require("axios");
let cheerio = require("cheerio");

exports.get_nodes = function (req, res, next) {
    /**
     * Will return a list of OSM nodes for further API use. This endpoint accepts POST requests.
     * @param query: Defines the location to search for on OSM.
     * @param type: (Optional) To limit the results to this specified type.
     */
    if (!req._body) {
        res.json({error: "Specify request with fields specified in documentation.."});
    }

    axios.get('https://www.openstreetmap.org/geocoder/search_osm_nominatim?query=' + req.body.query)
        .then(response => {
            let $ = cheerio.load(response.data);
            let search_results = $(".results-list li p");

            let nodes = {};

            for (let i = 0; i < search_results.length; i += 1) {
                let sr = search_results[i];
                let sr_type = sr.children[0]["data"].trim();
                let type_defined = req.body.type !== undefined;

                if (type_defined && req.body.type.toLowerCase() === sr_type.toLocaleLowerCase()) {
                    nodes[sr_type] = sr.children[1].attribs;
                } else if (!type_defined) {
                    nodes[sr_type] = sr.children[1].attribs;
                }
            }
            res.json({data: nodes});
        })
        .catch(error => {
            res.json({
                error: error
            });
        });
};

exports.routing = function (req, res, next) {
    /***
     * Will return the distance in meters from given points.
     * @param type: Which road to calculate for. Either 'car' or 'foot'.
     * @param lat_from, lon_from: Latitude and longitude information of point A.
     * @param lat_to, lon_to: Latitude and longitude information of point B.
     */
    if (!req._body) {
        res.json({error: "Specify request with fields specified in documentation.."});
    }

    let type = req.body.type;
    let lat_from = req.body.lat_from;
    let lon_from = req.body.lon_from;
    let lat_to = req.body.lat_to;
    let lon_to = req.body.lon_to;

    let query = util.format("https://routing.openstreetmap.de/routed-%s/route/v1/driving/%s,%s;%s,%s?overview=false&geometries=polyline",
        type, lon_from, lat_from, lon_to, lat_to);

    axios.get(query)
        .then(response => {
            if (response.data === null) {
                res.json({ error: "Query error. Status: " + response.status });
            } else {
                res.json({
                    "from_text": response.data.waypoints[0].name,
                    "to_text": response.data.waypoints[1].name,
                    "distance_meters": response.data.routes[0].distance,
                    "distance_minutes": parseInt(response.data.routes[0].duration/60)
                });
            }
        })
        .catch(error => {
            res.json({ error: error });
        });
};