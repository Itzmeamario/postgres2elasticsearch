exports.createJson = (writer, encoding, type, typeName, callback) => {
  let i = 0;
  let max = type.length;
  function write() {
    let ok = true;
    while (i < max && ok) {
      let id = type[i].node_id;
      let name = type[i].name.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      // if(name.includes('\r' || '\n' || '\p' || '\t' || '\\')) {
      //   console.log(name.replace(/\r?\n/g, " ").replace(/\t?\t/g, ""));
      // }

      // if(name.indexOf('"') !== -1) {
      //   console.log(id);
      //   console.log(name);
      // }
      // if(id === '2000036') console.log({name});
      let countries = type[i].countries;
      let country_codes = type[i].country_codes;
      i += 1;
      // if (i % 100000 === 0) { console.log(i); }
      if (i === max) {
        writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}, type: "${typeName}" }\n`, encoding, callback);
      } else {
        ok = writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        ok = writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}", type: "${typeName}" }\n`, encoding);
      }
    }
    if (i < max) {
      writer.once('drain', write);
    }
  }
  write();
}

exports.createJsonEdges = (writer, encoding, type, callback) => {
  let i = 0;
  let max = type.length;
  function write() {
    let ok = true;
    while (i < max && ok) {
      let startId = type[i].start_id;
      let typeR = type[i].type.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let endId = type[i].end_id;
      i += 1;
      if (i === max) {
        writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${parseInt(startId.toString() + endId.toString())}" } }\n`, encoding);
        writer.write(`{ "start_id" : "${startId}", "type" : "${typeR}", "end_id" : "${endId}" }\n`, encoding, callback);
      } else {
        ok = writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${parseInt(startId.toString() + endId.toString())}" } }\n`, encoding);
        ok = writer.write(`{ "start_id" : "${startId}", "type" : "${typeR}", "end_id" : "${endId}" }\n`, encoding);
      }
    }
    if (i < max) {
      writer.once('drain', write);
    }
  }
  write();
}