
	var fs = require('fs');

	var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

	function checkUpdate(callback){

		var url = "github";

		$.ajax({

			type : "GET",
			url : url,
			dataType : "json",
			cache : false,
			async : true,
			success : function(data){

				var version = config.version;
				var new_version = data.version;
				var str = "";
				if(version == new_version){
					str = "Latest version";
				}else{
					str = "Old version";
				}

				callback(str);
			}
		})
	}

	function getGssData(SheetName,callbackZ){
		 var url = config.json_url;
		 url = url.replace("[key]",config.key);
		 url = url.replace("[worksheetId]",config.worksheetId[SheetName]);
		 $.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				cache: false,
				async:true,
				success: function(data){
					var sheetsEntry = data.feed.entry;
					var arData = {};
					for (var i = 0; i < sheetsEntry.length; i++) {
						var obj = sheetsEntry[i].gs$cell;
						if(arData[obj.row] == null){
							arData[obj.row] = {};
						}
						arData[obj.row][obj.col] = obj.$t;
						arData.length = obj.row;
					}
					// callbackZ(arData);
					callbackZ(arData,SheetName);
				}
			});
	 }

	 var dataArray = [];
	 var setData = function(data,target) {
		dataArray[target] = data;
	 }

	 getGssData("対応表",setData);
	 getGssData("curios.string_table",setData);
	 getGssData("actor.string_table",setData);
	 getGssData("activity_log.string_table",setData);
	 getGssData("dialogue.string_table",setData);
	 getGssData("help.string_table",setData);
	 getGssData("quirks.string_table",setData);
	 getGssData("heroes.string_table",setData);
	 getGssData("menu.string_table",setData);
	 getGssData("miscellaneous.string_table",setData);

	 function strConv(str,data){
		var ret = "";
		// console.log(data);
		if(str == null){
			return str;
		}
		for (var i = 0; i < str.length; i++) {
			
			for (var j = 1; j <= data.length; j++) {

				if(str[i] == data[j][1]){
					ret += data[j][2];
					break;
				}

			};

		};
		return ret;

	 }

	 function replaceXml(xmlName,data,taiou,steamFolder,resultFolder) {
		var filename = steamFolder + "/localization/" + xmlName + ".xml";
		var text = fs.readFileSync(filename,'utf-8');
		var i = 2;

		setTimeout(function tmp() {
			
			if(typeof data[i] === "undefined"){

				if(i < data.length){
					i++;
					setTimeout(tmp,0);
				}else{

					console.log("FIN " + xmlName);
					fs.writeFile(resultFolder + "/" + xmlName + ".xml",text,function(err){
						console.log(err);
					});

				}

			}else{
				if (typeof data[i]["1"] === "undefined" || typeof data[i]["2"] === "undefined"){
					var par = (i / data.length) * 100;
					var name = xmlName.split(".");
					$("#" + name[0]).css("width", Math.round(par) + "%");
					if(i < data.length){
						i++;
						setTimeout(tmp,0);
					}else{

						// console.log("FIN " + xmlName);
						fs.writeFile(resultFolder + "/" + xmlName + ".xml",text,function(err){
							console.log(err);
						});

					}
				}else{

					var orgStr = data[i]["1"];
					var repStr = data[i]["2"];

					// console.log(repStr);

					repStr =  strConv(repStr,taiou);
					var str;
					if(repStr != "" && repStr != "undefined"){
						str = orgStr.replace(/CDATA\[.+?\]/, "CDATA[" + repStr + "]");
					}else{
						str = orgStr;
					}
					
					text = text.replace(orgStr, str);

					var par = (i / data.length) * 100;
					var name = xmlName.split(".");

					$("#" + name[0]).css("width", Math.round(par) + "%");

					if(i < data.length){
						i++;
						setTimeout(tmp,0);
					}else{

						fs.writeFile(resultFolder + "/" + xmlName + ".xml",text,function(err){
							console.log(err);
						});

					}
				}
			}
			
		},0)
		
	}