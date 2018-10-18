exports.createBulk = (bulk, element, elementName, callback) => {
  function write() {
    for(let i = 0; i < element.length; i++) {
      let id = element[i].node_id;
      let name = element[i].name.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let countries = element[i].countries;
      let country_codes = element[i].country_codes;
      bulk.push({
        'create':
          {
            '_index': 'panama_papers',
            '_type': 'panama_papers',
            '_id': id
          }
      });
      bulk.push({
        id,
        name, 
        countries, 
        country_codes,
        elementName
      });
    }
    callback();
  }
  write();
}

exports.createBulkEdges = (bulk, element, callback) => {
  function write() {
    for(let i = 0; i < element.length; i++) {
      let startId = element[i].start_id;
      let typeRelation = element[i].type.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let endId = element[i].end_id;
      bulk.push({
        'create':
          {
            '_index': 'panama_papers',
            '_type': 'panama_papers',
            '_id': startId + endId
          }
      });
      bulk.push({
        start_id: startId,
        type: typeRelation, 
        end_id: endId
      });
    }
    callback();
  }
  write();
}

exports.createJson = (writer, encoding, element, elementName, callback) => {
  let i = 0;
  let max = element.length;
  function write() {
    let ok = true;
    while (i < max && ok) {
      let id = element[i].node_id;
      let name = element[i].name.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let countries = element[i].countries;
      let country_codes = element[i].country_codes;
      i += 1;
      if (i === max) {
        writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}, type: "${elementName}" }\n`, encoding, callback);
      } else {
        ok = writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        ok = writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}", type: "${elementName}" }\n`, encoding);
      }
    }
    if (i < max) {
      writer.once('drain', write);
    }
  }
  write();
}

exports.createJsonEdges = (writer, encoding, element, callback) => {
  let i = 0;
  let max = element.length;
  function write() {
    let ok = true;
    while (i < max && ok) {
      let startId = element[i].start_id;
      let typeRelation = element[i].type.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let endId = element[i].end_id;
      i += 1;
      if (i === max) {
        writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${parseInt(startId.toString() + endId.toString())}" } }\n`, encoding);
        writer.write(`{ "start_id" : "${startId}", "type" : "${typeRelation}", "end_id" : "${endId}" }\n`, encoding, callback);
      } else {
        ok = writer.write(`{ "create" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${parseInt(startId.toString() + endId.toString())}" } }\n`, encoding);
        ok = writer.write(`{ "start_id" : "${startId}", "type" : "${typeRelation}", "end_id" : "${endId}" }\n`, encoding);
      }
    }
    if (i < max) {
      writer.once('drain', write);
    }
  }
  write();
}