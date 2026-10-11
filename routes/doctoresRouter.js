
const express = require('express');
const router = express.Router();
const controller = require('../controller/doctoresController');
const asyncHandler = require('../utils/asyncHandler');
const { validarDoctoresMiddleware} = require('../middleware/errorHandler');
const {validarIdMiddleware} = require('../middleware/idValidator')
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');


router.get('/especialidad/:especialidad', authMiddleware, checkRole(['admin']), asyncHandler(controller.listarDoctoresEspecialidad))
router.get('/', asyncHandler(controller.listarDoctores));
router.get('/:id', validarIdMiddleware, asyncHandler(controller.buscarDoctor));
router.put('/:id', authMiddleware, checkRole(['admin']), validarIdMiddleware, validarDoctoresMiddleware, asyncHandler(controller.modificarDoctor))
router.post('/',authMiddleware, checkRole(['admin']), validarDoctoresMiddleware, asyncHandler(controller.crearDoctor));
router.delete('/:id',authMiddleware, checkRole(['admin']), validarIdMiddleware, asyncHandler(controller.eliminarDoctor) )

module.exports = router;