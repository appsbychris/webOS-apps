/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "TextCanvas", 
	kind: enyo.Control,
    nodeTag: "canvas",
    published: {
    	txtWidth: 1024,
    	txtHeight: 768,
    	textColor: "#ff0000",
    	textFont:"30pt Prelude",
    	textPosition: 0,
    	triggerDistance: 350,
    	handlingDrag: false
    },
    domAttributes: { 
    	style: "position: absolute; top: 0; left: 0;z-index:100;"
	},
	events: {
		onClicked: "",
		onGesStart: "",
	    onGes: "",
	    onGesEnd: "",
	    onGesInc: ""
	},
	/*mouseupHandler: function(inSender, inEvent) {
		this.log ("$$$$MOUSE-UP$$$$$$$$$$$$")
		if (this.handlingDrag == false) {
		  	this.doClicked();	
		};
		   
	},
	dragstartHandler: function(inSender, inEvent) {
		//this.resetPosition();
		if (inEvent.horizontal && this.hasNode()) {
			
			this.handlingDrag = true;
			this.doGesStart(inEvent)
			return true;
		} //else {
		//	return this.fire("ondragstart", inEvent);
		//}
	},
	dragHandler: function(inSender, inEvent) {
		var dx = inEvent.dx; 
		if (this.handlingDrag) {
				//this.node.style.webkitTransform = "translate3d(" + dx + "px, 0, 0)";
				this.doGes(inEvent);
			return true;
		}
	},
	dragfinishHandler: function(inSender, inEvent) {
		if (this.handlingDrag) {
			var dx = inEvent.dx;
			//inEvent.preventClick();
			window.setTimeout(enyo.bind(this,function() {this.handlingDrag = false;}), 500); 
			//this.resetPosition();
			if (Math.abs(dx) > this.triggerDistance) {
				//this.handleSwipe();
				this.doGesEnd(inEvent)
			}
			else {
				this.doGesInc()
			}
			return true;
		} else {
			//this.fire("ondragfinish", inEvent);
		}
	},*/
	///////////////////////////
	lastText: "",
	lastColor: "",
	lastFont: "",
	lastY: -1,
	drawText: function(stext, x, y, lineHeight) {
		var clearIt = false
		if (x !== null) {
			if (this.lastText == stext && this.lastColor == this.textColor && this.lastFont == this.textFont && this.lastY == y) {
				return false;
			}
			else {
				clearIt = true
			}
			this.lastText = stext
			this.lastColor = this.textColor
			this.lastFont = this.textFont
			this.lastY = y
		}
		//this.log(stext)
		this.hasNode();
		var can = this.node;
		var w = this.txtWidth;
		var h = this.txtHeight;
		if (can.width != w || clearIt) {can.width = w};
		if (can.height!= h || clearIt) {can.height = h};
    	var c = can.getContext('2d');
		c.font = this.textFont;
		//c.lineWidth=3;
		c.fillStyle = this.textColor;
		//c.lineStyle="#880000";
		//c.strokeStyle = "rgba(255, 0, 0 , 1)";
		
		fitWidth = w - 20;
	    var draw = x !== null && y !== null;
		if (stext != "") {
		    stext = stext.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
		    var sections = stext.split("\n");
		    var i, str, wordWidth, words, currentLine = 0,
		        maxHeight = 0,
		        maxWidth = 0;
		    var printNextLine = enyo.bind(this,function(str) {
		        if (draw) {	        	
		    		c.fillText(str, x, y + (lineHeight * currentLine));
		        	//c.strokeText(str, x, y + (lineHeight * currentLine));
		        }
		        currentLine++;
		        wordWidth = c.measureText(str).width;
		        if (wordWidth > maxWidth) {
		            maxWidth = wordWidth;
		        }
		    })
		    for (i = 0; i < sections.length; i++) {
		    	//sections[i] = sections[i].replace(/\//gi, "\/ ")
		        words = sections[i].split(' ');
		        index = 1;
		        while (words.length > 0 && index <= words.length) {
		        	str = words.slice(0, index).join(' ');
		            wordWidth = c.measureText(str).width;
		            /*if (wordWidth > fitWidth) {
		            	if (index == 1) {

		            	}
		            	else {
		            		str = words.slice(0, index).join(' ');
		            	}
		            }
		            else */if (wordWidth > fitWidth /*&& wordWidth > fitWidth - 15*/) {
		                if (index === 1) {
		                    str = words.slice(0, 1).join(' ');
		                    var tmp = ""
		                    do {
		                    	tmp = str.substr(str.length - 1, 1) + tmp
		                    	str = str.substr(0, str.length - 1)
		                    	wordWidth = c.measureText(str).width;

		                    }	
		                    while (wordWidth > fitWidth)
		                    var a = []
		                	a.push(tmp)
		                    words = words.splice(1);
		                    words = a.concat(words)
		                } else {
		                    str = words.slice(0, index - 1).join(' ');
		                    words = words.splice(index - 1);
		                };
	
		                printNextLine(str);
	
		                index = 1;
		            } else {
		                index++;
		            };
		        };
		        if (index > 0) {
		        	str = words.join(' ')
		            printNextLine(str);
		        };
		    };
	
		    maxHeight = lineHeight * (currentLine);
	
		    if (!draw) {
		        return {
		            height: maxHeight,
		            width: maxWidth
		        };
		    }
		}
	},
	getStringHeight: function(text, lineHeight) {
	    return this.drawText(text, null, null, lineHeight);
	},
	setWidthAndHeight: function(w, h) {
		this.txtWidth = w;
		this.txtHeight = h;
	}
});
