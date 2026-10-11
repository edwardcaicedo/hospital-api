const express = require('express');
const app = express();
const pacientesRoutes = require('./routes/pacientesRoutes');
const doctoresRoutes = require('./routes/doctoresRouter');
const citasRoutes = require('./routes/citasRouter')
const usuariosRouter = require('./routes/usuarioRouter');
const authRouter = require('./routes/authRoutes')
const { errorHandler } = require('./middleware/errorHandler');

app.use(express.json());

// Rutas de la API
app.use('/pacientes', pacientesRoutes);
app.use('/doctores', doctoresRoutes);
app.use('/citas', citasRoutes);
app.use('/usuarios', usuariosRouter);
app.use('/api/auth', authRouter);
// El middleware de errores SIEMPRE se registra al final de todas las rutas
app.use(errorHandler);

module.exports = app;