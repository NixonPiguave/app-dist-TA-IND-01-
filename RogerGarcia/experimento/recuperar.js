// Consulta de solo lectura en el nodo reincorporado.
db = db.getSiblingDB("taind01");
db.getMongo().setReadPref("secondaryPreferred");
print("Nodo consultado directamente: " + db.hello().me);

const estado = rs.status();
estado.members.forEach(m =>
  print(m.name + " | " + m.stateStr + " | salud=" + m.health));
if (estado.members.length !== 3 ||
    !estado.members.every(m => m.health === 1 &&
      ["PRIMARY", "SECONDARY"].includes(m.stateStr)) ||
    estado.members.filter(m => m.stateStr === "PRIMARY").length !== 1) {
  print("Los tres miembros todavía no están listos. Repetir solo esta consulta después de esperar.");
  quit(2);
}

const respuesta = db.runCommand({
  find: "pruebas",
  filter: {_id: {$in: ["roger-taind01-base", "roger-taind01-despues"]}},
  readConcern: {level: "majority"}
});
if (respuesta.ok !== 1 || !respuesta.cursor ||
    respuesta.cursor.firstBatch.length !== 2) {
  printjson(respuesta);
  print("Todavía no se comprobaron ambos documentos; esperar y repetir la consulta.");
  quit(2);
}
print("Documentos encontrados en el nodo reincorporado:");
respuesta.cursor.firstBatch.forEach(d => print(d._id + " | " + d.mensaje));
