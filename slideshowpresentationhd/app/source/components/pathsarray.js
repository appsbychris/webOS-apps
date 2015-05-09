enyo.kind({
	name: "PathsArray",
	kind: "Component",
	published: {
		picList: [],
		audList: [],
		setList: []
	},
	pictureObject: function (sPath, sIndex, sCaption, sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, pKey) {
		
		this.sPath = sPath || "";
		this.sIndex = sIndex || "";
		this.sCaption = sCaption || "";
		this.sCaptionLocation = sCaptionLocation || "";
		this.sFileName = sFileName || "";
		this.sTransition = sTransition || "";
		this.sCaptionColor = sCaptionColor || "";
		this.sCaptionStyle = sCaptionStyle;
		this.sStretch = sStretch || "";
		this.sDelay = sDelay || "";
		//pan: pan and zoom index
		//dir: pan direction
		//siz: font size
		this.sPan = -1
		this.sDir = 0
		this.sSiz = 32
		this.sRotate = 0
		this.sTSpeed = 0
		this.pKey = pKey 
		if (sCaptionStyle != undefined) {
			if (sCaptionStyle.length > 3) {
				var Arr = sCaptionStyle.split("{")
				var s = 0
				for (var i = 0; i < Arr.length; i++) {
					switch (Arr[i].substr(0,3)) {
						case "pan": {
							s = Number(Arr[i].substr(Arr[i].indexOf(":") + 1))
							this.sPan = s
							break;
						}
						case "dir": {
							s = Number(Arr[i].substr(Arr[i].indexOf(":") + 1))
							this.sDir = s
							break;
						}
						case "siz": {
							s = Number(Arr[i].substr(Arr[i].indexOf(":") + 1))
							this.sSiz = s
							break;
						}
						case "rot": {
							s = Number(Arr[i].substr(Arr[i].indexOf(":") + 1))
							this.sRotate = s
							break;
						}
						case "tsp": {
							s = Number(Arr[i].substr(Arr[i].indexOf(":") + 1))
							this.sTSpeed = s
							break;
						}
					}
				}
			}
		}
	},
	audioObject: function (sPath, sIndex, sFileName, pKey) {
		this.sPath = sPath;
		this.sIndex = sIndex;
		this.sFileName = sFileName;
		this.pKey = pKey || 0
	},
	settingsObject: function (sFileName, allSettings, exifinfo) {//sMainSettings, sGlobalSettings, sAddSettings, sProjectSettings, sExhibition, sExtra1, sExtra2, sExtra3) {
		this.sFileName = sFileName
		this.sAllSettings = allSettings
		this.sExifInfo = exifinfo
		this.projectpreviewcheck = false
		this.projectpreview = {}
			//"audpick", "picpick", "dateshow", "songshow", "fullscreen", "change", "duration", "scale", 
			//"textcolor"//"usetransoverride", "stretchall""usesizeoverride", "cinematic"
		// "transsetting", "transoverride", "overridecolor", 
		//,"addpicturecolor","pictrans", "pictranssetting",
		//"captionlocation","fontsize",, "picpansetting", 
		//"panmode", "pandir","fontmin", "fontmax","addfontsize", "addfontsetting"
		
			
		
		//"filename, mainsettings, globalsettings, addsettings, projectsettings, exhibition, extra1, extra2, extra3"
	},
	clearSettings: function () {
		this.setList = []
	},
	feedSetting: function(sFileName, sAllSettings, exifinfo) {
		this.setList[this.setList.length] = new this.settingsObject(sFileName, sAllSettings,exifinfo);
	},
	setSetting: function(curFile, theSetting, val) {
		var b = false
		for (var j = 0; j < this.setList.length; j++){
			if (this.setList[j].sFileName == curFile) {
				if (theSetting == "projectpreviewcheck") {
					this.setList[j].projectpreviewcheck = val
				}
				else if (theSetting == "projectpreview") {
					this.setList[j].projectpreview = val
				}
				else {
					var Arr = this.setList[j].sAllSettings.split("{")
					//var s = ""
					for (var i = 0; i < Arr.length; i++) {
						//s = Arr[i].substr(Arr[i].indexOf(":") + 1)
						if (theSetting == Arr[i].substr(0,Arr[i].indexOf(":"))) {
							Arr[i] = theSetting + ":" + val ;
							this.setList[j].sAllSettings = Arr.join("{");
							b = true;
							break;
						}
					}
				}
			}
		}
		return b;
	},
	getSettingSet: function(curFile, i) {
		for (var j = 0; j < this.setList.length; j++){
			if (this.setList[j].sFileName == curFile) {
				var Arr = this.setList[j].sAllSettings.split("|+|{");
				return Arr[i];
				break;
			}
		}
		
	},
	getSettingExif: function(curFile) {
		for (var j = 0; j < this.setList.length; j++){
			if (this.setList[j].sFileName == curFile) {
				return this.setList[j].sExifInfo;
				break;
			}
		}
	},
	insertSettingInSet: function(curFile, theSetting, i) {
		for (var j = 0; j < this.setList.length; j++){
			if (this.setList[j].sFileName == curFile) {
				var Arr = this.setList[j].sAllSettings.split("|+|{");
				if (Arr[i] == "0") {Arr[i] = ""}
				 Arr[i] = Arr[i] + theSetting
				// var s = Arr[i]
				 this.setList[j].sAllSettings = Arr.join("|+|{")
				 //return s
				break;
			}
		}
	},
	getListOfProjects: function() {
		var tmp = [];
		var b = false;
		for (var i = 0; i < this.setList.length; i++) {
			b = false;
			for (var j = tmp.length - 1; j >= 0; j--) {
				if (tmp[j] == this.setList[i].sFileName) {
					b = true;
					break;
				}
			};
			if (b == false) {
				tmp.push(this.setList[i].sFileName);
			};
		};
		return tmp;
	},
	getSetting: function(curFile, theSetting) {
		
		var b = false
		for (var j = 0; j < this.setList.length; j++){
			if (this.setList[j].sFileName == curFile) {
				if (theSetting == "projectpreviewcheck") {
					return this.setList[j].projectpreviewcheck
				}
				else if (theSetting == "projectpreview") {
					return this.setList[j].projectpreview
				}
				else {
					var xx = this.setList[j].sAllSettings
					var Arr = xx.split("{")
					var s = 0
					for (var i = 0; i < Arr.length; i++) {
						s = Arr[i].substr(Arr[i].indexOf(":") + 1)
						//this.log(Arr[i].substr(0,Arr[i].indexOf(":")))
						if (theSetting == Arr[i].substr(0,Arr[i].indexOf(":"))) {
							b = true
							if (s == "true") {
								s = true
							}
							else if (s == "false") {
								s = false
							}
							return s;
							break;
						}
					}
				}
				break;
			}
		}
		if (b == false) {return this.getDefaultSetting(theSetting);}		
	},
	getDefaultSetting: function(key) {
		enyo.warn("Key = " + key + " not found, sending default setting")
		switch (key) {
			case "audpick": {
				return "Audio Random";
				break;
			};
			case "picpick": {
				return "Picture Random";
				break;
			};
			case "showexif": {
				return false;
				break;
			};
			case "showfileinfo": {
				return false;
				break;
			};
			case "showfileinfopicker": {
				return "File Name";
				break;
			};
			case "dateshow": {
				return false;
				break;
			};
			case "songshow": {
				return false;
				break;
			};
			case "fullscreen": {
				return false;
				break;
			};
			case "change": {
				return "Duration:";
				break;
			};
			case "duration": {
				return 15;
				break;
			};
			case "scale": {
				return "seconds";
				break;
			};
			case "stretchall": {
				return false;
				break;
			};
			case "usesizeoverride": {
				return false;
				break;
			};
			case "usetransoverride": {
				return false;
				break;
			};
			case "cinematic": {
				return false;
				break;
			};
			case "textcolor": {
				return false;
				break;
			};
			case "repeat": {
				return "Repeat";
				break;
			};
			case "overridecolor": {
				return "#ffffff";
				break;
			};
			case "transsetting": {
				return "Random";
				break;
			};
			case "transoverride": {
				return "fadeOut";
				break;
			};
			case "globaltransspeed": {
				return "0";
				break;
			};
			case "fontsize": {
				return 32;
				break;
			};
			case "globalcaption": {
				return "";
				break;
			};
			case "useglobalcaption": {
				return false;
				break;
			};
			case "globaltransspeed": {
				return "0";
				break;
			};
			case "addpicturecolor": {
				return "#ffffff";
				break;
			};
			case "captionlocation": {
				return "Bottom";
				break;
			};
			case "pictranssetting": {
				return "Random";
				break;
			};
			case "pictrans": {
				return "fadeOut";
				break;
			};
			case "picpansetting": {
				return "Use just one:";
				break;
			};
			case "panmode": {
				return -1;
				break;
			};
			case "pandir": {
				return -1;
				break;
			};
			case "addtransspeed": {
				return 0;
				break;
			};
			case "addfontsetting:": {
				return "Random";
				break;
			};
			case "addfontsize": {
				return 32;
				break;
			};
			case "fontmin": {
				return 20;
				break;
			};
			case "fontmax": {
				return 40;
				break;
			};
			case "shownav": {
				return false;
				break;
			};
			case "autohideaudio": {
				return false;
				break;
			};
			case "useswipe": {
				return true;
				break;
			};
			case "autostart": {
				return false;
				break;
			};
			case "lastpospic": {
				return 0;
				break;
			};
			case "lastposaud": {
				return 0;
				break;
			};
			case "hidemenubutton": {
				return false;
				break;
			};
			case "picturedrawer": {
				return false;
				break;
			};
			case "audiodrawer": {
				return false;
				break;
			};
			case "changedrawer": {
				return false;
				break;
			};
			case "repeatdrawer": {
				return false;
				break;
			};
			case "miscdrawer": {
				return false;
				break;
			};
			case "captiondrawer": {
				return false;
				break;
			};
			case "overridedrawer": {
				return false;
				break;
			};
			case "showhidden": {
				return false;
				break;
			};
			case "addsubfolder": {
				return false;
				break;
			};
			case "bulksortpicker": {
				return "Picture Ordered By Filename";
				break;
			};
			case "bulkradio": {
				return "pic";
				break;
			};
			default: {
				return "NO_SETTINGS";
			};
		};
	},
	feedAudioItem: function(sPath, sIndex, pKey) {
		this.audList[this.audList.length] = new this.audioObject(sPath, sIndex, pKey);
	},
	getAudioInfo: function(iIndex, wWhich) {
		switch (wWhich) {
			case "pkey": {
				return this.audList[iIndex].pKey;
				break;
			};
			case "path": {
				return this.audList[iIndex].sPath;
				break;
			}
			case "index": {
				return this.audList[iIndex].sIndex;
				break;
			}
			case "filename": {
				return this.audList[iIndex].sFileName;
				break;
			}
		};
	},
	setAudioInfo: function(iIndex, wWhich, sVal) {
		switch (wWhich) {
			case "path": {
				this.audList[iIndex].sPath = sVal;
				break;
			}
			case "index": {
				this.audList[iIndex].sIndex = sVal;
				break;
			}
			case "filename": {
				this.audList[iIndex].sFileName = sVal;
				break;
			}
		};
	},
	feedPictureItem: function(sPath, sIndex, sCaption, sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, pKey) {
		/*if (pKey === undefined) {
			pKey = "picpath = \"" + sPath + "\" AND filename = \"" + sFileName + "\""
		}*/
		this.picList[this.picList.length] = new this.pictureObject(sPath, sIndex, sCaption, sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, pKey);
	},
	replacePictureItem: function(sPath, sIndex, sCaption, sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, pKey) {
		for (var i = 0; i < this.picList.length; i++) {
			if (this.picList[i].sPath == sPath) {
				this.picList[i] = new this.pictureObject(sPath, sIndex, sCaption, sCaptionLocation, sFileName, sTransition, sCaptionColor, sCaptionStyle, sStretch, sDelay, pKey);		
				break;
			}
		};		
		
	},
	getPictureInfo: function(iIndex, wWhich) {
		//"picpath, piccaption, piccaploc, picorder, filename, transition, captioncolor, captionstyle, stretch"
		if (iIndex >= this.picList.length) {
			return "";
		};
		switch (wWhich) {
			case "pkey": {
				return this.picList[iIndex].pKey;
				break;
			}
			case "path": {
				return this.picList[iIndex].sPath;
				break;
			}
			case "index": {
				return this.picList[iIndex].sIndex;
				break;
			}
			case "caption": {
				return this.picList[iIndex].sCaption;
				break;
			}
			case "captionlocation" : {
				return this.picList[iIndex].sCaptionLocation;
				break;
			}
			case "filename" : {
				return this.picList[iIndex].sFileName;
				break;
			}
			case "transition" : {
				return this.picList[iIndex].sTransition;
				break;
			}
			case "captioncolor" : {
				return this.picList[iIndex].sCaptionColor;
				break;
			}
			case "captionstyle" : {
				return this.picList[iIndex].sCaptionStyle;
				break;
			}
			case "stretch" : {
				return this.picList[iIndex].sStretch;
				break;
			}
			case "delay" : {
				return this.picList[iIndex].sDelay;
				break;
			}
			case "pan" : {
				return this.picList[iIndex].sPan;
				break;
			}
			case "pandirection" : {
				return this.picList[iIndex].sDir;
				break;
			}
			case "fontsize" : {
				return this.picList[iIndex].sSiz;
				break;
			}
			case "rotate" : {
				return this.picList[iIndex].sRotate;
				break;
			}
			case "tspeed" : {
				return this.picList[iIndex].sTSpeed;
				break;
			}
			case "flags": {
				var s = "pan:" + this.picList[iIndex].sPan + "{";
				s = s + "dir:" + this.picList[iIndex].sDir + "{";
				s = s + "siz:" + this.picList[iIndex].sSiz + "{";
				s = s + "rot:" + this.picList[iIndex].sRotate + "{";
				s = s + "tsp:" + this.picList[iIndex].sTSpeed + "{";
				return s;
				break;
			}
		};
	},
	setPictureInfo: function(iIndex, wWhich, sVal) {
		switch (wWhich) {
			case "path": {
				this.picList[iIndex].sPath = sVal;
				break;
			}
			case "index": {
				this.picList[iIndex].sIndex = sVal;
				break;
			}
			case "caption": {
				this.picList[iIndex].sCaption = sVal;
				break;
			}
			case "captionlocation" : {
				this.picList[iIndex].sCaptionLocation = sVal;
				break;
			}
			case "filename" : {
				this.picList[iIndex].sFileName = sVal;
				break;
			}
			case "transition" : {
				this.picList[iIndex].sTransition = sVal;
				break;
			}
			case "captioncolor" : {
				this.picList[iIndex].sCaptionColor = sVal;
				break;
			}
			case "captionstyle" : {
				this.picList[iIndex].sCaptionStyle = sVal;
				break;
			}
			case "stretch" : {
				this.picList[iIndex].sStretch = sVal;
				break;
			}
			case "delay" : {
				this.picList[iIndex].sDelay = sVal;
				break;
			}
			case "pan" : {
				this.picList[iIndex].sPan = sVal;
				break;
			}
			case "pandirection" : {
				this.picList[iIndex].sDir = sVal;
				break;
			}
			case "fontsize" : {
				this.picList[iIndex].sSiz = sVal;
				break;
			}
			case "rotate" : {
				this.picList[iIndex].sRotate = sVal
				break;
			}
			case "tspeed" : {
				this.picList[iIndex].sTSpeed = sVal
				break;
			}
		};
	},
	doesPictureExist: function(sPath) {
		var b = false
		for (var i = 0; i < this.picList.length; i++) {
			if (sPath == this.picList[i].sPath) {
				b= true;
				break;
			}
		}
		return b;
		
	},
	doesAudioExist: function(sPath) {
		var b = false
		for (var i = 0; i < this.audList.length; i++) {
			if (sPath == this.audList[i].sPath) {
				b= true;
				break;
			}
		}
		return b;
		
	},
	clearPictures: function () {
		this.picList = [];
	},
	clearAudio: function () {
		this.audList = [];
	},
	getPictureCount: function () {
		return this.picList.length;
	},
	getAudioCount: function () {
		return this.audList.length;
	},
	deletePictureItem: function (iIndex) {
		if (iIndex < 0) {return;}
		this.picList.splice(iIndex,1);
	},
	deleteAudioItem: function (iIndex) {
		if (iIndex < 0) {return;}
		this.audList.splice(iIndex,1);
	},
	deleteSettingItem: function (iIndex) {
		if (iIndex < 0) {return;}
		this.setList.splice(iIndex,1);
	},
	getSettingIndexByName: function(inName) {
		for (var i = 0; i < this.setList.length; i++) {
			if (this.setList[i].sFileName == inName) {
				return i;
				break;
			}
		};
		return -1;
	},
	getZeroIndex: function() {
		var b = false;
		var x = 0;
		for (var i = 0; i < this.picList.length; i++) {
			if (Number(this.picList[i].sIndex) == 0) {
				b = true;
				x = i;
				break;
			}
		}
		if (b == true) {
			return x;
		}
		else {
			return 0;
		}
	},
	compare: function (a,b) {
	  if (Number(a.sIndex) < Number(b.sIndex)) {
	     return -1;
	  }
	  if (Number(a.sIndex) > Number(b.sIndex)) {
	     return 1;
	  }
	  return 0;
	},
	compareFileName: function (a,b) {
	  var s = a.sPath
	  var x = s.lastIndexOf("/");
	  s =  s.substr(x+1)
	  s = s.toLowerCase()
	  var s1 = b.sPath
	  x = s1.lastIndexOf("/");
	  s1 =  s1.substr(x+1)
	  s1 = s1.toLowerCase()
	  if (s < s1) {
	     return -1;
	  }
	  if (s > s1) {
	     return 1;
	  }
	  return 0;
	},
	comparePaths: function (a,b) {
		  var s = a.sPath
		  var x = s.lastIndexOf("/");
		  s =  s.substr(0,x)
		  s = s.toLowerCase()
		  var s1 = b.sPath
		  x = s1.lastIndexOf("/");
		  s1 =  s1.substr(0,x)
		  s1 = s1.toLowerCase()
		  if (s < s1) {
		     return -1;
		  }
		  if (s > s1) {
		     return 1;
		  }
		  return 0;
	},
	compareFileNameAndPath: function (a,b) {
		  var s = a.sPath
		  
		  s = s.toLowerCase()
		  var s1 = b.sPath
		 
		  s1 = s1.toLowerCase()
		  if (s < s1) {
		     return -1;
		  }
		  if (s > s1) {
		     return 1;
		  }
		  return 0;
	},
	orderArrayABC: function(wWhich, mode) {
		if (wWhich == "pictures") {
			switch (mode) {
				case 0: {

					this.picList.sort(this.compareFileName)
					break;
				}
				case 1: {

					this.picList.sort(this.comparePaths)
					break;
				}
				case 2: {
					this.picList.sort(this.compareFileNameAndPath)
					break;
				}
			}
		}
		else {
			this.audList.sort(this.compare)
		}
	},
	orderArray: function(wWhich) {
		//var b = false;
		if (wWhich == "pictures") {
			this.picList.sort(this.compare)
			/*var s = new this.pictureObject;
			do {
				b = false;
				for (var i=this.picList.length - 1;i > 0 ; i--){
					if (Number(this.picList[i].sIndex) < Number(this.picList[i-1].sIndex)) {
						s = this.picList[i];
						this.picList[i] = this.picList[i-1];
						this.picList[i-1] = s;
						b = true;
					};
				}
			}
			while (b == true);*/
		}
		else {
			this.audList.sort(this.compare)
			/*var s = new this.audioObject;
			do {
				b = false;
				for (var i=this.audList.length - 1;i > 0 ; i--){
					if (Number(this.audList[i].sIndex) < Number(this.audList[i-1].sIndex)) {
						s = this.audList[i];
						this.audList[i] = this.audList[i-1];
						this.audList[i-1] = s;
						b = true;
					};
				}
			}
			while (b == true);*/
		}
	},
	shuffle: function(wWhich){ 
		if (wWhich == "pictures") {
			var a = [].concat(this.picList);
			var l = this.picList.length;
		    var al = n = 0;
		    for(var i=0; i<l; i++) {
		        al = a.length;
		        n = Math.floor((Math.random() * al));
		        this.picList[i] = a[n];
		        if (n == al - 1) {
		          a.pop();
		        }
		        else {
		          a[n] = a[al - 1];
		          a.pop();
		        };
		      };
			}
		 else {
			var a = [].concat(this.audList);
			var l = this.audList.length;
			var al = n = 0;
			for(var i=0; i<l; i++) {
			    al = a.length;
			    n = Math.floor((Math.random() * al));
			    this.audList[i] = a[n];
			    if (n == al - 1) {
			        a.pop();
			    }
			    else {
			        a[n] = a[al - 1];
			        a.pop();
			    };
			};
		};
	},
})