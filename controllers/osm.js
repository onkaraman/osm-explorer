let axios = require("axios");
let cheerio = require("cheerio");

exports.get_nodes = function (req, res, next) {
    /**
     * Will return a list of OSM nodes for further API use. This endpoint accepts POST requests.
     * @param query: Defines the location to search for on OSM.
     * @param type: (Optional) To limit the results to this specified type.
     */
    if (!req._body) {
        res.json({ error: "Specify request with 'query' and actual query."});
    }

    axios.get('https://www.openstreetmap.org/geocoder/search_osm_nominatim?query=' + req.body.query)
        .then(response => {
            let $ = cheerio.load(response.data);
            let search_results = $(".results-list li p");

            let nodes = {};

            for (let i=0; i < search_results.length; i+=1) {
                let sr = search_results[i];
                let sr_type = sr.children[0]["data"].trim();
                let type_defined = req.body.type !== undefined;

                if (type_defined && req.body.type.toLowerCase() === sr_type.toLocaleLowerCase()) {
                    nodes[sr_type] = sr.children[1].attribs;
                }
                else if (!type_defined) {
                    nodes[sr_type] = sr.children[1].attribs;
                }
            }
            res.json({ data: nodes });
        })
        .catch(error => {
            res.json({
                error: error
            });
        });
};