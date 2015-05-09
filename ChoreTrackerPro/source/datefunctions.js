enyo.kind({
	name: "fDates",
	kind: "Component",
	getPercent: function(t,d,r) {
		//console.log(t,d)
		try {
			var Arr = t.split("T");
			
			var dAr = Arr[0].split("-");
			var tAr = Arr[1].split(":");
			if (tAr[2] == "pm") {
				if (Number(tAr[0] < 12)) {tAr[0] = Number(tAr[0]) + 12;};
			};
			if (tAr[2] == "am" && tAr[0] ==  12) {
				tAr[0] = 0;
			};
			//this.log("!!!!!!!!!!!" + dAr + tAr)
			var lastDate = new Date(Number(dAr[0]),Number(dAr[1])-1,Number(dAr[2]),Number(tAr[0]),Number(tAr[1]),0,0);
			if (r == 1) {
				return lastDate;
			};
			//this.log(lastDate)
			
			var durAr = d.split(",");
			if (r != 1) {
				var nowDate = new Date();
				var x = this.timeSpan(lastDate,nowDate,durAr[1]);
				this.log("****************" + lastDate + "," + nowDate)
				switch (durAr[1]) {
					case "hours": {
						y = x.hours;
						break;
					};
					case "days": {
						y = x.days;
						break;
					};
					case "weeks": {
						y = x.weeks;
						break;
					};
					case "months": {
						y = x.months;
						break;
					};
					case "years": {
						y = x.years;
						break;
					};
				};
				
				//this.log(y)
				var p =y/ Number(durAr[0]) ;
				//this.log(p)
				if (p >= 1 || x.negative == 1) {
					p = 0;
					//this.log(true)
				}
				else {
					p = Math.floor(100 - (p * 100));
					//this.log(false)
				};
				if (r != 3) {
					if (p < 98 && p > 95) {
						p = 97;
					}
					else {
						p = this.round5(Number(p));
				    };
				};
				//console.log(p)
				return p;
			}
		}
		catch (e) {
			return 0;
		};
	},
	round5: function(x)	{
	    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
	},
	timeSpan: function(fromDate, toDate, format){
		//enyo.log(toDate.getTime()-fromDate.getTime())
		try {
			if (format == null) {format="milliseconds";};	
			var formatsMS = {
				milliseconds:1,
				seconds:1000,
				minutes:1000*60,
				hours:1000*60*60,
				days:1000*60*60*24,
				weeks:1000*60*60*24*7,
				months:function(m){
					var ms = this.days,
					daysPer = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
					return ms*daysPer[m];
				},
				years:function(y){
					var ms = 1000*60*60*24*365;
					//add a day for leap years
					if( (y % 4 == 0 && y % 100 == 0) || y % 400 == 0 )
						ms += this.days;
					return ms;
				}
			}
			
			//get the time difference in milliseconds
			if (toDate.getTime()-fromDate.getTime() >= 0)  {
				ms = toDate.getTime()-fromDate.getTime(),
				reqFormats = format.split(","),
				isYearReq = (format.indexOf("years")>-1),
				isMonthReq = (format.indexOf("months")>-1),
				result = {minutes: 0,
					      hours: 0,
					      days: 0,
					      months: 0,
					      weeks: 0,
					      years: 0};
				result["negative"] = 0;
			}
			else {
				ms =fromDate.getTime()-toDate.getTime(),
				reqFormats = format.split(","),
				isYearReq = (format.indexOf("years")>-1),
				isMonthReq = (format.indexOf("months")>-1),
				result = {};
				result["negative"] = 1;
			}
			if(isYearReq){ 
				result["years"]=0;
				for(var y=fromDate.getFullYear(); y <= toDate.getFullYear(); y++){	
					var yearMS = formatsMS.years(y);
					if(ms >= yearMS){
						ms -= yearMS;
						result["years"]+=1;
					}
				}
				//use "to" year for calculating decimal
				formatsMS.years = formatsMS.years(toDate.getFullYear());
			}
			if(isMonthReq){
				result["months"]=0;
				var month = fromDate.getMonth(),
					year = (result["years"]>0) ? fromDate.getFullYear() + result["years"] : fromDate.getFullYear();					
				for(month; month<=11; month++){
					var monthMS = formatsMS.months(month);
					if(month==toDate.getMonth() && year== toDate.getFullYear()) break;
					else if(ms >= monthMS){
						ms -= monthMS;
						result["months"]+=1;
					}
					if(month==12 && year < toDate.getFullYear()) {
						month=0; 
						year++;
					}
				}
				//use "to" month for decimal
				formatsMS.months = formatsMS.months(toDate.getMonth());
			}
	
			//handle the remaining milliseconds
			for(var f=0; f < reqFormats.length && reqFormats[0]!=""; f++){
				var res=(f<reqFormats.length-1) ? Math.floor(ms/formatsMS[reqFormats[f]]) : ms/formatsMS[reqFormats[f]];
				if(ms>0) result[reqFormats[f]] = (result[reqFormats[f]]>=0) ? result[reqFormats[f]]+=res : res;
				else result[reqFormats[f]]=0;
	
				ms -= res * formatsMS[reqFormats[f]];
			}
			return result;
		}
		catch (e) {
			return 0;
		}
	},
	dateAdd: function (objDate, strInterval, intIncrement) {
        switch(strInterval) {
            case "months": {
	            objDate.setMonth(parseInt(objDate.getMonth()) + parseInt(intIncrement));
	            break;
            };
            case "days": {
	            objDate.setDate(parseInt(objDate.getDate()) + parseInt(intIncrement));
	            break;
            };
            case "weeks" : {
            	
            	objDate.setDate(parseInt(objDate.getDate()) + (parseInt(intIncrement * 7) ));
            	
            	break;
            };
            case "years": {
            	//this.log("HERE" + objDate.getFullYear())
	            objDate.setFullYear(parseInt(objDate.getFullYear()) + parseInt(intIncrement));
            	//this.log("HERE" + objDate)
	            break;
            };
            case "hours": {
	            objDate.setHours(parseInt(objDate.getHours()) + parseInt(intIncrement));
	            break;
            };
            case "minutes": {
	            objDate.setMinutes(parseInt(objDate.getMinutes()) + parseInt(intIncrement));
	            break;
            };
        };
        //this.log(objDate);
        return objDate;
    },
    formatTheDate: function (inDate, inFormat) {
		var gsMonthNames = new Array(
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
				);
		var gsDayNames = new Array(
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
				);
		var s = inFormat;
		var d = inDate;
		
	    s = s.replace("yyyy",  d.getFullYear());
	    s = s.replace("mmmm",  gsMonthNames[d.getMonth()]);
	    s = s.replace("mm",  this.zeroPadder((d.getMonth() + 1)));
	    s = s.replace("dddd",  gsDayNames[d.getDay()]);
	    s = s.replace("dd",  this.zeroPadder(d.getDate()));
	    s = s.replace("hh",  this.zeroPadder((h = d.getHours() % 12) ? h : 12));
	    s = s.replace("nn", this.zeroPadder(d.getMinutes()));
	    s = s.replace("a/p",  d.getHours() < 12 ? "am" : "pm");
	    return s;
	    // "dddd, mmmm dd, yyyy, hh:nn a/p"
	},
	zeroPadder: function(inValue) {
		var s = inValue.toString();
		if (s.length < 2) {
			s = "0" + s;
		};
		return s;
	},
	getDayName: function(i) {
		
		var gsDayNames = new Array(
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
				);
		return gsDayNames[i];
	}
});