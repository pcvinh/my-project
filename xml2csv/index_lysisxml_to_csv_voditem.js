var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});
 

 



var fs = require('fs'),
    xml2js = require('xml2js');

	
const createCsvWriter = require('csv-writer').createArrayCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out_voditem_new.csv'
});

var xml_file = '/SCV_2019-03-15_02_30_00.xml';


try {
	
	parse(function(ret) {
	  csvWriter  
	  .writeRecords(ret)
	  .then(()=> console.log('The CSV file was written successfully'));
	});

} catch(err) {
  console.error(err)
}

function parse(callback) {
	var parser = new xml2js.Parser();
	
	var ret = [];
	fs.readFile(__dirname + xml_file, function(err, data) {
		parser.parseString(data, function (err, result) {
			var length = result.ScheduleProvider.VodItem.length;
			//for(var i=0;i < result.ScheduleProvider.VodItem.length; i++) {
			for(var i=0;i < length; i++) {
				var id = result.ScheduleProvider.VodItem[i]['$'].id;
				var nodeRefs = result.ScheduleProvider.VodItem[i]['$'].nodeRefs.split(" ");
				if(result.ScheduleProvider.VodItem[i].EpgDescription[2]) {
					var ShortTitle = result.ScheduleProvider.VodItem[i].EpgDescription[2].EpgElement[0];
				} else {
					var ShortTitle = "NA";
				}
				if(result.ScheduleProvider.VodItem[i].EpgDescription[0].EpgElement[6]['$'].key === 'EpisodeNumber') {
					var is_eps = true;
				} else {
					var is_eps = false;
				}
				
				for(var j = 0; j < nodeRefs.length; j++) {
					ret.push( [id, nodeRefs[j], is_eps]);
				}
				
				
				if(i == length - 1) {
					callback(ret);
				}
			} 
		});
	});
}


/*
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
*/