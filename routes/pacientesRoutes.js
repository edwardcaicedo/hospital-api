const express = require('express');

const router = express.Router();

const controller = require('../controller/pacientesController');

const asyncHandler = require('../utils/asyncHandler');

const { validarPacienteMiddleware } = require('../middleware/errorHandler');

const { validarIdMiddleware } =
    require('../middleware/idValidator');

const { checkRole } =
    require('../middleware/checkRole');

const  authMiddleware  =
    require('../middleware/authMiddleware');


router.get('/ciudad/:ciudad', authMiddleware, checkRole(['admin']), asyncHandler(controller.listarPacienteCiudad))

router.get('/:id', validarIdMiddleware, asyncHandler(controller.buscarPaciente));

router.get('/', asyncHandler(controller.listarPacientes));

router.post(
    '/',
    authMiddleware,
    checkRole(['admin']),
    validarPacienteMiddleware,
    asyncHandler(controller.crearPaciente)
);


router.put(
    '/:id',
    authMiddleware,
    checkRole(['admin']),
    validarIdMiddleware,
    validarPacienteMiddleware,
    asyncHandler(controller.modificarPaciente)
);


router.delete(
    '/:id',
    authMiddleware,
    checkRole(['admin']),
    validarIdMiddleware,
    asyncHandler(controller.eliminarPaciente)
);


module.exports = router;