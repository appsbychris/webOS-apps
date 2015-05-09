enyo.kind({
	name: "MemoryArray",
	kind: "Control",
	published: {
		choreList: []
	},
	showing:false,
	components: [
	    {kind:"fDates", name:"fd"}         
    ],
	choreObject: function (sName, sDone, sLast, sPic, sNotes,sFlags, sTags) {
		this.sName = sName;
		this.sDone = sDone;
		this.sLast = sLast;
		this.sPic = sPic;
		this.sNotes = sNotes;
		this.sFlags = sFlags;
		this.sTags = sTags;
		
	},
	feedItem: function(sName,sDone,sLast,sPic, sNotes,sFlags, sTags) {
		this.choreList[this.choreList.length] = new this.choreObject(sName, sDone, sLast, sPic, sNotes,sFlags, sTags);
	},
	getItemInfo: function(i,s){
		try {
			switch (s){
				case "name": {
					return this.choreList[i].sName;
					break;
				};
				case "done": {
					return this.choreList[i].sDone;
					break;
				};
				case "last": {
					return this.choreList[i].sLast;
					break;
				};
				case "pic": {
					return this.choreList[i].sPic;
					break;
				};
				case "notes" : {
					return this.choreList[i].sNotes;
					break;
				};
				case "flags": {
					return this.choreList[i].sFlags;
					break;
				};
				case "tags": {
					return this.choreList[i].sTags;
					break;
				};
				default: {
					try {
						var Arr = this.choreList[i].sFlags.split("@")
						for (var j = 0;j < Arr.length;j++) {
							if (Arr[j].substr(0,Arr[j].indexOf(":")) == s) {
								return Arr[j].substr(Arr[j].indexOf(":") + 1);
								break;
							};
						};
					}
					catch (e) {};
					break;
				};
			};
		}
		catch (e) {
			return 0;
		};
		return 0;
	},
	getHighestIndex: function() {
		var i = 0;
		for (var j = 0; j < this.choreList.length; j++) {
			var x = this.getItemInfo(j,"index");
			if (x > i) {
				i = x;
			};
		};
		return i;
	},
	setItemInfo: function(i,s,v,byName){
		if (byName) {
			for (var j = this.choreList.length - 1; j >= 0; j--) {
				if (this.choreList[j].sName.toLowerCase() == i.toLowerCase()) {
					i = j
					break;
				};
			};
		}
		switch (s){
			case "name": {
				this.choreList[i].sName = v;
				break;
			};
			case "done": {
				this.choreList[i].sDone = v;
				break;
			};
			case "last": {
				this.choreList[i].sLast = v;
				break;
			};
			case "pic": {
				this.choreList[i].sPic = v;
				break;
			};
			case "notes" : {
				this.choreList[i].sNotes = v;
				break;
			};
			case "tags" : {
				this.choreList[i].sTags = v;
				break;
			};
			default: {
				var b = false;
				var Arr = this.choreList[i].sFlags.split("@");
				for (var j = 0;j < Arr.length;j++) {
					if (Arr[j].substr(0,Arr[j].indexOf(":")) == s) {
						Arr[j] = s + ":" + v;
						b = true;
						break;
					};
				};
				if (b == false) {
					Arr[Arr.length] = s + ":" + v;
				};
				this.choreList[i].sFlags = Arr.join("@");
				break;
			};			
		};
	},
	getItemCount: function() {
		return this.choreList.length;
	},
	doesNameExist: function(s) {
		for (var i = 0; i < this.choreList.length;i++) {
			if (this.choreList[i].sName.toLowerCase() == s.toLowerCase()){
				return true;
				break;
			}
		}
		return false;
	},
	getIndexByName: function(s) {
		for (var i = 0; i < this.choreList.length;i++) {
			if (this.choreList[i].sName.toLowerCase() == s.toLowerCase()){
				return i;
				break;
			}
		}
		return false;
	},
	clearItems: function() {
		this.choreList = [];
	},
	deleteItem: function(i) {
		this.log(this.choreList.length);
		this.choreList.splice(i,1);
		this.log(this.choreList.length + "," + i);
	},
	sortBy: function(by) {
		switch (by) {
			case "index": {
				this.choreList.sort(this.compareByIndex);
				break;
			};
			case "danger": {
				this.choreList.sort(enyo.bind(this,this.compareByDanger));
				break;
			};
			case "abc": {
				this.choreList.sort(this.compareByName);
				break;
			};
			case "recent": {
				this.choreList.sort(enyo.bind(this,this.compareByRecent));
				break;
			};
			case "often": {
				this.choreList.sort(this.compareByOften);
				break;
			};
			case "today" : {
				this.choreList.sort(enyo.bind(this,this.compareByDueToday));
				break;
			};
		};
	},
	compareByIndex: function (a,b) {
		var Arr = a.sFlags.split("@");
		var x  = 0;
		var y = 0;
		for (var j = 0;j < Arr.length;j++) {
			if (Arr[j].substr(0,Arr[j].indexOf(":")) == "index") {
				x = Number(Arr[j].substr(Arr[j].indexOf(":") + 1));
				break;
			};
		};
		Arr = b.sFlags.split("@");
		for (var j = 0;j < Arr.length;j++) {
			if (Arr[j].substr(0,Arr[j].indexOf(":")) == "index") {
				y = Number(Arr[j].substr(Arr[j].indexOf(":") + 1));
				break;
			};
		};
  	    if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
	compareByDanger: function (a,b) {
		var x  = 0;
		var y = 0;
		x = this.$.fd.getPercent(a.sLast, a.sDone, 3);
		y = this.$.fd.getPercent(b.sLast, b.sDone, 3);
		if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
	compareByDueToday: function (a,b) {
		var Arr = a.sDone.split(",");
		var x = this.$.fd.dateAdd(this.$.fd.getPercent(a.sLast,0,1),Arr[1],Number(Arr[0]));
		Arr = b.sDone.split(",");
		var y = this.$.fd.dateAdd(this.$.fd.getPercent(b.sLast,0,1),Arr[1],Number(Arr[0]));
		
		if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
	compareByRecent: function (a,b) {
		
		var x = this.$.fd.getPercent(a.sLast,0, 1);
		var y = this.$.fd.getPercent(b.sLast, 0, 1);
		if (x > y) {
	       return -1;
	    };
	    if (x < y) {
	       return 1;
	    };
	    return 0;
	},
	compareByName: function (a,b) {
		
		var x = a.sName.toLowerCase();
		var y = b.sName.toLowerCase();
		if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
	compareByOften: function (a,b) {
		
		var x = 0;
		var Arr = a.sDone.split(",");
		switch (Arr[1]) {
			case "hours": {
				//this.$.durVal.setMax(24)
				x = Number(Arr[0]);
				break;
			};
			case "days": {
				x = Number(Arr[0]) * 24;
				break;
			};
			case "weeks": {
				x = Number(Arr[0]) * 168;
				break;
			};
			case "months": {
				x = Number(Arr[0]) * 720;
				break;
			};
			case "years": {
				x = Number(Arr[0]) * 8760;
				break;
			};
		};
		var y = 0;
		Arr = b.sDone.split(",");
		switch (Arr[1]) {
			case "hours": {
				//this.$.durVal.setMax(24)
				y = Number(Arr[0]);
				break;
			};
			case "days": {
				y = Number(Arr[0]) * 24;
				break;
			};
			case "weeks": {
				y = Number(Arr[0]) * 168;
				break;
			};
			case "months": {
				y = Number(Arr[0]) * 720;
				break;
			};
			case "years": {
				y = Number(Arr[0]) * 8760;
				break;
			};
		};
		if (x < y) {
	       return -1;
	    };
	    if (x > y) {
	       return 1;
	    };
	    return 0;
	},
});