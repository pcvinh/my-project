const fs = require('fs')
xml2js = require('xml2js')
var parser = new xml2js.Parser();

const xml_file = '/Production_Catalog_InternetTV.xml'

const createCsvWriter = require('csv-writer').createArrayCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out_InternetTV_b4_2nd_migration.csv'
});



try {
	fs.readFile(__dirname + xml_file, function(err, data) {
		parser.parseString(data, function (err, result) {
			parse(result, function(ret) {
			  csvWriter  
			  .writeRecords(ret)
			  .then(()=> console.log('The CSV file was written successfully'));
			});
		});
	});
} catch(err) {
  console.error(err)
}

function get_ImageSize(EpgDescription) {
		
	for(var i = 0; i < EpgDescription.length; i++) {
		if(!EpgDescription[i].hasOwnProperty('$')) {
			var EpgElement;
			if(Array.isArray(EpgDescription[i].EpgElement)) {
				  EpgElement = EpgDescription[i].EpgElement;
			  } else {
				  EpgElement = [EpgDescription[i].EpgElement];
			  }
			if(EpgElement[0]['$']["key"] === 'ImageSize') {
				return EpgElement[0]["_"];
			} 
			
			return "";
		}
	}
}
function parse(data, callback) {

	var ret = [] ;
	var nodes_lv3 = data.Node.Node;
 
  for(var i = 0; i < nodes_lv3.length; i++) {
	  var node_lv3 = nodes_lv3[i];
	  var lv3_title = node_lv3['$'].id + ":" + node_lv3['$'].title;
	  var lv3_imageSize = get_ImageSize(node_lv3.EpgDescription);
	  
	  if(node_lv3.hasOwnProperty("Node")) {
		  var nodes_lv4;
		  if(Array.isArray(node_lv3.Node)) {
			  nodes_lv4 = node_lv3.Node;
		  } else {
			  nodes_lv4 = [node_lv3.Node];
		  }
		  
		  for(var j = 0; j < nodes_lv4.length; j++) {
				var node_lv4 = nodes_lv4[j];
				var lv4_title = node_lv4['$'].id + ":" + node_lv4['$'].title;
				var lv4_imageSize = get_ImageSize(node_lv4.EpgDescription);
	  
				 if(node_lv4.hasOwnProperty("Node")) {
					  var nodes_lv5;
					  if(Array.isArray(node_lv4.Node)) {
						  nodes_lv5 = node_lv4.Node;
					  } else {
						  nodes_lv5 = [node_lv4.Node];
					  }
					  
					  for(var k = 0; k < nodes_lv5.length; k++) {
						  var node_lv5 = nodes_lv5[k];
						  var lv5_title = node_lv5['$'].id + ":" + node_lv5['$'].title;
							var lv5_imageSize = get_ImageSize(node_lv5.EpgDescription);
						  
						  if(node_lv5.hasOwnProperty("Node")) {
							  var nodes_lv6;
							  if(Array.isArray(node_lv5.Node)) {
								  nodes_lv6 = node_lv5.Node;
							  } else {
								  nodes_lv6 = [node_lv5.Node];
							  }
							  
							   for(var l = 0; l < nodes_lv6.length; l++) { 
									var node_lv6 = nodes_lv6[l];
									var lv6_title = node_lv6['$'].id + ":" + node_lv6['$'].title;
									var lv6_imageSize = get_ImageSize(node_lv6.EpgDescription);
									
									ret.push([lv3_title, lv3_imageSize,lv4_title, lv4_imageSize,lv5_title, lv5_imageSize,lv6_title, lv6_imageSize]);
									
									if(i == nodes_lv3.length -1 && j == nodes_lv4.length -1 && k == nodes_lv5.length -1 && l == nodes_lv6.length -1) callback(ret);
							   }
							  
						  } else { 
							// no child - so write
							  ret.push([lv3_title, lv3_imageSize,lv4_title, lv4_imageSize,lv5_title, lv5_imageSize]);
							  if(i == nodes_lv3.length -1 && j == nodes_lv4.length -1 && k == nodes_lv5.length -1) callback(ret);
						  }
					  }
				 } else {
					 // no child - so write
					 ret.push([lv3_title, lv3_imageSize,lv4_title, lv4_imageSize]);
					 
					 if(i == nodes_lv3.length -1 && j == nodes_lv4.length -1) callback(ret);
				 } 
		  }
		  
	  } else {
		  // no more child
		  ret.push([lv3_title, lv3_imageSize]);
		  
		  if(i == nodes_lv3.length -1) callback(ret);
	  }
	  
	  
  }
  
	
}