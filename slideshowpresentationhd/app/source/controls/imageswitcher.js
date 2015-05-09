enyo.kind({
	name: "ImageSwitcher",
	kind: "Pane",
	published: {
		photos: {
			photo1: {
				trans: "",
				rotate: 0,
				speed: 0,
				src: "",
				pan: -1,
				dir: 0,
				stretch: false
			},
			photo2: {
				trans: "",
				rotate: 0,
				speed: 0,
				src: "",
				pan: -1,
				dir: 0,
				stretch: false
			},
			photo3: {
				trans: "",
				rotate: 0,
				speed: 0,
				src: "",
				pan: -1,
				dir: 0,
				stretch: false
			}
		},
		exhibition: false,
		fillIndex: 1,
		showIndex: 1,
		canvasWidth: 300,
		canvasHeight: 300,
		goneBack: 0,
		frozen: false,
		canvasToHide: 1,
		useSwipe: true,
		ISDRAGGING: false,
		triggerDistance: 350,
		handlingDrag: false,

		preventDrag: false
	},
	events: {
		onClicked: "",
		onPicLoaded: "",
		onExifData: "",
		onDragStarted: "",
		onDragCompleted: "",
		onDragStoped: "",
		onRequestNavButtons: ""
	},
	components: [
		//{kind: "VFlexBox", name: "canvas1",flex:1, components:[
			{kind: "DrawImage.control" ,name:"canvas1",className:"showingCanvas", onClicked:"doClicked", onPicLoaded: "checkLoad",onGotExif: "sendOutExif"},
		//]},
		//{kind: "VFlexBox", name: "canvas2",flex:1, showing: false, components:[
	        {kind: "DrawImage.control" ,name: "canvas2",className:"hidingCanvas", onClicked:"doClicked", onPicLoaded: "checkLoad",onGotExif: "sendOutExif"},
	    //]},
	    //{kind: "VFlexBox", name: "canvas3",flex:1, showing: false, components:[
	        {kind: "DrawImage.control" ,name:"canvas3",className:"hidingCanvas", onClicked:"doClicked", onPicLoaded: "checkLoad",onGotExif: "sendOutExif"},
	    //]},
	    //{kind: "VFlexBox", name: "backpic",flex:1, showing: false, components:[
	       	{kind: "DrawImage.control" ,name:"backpic",className:"hidingCanvas"},
	   // ]},
	    //{kind: "VFlexBox", name: "forpic",flex:1, showing: false, components:[
	        {kind: "DrawImage.control" ,name:"forpic",className:"hidingCanvas"},
		//]},
	    {kind: "TextCanvas", name: "textField", className:"datetimebox"},
	],
	setTextColor: function(s) {
		/*enyo.nextTick(this.$.textField,*/this.$.textField.setTextColor(s)
	},
	setTextFont: function(s) {
		/*enyo.nextTick(this.$.textField,*/this.$.textField.setTextFont(s)	
	},
	drawText: function(stext, x, y, lineHeight) {
		enyo.nextTick(this.$.textField,this.$.textField.drawText,stext,x,y,lineHeight);
	},
	getStringHeight: function(text, lineHeight) {
	    return this.$.textField.drawText(text, null, null, lineHeight);
	},
	setWidthAndHeight: function(w, h) {
		/*enyo.nextTick(this.$.textField,*/this.$.textField.setWidthAndHeight(w, h);
	},
    sendOutExif: function(iS,iE) {
    	var s = iS.name.replace("canvas", "")
    	iE.PATH_SRC = this.photos["photo" + s].src
    	this.doExifData(iE);
    },
    checkLoad: function(iS, iE) {
    	if (this.goneBack > 0) {
	    		this.log("CHECKLOADshowindex>>>>>>>>>>>>>>>>" +iS.name)
    		if (parseInt(iS.name.replace("canvas", "")) == this.showIndex) {
	    		this.goneBack = 0
	    		this.$.backpic.removeClass("finishSwipe");
	    		//this.$["canvas" + this.showIndex].drawPicture()
	    		this.setClasses(this.$["canvas" + this.showIndex], "top");
				this.setClasses(this.$.backpic, "hide");
				this.$.backpic.drawPicture()
				this.log("@@@@================>>>" + this.$.backpic.getSrc())
			}
    		//this.$.backpic.setShowing(false)
			/*this.$["canvas" + this.showIndex].setStyle(this.getStyle());
			//
			//window.setTimeout(enyo.bind(this,function() {
				this.$.backpic.removeClass("finishSwipe");
				this.setClasses(this.$.backpic, "hide");
				this.setClasses(this.$["canvas" + this.showIndex], "top");
    			this.$.backpic.loadPicture()	
			//}), 300)
    		*/
    		//this.log("!!!!GONEBACK!!!!!")
    	}
    	else {
    		this.doPicLoaded(iE)
    	}
    },	             
	forceToggleStretch: function(val) {
		var b = false;
		if (val == "1") { b = true;};
		for (var i = 1; i < 4; i++) {
			this.photos["photo" + i].stretch = val
			this.$["canvas" + i].setStretch(b)
		};
		var x = this.showIndex
		this.$["canvas" + x].drawPicture();
		x++;
		if (x > 3) {x = 1;};
		this.$["canvas" + x].drawPicture();
	},
	forceToggleCinematic: function (val, class1, class2, pm1, pm2, pd1, pd2) {
		if (this.preventDrag == false) {
			if (val == true) {
				var pDir = Math.floor(Math.random() * 100); 
				if (pDir > 49) {
					pDir = 0;
				}
				else {
					pDir = -1;
				}
				var pMode = Math.floor(Math.random() * 3);

				var pDir1 = Math.floor(Math.random() * 100);
				if (pDir1 > 49) {
					pDir1 = 0;
				}
				else {
					pDir1 = -1;
				}
				var pMode1 = Math.floor(Math.random() * 3);
			}
			else {
				var pDir = pd1; 
				var pMode = pm1;
				var pDir1 = pd2;
				var pMode1 = pm2;
			}
			var x = this.showIndex;
			this.photos["photo" + x].pan = pMode;
			this.photos["photo" + x].dir = pDir;
			if (this.exhibition == true) {
				class1 = GetExhibTransSub(class1);
			};
			this.photos["photo" + x].trans = class1;
			this.$["canvas" + x].setPanPic(val);
			this.$["canvas" + x].setPanMode(pMode);
			this.$["canvas" + x].setPanVars(pDir);
			this.$["canvas" + x].drawPicture();
			if (val == true && pMode > -1) {
				enyo.nextTick(this.$["canvas" + x], this.$["canvas" + x].startPan);
			}
			else {
				enyo.nextTick(this.$["canvas" + x], this.$["canvas" + x].stopPan);
			}

			x++;
			if (x > 3) {x = 1;};
			this.photos["photo" + x].pan = pMode1;
			this.photos["photo" + x].dir = pDir1;
			if (this.exhibition == true) {
				class2 = GetExhibTransSub(class2);
			};
			this.photos["photo" + x].trans = class2;
			this.$["canvas" + x].setPanPic(val);
			this.$["canvas" + x].setPanMode(pMode1);
			this.$["canvas" + x].setPanVars(pDir1);
			this.$["canvas" + x].drawPicture();
		}
		else {
			this.cinematicPrevented = true
			this.cinematicVals.val = val
			this.cinematicVals.class1 = class1
			this.cinematicVals.class2 = class2
			this.cinematicVals.pm1 = pm1
			this.cinematicVals.pm2 = pm2
			this.cinematicVals.pd1 = pd1
			this.cinematicVals.pd2 = pd2
		}

	},
	cinematicPrevented: false,
	cinematicVals: {},
	forcechangeCurrentAndNext: function (picSrc1, picClass1,picStretch1,picPan1, picDir1, picRotate1,picTSpeed1, picSrc2, picClass2, picStretch2,picPan2, picDir2, picRotate2,picTSpeed2) {

		for (var i = 1; i < 4; i++) {
			this.$["canvas" + i].stopPan();
		};
		//this.$.backpic.setStyle(this.getStyle("1"));

		this.goneBack = 1;
		var x = this.showIndex;
		if (this.exhibition == true) {
			picClass1 = GetExhibTransSub(picClass1)
		}
		this.photos["photo" + x].trans = picClass1;
		this.photos["photo" + x].pan = picPan1;
		this.photos["photo" + x].dir = picDir1;
		this.photos["photo" + x].rotate = picRotate1;
		this.photos["photo" + x].speed = picTSpeed1;
		this.photos["photo" + x].src = picSrc1;
		this.photos["photo" + x].stretch = (parseInt(picStretch1) == 1) ? true : false;
		this.setClasses(this.$["canvas" + x], "mid");
		this.$["canvas" + x].setPicRotate(picRotate1);
		this.$["canvas" + x].setPicWidth(this.canvasWidth);
		this.$["canvas" + x].setPicHeight(this.canvasHeight);
		//this.$["canvas" + x].setClassName("canvasBasicShowing");
		//this.$["canvas" + x].setShowing(true);
		this.$["canvas" + x].setSrc(picSrc1);
		this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);
		this.$["canvas" + x].loadPicture();
		this.log("showindex>>>>>>>>>>>>>>>>" + x)

		if (this.photos["photo" + x].pan >= 0) {
			this.$["canvas" + x].setPanPic(true);
			this.$["canvas" + x].setPanMode(picPan1);
			this.$["canvas" + x].setPanVars(picDir1);
		}
		else {
			this.$["canvas" + x].setPanPic(false);
			this.$["canvas" + x].setPanMode(0);
		}
		if (picPan1 >= 0 ) {this.$["canvas" + x].startPan();};

		x++;
		if (x > 3) {x = 1;};


		if (this.exhibition == true) {
			picClass2 = GetExhibTransSub(picClass2)
		}
		this.photos["photo" + x].trans = picClass2;
		this.photos["photo" + x].pan = picPan2;
		this.photos["photo" + x].dir = picDir2;
		this.photos["photo" + x].rotate = picRotate2;
		this.photos["photo" + x].speed = picTSpeed2;
		this.photos["photo" + x].src = picSrc2;
		this.photos["photo" + x].stretch = (parseInt(picStretch2) == 1) ? true : false;

		this.$["canvas" + x].setPicRotate(picRotate2);
		this.$["canvas" + x].setPicWidth(this.canvasWidth);
		this.$["canvas" + x].setPicHeight(this.canvasHeight);
		//this.$["canvas" + x].setShowing(false);
		//this.$["canvas" + x].setClassName("canvasBasicHiding");
		//this.$["canvas" + x].setStyle(this.getStyle("1"));
		//this.setClasses(this.$["canvas" + x], "hide");
		this.$["canvas" + x].setStyle(this.getStyle());
		this.$["canvas" + x].setSrc(picSrc2);
		this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);
		this.$["canvas" + x].loadPicture();

		if (this.photos["photo" + x].pan >= 0) {
			this.$["canvas" + x].setPanPic(true);
			this.$["canvas" + x].setPanMode(picPan2);
			this.$["canvas" + x].setPanVars(picDir2);
		}
		else {
			this.$["canvas" + x].setPanPic(false);
			this.$["canvas" + x].setPanMode(0);
		};
		//this.setClasses(this.$.backpic, "hide");
	},
	panPicture: function() {
		var x = this.showIndex;
		if (this.photos["photo" + x].pan > 0) {
			this.$["canvas" + x].startPan();
		};
	},
	pausePan: function() {
		var x = this.showIndex;
		this.$["canvas" + x].pausePan();
	},
	canvasHeightChanged: function() {
		this.$.forpic.setPicHeight(this.canvasHeight);
		this.$.backpic.setPicHeight(this.canvasHeight);
	},
	canvasWidthChanged: function() {
		this.$.forpic.setPicWidth(this.canvasWidth);
		this.$.backpic.setPicWidth(this.canvasWidth);
	},
	changePicture: function(noTrans) {
		
	    if (noTrans != true) {this.preventDrag = true};
	    
	    var x = this.showIndex
		var y = x + 1;
		if (y > 3) {y = 1;};
		var z = y + 1
		if (z > 3) {z = 1;};

		this.$["canvas" + x].stopPan();

		this.setClasses(this.$["canvas" + y], "mid")
			
	    
		
		if (this.photos["photo" + y].pan >= 0) {
			/*enyo.asyncMethod(this.$["canvas" + y],*/ this.$["canvas" + y].startPan();	
			
		}

		window.setTimeout(enyo.bind(this,function(){

			if (noTrans == false) {
				
				this.$["canvas" + x].addClass("animateCanvas" + this.photos["photo" + x].speed)
				
				window.setTimeout(enyo.bind(this,function(){
		    		this.$["canvas" + x].addClass(this.photos["photo" + x].trans)	
		    		this.log("$%%%$CLASSNAME X:=====>>>>>" + this.$["canvas" + x].getClassName())	 
		    	}),100)
		    	
		    	
			}
			else {
				
				this.setClasses(this.$["canvas" + x], "hide")

			}

			var finishSwitch = enyo.bind(this, (function() {

				this.$.forpic.removeClass("finishSwipe");
			    this.$.backpic.removeClass("finishSwipe");

			    this.setClasses(this.$.backpic, "hide");
			    this.setClasses(this.$.forpic, "hide");
		    	if (this.useSwipe == true) {
			    	this.$.backpic.setSrc("/var/luna/data/extractfs" + this.photos["photo" + x].src + ":0:0:200:200:2");
				    this.$.backpic.setStretch(this.photos["photo" + x].stretch);
				    this.$.backpic.setPicRotate(this.photos["photo" + x].rotate);

				    this.$.forpic.setSrc("/var/luna/data/extractfs" + this.photos["photo" + z].src + ":0:0:200:200:2");
				    this.$.forpic.setStretch(this.photos["photo" + z].stretch);
				    this.$.forpic.setPicRotate(this.photos["photo" + z].rotate);
					this.$.forpic.loadPicture();
				    this.$.backpic.loadPicture();
			    }
				
				this.$["canvas" + x].removeClass("animateCanvas" + this.photos["photo" + x].speed)
				this.$["canvas" + x].removeClass(this.photos["photo" + x].trans)	
			    this.setClasses(this.$["canvas" + x], "hide")

			    if (this.photos["photo" + z].pan >= 0) {
					this.$["canvas" + z].setPanPic(true);
					this.$["canvas" + z].setPanMode(this.photos["photo" + z].pan);
					this.$["canvas" + z].setPanVars(this.photos["photo" + z].dir);
				}
				else {
					this.$["canvas" + z].setPanPic(false);
					this.$["canvas" + z].setPanMode(-1);
				}
				this.setClasses(this.$["canvas" + y], "top")
				
				this.$["canvas" + z].setPicRotate (this.photos["photo" + z].rotate);
			    this.$["canvas" + z].loadPicture();
			    //enyo.nextTick(this.$["canvas" + z],this.$["canvas" + z].drawPicture,true);
				this.showIndex++;
				if (this.showIndex > 3) {this.showIndex = 1};

				if (this.cinematicPrevented == true) {
					this.cinematicPrevented = false
					if (this.cinematicVals.val == true) {
						this.forceToggleCinematic(true, 
							                      this.cinematicVals.class1,
							                      this.cinematicVals.class2,
							                      this.cinematicVals.pm1,
							                      this.cinematicVals.pm2,
							                      this.cinematicVals.pd1,
							                      this.cinematicVals.pd2 
							                     )
					}
					else {
						this.forceToggleCinematic(false, 
							                      this.cinematicVals.class2,
							                      this.cinematicVals.class1,
							                      this.cinematicVals.pm2,
							                      this.cinematicVals.pm1,
							                      this.cinematicVals.pd2,
							                      this.cinematicVals.pd1 
							                     )
					}
				}

			    if (noTrans != true) {this.preventDrag = false}
			}));
			if (noTrans == true) {
				//window.setTimeout(enyo.bind(this,function() {
					finishSwitch();
				//}), 20);
			}
			else {
				window.setTimeout(enyo.bind(this,function() {
					finishSwitch();
						    
				}), 5500 - (parseInt(this.photos["photo" + x].speed) * 1000));
			}
		}),100)
		//this.refreshSize();
	},
	mouseupHandler: function(inSender, inEvent) {
		this.log ("$$$$MOUSE-UP$$$$$$$$$$$$")
		if (this.handlingDrag == false) {
			this.picReset();
		  	this.doRequestNavButtons();	
		};
		   
	},
	dragstartHandler: function(inSender, inEvent) {
		//this.resetPosition();
		if (inEvent.horizontal && this.hasNode() && this.preventDrag == false) {
			
			this.handlingDrag = true;
			//this.doGesStart(inEvent)
			return true;
		} //else {
		//	return this.fire("ondragstart", inEvent);
		//}
	},
	dragHandler: function(inSender, inEvent) {
		var dx = inEvent.dx; 
		if (this.handlingDrag && this.preventDrag == false) {
				//this.node.style.webkitTransform = "translate3d(" + dx + "px, 0, 0)";
				this.picMove("", inEvent);
			return true;
		}
	},
	dragfinishHandler: function(inSender, inEvent) {
		if (this.handlingDrag && this.preventDrag == false) {
			var dx = inEvent.dx;
			//inEvent.preventClick();
			window.setTimeout(enyo.bind(this,function() {this.handlingDrag = false;}), 500); 
			//this.resetPosition();
			if (Math.abs(dx) > this.triggerDistance) {
				//this.handleSwipe();
				this.picMoveEnd("",inEvent)
			}
			else {
				this.picReset()
			}
			return true;
		} else {
			//this.fire("ondragfinish", inEvent);
		}
	},
	picReset: function() {
		if (this.frozen == false && this.useSwipe == true && this.preventDrag == false) {
			this.setClasses(this.$.backpic, "hide")
			this.setClasses(this.$.forpic, "hide")
			this.refreshSize()
			this.ISDRAGGING = false
			enyo.nextTick(this,this.panPicture)
			this.doDragStoped();
		}
	},
	picMove: function(iS, iE) {
		//this.log(this.frozen + ", " + this.useSwipe)
		if (this.frozen == false && this.useSwipe == true && this.preventDrag == false) {
			if (this.ISDRAGGING == false) {
				this.pausePan();
				this.doDragStarted();
			};
			this.ISDRAGGING = true;
			this.dragImage(iE)
		};
	},
	picMoveEnd: function(iS, iE) {
		this.ISDRAGGING = false
		this.timeIndex = 0;
		if (this.frozen == false && this.useSwipe == true && this.preventDrag == false) {
			if (iE.dx <= 0) {
				if (iE.dx < -300) {
					this.endSwipe(0);
				}
				else {
					this.picReset();
				}
			}
			else {
				if (iE.dx > 300) {
					this.endSwipe(1);
				}
				else {
					this.picReset();
				}
			}
		}
	},
	lastX: 0,
	dragImage: function(iE) {
		//this.refreshSize()
		var x = this.showIndex
		this.$["canvas" + x].setStyle(this.getStyle() + "-webkit-transform: translate3d(" + iE.dx + "px, 0, 0);");
		//this.setClasses(this.$["canvas" + x], "mid")
		if (iE.dx <=0) {
			//this.$.backpic.setShowing(false);
			//this.$.forpic.setShowing(true);
			this.setClasses(this.$.backpic, "hide")
			this.setClasses(this.$.forpic, "absolute")
			this.$.forpic.setStyle(this.getStyle() + "-webkit-transform: translate3d(" + (iE.dx + this.$["canvas" + x].getPicWidth()) + "px, 0, 0);");
			this.lastX = iE.dx + this.$["canvas" + x].getPicWidth();
		}
		else {
			//this.$.forpic.setShowing(false);
			//this.$.backpic.setShowing(true);
			this.setClasses(this.$.backpic, "absolute")
			this.setClasses(this.$.forpic, "hide")
			this.$.backpic.setStyle(this.getStyle() + "-webkit-transform: translate3d(" + (iE.dx - this.$["canvas" + x].getPicWidth()) + "px, 0, 0);");
			this.lastX = iE.dx - this.$["canvas" + x].getPicWidth();
		}
	},
	endSwipe: function(val) {
		this.log()
		this.preventDrag = true
		if (val == 0) {
			//this.$.forpic.setStyle("left: " + this.lastX + "px;");
			this.$.forpic.addClass("finishSwipe")//"top:0;left:0;")
			window.setTimeout(enyo.bind(this,function(){
				this.$.forpic.hasNode()
				this.$.forpic.node.style.webkitTransform = "translate3d(0, 0, 0)";	
			}),0);
			
			window.setTimeout(enyo.bind(this,function(){
				this.doDragCompleted(3);
				//this.setClasses(this.$["canvas" + this.showIndex], "hide")
				this.$["canvas" + this.showIndex].setStyle(this.getStyle())
				/*var x = this.showIndex + 1
				if (x > 3) { x = 3}
				this.setClasses(this.$["canvas" + x], "mid")*/
				window.setTimeout(enyo.bind(this,function(){
					this.preventDrag = false
				}),1000 + (this.photos["photo" + this.showIndex].pan >= 0 ? 600 : 0)) 
			}),320) 
			//this.$.forpic.applyStyle("-webkit-transform", "0,0,0")
		}
		else {
			//this.$.backpic.setStyle("left: " + this.lastX + "px;");
			this.$.backpic.addClass("finishSwipe")
			window.setTimeout(enyo.bind(this,function(){
				this.$.backpic.hasNode()
				this.$.backpic.node.style.webkitTransform = "translate3d(0, 0, 0)";
			}),0);
			window.setTimeout(enyo.bind(this,function(){
				this.doDragCompleted(4);
				this.setClasses(this.$["canvas" + this.showIndex], "hide")
				this.$["canvas" + this.showIndex].setStyle(this.getStyle());
				//
				//this.$["canvas" + this.showIndex].setStyle(this.getStyle())
				window.setTimeout(enyo.bind(this,function(){
					this.preventDrag = false
				}),1000 + (this.photos["photo" + this.showIndex].pan >= 0 ? 600 : 0)) 
			}),320)
		}
	},
	getStyle: function() {
		
		return "width:" + this.canvasWidth + "px; height:" + this.canvasHeight + "px;"

	},
	feedBackPic: function(picSrc, sStretch,picRotate,loadit, noDraw) {
		this.$.backpic.setSrc("/var/luna/data/extractfs" + picSrc + ":0:0:200:200:2")
		//this.$.backpic.setStyle(this.getStyle("1", -this.canvasWidth))
		//if (loadit == true) {this.setClasses(this.$.backpic, "hide")}
		this.$.backpic.setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		this.$.backpic.setPicRotate(picRotate)
		if (sStretch == 1) {sStretch = true}
		else {sStretch = false}
		this.$.backpic.setStretch(sStretch)
		if (loadit == true) {this.$.backpic.loadPicture(noDraw)}
	},
	
	feedNextPic: function(picSrc, sStretch,picRotate,loadit) {
		this.$.forpic.setSrc("/var/luna/data/extractfs" + picSrc + ":0:0:200:200:2")
		//this.$.forpic.setStyle(this.getStyle("1", this.canvasWidth))
		//if (loadit == true) {this.setClasses(this.$.forpic, "hide")}
		this.$.forpic.setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		this.$.forpic.setPicRotate(picRotate)
		if (sStretch == 1) {sStretch = true}
		else {sStretch = false}
		this.$.forpic.setStretch(sStretch)
		if (loadit == true) {this.$.forpic.loadPicture()}
	},
	
	feedPicture: function (picSrc, picClass, sStretch, picPan, picDir,picRotate, picTSpeed) {
		var x = this.fillIndex
		this.log("FEED: " + picPan)
		if (this.exhibition == true) {
			picClass = GetExhibTransSub(picClass)
		}
		this.photos["photo" + x].trans = picClass;
		this.photos["photo" + x].pan = picPan;
		this.photos["photo" + x].dir = picDir;
		this.photos["photo" + x].rotate = picRotate;
		this.photos["photo" + x].speed = picTSpeed;
		this.photos["photo" + x].src = picSrc;
		this.photos["photo" + x].stretch = (parseInt(sStretch) == 1) ? true : false;

		this.$["canvas" + x].setPicRotate(picRotate);
		this.$["canvas" + x].setPicWidth(this.canvasWidth);
		this.$["canvas" + x].setPicHeight(this.canvasHeight);
		this.$["canvas" + x].setSrc(picSrc);
		this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);

		this.fillIndex++;
		if (this.fillIndex > 3) {this.fillIndex = 1};
	},
	clearImages: function () {
		for (var i = 1; i < 4; i++) {
			this.$["canvas" + i].clearPicture();
			this.$["canvas" + i].setClassName("enyo-view")
			if (i == 1) {
				//this.$["canvas" + i].setClassName("canvasBasicShowing");
				//this.$["canvas" + i].setShowing(true);
			}
			else {
				//this.$["canvas" + i].setShowing(false);
				//this.$["canvas" + i].setClassName("canvasBasicHiding");
			}
			this.photos["photo" + i].src = "";
			this.photos["photo" + i].trans = "";
			this.photos["photo" + i].pan = 0;
			this.photos["photo" + i].dir = 0;
			this.photos["photo" + i].stretch = false;
			this.photos["photo" + i].rotate = 0;
			this.photos["photo" + i].speed = 0;
		};
		this.setClasses(this.$.canvas1, "top");
		this.setClasses(this.$.canvas2, "hide");
		this.setClasses(this.$.canvas3, "hide");
		this.setClasses(this.$.backpic, "hide");
		this.setClasses(this.$.forpic, "hide");
		this.showIndex = 1;
		this.fillIndex = 1;
		
	},
	
	loadFirstTwoImages: function () {
		this.showIndex = 1;
		/*this.$["canvas1"].setStyle(this.getStyle("99"));
		this.$["canvas2"].setStyle(this.getStyle("1"));
		this.$["canvas3"].setStyle(this.getStyle("1"));*/
		//this.$.canvas3.setClassName("canvasBasicHiding")
		this.setClasses(this.$.canvas1, "top")
		for (var x = 1; x < 3; x++) {
			if (this.photos["photo" + x].pan >= 0) {
				this.$["canvas" + x].setPanPic(true);
				this.$["canvas" + x].setPanMode(this.photos["photo" + x].pan);
				this.$["canvas" + x].setPanVars(this.photos["photo" + x].dir);
			}
			else {
				this.$["canvas" + x].setPanPic(false);
				this.$["canvas" + x].setPanMode(-1);
			}
			this.$["canvas" + x].setStyle("width:" + this.canvasWidth + "px; height:" + this.canvasHeight + "px;")
			this.$["canvas" + x].setPicRotate(this.photos["photo" + x].rotate);
			this.$["canvas" + x].setPicWidth(this.canvasWidth);
			this.$["canvas" + x].setPicHeight(this.canvasHeight);
			//this.$["canvas" + x].setShowing((x == 1 ? true : false))
			//this.$["canvas" + x].setClassName((x == 1 ? "canvasBasicShowing" : ""));
			this.$["canvas" + x].setSrc(this.photos["photo" + x].src);
			this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);
			this.$["canvas" + x].loadPicture();
		};

		this.setClasses(this.$.canvas2, "hide")
		this.setClasses(this.$.canvas3, "hide")
		this.$.canvas3.setStyle("width:" + this.canvasWidth + "px; height:" + this.canvasHeight + "px;")
		//this.$.canvas3.setShowing(false)
		//this.$.canvas2.setShowing(false)
		//this.$.canvas1.setShowing(true)
		if (this.photos["photo" + this.showIndex].pan >= 0 ) {
			window.setTimeout(enyo.bind(this,(function(){
				enyo.nextTick(this.$["canvas" + this.showIndex], this.$["canvas" + this.showIndex].startPan);
			})),1000);
			
		};

	},
	loadFirstImage: function (noStart) {
		this.showIndex = 1
		var x = 1;
		if (this.photos["photo" + x].pan >= 0) {
			this.$["canvas" + x].setPanPic(true);
			this.$["canvas" + x].setPanMode(this.photos["photo" + x].pan);
			this.$["canvas" + x].setPanVars(this.photos["photo" + x].dir);
		}
		else {
			this.$["canvas" + x].setPanPic(false);
			this.$["canvas" + x].setPanMode(-1);
		}
		this.$["canvas" + x].setPicRotate(this.photos["photo" + x].rotate);
		this.$["canvas" + x].setPicWidth(this.canvasWidth);
		this.$["canvas" + x].setPicHeight(this.canvasHeight);
		
		//this.$["canvas" + x].setShowing(true);
		//this.$["canvas" + x].setStyle(this.getStyle("99"));
		this.setClasses(this.$["canvas" + x], "top")
		//this.$["canvas" + x].setClassName("canvasBasicShowing");
		this.$["canvas" + x].setSrc(this.photos["photo" + x].src);
		this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);
		this.$["canvas" + x].loadPicture();

		this.setClasses(this.$.canvas2, "hide")
		this.setClasses(this.$.canvas3, "hide")
		//this.$.canvas2.setShowing(false);
		//this.$.canvas3.setShowing(false);
		if (this.photos["photo" + this.showIndex].pan >= 0 && !noStart) {
			window.setTimeout(enyo.bind(this,(function(){
				enyo.nextTick(this.$["canvas" + this.showIndex], this.$["canvas" + this.showIndex].startPan);
			})),1000);
			
		};

	},
	displayFirstImage: function () {
		this.showIndex = 1;
		var x = 1;
		/*if (this.photos["photo" + x].pan >= 0) {
			this.$["canvas" + x].setPanPic(true);
			this.$["canvas" + x].setPanMode(this.photos["photo" + x].pan);
			this.$["canvas" + x].setPanVars(this.photos["photo" + x].dir);
		}
		else {*/
			this.$["canvas" + x].setPanPic(false);
			this.$["canvas" + x].setPanMode(-1);
		//}
		this.$["canvas" + x].setPicRotate(this.photos["photo" + x].rotate);
		this.$["canvas" + x].setPicWidth(this.canvasWidth);
		this.$["canvas" + x].setPicHeight(this.canvasHeight);
		//this.$["canvas" + x].setShowing(true);
		//this.$["canvas" + x].setStyle(this.getStyle("99"));
		this.setClasses(this.$["canvas" + x], "top")
		//this.$["canvas" + x].setClassName("canvasBasicShowing");
		this.$["canvas" + x].setSrc(this.photos["photo" + x].src);
		this.$["canvas" + x].setStretch(this.photos["photo" + x].stretch);
		this.$["canvas" + x].loadPicture();
		this.setClasses(this.$.canvas2, "hide")
		this.setClasses(this.$.canvas3, "hide")
		//this.$.canvas2.setShowing(false);
		//this.$.canvas3.setShowing(false);

	},
	refreshSize: function () {
		this.frozen = false;
		//this.$.backpic.setShowing(false)
		//this.$.backpic.setClassName("canvasBasicHiding")
		//this.$.forpic.setShowing(false)
		//this.$.forpic.setClassName("canvasBasicHiding")
		var x = this.showIndex;
		
		this.$["canvas" + x].setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		//this.$["canvas" + x].setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		//this.$["canvas" + x].setShowing(true);
		this.setClasses(this.$["canvas" + x], "top");
		this.$["canvas" + x].setStyle(this.getStyle());
		//.addClass() //setStyle(this.getStyle("99"));
		//this.$["canvas" + x].setClassName("canvasBasicShowing");
		
		x++;
		if (x > 3) {x = 1;};

		this.$["canvas" + x].setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		//this.$["canvas" + x].setShowing(false);
		//this.$["canvas" + x].setClassName("canvasBasicHiding");
		this.setClasses(this.$["canvas" + x], "hide");
		this.$["canvas" + x].setStyle(this.getStyle());

		x++;
		if (x > 3) {x = 1;};
		this.$["canvas" + x].setWidthAndHeight(this.canvasWidth , this.canvasHeight );
		//this.$["canvas" + x].setShowing(false);
		this.setClasses(this.$["canvas" + x], "hide");
		this.$["canvas" + x].setStyle(this.getStyle());

		this.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
		this.setClasses(this.$.backpic, "hide");
		this.setClasses(this.$.forpic, "hide");
		
	},
	setClasses: function(canvas, showingLevel) {
		//this.log("!!!!!!!!!!!!!!!!!!!!!!!===========>>>>>>>" + canvas.name + " " + showingLevel)
		if (showingLevel == "top") {
			canvas.addClass("showingCanvas");
			canvas.removeClass("hidingCanvas");
			canvas.removeClass("showingBehindCanvas");
			canvas.removeClass("topCanvas");	
			//window.setTimeout(enyo.bind(this,function(){
			//}),0)	
		}
		else if (showingLevel == "mid") {
			canvas.addClass("showingBehindCanvas");		
			canvas.removeClass("hidingCanvas");
			canvas.removeClass("showingCanvas");
			canvas.removeClass("topCanvas");	
			//window.setTimeout(enyo.bind(this,function(){
			//}),0)
			
		}
		else if (showingLevel == "hide") {
			canvas.addClass("hidingCanvas");	
			canvas.removeClass("showingBehindCanvas");
			canvas.removeClass("showingCanvas");
			canvas.removeClass("topCanvas");	
		}
		else if (showingLevel == "absolute") {
			canvas.addClass("topCanvas")
			canvas.removeClass("hidingCanvas");	
			canvas.removeClass("showingBehindCanvas");
			canvas.removeClass("showingCanvas");
		}
	}
	
})