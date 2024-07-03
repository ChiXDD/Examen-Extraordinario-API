const axios = require('axios');
const { obtenerConexion } = require('../database/conexion');

// Función para simular el rendimiento promedio histórico
async function simularRendimientoHistorico(inversion) {
  const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
  let resultadoSimulacion = montoInicial;
  let gananciaSimulacion;

  if (plazoInversion < numAportaciones) {
    throw new Error('El número de aportaciones no puede ser mayor al plazo de inversión');
  } else if (plazoInversion === 0) {
    throw new Error('El plazo de inversión no puede ser 0');
  } else if (montoInicial < 10 || montoAportaciones < 10) { 
    throw new Error('El monto inicial y las aportaciones deben ser iguales o mayores a 10');
  } else {
    // Determinar el rendimiento promedio según el tipo de inversión
    if (tipoInversion === 'cuenta-ahorro') {
      gananciaSimulacion = 0.0010; // 0.10% para cuentas de ahorro
    } else if (tipoInversion === 'bonos-gob') {
      gananciaSimulacion = 0.05; // 5% bonos gubernamentales
    } else if (tipoInversion === 'bonos-corp') {
      gananciaSimulacion = 0.05; // 5% bonos corporativos
    } else if (tipoInversion === 'propiedad-resi') {
      gananciaSimulacion = 0.06; // 6% propiedades residenciales
    } else if (tipoInversion === 'propiedad-comer') {
      gananciaSimulacion = 0.06; // 6% propiedades comerciales
    } else {
      gananciaSimulacion = 0.07; // 7% para otras inversiones
    }

    const resultadosPeriodicos = [];

    for (let i = 0; i < plazoInversion; i++) {
      if (i < numAportaciones) {
        resultadoSimulacion += montoAportaciones;
      }
      resultadoSimulacion *= 1 + (gananciaSimulacion / plazoInversion);
      resultadosPeriodicos.push({ periodo: i + 1, resultado: resultadoSimulacion });
    }

    return resultadosPeriodicos;
  }
}

