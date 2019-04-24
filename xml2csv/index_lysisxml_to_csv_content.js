var fs = require('fs'),
    xml2js = require('xml2js');

	
const createCsvWriter = require('csv-writer').createArrayCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out_content_new.csv'
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
			
			for(var i=0;i < result.ScheduleProvider.Content.length; i++) {
				var id = result.ScheduleProvider.Content[i]['$'].id;
				var title = result.ScheduleProvider.Content[i]['$'].title;
				if(result.ScheduleProvider.Content[i].Media) {
					var media_fileName = result.ScheduleProvider.Content[i].Media[0]['$'].fileName;
					var media_id = result.ScheduleProvider.Content[i].Media[0]['$'].id;
				} else {
					var media_fileName = "NA";
					var media_id = "NA";
				}
				
				ret.push( [id, title, media_fileName, media_id]);
				
				if(i == result.ScheduleProvider.Content.length - 1) {
					callback(ret);
				}
			} 
		});
	});
}
