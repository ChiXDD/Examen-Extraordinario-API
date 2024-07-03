const inversionesModel = require('../models/inversionesModel');

async function simularYGuardar(inversion, usuarioId) {
  try {
    console.log('Iniciando simulación de rendimiento histórico');
    const resultadosHistorico = await inversionesModel.simularRendimientoHistorico(inversion);
    console.log('Simulación de rendimiento histórico completada');

    console.log('Iniciando simulación de rendimiento ajustado por inflación');
    const resultadosAjustado = await inversionesModel.simularRendimientoAjustadoInflacion(inversion);
    console.log('Simulación de rendimiento ajustado por inflación completada');

    console.log('Iniciando simulación de Monte Carlo');
    const resultadosMontecarlo = await inversionesModel.simularMontecarlo(inversion);
    console.log('Simulación de Monte Carlo completada');
    
    await inversionesModel.guardarSimulacionHistorica(inversion, resultadosHistorico, usuarioId);
    await inversionesModel.guardarSimulacionAjustado(inversion, resultadosAjustado, usuarioId);
    await inversionesModel.guardarSimulacionMontecarlo(inversion, resultadosMontecarlo, usuarioId);

    console.log('Guardando movimiento');
    await inversionesModel.guardarMovimiento(resultadosHistorico, resultadosAjustado, resultadosMontecarlo, usuarioId);

    return { resultadosHistorico, resultadosAjustado, resultadosMontecarlo };
  } catch (error) {
    console.error('Error en simularYGuardar:', error);
    throw error;
  }
}

module.exports = {
  simularYGuardar
}
