enyo.kind({
	name: "audiocontrol",
	kind: "Component",
	published: {
	      src: "",
	    isplaying: false,
	    ispaused: false,
	    sounds: [   "appclose",
					"back_01",
					"browser_01",
					"card_01",
					"card_02",
					"card_03",
					"card_04",
					"card_05",
					"default_425hz",
					"delete_01",
					"discardingapp_01",
					"down2",
					"dtmf_0",
					"dtmf_1",
					"dtmf_2",
					"dtmf_3",
					"dtmf_4",
					"dtmf_5",
					"dtmf_6",
					"dtmf_7",
					"dtmf_8",
					"dtmf_9",
					"dtmf_asterisk",
					"dtmf_pound",
					"error_01",
					"error_02",
					"error_03",
					"focusing",
					"launch_01",
					"launch_02",
					"launch_03",
					"pagebacwards",
					"pageforward_01",
					"shuffle_02",
					"shuffle_03",
					"shuffle_04",
					"shuffle_05",
					"shuffle_06",
					"shuffle_07",
					"shuffle_08",
					"shuffling_01",
					"shutter",
					"switchingapps_01",
					"switchingapps_02",
					"switchingapps_03",
					"tones_3beeps_otasp_done",
					"unassigned",
					"up2"
				],
			sIndex: 0
	  },
	events: {
		
		onPlayEnded: ""
		
	},
	components: [
		{
            name : "sysSound",
            kind : "PalmService",
            service : "palm://com.palm.audio/systemsounds",
            method : "playFeedback"
         },
	],
    create: function() {
         this.inherited(arguments);
         this.createSound();
     },
	playSysSound: function(i) {
		this.$.sysSound.call({"name": this.sounds[i]});	
	},     
	playSwoosh: function() {
		this.$.sysSound.call({"name": this.sounds[37]});		
	},
	playClick: function() {
		this.$.sysSound.call({"name": this.sounds[34]});		
	},
	playJingle: function() {
		this.$.sysSound.call({"name": this.sounds[2]});	
	},
	playClick2: function() {
		this.$.sysSound.call({"name": this.sounds[25]});	
	},                                 
	createSound: function() {
		if (this.mySound === undefined) {
			this.mySound = new Audio();
			this.mySound.setAttribute("x-palm-media-audio-class", "defaultapp");
			this.mySound.addEventListener('ended', enyo.bind(this,this.soundEnded), false);
		}
	},
	loadSound: function () {
		this.mySound.src = this.src;
		this.mySound.load();
	},
	stop: function() {
		if (this.isplaying == true) {
			this.mySound.pause();
			this.mySound.currentTime = 0;
			this.isplaying = false
			this.ispaused = false
		}
	},
	play: function() {
		
		this.mySound.play();
		this.isplaying = true;
		this.ispaused = false;
	},
	showCurrentPosition: function() {
		if (this.isplaying == true) {
			var t = this.mySound.duration
			if (isNaN(t) == false && t != "Infinity") {
				var s = this.mySound.currentTime
				
				return (this.secondsToTime(s) + "/" + this.secondsToTime(t) );
			}
			else {return ""};
			
			
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
	}
	
});

