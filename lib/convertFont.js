	function replaceCmap(orgFileName){
		var fileContent = fs.readFileSync(orgFileName) + '';
		fileContent = fileContent.replace(/\r/g, '').replace(/\uFEFF/g, '').replace(/\n*$/, '');
		var lines = fileContent.split(/\n/);

		var ngChars = '0x9945 0x982d'.split(' ');
		var toBeReplaced = '0x25cb';
		var toBeGlyphName = getGlyphName(toBeReplaced, lines);
		for(var i=0; i<ngChars.length; i++){
			var ngGlyphName = getGlyphName(ngChars[i], lines);
			fileContent = fileContent.replace(new RegExp(ngGlyphName+'"','g'), toBeGlyphName+'"')
		}

		var newFileName = orgFileName.replace('\.ttx','_new.ttx');
		fs.writeFileSync(newFileName, fileContent);
		dispLog('(replace): ' + orgFileName + ' -> ' + newFileName);
		return newFileName;
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
		dispLog('error: '+theGlyph+' not found.');
		process.exit(-1);
	}