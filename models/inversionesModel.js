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

async function guardarSimulacionHistorica(inversion, resultadosPeriodicos, usuarioId) {
  const conexion = await obtenerConexion();
  try {
    const { tipoInversion, montoInicial, numAportaciones, montoAportaciones, plazoInversion } = inversion;

    // Asegúrate de que todos los datos sean del tipo adecuado
    const tipoInversionValido = tipoInversion && typeof tipoInversion === 'string';
    const montoInicialValido = montoInicial && !isNaN(parseFloat(montoInicial));
    const numAportacionesValido = numAportaciones !== undefined && !isNaN(parseInt(numAportaciones));
    const montoAportacionesValido = montoAportaciones !== undefined && !isNaN(parseFloat(montoAportaciones));
    const plazoInversionValido = plazoInversion !== undefined && !isNaN(parseInt(plazoInversion));
    const usuarioIdValido = usuarioId && !isNaN(parseInt(usuarioId));

    if (!tipoInversionValido || !montoInicialValido || !numAportacionesValido || !montoAportacionesValido || !plazoInversionValido || !usuarioIdValido) {
      console.error('Datos inválidos:', {
        tipoInversion,
        montoInicial,
        numAportaciones,
        montoAportaciones,
        plazoInversion,
        usuarioId
      });
      throw new Error('Faltan datos necesarios para guardar la simulación histórica');
    }

    // Convertir los valores a los tipos adecuados
    const montoInicialNum = parseFloat(montoInicial);
    const numAportacionesNum = parseInt(numAportaciones);
    const montoAportacionesNum = parseFloat(montoAportaciones);
    const plazoInversionNum = parseInt(plazoInversion);
    const usuarioIdNum = parseInt(usuarioId);

    // Formatear los resultados a dos decimales
    const resultadosFormateados = resultadosPeriodicos.map(resultado => ({
      periodo: resultado.periodo,
      resultado: parseFloat(resultado.resultado.toFixed(2))
    }));

    const resultadosPeriodicosJson = JSON.stringify(resultadosFormateados);

    // Realizar la inserción en la tabla historico y obtener el ID insertado
    const [result] = await conexion.query(
      `INSERT INTO historico (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, usuario_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipoInversion, montoInicialNum, numAportacionesNum, montoAportacionesNum, plazoInversionNum, usuarioIdNum]
    );

    const historicoId = result.insertId;

    // Realizar las inserciones en la tabla resultados_periodicos
    for (const resultadoPeriodico of resultadosFormateados) {
      await conexion.query(
        `INSERT INTO resultados_periodicos (simulacion_id, periodo, resultado, tipo_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?)`,
        [historicoId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'historico', usuarioIdNum]
      );
    }

    return historicoId;
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

    // Asegúrate de que todos los datos sean del tipo adecuado
    const tipoInversionValido = tipoInversion && typeof tipoInversion === 'string';
    const montoInicialValido = montoInicial && !isNaN(parseFloat(montoInicial));
    const numAportacionesValido = numAportaciones !== undefined && !isNaN(parseInt(numAportaciones));
    const montoAportacionesValido = montoAportaciones !== undefined && !isNaN(parseFloat(montoAportaciones));
    const plazoInversionValido = plazoInversion !== undefined && !isNaN(parseInt(plazoInversion));
    const usuarioIdValido = usuarioId && !isNaN(parseInt(usuarioId));

    if (!tipoInversionValido || !montoInicialValido || !numAportacionesValido || !montoAportacionesValido || !plazoInversionValido || !usuarioIdValido) {
      console.error('Datos inválidos:', {
        tipoInversion,
        montoInicial,
        numAportaciones,
        montoAportaciones,
        plazoInversion,
        usuarioId
      });
      throw new Error('Faltan datos necesarios para guardar la simulación histórica');
    }

    // Convertir los valores a los tipos adecuados
    const montoInicialNum = parseFloat(montoInicial);
    const numAportacionesNum = parseInt(numAportaciones);
    const montoAportacionesNum = parseFloat(montoAportaciones);
    const plazoInversionNum = parseInt(plazoInversion);
    const usuarioIdNum = parseInt(usuarioId);

    // Formatear los resultados a dos decimales
    const resultadosFormateados = resultadosPeriodicos.map(resultado => ({
      periodo: resultado.periodo,
      resultado: parseFloat(resultado.resultado.toFixed(2))
    }));

    const resultadosPeriodicosJson = JSON.stringify(resultadosFormateados);

    // Realizar la inserción en la tabla historico y obtener el ID insertado
    const [result] = await conexion.query(
      `INSERT INTO ajustado (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, usuario_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipoInversion, montoInicialNum, numAportacionesNum, montoAportacionesNum, plazoInversionNum, usuarioIdNum]
    );

    const ajustadoId = result.insertId;

    // Realizar las inserciones en la tabla resultados_periodicos
    for (const resultadoPeriodico of resultadosFormateados) {
      await conexion.query(
        `INSERT INTO resultados_periodicos (simulacion_id, periodo, resultado, tipo_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?)`,
        [ajustadoId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'ajustado', usuarioIdNum]
      );
    }

    return ajustadoId;
  } catch (error) {
    console.error('Error al guardar la simulación histórica:', error.message);
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

    // Asegúrate de que todos los datos sean del tipo adecuado
    const tipoInversionValido = tipoInversion && typeof tipoInversion === 'string';
    const montoInicialValido = montoInicial && !isNaN(parseFloat(montoInicial));
    const numAportacionesValido = numAportaciones !== undefined && !isNaN(parseInt(numAportaciones));
    const montoAportacionesValido = montoAportaciones !== undefined && !isNaN(parseFloat(montoAportaciones));
    const plazoInversionValido = plazoInversion !== undefined && !isNaN(parseInt(plazoInversion));
    const usuarioIdValido = usuarioId && !isNaN(parseInt(usuarioId));

    if (!tipoInversionValido || !montoInicialValido || !numAportacionesValido || !montoAportacionesValido || !plazoInversionValido || !usuarioIdValido) {
      console.error('Datos inválidos:', {
        tipoInversion,
        montoInicial,
        numAportaciones,
        montoAportaciones,
        plazoInversion,
        usuarioId
      });
      throw new Error('Faltan datos necesarios para guardar la simulación histórica');
    }

    // Convertir los valores a los tipos adecuados
    const montoInicialNum = parseFloat(montoInicial);
    const numAportacionesNum = parseInt(numAportaciones);
    const montoAportacionesNum = parseFloat(montoAportaciones);
    const plazoInversionNum = parseInt(plazoInversion);
    const usuarioIdNum = parseInt(usuarioId);

    // Formatear los resultados a dos decimales
    const resultadosFormateados = resultadosPeriodicos.map(resultado => ({
      periodo: resultado.periodo,
      resultado: parseFloat(resultado.resultado.toFixed(2))
    }));

    const resultadosPeriodicosJson = JSON.stringify(resultadosFormateados);

    // Realizar la inserción en la tabla historico y obtener el ID insertado
    const [result] = await conexion.query(
      `INSERT INTO montecarlo (tipo_inversion, monto_inicial, num_aportaciones, monto_aportaciones, plazo_inversion, usuario_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipoInversion, montoInicialNum, numAportacionesNum, montoAportacionesNum, plazoInversionNum, usuarioIdNum]
    );

    const montecarloId = result.insertId;

    // Realizar las inserciones en la tabla resultados_periodicos
    for (const resultadoPeriodico of resultadosFormateados) {
      await conexion.query(
        `INSERT INTO resultados_periodicos (simulacion_id, periodo, resultado, tipo_simulacion, usuario_id) VALUES (?, ?, ?, ?, ?)`,
        [montecarloId, resultadoPeriodico.periodo, resultadoPeriodico.resultado, 'montecarlo', usuarioIdNum]
      );
    }

    return montecarloId;
  } catch (error) {
    console.error('Error al guardar la simulación histórica:', error.message);
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
  guardarSimulacionMontecarlo
};
