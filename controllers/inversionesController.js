const inversionesService = require('../services/inversionesService');

exports.simularYGuardar = async (req, res) => {
    try {
        console.log("Iniciando simulación de rendimiento histórico");
        const inversion = req.body;
        console.log("Datos de la inversión recibidos en el API:", inversion);

        const resultado = await inversionesService.simularYGuardar(inversion);
        res.json(resultado);
    } catch (error) {
        console.error("Error en simularYGuardar:", error);
        res.status(500).json({ message: 'Error al intentar simular y guardar la inversión', error: error.message });
    }
};
