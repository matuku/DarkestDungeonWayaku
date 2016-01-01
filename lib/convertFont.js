

	function replaceCmap(orgFileName,taiouData){
		var fileContent = fs.readFileSync(orgFileName) + '';
		fileContent = fileContent.replace(/\r/g, '').replace(/\uFEFF/g, '').replace(/\n*$/, '');
		var lines = fileContent.split(/\n/);

		for(var i=1; i<=taiouData.length; i++){

			var hexTaiouDataTo = strToHex(taiouData[i]["1"]);
			var hexTaiouDataNg = strToHex(taiouData[i]["2"]);

			var toBeGlyphName = getGlyphName(hexTaiouDataTo, lines);
			var ngGlyphName = getGlyphName(hexTaiouDataNg, lines);

			fileContent = fileContent.replace(new RegExp('"'+ngGlyphName+'"','g'), '"'+toBeGlyphName+'"')
		}

		var newFileName = orgFileName.replace('\.ttx','_new.ttx');
		fs.writeFileSync(newFileName, fileContent);
		return newFileName;
	}

	function strToHex(str) {

		var esc = escape(str);
		var hex = esc.split("%u").join("0x").toLowerCase();
		hex = hex.split("%").join("0x").toLowerCase();
		hex = hex.split("0x0").join("0x").toLowerCase();

		return hex;
	}

	function getGlyphName(theGlyph, lines){
		var m;
		var n;
		for (var i=0; i<lines.length; i++){
			if (lines[i].match(theGlyph)){
				if (m = lines[i].match('name="([^\"]+)"/>')){
					return m[1];
				}
			}
		}
		console.log('error: '+theGlyph+' not found.');
	}

	function getFontName(fileName,callback){

		$.ajax({
			type : "GET",
			url : fileName,
			dataType : "xml",
			cache : false,
			async : true,
			success : function(xml){
				var fnd = $(xml).find("namerecord[langID=\"0x411\"][nameID=\"1\"]").each(function(){
					var name = $(this).text().trim();
					callback(name);
				});
			}
		});
	}

	var createTGA = function(name,outputDir){

		var dir = "./fonts/";

		var fileList = [];

		var files = fs.readdirSync(dir);

		files.filter(function(file){
			return fs.statSync(dir + file).isFile() && /.*\.bmfc$/.test(dir + file);
		}).forEach(function (file) {

			var newFileName = replaceBMFC(dir + file,name,outputDir);
			var arFileName = newFileName.split("/");
			var outputFileTGA = arFileName[arFileName.length -1].split(".")[0] + ".fnt";

			exec('cd ' + outputDir + " & " + 'bmfont -c ' + newFileName + ' -o ' + "./" + outputFileTGA, function(err, stdoutTxt, stderrTxt){
				if(err !== null){
					console.log(err);
				}
			});

		});

		chageBtnStatus("btnFontConv","変換終了");
		return;

	}

	function replaceBMFC(orgFileName,fontName,outputDir){

		var fileContent = fs.readFileSync(orgFileName) + '';
		fileContent = fileContent.replace("fontNameValue",fontName);

		var newFileName = orgFileName.replace("./fonts",outputDir);

		fs.writeFileSync(newFileName, fileContent);
		return newFileName;	
	}