enyo.kind({
	name: "audiocontrol",
	kind: "Component",
	published: {
	      src: "",
	    isplaying: false,
	    ispaused: false
	  },
	events: {
		
		onPlayEnded: ""
		
	},
     create: function() {
         this.inherited(arguments);
         this.createSound();
     },
	setError: function() {
		this.isplaying = false;
		this.ispaused = false;
	},
	createSound: function() {
		if (this.mySound === undefined) {
			this.mySound = new Audio();
			this.mySound.setAttribute("x-palm-media-audio-class", "media");
			this.mySound.addEventListener('ended', enyo.bind(this,this.soundEnded), false);
			this.mySound.addEventListener('onerror', enyo.bind(this,this.setError), false);
			//onerror
		}
	},
	srcChanged: function() {
		this.mySound.src = this.src;

		this.mySound.load();
	},
	playSound: function() {
		//this.log(this.src)
		if (this.mySound.src != this.src) {
			this.mySound.src = this.src;
		}
		//this.log(this.mySound.src)
		this.mySound.load();
		this.mySound.play();
		this.isplaying = true;
		this.ispaused = false;
	},
	stop: function() {
		if (this.isplaying == true) {
			this.mySound.pause();
			this.mySound.src = null
			this.mySound.currentTime = 0;
			this.isplaying = false
			this.ispaused = false
		}
	},
	showCurrentPosition: function() {
		if (this.isplaying == true) {
			var t = this.mySound.duration;
			if (isNaN(t) == false && t != "Infinity") {
				var s = this.mySound.currentTime;
				
				return (this.secondsToTime(s) + "/" + this.secondsToTime(t) );
			}
			else {return ""};
			
			
		}
	},
	setCurrentSeconds: function(val) {
		if (this.isplaying == true) {
			try {
				var t = this.mySound.duration
				if (isNaN(t) == false && t != "Infinity") {
					this.mySound.currentTime = val;
					
				}
			}
			catch (e) {
				enyo.log("error setting seconds")
			}
			
		}
	},
	getCurrentSeconds: function() {
		if (this.isplaying == true) {
			var t = this.mySound.duration
			if (isNaN(t) == false && t != "Infinity") {
				var s = this.mySound.currentTime
				
				return s
			}
			else {return "0"};
			
			
		}
	},
	getMaxSeconds: function() {
		if (this.isplaying == true) {
			var t = this.mySound.duration
			if (isNaN(t) == false && t != "Infinity") {
				return t
			}
			else {return "100"};
			
			
		}
	},
	secondsToTime: function (secs) {
	    var hours = Math.floor(secs / (60 * 60));
	   
	    var divisor_for_minutes = secs % (60 * 60);
	    var minutes = Math.floor(divisor_for_minutes / 60);
	 
	    var divisor_for_seconds = divisor_for_minutes % 60;
	    var seconds = Math.ceil(divisor_for_seconds);
	    if (seconds >= 60) {
	    	seconds = 0
	    	minutes++
	    };
	    if (minutes >= 60) {
	    	minutes = 0
	    	hours++
	    };
	    if (hours > 0) {
	    	return this.zeroPadder(hours) + ":" + this.zeroPadder(minutes) + ":" + this.zeroPadder(seconds)
	    }
	    else {
	    	return this.zeroPadder(minutes) + ":" + this.zeroPadder(seconds)
	    };
	},
	zeroPadder: function(inValue) {
		var s = inValue.toString();
		if (s.length < 2) {
			s = "0" + s;
		};
		return s;
	},
	soundEnded: function(event) {
		this.isplaying = false;
		this.ispaused = false;
		this.doPlayEnded();
	},
	pauseSound: function() {
		if (this.isplaying == true) {
			if (this.ispaused == true) {
				this.mySound.play();
				this.ispaused = false;
			}
			else {
				this.mySound.pause();
				this.ispaused = true;
			};
		};
	}
	
});

