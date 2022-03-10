'use strict';

var express = require("express");
var router = express.Router();
var projectsController = require("./projects.controller")

router.get('/', projectsController.index);
router.post('/create', projectsController.create);
router.put('/:id', projectsController.update);
router.put('/delete/:id', projectsController.delete);

module.exports = router;