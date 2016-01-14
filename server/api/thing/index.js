'use strict';

import {Router} from 'express';
var controller = require('./thing.controller');
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(),controller.index);
router.get('/:id',auth.isAuthenticated(), controller.show);
router.post('/',auth.isAuthenticated(), controller.create);
router.put('/:id',auth.isAuthenticated() ,controller.update);
router.patch('/:id',auth.isAuthenticated(), controller.update);
router.delete('/:id',auth.isAuthenticated(), controller.destroy);

module.exports = router;
