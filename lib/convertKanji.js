	var charMapData = JSON.parse(fs.readFileSync('./lib/charMap.json', 'utf8'));
	var arKanji = {};
	var mapKanji = {};

	var cbRetData = function(name,sentence,data){

		var sentencekanji = "";
		for (var i = 0; i < data.length; i++) {
			if(data[i][1] != null){
				if(data[i][1][0] != " "){
					sentencekanji += data[i][1][0];
				}
			}
		}

		if(arKanji[name] == null){
			arKanji[name] = {};
		}
		
		arKanji[name][sentence] = sentencekanji;

		if(mapKanji[name] == null){
			mapKanji[name] = {};
		}

		for (var j = 0; j < sentencekanji.length; j++) {
			if(isKanji(sentencekanji[j])){
				if(mapKanji[name][sentencekanji[j]] == null){
					mapKanji[name][sentencekanji[j]] = 1;
				}else{
					mapKanji[name][sentencekanji[j]]++;	
				}
			}
		}
	}

	function getHiragana2Kanji(index,data,name) {
		if(typeof data[index] === "undefined"){
			df[name].resolve();
			return;
		}
		if(typeof data[index]["2"] !== "undefined"){
			var sentence = data[index]["2"];
			sentence = sentence.replace(/ /g,''); 
			sentence = sentence.replace(/　/g,'');
			// console.log(sentence);
			if(sentence == ""){
				index++;
				getHiragana2Kanji(index,data,name);
			}

			var url = "http://www.google.com/transliterate?langpair=ja-Hira|ja&text=" + sentence;
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				cache: false,
				async: true,
				success: function(ret){
					// console.log(index);
					index++;
					cbRetData(name,sentence,ret);
					getHiragana2Kanji(index,data,name);
					return;
				},
				error: function(ret){
					console.log(name);
					console.log(sentence);
					// console.log(ret);
					index++;
					getHiragana2Kanji(index,data,name);
					return;
				}
			});
		}else{
			index++;
			getHiragana2Kanji(index,data,name);			
		}
		return;
	}

	var df = [];

	df["curios.string_table"] = $.Deferred();
	df["actor.string_table"] = $.Deferred();
	df["activity_log.string_table"] = $.Deferred();
	df["dialogue.string_table"] = $.Deferred();
	// df["help.string_table"] = $.Deferred();
	df["quirks.string_table"] = $.Deferred();
	df["heroes.string_table"] = $.Deferred();
	df["menu.string_table"] = $.Deferred();
	df["miscellaneous.string_table"] = $.Deferred();

	var mapData;

	function convertKanji(gssData){
		$.when(
			df["curios.string_table"].promise(),
			df["actor.string_table"].promise(),
			df["activity_log.string_table"].promise(),
			df["dialogue.string_table"].promise(),
			// df["help.string_table"].promise(),
			df["quirks.string_table"].promise(),
			df["heroes.string_table"].promise(),
			df["menu.string_table"].promise(),
			df["miscellaneous.string_table"].promise()
			// df["curios.string_table"].promise(),
			// df["actor.string_table"].promise()
		).done(
			function(){
				console.log("finish");
				createCostMap();
			}
		);
		// getHiragana2Kanji(2,dataArray["curios.string_table"],"curios.string_table");
		// getHiragana2Kanji(2,dataArray["actor.string_table"],"actor.string_table");
		getHiragana2Kanji(2,dataArray["curios.string_table"],"curios.string_table");
		getHiragana2Kanji(2,dataArray["actor.string_table"],"actor.string_table");
		getHiragana2Kanji(2,dataArray["activity_log.string_table"],"activity_log.string_table");
		getHiragana2Kanji(2,dataArray["dialogue.string_table"],"dialogue.string_table");
		// getHiragana2Kanji(2,dataArray["help.string_table"],"help.string_table");
		getHiragana2Kanji(2,dataArray["quirks.string_table"],"quirks.string_table");
		getHiragana2Kanji(2,dataArray["heroes.string_table"],"heroes.string_table");
		getHiragana2Kanji(2,dataArray["menu.string_table"],"menu.string_table");
		getHiragana2Kanji(2,dataArray["miscellaneous.string_table"],"miscellaneous.string_table");

	}

	function createCostMap(){
		var tmpMapKanji = {};
		for(var sheet in mapKanji){
			for(var c in mapKanji[sheet]){
				// console.log(c);
				if(tmpMapKanji[c] == null){
					tmpMapKanji[c] = mapKanji[sheet][c];
				}else{
					tmpMapKanji[c] += mapKanji[sheet][c];
				}
			}
		}
		costMapSort(tmpMapKanji);
		return tmpMapKanji;
	}

	function costMapSort(map){

		var tmpMapKanjiSort = [];
		for(var charK in map){
			tmpMapKanjiSort.push({char : charK, cost : map[charK]});
		}
		tmpMapKanjiSort.sort(function(a,b){
			var aCost = a["cost"];
			var bCost = b["cost"];
			if(aCost > bCost)return -1;
			if(aCost < bCost)return 1;
			return 0;

		});
		mapData = tmpMapKanjiSort;
		console.log(tmpMapKanjiSort);
	}

	function isKanji(c){
		var unicode = c.charCodeAt(0);

		if ((unicode>=0x4e00  && unicode<=0x9fcf)||
			(unicode>=0x3400  && unicode<=0x4dbf)||
			(unicode>=0x20000 && unicode<=0x2a6df)||
			(unicode>=0xf900  && unicode<=0xfadf)||
			(unicode>=0x2f800 && unicode<=0x2fa1f))
			return true;
		return false;
	}