async function guardarSimulacionHistorica(inversion, usuarioId, resultadosPeriodicos) {
  const conexion = await obtenerConexion();
  try {
    const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
    const resultadosPeriodicosJson = JSON.stringify(resultadosPeriodicos);

    await conexion.query ("INSERT INTO `historico` (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, resultado_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion, resultadosPeriodicosJson, usuarioId]);

    const historicoId = result.insertId;

    for (const resultadoPeriodico of resultadosPeriodicos) {
      await conexion.query("INSERT INTO `resultados_periodicos` (simulacion_id, periodo, resultado, tipo_simulacion) VALUES (?, ?, ?, ?)", [historicoId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'historico']);
    }
  } catch (error) {
    console.error('Error al guardar la simulación histórica:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}




// Función para simular el rendimiento ajustado por inflación
async function simularRendimientoAjustadoInflacion(inversion, conseguirPlazoInversion) {
  const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
  let resultadoSimulacion = montoInicial;
  let gananciaSimulacion;
  let inflacion = 0.03 // 4% de inflación anual

  if (plazoInversion < numAportaciones) {
    throw new Error('El número de aportaciones no puede ser mayor al plazo de inversión');
  } else if (plazoInversion === 0) {
    throw new Error('El plazo de inversión no puede ser 0');
  } else if (montoInicial < 10 || montoAportaciones < 10) { 
    throw new Error('El monto inicial y las aportaciones deben ser iguales o mayores a 10');
  } else {
    // Determinar el rendimiento promedio según el tipo de inversión
    if (tipoInversion === 'cuenta-ahorro') {
      gananciaSimulacion = 0.0010; // 0.10% para cuentas de ahorro
    } else if (tipoInversion === 'bonos-gob') {
      gananciaSimulacion = 0.05; // 5% bonos gubernamentales
    } else if (tipoInversion === 'bonos-corp') {
      gananciaSimulacion = 0.05; // 5% bonos corporativos
    } else if (tipoInversion === 'propiedad-resi') {
      gananciaSimulacion = 0.06; // 6% propiedades residenciales
    } else if (tipoInversion === 'propiedad-comer') {
      gananciaSimulacion = 0.06; // 6% propiedades comerciales
    } else {
      gananciaSimulacion = 0.07; // 7% para otras inversiones
    }

    const resultadosPeriodicos = [];

    for (let i = 0; i < plazoInversion; i++) {
      if (i < numAportaciones) {
        resultadoSimulacion += montoAportaciones;
      }
      resultadoSimulacion *= 1 + ((gananciaSimulacion - inflacion) / plazoInversion);
      resultadosPeriodicos.push({ periodo: i + 1, resultado: resultadoSimulacion });
    }

    return resultadosPeriodicos;
  }
}

async function guardarSimulacionAjustado(inversion, resultadosPeriodicos, usuarioId) {
  const conexion = await obtenerConexion();
  try {
    const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
    const resultadosPeriodicosJson = JSON.stringify(resultadosPeriodicos);

    await conexion.query ("INSERT INTO `ajustado` (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, resultado_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion, resultadosPeriodicosJson, usuarioId]);

    const ajustadoId = result.insertId;

    for (const resultadoPeriodico of resultadosPeriodicos) {
      await conexion.query("INSERT INTO `resultados_periodicos` (simulacion_id, periodo, resultado, tipo_simulacion) VALUES (?, ?, ?, ?)", [historicoId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'ajustado']);
    }
  } catch (error) {
    console.error('Error al guardar la simulación ajustada:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}

// Función para la simulación de Monte Carlo
async function simularMontecarlo(inversion, conseguirPlazoInversion) {
  const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
  let simulaciones = 1000;
  let resultados = [];

  if (plazoInversion < numAportaciones) {
    throw new Error('El número de aportaciones no puede ser mayor al plazo de inversión');
  } else if (plazoInversion === 0) {
    throw new Error('El plazo de inversión no puede ser 0');
  } else if (montoInicial < 10 || montoAportaciones < 10) { 
    throw new Error('El monto inicial y las aportaciones deben ser iguales o mayores a 10');
  } else {
    // Determinar el rendimiento promedio según el tipo de inversión
    if (tipoInversion === 'cuenta-ahorro') {
      gananciaSimulacion = 0.0010; // 0.10% para cuentas de ahorro
    } else if (tipoInversion === 'bonos-gob') {
      gananciaSimulacion = 0.05; // 5% bonos gubernamentales
    } else if (tipoInversion === 'bonos-corp') {
      gananciaSimulacion = 0.05; // 5% bonos corporativos
    } else if (tipoInversion === 'propiedad-resi') {
      gananciaSimulacion = 0.06; // 6% propiedades residenciales
    } else if (tipoInversion === 'propiedad-comer') {
      gananciaSimulacion = 0.06; // 6% propiedades comerciales
    } else {
      gananciaSimulacion = 0.07; // 7% para otras inversiones
    }

    const resultadosPeriodicos = [];

    for (let i = 0; i < simulaciones; i++) {
      let resultadoSimulacion = montoInicial;
      const resultadosIntermedios = [];

      for (let j = 0; j < plazoInversion; j++) {
        if (j < numAportaciones) {
          resultadoSimulacion += montoAportaciones;
        }
        let randomRate = gananciaSimulacion + (Math.random() * 0.1 - 0.05); // +-5% alrededor del rendimiento promedio
        resultadoSimulacion *= 1 + (randomRate / plazoInversion);
        resultadosIntermedios.push(resultadoSimulacion);
      }

      resultados.push(resultadosIntermedios);
    }

    // Promediar los resultados de todas las simulaciones
    const resultadosPromedio = [];
    for (let i = 0; i < plazoInversion; i++) {
      let suma = 0;
      for (let j = 0; j < simulaciones; j++) {
        suma += resultados[j][i];
      }
      resultadosPromedio.push({ periodo: i + 1, resultado: suma / simulaciones });
    }

    return resultadosPromedio;
  }
}

async function guardarSimulacionMontecarlo(inversion, resultadosPeriodicos, usuarioId) {
  const conexion = await obtenerConexion();
  try {
    const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;
    const resultadosPeriodicosJson = JSON.stringify(resultadosPeriodicos);

    await conexion.query ("INSERT INTO `montecarlo` (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, resultado_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion, resultadosPeriodicosJson, usuarioId]);

    const montecarloId = result.insertId;

    for (const resultadoPeriodico of resultadosPeriodicos) {
      await conexion.query("INSERT INTO `resultados_periodicos` (simulacion_id, periodo, resultado, tipo_simulacion) VALUES (?, ?, ?, ?)", [historicoId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'montecarlo']);
    }
  } catch (error) {
    console.error('Error al guardar la simulación montecarlo:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}

async function guardarMovimiento(historicoId, ajustadoId, montecarloId) {
  const conexion = await obtenerConexion();

  try {
    const query = `INSERT INTO movimiento (historico_id, ajustado_id, montecarlo_id) VALUES (?, ?, ?)`;
    const values = [historicoId, ajustadoId, montecarloId];
    await conexion.query(query, values);
  } catch (error) {
    console.error('Error al guardar el movimiento:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}

async function obtenerTodosMovimientos() {
  const conexion = await obtenerConexion();

  try {
    const [result] = await conexion.query(`SELECT * FROM movimiento`);
    return result;
  } catch (error) {
    console.error('Error al obtener los movimientos:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}

async function obtenerMovimientoPorUsuario(usuarioId) {
  const conexion = await obtenerConexion();

  try {
    const [result] = await conexion.query(`SELECT * FROM movimiento WHERE usuario_id = ?`, [usuarioId]);
    return result;
  } catch (error) {
    console.error('Error al obtener el movimiento por usuario:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
}

module.exports = {
  simularRendimientoHistorico,
  guardarSimulacionHistorica,
  simularRendimientoAjustadoInflacion,
  guardarSimulacionAjustado,
  simularMontecarlo,
  guardarSimulacionMontecarlo,
  guardarMovimiento,
  obtenerTodosMovimientos,
  obtenerMovimientoPorUsuario
};
