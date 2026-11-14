db = db.getSiblingDB("taind01");
print("Primario actual: " + db.hello().primary);
rs.status().members.forEach(m =>
  print(m.name + " | " + m.stateStr + " | salud=" + m.health));

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
print("Documento inicial conservado: " + lectura.cursor.firstBatch[0]._id);

const respuesta = db.runCommand({
  insert: "pruebas",
  documents: [{
    _id: "roger-taind01-despues",
    estudiante: "Roger Steven García Sangoquiza",
    mensaje: "Escritura con un miembro detenido",
    fecha: new Date()
  }],
  writeConcern: {w: "majority", j: true, wtimeout: 10000}
});
if (respuesta.ok !== 1 || respuesta.writeConcernError ||
    (respuesta.writeErrors && respuesta.writeErrors.length > 0)) {
  printjson(respuesta);
  quit(2);
}
print("Escritura posterior confirmada con w=majority y j=true:");
printjson({ok: respuesta.ok, n: respuesta.n});
