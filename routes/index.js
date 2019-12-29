let express = require('express');
let router = express.Router();
let osm_controller = require("../controllers/osm");

router.post('/', osm_controller.get_nodes);

module.exports = router;
