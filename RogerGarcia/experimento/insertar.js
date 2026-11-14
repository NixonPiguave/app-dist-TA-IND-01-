// Ejecutar una sola vez, con los tres miembros disponibles.
db = db.getSiblingDB("taind01");

const respuesta = db.runCommand({
  insert: "pruebas",
  documents: [{
    _id: "roger-taind01-base",
    estudiante: "Roger Steven García Sangoquiza",
    paralelo: "7mo Soft, paralelo B",
    actividad: "TA-IND-01",
    mensaje: "Documento previo al apagado del primario",
    fecha: new Date()
  }],
  writeConcern: {w: 3, j: true, wtimeout: 10000}
});

if (respuesta.ok !== 1 || respuesta.writeConcernError ||
    (respuesta.writeErrors && respuesta.writeErrors.length > 0)) {
  printjson(respuesta);
  quit(2);
}

print("Inserción confirmada con w=3 y j=true.");
printjson({ok: respuesta.ok, n: respuesta.n});

const lectura = db.runCommand({
  find: "pruebas",
  filter: {_id: "roger-taind01-base"},
  readConcern: {level: "majority"}
});
if (lectura.ok !== 1 || !lectura.cursor ||
    lectura.cursor.firstBatch.length !== 1) {
  printjson(lectura);
  quit(2);
}
print("Documento consultado:");
printjson(lectura.cursor.firstBatch[0]);
