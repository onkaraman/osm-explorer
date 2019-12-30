let express = require('express');
let router = express.Router();
let osm_controller = require("../controllers/osm");
let overpass_controller = require("../controllers/overpass");

router.post("/nodes", osm_controller.get_nodes);

router.post("/around", overpass_controller.get_radius);

module.exports = router;
