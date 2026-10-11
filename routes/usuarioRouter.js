const express = require('express');
const router = express.Router();
const controller = require('../controller/usuarioController');
const asyncHandler = require('../utils/asyncHandler');
const {validarUsuarioMiddleware} = require('../middleware/usuarioValidator');
const {validarIdMiddleware} = require('../middleware/idValidator')
const { checkRole } = require('../middleware/checkRole');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/', asyncHandler(controller.listarUsuarios));
router.get('/:id', validarIdMiddleware, asyncHandler(controller.buscarUsuario));
router.put('/:id',authMiddleware, checkRole(['admin']) , validarIdMiddleware, validarUsuarioMiddleware, asyncHandler(controller.usuarioModificado) );
router.post('/', authMiddleware, checkRole(['admin']), validarUsuarioMiddleware, asyncHandler(controller.crearUsuario))
router.delete('/:id', authMiddleware, checkRole(['admin']), validarIdMiddleware, asyncHandler(controller.eliminarUsuario));


module.exports = router;


/*
{
    "nombre": "jhonier calderon",
    "email": "jcalderon@gmail.com",
    "password": "jrl1452",
    "rol": "doctor"
}

{
    "nombre": "sofia henao",
    "email": "shenao@gmail.com",
    "password": "htdol520",
    "rol": "recepcion"
}

{
    "email": "hhadmin@gmail.com",
    "password": "12345hh"
}

{
    "paciente_id": 7,
    "doctor_id": 6,
    "fecha": "2027-01-10T05:00:00.000Z",
    "estado": "confirmada"
}
*/