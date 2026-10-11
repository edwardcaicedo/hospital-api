
const express = require('express');
const router = express.Router();
const controller = require('../controller/citasController');
const asyncHandler = require('../utils/asyncHandler');
const {validarCitasMiddleware, validarNombreMiddleware} = require('../middleware/errorHandler');
const {validarIdMiddleware} = require('../middleware/idValidator')
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');


router.get('/', asyncHandler(controller.listarCitas));
router.get('/nombre/:nombre', validarNombreMiddleware, asyncHandler(controller.buscarCitasPorNombrePaciente));
router.get('/doctor/:nombre', validarNombreMiddleware, asyncHandler(controller.buscarCitasPorNombreDoctor));
router.get('/:id',validarIdMiddleware, asyncHandler(controller.buscarCitas));
router.post('/',authMiddleware, checkRole(['admin']) , validarCitasMiddleware, asyncHandler(controller.crearCita));
router.put('/:id',authMiddleware, checkRole(['admin']), validarIdMiddleware, validarCitasMiddleware, asyncHandler(controller.modificarCita));
router.delete('/:id',authMiddleware, checkRole(['admin']), validarIdMiddleware, asyncHandler(controller.eliminarCita));






module.exports = router;