

enyo.kind({
	kind: "Pane", 
	name:"editAud", 
	className: "editWindowPane", 
	lazy: true, 
	published: {
		selectedRow: -1,
		thePaths: "",
		currentFile: ""
	},
	events: {
		onDataToSave: "",
		onShutDown: "",
		onRequestHelpPop: ""
	},
	components: [
        {name: "sound", kind: "audiocontrol", onPlayEnded: "stopPreview"},
        {kind: "VFlexBox", components:[
			{kind: "HFlexBox", style: "height:80px", className: "editListSubItem", components: [
	            {kind: "MyCustomButton", defaultClassName:"backButton", clickClassName: "backButtonClicked", name:"backAud", onButtonClicked: "shutDown"},                            
	        	{name: "audHeaderContent", content: "Edit Music", flex: 1},
	        	{kind: "HelpButton", helpID: "editmusic", onHelpRequested: "doRequestHelpPop"},
	        ]},
			{kind: "HFlexBox", flex:1, components: [
				{kind: "VFlexBox",flex:1, components: [
				    {kind: "ReorderableVirtualList",height: "100%", width: "100%",name: "audFileList",className: "editList", onSetupRow: "setupRow", reorderable:true, onReorder: "audReorder", components: [
				        {kind: "SwipeableItem",name:"audItem",className: "editListItemList", tapHighlight: true,onclick: "audItemClick", onConfirm: "deleteAudItem", layoutKind: "HFlexLayout", components: [
				            {name: "theAudOrder", content:"0", className: "editListIndexAudio"},     
				            {name: "audFilename", flex: 1},
				        ]}
				    ]}
			    ]},
			    {kind: "VFlexBox",flex:1, components: [
			    	{kind: "Scroller", flex: 1, components: [
			    	    {name: "audselectHeader", content: "Item settings:"},
			    	    {kind: "MyLabeledContainer",className: "editListSubItem", caption: $L("Audio Index"), components: [
			    	        {kind: "IntegerPicker",style:"margin-right: 10px", name: "audItemIndex", label: "", min: 0, max: 10, onChange: "saveAudItemSettings", preference: "order"}
			    	    ]},
			    	    {kind: "MyLabeledContainer",className: "editListSubItem", caption: $L("Preview"), components: [
	                        {kind: "HFlexBox", components: [
	                            {kind: "MyCustomButton", style: "margin: 5px;",defaultClassName:"playButton",buttonEnabled:true, name:"previewButton", buttonType: "dual", clickClassName: "playButtonClicked", disabledClassName: "playButtonDisabled", dualDefault: "pauseButton", dualClick: "pauseButtonClicked", onButtonClicked: "previewSong"},
	                            {kind: "Slider",name: "previewPosition", style: "width: 200px;", onChanging: "previewChanging", onChange: "previewChange"},
	                            {kind: "VFlexBox", components: [
		                            {name: "previewCur", content: "0:00"},
		                            {content: "of"},
		                            {name: "previewMax", content: "0:00", style: "margin-right:10px;"}
		                        ]}    
	                        ]}
			    	    ]}
			    	]}
			    ]}
			]} 
		]}
	
    ],
    startUp: function() {
    	enyo.setAllowedOrientation("landscape");
		this.selectedRow = -1;
		this.thePaths.orderArray("audio");
		this.$.audItemIndex.setMax(this.thePaths.getAudioCount()- 1);
		this.$.audHeaderContent.setContent("Edit Music: " + this.thePaths.getAudioCount() + " tracks")
		enyo.nextTick(this.$.audFileList,this.$.audFileList.punt);
    },
    shutDown: function() {
		this.stopPreviewSound();
		enyo.setAllowedOrientation("free");
		this.beSilent = 1;
		this.saveAudItemSettings();
		this.beSilent = 0;
		this.doShutDown()
	},
	setupRow: function(inSender, inIndex) {
		var x = 0;
		if (inIndex >= 0) {
		    if (inIndex <= this.thePaths.getAudioCount() -1) {
		    	if (this.selectedRow == -1) {
		        	this.selectedRow = 0;
		        	x = this.selectedRow;
				    this.$.audItemIndex.setValue(Number(this.thePaths.getAudioInfo(x, "index")));
				    
		        };
		    	var isRowSelected = (inIndex == this.selectedRow);
		    	var s = this.thePaths.getAudioInfo(inIndex, "path") 
		    	x = s.lastIndexOf("/");
		    	if (isRowSelected) {
		    		this.$.audItem.addClass("editListItemSelected")
		    	}
		    	else {
		    		this.$.audItem.removeClass("editListItemSelected")
		    	}
		        this.$.theAudOrder.setContent(this.thePaths.getAudioInfo(inIndex, "index"));
		        var c = s.substr(x+1)
		        if (c.length > 50) {
		        	c = c.substr(0,50) + "..."
		        }
		        this.$.audFilename.setContent(c);
		        
		        return true;
		    }
		}
	},
	
   
	
	
	audItemClick: function(inSender, inEvent) {
		this.stopPreviewSound();
		this.beSilent = 1;
		this.saveAudItemSettings();
		this.beSilent = 0;
	    this.selectedRow = inEvent.rowIndex;
	    var x = this.selectedRow;
	    this.$.audItemIndex.setValue(Number(this.thePaths.getAudioInfo(x,"index")));
	    this.$.audFileList.refresh();
	},
	
	
	deleteAudItem: function(inSender, inIndex) {
		/*if (this.thePaths.getAudioCount() > 100) {
			this.$.progress.openAtCenter();
			this.$.progress.startAni();
			this.$.progress.setMessage("Saving...");
		}*/
		var sql = []
		sql.push("DELETE FROM audPathsTable WHERE audpath = '" + this.thePaths.getAudioInfo(inIndex,"path") + "' AND filename = '" + this.currentFile + "';");
		var s = "";
		var i = 0;
		if (inIndex != this.thePaths.getAudioCount() - 1 ){
			for (var i = inIndex + 1; i <= this.thePaths.getAudioCount() - 1; i++) {

				sql.push("UPDATE audPathsTable SET audorder = " + (i - 1) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
				this.thePaths.setAudioInfo(i, "index", i - 1);
				
			};
		};
		this.thePaths.deleteAudioItem(inIndex);
		this.$.audItemIndex.setMax(this.thePaths.getPictureCount()-1);
		this.$.audFileList.refresh();
		this.$.audHeaderContent.setContent("Edit Music: " + this.thePaths.getAudioCount() + " tracks");
		this.doDataToSave(sql)
	},
	audReorder:function(inSender,toIndex,fromIndex){
	    if (toIndex != fromIndex && toIndex > -1 && toIndex < this.thePaths.getAudioCount()){
	    	var sql = []
	    	var inDex = toIndex
	        var j = this.thePaths.getAudioInfo(fromIndex, "path")
			var oldDex = fromIndex
			sql.push("UPDATE audPathsTable SET audorder = " + inDex + " WHERE audpath = '" + j + "' AND filename = '" + this.currentFile + "';");
			this.thePaths.setAudioInfo(oldDex, "index", inDex);
			var i = 0
			this.selectedRow = inDex
			if (oldDex < inDex) {
				for (i = inDex; i >= 1; i--) {
					if (i == oldDex -1) {break;}
					if (this.thePaths.getAudioInfo(i, "path") != j) {
						sql.push("UPDATE audPathsTable SET audorder = " + (i - 1) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
						this.thePaths.setAudioInfo(i, "index", i-1);
					}
				}
			}
			else {
				var yy = false
				for (i = inDex; i <= this.thePaths.getAudioCount() - 1; i++) {
					if (this.thePaths.getAudioInfo(i, "path") != j && yy == false) {
						sql.push("UPDATE audPathsTable SET audorder = " + (i + 1) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
						this.thePaths.setAudioInfo(i, "index", i + 1);
					}
					else {
						yy = true
						if (this.thePaths.getAudioInfo(i, "path") != j) {
							sql.push("UPDATE audPathsTable SET audorder = " + (i) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
							this.thePaths.setAudioInfo(i, "index", i);
						}
					}
				}
			}
			this.$.audItemIndex.setValue(parseInt(this.thePaths.getAudioInfo(oldDex,"index")));
			this.thePaths.orderArray("audio");
	    	this.$.audFileList.refresh();
	    	this.doDataToSave(sql);
	    }
	},
	saveAudItemSettings: function() {

		if (Number(this.selectedRow) > -1) {
			/*if (this.thePaths.getAudioCount() > 200) {
				this.$.progress.openAtCenter();
				this.$.progress.startAni();
				this.$.progress.setMessage("Saving...");
			}*/
			var j = this.thePaths.getAudioInfo(this.selectedRow, "path");
			var inDex = this.$.audItemIndex.getValue();
			var sLoc = ""
			var oldDex = this.thePaths.getAudioInfo(this.selectedRow, "index")
			var sql = []
			if (inDex != oldDex) {
				sql.push("UPDATE audPathsTable SET audorder = " + inDex + " WHERE audpath = '" + j + "' AND filename = '" + this.currentFile + "';");
				this.thePaths.setAudioInfo(this.selectedRow, "index", inDex);
			};
			var s = "";
			var i = 0;
			if (sLoc.length > 0) {
				if (oldDex < inDex) {
					for (i = inDex; i >= 1; i--) {
						if (i == oldDex -1) {break;}
						if (this.thePaths.getAudioInfo(i, "path") != j) {
							sql.push("UPDATE audPathsTable SET audorder = " + (i - 1) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
							this.thePaths.setAudioInfo(i, "index", i-1);
						}
					}
				}
				else {
					var yy = false
					for (i = inDex; i <= this.thePaths.getAudioCount() - 1; i++) {
						
						if (this.thePaths.getAudioInfo(i, "path") != j && yy == false) {
							sql.push("UPDATE audPathsTable SET audorder = " + (i + 1) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
							this.thePaths.setAudioInfo(i, "index", i + 1);
						}
						else {
							yy = true
							if (this.thePaths.getAudioInfo(i, "path") != j) {
								sql.push("UPDATE audPathsTable SET audorder = " + (i) + " WHERE audpath = '" + this.thePaths.getAudioInfo(i, "path") + "' AND filename = '" + this.currentFile + "';");
								this.thePaths.setAudioInfo(i, "index", i);
							}
						}
					}
				}
			}
			
        	this.thePaths.orderArray("audio")
			for (i = 0;i <= this.thePaths.getAudioCount() - 1; i++) {
				if (this.thePaths.getAudioInfo(i, "path") == j) {
					this.selectedRow = i;
					break;
				};
			};
			if (this.beSilent == 0) {
				this.$.audFileList.refresh();
				if (this.thePaths.getAudioCount() > 10) {
				    this.scrollTo(this.selectedRow);
				};
			};

			this.doDataToSave(sql)
			//if (sLoc.length == 0) {
				//this.$.progress.stopAni();
				//this.$.progress.close();
			//}
		};
	},
	scrollTo:function(inIndex){
		var scr=this.$.audFileList.$.scroller;
		//if (whichSrc == 0) {
			//var scr=this.$.fileList.$.scroller;
		/*}
		else if (whichSrc == 1){
			
		}
		else if (whichSrc == 2){
			var scr=this.$.exhibitionFiles.$.scroller;
		}*/
		inIndex = inIndex - 2;
		if (inIndex < 0) {inIndex = 0;};
		var scrollSpot=0;
		for (var h in scr.heights) {
			if (h) {
				scrollSpot=scr.heights[h] * inIndex;
				break;
			}
		}
		scr.$.scroll.setScrollPosition(-scrollSpot);
		scr.start();
		
	  },
	previewChanging: function(iS,iE) {
		this.previewChange(iS,iE)
	},
	previewChange: function(iS,iE) {
		this.$.sound.setCurrentSeconds(iS.getPosition())
		if (this.$.previewCur) {
			this.$.previewCur.setContent(this.$.sound.secondsToTime(iS.getPosition()))
		}
		/*if (iS.name == "audioPosition") {
			this.$.cTime.setContent(this.$.sound.secondsToTime(iS.getPosition()))
		}*/
	},
	previewUpdate: function() {
		var s= this.$.sound.showCurrentPosition()
		if (s) {
			//this.$.previewCur.setContent(Arr[0])
			this.$.previewMax.setContent(this.$.sound.secondsToTime(this.$.sound.getMaxSeconds()))
			this.$.previewCur.setContent(this.$.sound.secondsToTime(this.$.previewPosition.getPosition()))
			this.$.previewPosition.setMaximum(this.$.sound.getMaxSeconds())
			this.$.previewPosition.setPosition(this.$.sound.getCurrentSeconds())
		}
	},
	previewSong: function() {
		if (this.$.sound.getIsplaying() == true) {
			this.$.sound.pauseSound();
			if (this.$.sound.getIspaused() == true) {
				window.clearInterval(this.previewJob)
			}
			else {
				this.previewJob = window.setInterval(enyo.hitch(this,"previewUpdate"),1000)
			}
		}
		else {
			if (this.selectedRow >=0) {
				var s = this.thePaths.getAudioInfo(this.selectedRow, "path")
				if (this.$.sound.getSrc() != s) {
					this.$.sound.setSrc(s)
				}
				this.$.sound.setCurrentSeconds(this.$.previewPosition.getPosition())
				this.$.sound.playSound();
				this.previewJob = window.setInterval(enyo.hitch(this,"previewUpdate"),1000)
			}
		}
	},
	stopPreview: function() {
		this.stopPreviewSound()
	},
	stopPreviewSound: function() {
		if (this.$.previewCur) {
			if (this.$.sound.getIsplaying() == true) {
				window.clearInterval(this.previewJob)
				if (this.$.sound.getIspaused() == true) {
					
				}
				else {
					this.$.sound.pauseSound();
					
				}
			}
			this.$.sound.stop();
			this.$.sound.setSrc("")
			if (this.selectedRow >=0) {
				this.$.sound.setSrc(this.thePaths.getAudioInfo(this.selectedRow, "path"))
				this.PREVSELECT = this.selectedRow
			}
			this.$.previewCur.setContent("0:00")
			this.$.previewMax.setContent("0:00")
			window.setTimeout(enyo.bind(this, (function(){
				if (this.PREVSELECT == this.selectedRow) {
					this.$.previewMax.setContent(this.$.sound.secondsToTime(this.$.sound.getMaxSeconds()))
				}
			})),3000)
			
			this.$.previewPosition.setPosition(0)
			this.$.previewButton.setToDefault();
		}
	},
	
});