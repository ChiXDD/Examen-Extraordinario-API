const inversionesModel = require('../models/inversionesModel');

async function simularYGuardar(inversion, usuarioId, historicoId, ajustadoId, montecarloId) {
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
    
    console.log('Guardando simulacion historica');
    await inversionesModel.guardarSimulacionHistorica(inversion, resultadosHistorico, usuarioId);
    console.log('Simulacion historica guardada');
    console.log('Guardando simulacion ajustado');
    await inversionesModel.guardarSimulacionAjustado(inversion, resultadosAjustado, usuarioId);
    console.log('Simulacion ajustado guardada');
    console.log('Guardando simulacion montecarlo');
    await inversionesModel.guardarSimulacionMontecarlo(inversion, resultadosMontecarlo, usuarioId);
    console.log('Simulacion montecarlo guardada');

    return { resultadosHistorico, resultadosAjustado, resultadosMontecarlo };
  } catch (error) {
    console.error('Error en simularYGuardar:', error);
    throw error;
  }
}

module.exports = {
  simularYGuardar
};