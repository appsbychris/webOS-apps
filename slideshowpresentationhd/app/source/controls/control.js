/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "DrawImage.control", 
	kind: enyo.Control,
    nodeTag: "canvas",
    published: {
    	src: "",
    	picWidth: 100,
    	picHeight: 100,
    	stretch: false,
    	pickerMode: false,
    	leftOffset: 500,
    	topOffset: 0,
    	panPic: false,
    	panX: 0,
    	panXMax: 200,
    	panY: 0,
    	panYMax:0,
    	panMode: 1,
    	picRotate: 0,
    	frozen: false,
    	ROTATED: false,
    	increment: 2,
    	img: "",
    	useExtractFs: true,
    	autoLoad: false,
    	txtWidth: 400,
    	txtHeight: 200,
    	textColor: "#ff0000",
    	textFont:"30pt Prelude"
    },
    domAttributes: { 
    	/*style: "border: 2px solid #000; position: absolute; top: 0; left: 0;"*/
	},
	events: {
		onClicked: "",
		onColorPicked: "",
		onPicLoaded:"",
		onGotExif:""
	},
	components:[
        {kind: "ApplicationEvents", onWindowRotated: "resetRotated", onWindowActivated: "resetRotated",onWindowDeactivated: "resetRotated"}        
	],
	resetRotated: function() {
		this.ROTATED = false
	},
	mousedownHandler: function(inSender, inEvent) {
		if (this.pickerMode == false) {  
			this.doClicked();
		}
		else {
			this.hasNode();
			var can = this.node;
			var c = can.getContext('2d');
			
			var offset = {x : inEvent.pageX, y : inEvent.pageY };
		       
	        this.GetOffset( this.hasNode( ), offset );
	        this.GetScrolled( this.parent, offset );
			
			var canvasX = offset.x - this.leftOffset;
			var canvasY = offset.y - this.topOffset;
			
			var imageData = c.getImageData(canvasX, canvasY, 1, 1);
			var pixel = imageData.data;
				 
			
			var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
			this.doColorPicked('#' + dColor.toString(16)) 
		}
	},
	mousemoveHandler: function(inSender, inEvent) {
		if (this.pickerMode == false) {  
			
		}
		else {
			this.hasNode();
			var can = this.node;
			var c = can.getContext('2d');
			
			var offset = {x : inEvent.pageX, y : inEvent.pageY };
		       
	        this.GetOffset( this.hasNode( ), offset );
	        this.GetScrolled( this.parent, offset );
			
			////this.log(enyo.json.stringify(offset))

			var canvasX =Math.floor( offset.x - this.leftOffset);
			var canvasY =Math.floor( offset.y - this.topOffset);
			
			var imageData = c.getImageData(canvasX, canvasY, 1, 1);
			var pixel = imageData.data;
				 
			
			var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
			this.doColorPicked('#' + this.verifyHexColor(dColor.toString(16))); 
		}
	},
	startPan: function() {
		this.frozen = false
		this.start_date = new Date();
		if (this.picRotate > 0){
			//this.job = window.setInterval(enyo.bind(this, "panBuffer"), 80);
			this.increment = 1
		}
		else {
			//this.job = window.setInterval(enyo.bind(this, "panBuffer"), 70);
			this.increment = 1
		}
		this.panBuffer();
		this.bS = false
	},
	stopPan: function() {
		//window.clearInterval(this.job);
		enyo.cancelRequestAnimationFrame(this.job)
		this.panX = 0
		this.panY = 0
		this.ROTATED = false
		this.frozen = true
	},
	pausePan: function() {
		//window.clearInterval(this.job);
		enyo.cancelRequestAnimationFrame(this.job)
		//this.panX = 0
		//this.panY = 0
		this.frozen = true
	},
	setPanVars: function(n) {
		n = parseInt(n)
		this.panMode = parseInt(this.panMode)
		switch (this.panMode) {
			case -1: {
				this.panX = 0
				this.panY = 0
				break;	
			}
			case 0: {
				this.panX = n
				this.panY = 0
				break;	
			}
			case 1: {
				this.panY = n
				this.panX = 0
				break;	
			}
			case 2: {
				this.panY = n
				this.panX = n
				break;	
			}
		}
    	//this.log(n + "PANX=" + this.panX)
	},
	onfocusHandler: function() {
		this.ROTATED = false
	},
	onchangeHandler: function() {
		this.ROTATED = false
	},
	panBuffer: function() {
		var fn = enyo.bind(this, function() {
			this.job = enyo.requestAnimationFrame(fn)
			this.panImage();
		})
		this.job = enyo.requestAnimationFrame(fn)
		//this.panImage()
		//enyo.asyncMethod(this, this.panImage)
	},
	panImage: function() {
		this.hasNode();
		var can = this.node;
		var w = this.picWidth;
		var h = this.picHeight;
		//can.width = w;
		//can.height = h;
		var c = can.getContext('2d');
		var offY = 0;
        var offX = 0;
    	var xX = 0;
        var h1 = (this.img.height );
    	var w1 = (this.img.width );
    	if ((h1 > 0) && (w1 > 0) && this.frozen == false) {
    		if (this.picRotate != 0) {
	    		switch (this.picRotate) {
	    		    case 1: case 3: {
	    		    	var j = w
	    		    	w = h
	    		    	h = j
	    		    	break;
	    		    }
	    		}
	    	}
	        if ((h1 >= w1) && (h1>=h)) {
	        	xX = h1 - h;
	        	xX = xX / h1;
	        	w = w1 - (w1 * xX);
	        }
	        else if ((w1>= h1) && (w1>= w)) {
	        	xX = w1 - w;
	        	xX = xX / w1;
	        	h = h1 - (h1 * xX);
	        }
	        else {
	        	w = w1;
	        	h = h1;
	        }
    		if (this.panMode == 0) {
    		////Pan horizontal across center
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panXMax = Math.floor(h1 * .3)
		    		    	if (w1> h) {
				    			xX = w1 * .60
				    			xX = xX / w1
				    			offY = h * xX
				    		}
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panXMax = Math.floor(w1 * .3)
		    				if (h1> h) {
				    			xX = h1 * .60
				    			xX = xX / h1
				    			offY = h * xX
				    		}
		    		    }
		    		}
    			}
    			else { 
    				this.panXMax = Math.floor(w1 * .3)
    				if (h1> h) {
		    			xX = h1 * .60
		    			xX = xX / h1
		    			offY = h * xX
		    		}
    			}
	    		if (this.panX == -1 ) {
	    			this.panX = this.panXMax
	    		}
	    		
	    		if (this.bS == false) {
		        	this.panX = this.panX + this.increment
		        	if (this.panX  >= this.panXMax) {
		        		this.panX = this.panX - 4
		        		this.bS = true
		        	}
		        }
		        else {
		        	this.panX = this.panX - this.increment
		        	if (this.panX <= 0) {
		        		this.panX = 0
		        		this.bS = false
		        	}
		        }
	    		if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),-offY,-this.picWidth,this.picHeight +offY,this.picWidth  );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,-this.picWidth,(this.picHeight + offY) * -1,this.picWidth,this.picHeight + offY);
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),-1 * (offY + this.picHeight),0,this.picHeight+offY ,this.picWidth  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
	    			c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,0,offY * -1,this.picWidth,this.picHeight + offY);
	    		}
    		}
    		else if (this.panMode == 1) {
    			//pan vertical centered
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panYMax = Math.floor(w1 * .3)
				    		if (h1> w ) {
				    			xX = h1 * .7
				    			xX = xX / h1
				    			offX = w * xX
				    		}
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panYMax = Math.floor(h1 * .3)
				    		if (w1> w ) {
				    			xX = w1 * .7
				    			xX = xX / w1
				    			offX = w * xX
				    		}
		    		    }
		    		}
    			}
    			else { 
	    			this.panYMax = Math.floor(h1 * .3)
		    		if (w1> w ) {
		    			xX = w1 * .7
		    			xX = xX / w1
		    			offX = w * xX
		    		}
    			}
    			if (this.panY == -1) {
    				this.panY = this.panYMax
	    		}
	    		if (this.bS == false) {
		        	this.panY = this.panY + this.increment
		        	if (this.panY  >= this.panYMax) {
		        		this.panY = this.panY - 4
		        		this.bS = true
		        	}
		        }
		        else {
		        	this.panY = this.panY - this.increment
		        	if (this.panY <= 0) {
		        		this.panY = 0
		        		this.bS = false
		        	}
		        }
	    		if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,-offX,-this.picWidth,this.picHeight +offX,this.picWidth  );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,w1,Math.floor(h1 * .7),-1 * (this.picWidth+ (offX/2)),(this.picHeight ) * -1,this.picWidth+ offX,this.picHeight );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,-1 * (offX + this.picHeight),0,this.picHeight+offX ,this.picWidth  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
	    			c.drawImage(this.img, (this.panX ), this.panY,w1 ,Math.floor(h1* .7),(offX/2) * -1,0,this.picWidth+offX,this.picHeight);
	    		}
    		}
    		else if (this.panMode == 2) {
    			//pan diagonal top left to bottom right
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panXMax = Math.floor(h1 * .3)
		    		    	this.panYMax = Math.floor(w1 * .3)
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panYMax = Math.floor(h1 * .3)
		    		    	this.panXMax = Math.floor(w1 * .3)
		    		    }
		    		}
    			}
    			else { 
    				this.panYMax = Math.floor(h1 * .3)
    				this.panXMax = Math.floor(w1 * .3)
    			}
				if (this.panX == -1) {
	    			this.panX = this.panXMax
	    		}
				if (this.panY == -1 ) {
	    			this.panY = this.panYMax
	    		}
				if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),Math.floor(h1* .7),0,-this.picWidth,this.picHeight ,this.picWidth  );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1* .7),Math.floor(h1 * .7),-this.picWidth,(this.picHeight ) * -1,this.picWidth,this.picHeight );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),Math.floor(h1* .7),-1 * (this.picHeight),0,this.picHeight ,this.picWidth  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1* .7) ,Math.floor(h1* .7),0,0,this.picWidth,this.picHeight);
	    		}
    			if (this.picWidth > this.picHeight) {
    				if (this.bS == false) {
	    				this.panX = this.panX + this.increment +1
	    				this.panY = this.panY + this.increment
	    				if (this.panX >= this.panXMax || this.panY >= this.panYMax) {
	    					this.panY = this.panY - 4
	    					this.panX = this.panX - 4
			        		this.bS = true
	    				}
    				}
    				if (this.bS == true) {
	    				this.panX = this.panX - this.increment - 1
	    				this.panY = this.panY - this.increment
	    				if (this.panX <=0 || this.panY <=0) {
	    					this.panY = 0
	    					this.panX = 0
			        		this.bS = false
	    				}
    				}
    			}
    			else {
    				if (this.bS == false) {
	    				this.panX = this.panX + this.increment
	    				this.panY = this.panY + this.increment + 1
	    				if (this.panX >= this.panXMax || this.panY >= this.panYMax) {
	    					this.panY = this.panY - 4
	    					this.panX = this.panX - 4
			        		this.bS = true
	    				}
    				}
    				if (this.bS == true) {
	    				this.panX = this.panX - this.increment
	    				this.panY = this.panY - this.increment - 1
	    				if (this.panX <=0 || this.panY <=0) {
	    					this.panY = 0
	    					this.panX = 0
			        		this.bS = false
	    				}
    				}
    			}
    			
    			
    			
    			
    			
    		}
    		else if (this.panMode == 3) {
    			//pan diagonal top right to bottom left
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panXMax = Math.floor(h1 * .3)
		    		    	this.panYMax = Math.floor(w1 * .3)
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panYMax = Math.floor(h1 * .3)
		    		    	this.panXMax = Math.floor(w1 * .3)
		    		    }
		    		}
    			}
    			else { 
    				this.panYMax = Math.floor(h1 * .3)
    				this.panXMax = Math.floor(w1 * .3)
    			}
    			
				if (this.panX == -1) {
	    			this.panX = 0
	    		}
				if (this.panY == -1 ) {
	    			this.panY = this.panYMax
	    		}
				if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),Math.floor(h1* .7),0,-this.picWidth,this.picHeight ,this.picWidth  );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1* .7),Math.floor(h1 * .7),-this.picWidth,(this.picHeight ) * -1,this.picWidth,this.picHeight );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),Math.floor(h1* .7),-1 * (this.picHeight),0,this.picHeight ,this.picWidth  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1* .7) ,Math.floor(h1* .7),0,0,this.picWidth,this.picHeight);
	    		}
    			if (this.picWidth > this.picHeight) {
    				if (this.bS == false) {
	    				this.panX = this.panX - this.increment -1
	    				this.panY = this.panY + this.increment
	    				if (this.panX <= 0 || this.panY >= this.panYMax) {
	    					this.panY = this.panY - 4
	    					this.panX = this.panX + 4
			        		this.bS = true
	    				}
    				}
    				if (this.bS == true) {
	    				this.panX = this.panX + this.increment + 1
	    				this.panY = this.panY - this.increment
	    				if (this.panX >= this.panXMax || this.panY <=0) {
	    					this.panY = 0
	    					this.panX = this.panXMax - 1
			        		this.bS = false
	    				}
    				}
    			}
    			else {
    				if (this.bS == false) {
	    				this.panX = this.panX - this.increment
	    				this.panY = this.panY + this.increment + 1
	    				if (this.panX <=0 || this.panY >= this.panYMax) {
	    					this.panY = this.panY - 4
	    					this.panX = this.panX + 4
			        		this.bS = true
	    				}
    				}
    				if (this.bS == true) {
	    				this.panX = this.panX + this.increment
	    				this.panY = this.panY - this.increment - 1
	    				if (this.panX >= this.panXMax || this.panY <=0) {
	    					this.panY = 0
	    					this.panX = this.panXMax - 1
			        		this.bS = false
	    				}
    				}
    			}
    		}
    		else if (this.panMode == 4) {
    		////Pan horizontal accross top
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panXMax = Math.floor(h1 * .3)
		    		    	if (w1> h) {
				    			xX = w1 * .60
				    			xX = xX / w1
				    			offY = h * xX
				    		}
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panXMax = Math.floor(w1 * .3)
		    				if (h1> h) {
				    			xX = h1 * .60
				    			xX = xX / h1
				    			offY = h * xX
				    		}
		    		    }
		    		}
    			}
    			else { 
    				this.panXMax = Math.floor(w1 * .3)
    				if (h1> h) {
		    			xX = h1 * .60
		    			xX = xX / h1
		    			offY = h * xX
		    		}
    			}
	    		if (this.panX == -1 ) {
	    			this.panX = this.panXMax
	    		}
	    		
	    		if (this.bS == false) {
		        	this.panX = this.panX + this.increment
		        	if (this.panX  >= this.panXMax) {
		        		this.panX = this.panX - 4
		        		this.bS = true
		        	}
		        }
		        else {
		        	this.panX = this.panX - this.increment
		        	if (this.panX <= 0) {
		        		this.panX = 0
		        		this.bS = false
		        	}
		        }
	    		if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),0,-this.picWidth,this.picHeight +(offY*2),this.picWidth  );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,-this.picWidth,(this.picHeight+ (offY*2) ) * -1,this.picWidth,this.picHeight+ (offY*2) );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),-1 * ( this.picHeight+(offY*2)),0,this.picHeight+(offY*2) ,this.picWidth  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
	    			c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,0,0,this.picWidth,this.picHeight + (offY*2));
	    		}
    		}
    		else if (this.panMode == 5) {
        		////Pan horizontal accross bottom
        			if (this.picRotate != 0) {
        				switch (this.picRotate) {
    		    		    case 1: case 3: {
    		    		    	this.panXMax = Math.floor(h1 * .3)
    		    		    	if (w1> h) {
    				    			xX = w1 * .60
    				    			xX = xX / w1
    				    			offY = h * xX
    				    		}
    		    		    	break;
    		    		    }
    		    		    case 2: {
    		    		    	this.panXMax = Math.floor(w1 * .3)
    		    				if (h1> h) {
    				    			xX = h1 * .60
    				    			xX = xX / h1
    				    			offY = h * xX
    				    		}
    		    		    }
    		    		}
        			}
        			else { 
        				this.panXMax = Math.floor(w1 * .3)
        				if (h1> h) {
    		    			xX = h1 * .60
    		    			xX = xX / h1
    		    			offY = h * xX
    		    		}
        			}
    	    		if (this.panX == -1 ) {
    	    			this.panX = this.panXMax
    	    		}
    	    		
    	    		if (this.bS == false) {
    		        	this.panX = this.panX + this.increment
    		        	if (this.panX  >= this.panXMax) {
    		        		this.panX = this.panX - 4
    		        		this.bS = true
    		        	}
    		        }
    		        else {
    		        	this.panX = this.panX - this.increment
    		        	if (this.panX <= 0) {
    		        		this.panX = 0
    		        		this.bS = false
    		        	}
    		        }
    	    		if (this.picRotate != 0) {
    	    			var angle = this.picRotate * 90
    	        		c.rotate(angle * Math.PI / 180)
    	    			if (this.picRotate == 1) {
    		    			c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),-1 * (offY*2),-this.picWidth,this.picHeight +(offY*2),this.picWidth  );
    		    		}
    	    			else if (this.picRotate == 2) {
    	    				c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,-this.picWidth,(this.picHeight) * -1,this.picWidth,this.picHeight+ (offY*2) );
    	    			}
    	    			else if (this.picRotate == 3) {
    	    				c.drawImage(this.img, (this.panY ), this.panX,w1,Math.floor(h1 * .7),-1 * ( this.picHeight),0,this.picHeight+(offY*2) ,this.picWidth  );
    	    			}
    	    			c.rotate((360 - angle) * Math.PI / 180)
    	    		}
    	    		else {
    	    			
    	    			c.drawImage(this.img, (this.panX ), this.panY,Math.floor(w1 * .7),h1,0,-1 * (offY*2),this.picWidth,this.picHeight + (offY*2));
    	    		}
        		}
    		else if (this.panMode == 6) {
    			//pan vertical on left
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panYMax = Math.floor(w1 * .3)
				    		if (h1> w ) {
				    			xX = h1 * .6
				    			xX = xX / h1
				    			offX = w * xX
				    		}
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panYMax = Math.floor(h1 * .3)
				    		if (w1> w ) {
				    			xX = w1 * .6
				    			xX = xX / w1
				    			offX = w * xX
				    		}
		    		    }
		    		}
    			}
    			else { 
	    			this.panYMax = Math.floor(h1 * .3)
		    		if (w1> w ) {
		    			xX = w1 * .6
		    			xX = xX / w1
		    			offX = w * xX
		    		}
    			}
    			if (this.panY == -1) {
    				this.panY = this.panYMax
	    		}
	    		if (this.bS == false) {
		        	this.panY = this.panY + this.increment
		        	if (this.panY  >= this.panYMax) {
		        		this.panY = this.panY - 4
		        		this.bS = true
		        	}
		        }
		        else {
		        	this.panY = this.panY - this.increment
		        	if (this.panY <= 0) {
		        		this.panY = 0
		        		this.bS = false
		        	}
		        }
	    		if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,0,-1 * (this.picWidth + (offX)),this.picHeight ,this.picWidth + (offX) );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,w1,Math.floor(h1 * .7),-1 * (this.picWidth+offX),(this.picHeight ) * -1,this.picWidth+ offX,this.picHeight );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,-1 * (this.picHeight ),0,this.picHeight ,this.picWidth+ (offX)  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
	    			c.drawImage(this.img, (this.panX ), this.panY,w1 ,Math.floor(h1* .7),0,0,this.picWidth+offX,this.picHeight);
	    		}
    		}
    		else if (this.panMode == 7) {
    			//pan vertical on right
    			if (this.picRotate != 0) {
    				switch (this.picRotate) {
		    		    case 1: case 3: {
		    		    	this.panYMax = Math.floor(w1 * .3)
				    		if (h1> w ) {
				    			xX = h1 * .6
				    			xX = xX / h1
				    			offX = w * xX
				    		}
		    		    	break;
		    		    }
		    		    case 2: {
		    		    	this.panYMax = Math.floor(h1 * .3)
				    		if (w1> w ) {
				    			xX = w1 * .6
				    			xX = xX / w1
				    			offX = w * xX
				    		}
		    		    }
		    		}
    			}
    			else { 
	    			this.panYMax = Math.floor(h1 * .3)
		    		if (w1> w ) {
		    			xX = w1 * .6
		    			xX = xX / w1
		    			offX = w * xX
		    		}
    			}
    			if (this.panY == -1) {
    				this.panY = this.panYMax
	    		}
	    		if (this.bS == false) {
		        	this.panY = this.panY + this.increment
		        	if (this.panY  >= this.panYMax) {
		        		this.panY = this.panY - 4
		        		this.bS = true
		        	}
		        }
		        else {
		        	this.panY = this.panY - this.increment
		        	if (this.panY <= 0) {
		        		this.panY = 0
		        		this.bS = false
		        	}
		        }
	    		if (this.picRotate != 0) {
	    			var angle = this.picRotate * 90
	        		c.rotate(angle * Math.PI / 180)
	    			if (this.picRotate == 1) {
		    			c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,0,-1 * (this.picWidth),this.picHeight ,this.picWidth + (offX) );
		    		}
	    			else if (this.picRotate == 2) {
	    				c.drawImage(this.img, (this.panX ), this.panY,w1,Math.floor(h1 * .7),-1 * (this.picWidth),(this.picHeight ) * -1,this.picWidth+ offX,this.picHeight );
	    			}
	    			else if (this.picRotate == 3) {
	    				c.drawImage(this.img, (this.panY ), this.panX,Math.floor(w1 * .7),h1,-1 * (this.picHeight ),-offX,this.picHeight ,this.picWidth+ (offX)  );
	    			}
	    			c.rotate((360 - angle) * Math.PI / 180)
	    		}
	    		else {
	    			c.drawImage(this.img, (this.panX ), this.panY,w1 ,Math.floor(h1* .7),-offX,0,this.picWidth+offX,this.picHeight);
	    		}
    		}
    	}
    	else {
    		//this.drawPicture(true)
    		//c.clearRect(0, 0, c.width, c.height);
    	}
	},
	verifyHexColor: function(inStr) {
		if (inStr.length < 6) {
			while (inStr.length < 6) {
				inStr =  "0" + inStr;
				
			};
		};
		return inStr
	},
	GetOffset: function (element, offset) {
        if( ! element )
            return;
       
        offset.y -= element.offsetTop;
        this.GetOffset(element.offsetParent, offset);
    },
    GetScrolled: function (element, offset) {
        if( ! element )
            return;
       
        if( element.scrollLeft != undefined ) {
            offset.y += element.scrollTop;
        };

        this.GetScrolled(element.parent, offset);
    }, 
	rendered: function() {
		this.inherited(arguments);
		this.img = new Image()
		if (this.autoLoad == true) {
			this.loadPicture();
		}
	},
	loadPicture: function (noDraw) {
		//this.img.src = "";
		if (this.useExtractFs == true) {
			var i = new Image()	
			i.onload = enyo.bind(this,function() {
			    			EXIF.getData(i, (enyo.bind(this,(function() {
			    				////this.log("I================>>>>>>" + this.name)
								this.doGotExif(i.exifdata);
							})))) 
						});

			i.exifdata = {};
		}
		

		this.img.onload = (enyo.bind(this,(function () {
			if (noDraw != true) {this.drawPicture()};
			var s = this.src.toLowerCase();
			////this.log(s)
		    if (s.indexOf(".jpg") >= 0 ||
		    	s.indexOf(".jpeg") >= 0) {
		    		
		    		if (this.panPic == true || this.img.src.indexOf("/var/luna/data/extractfs") >= 0) {
		    			
		    			/*s = this.src
		    			if (s.indexOf("/var/luna/data/extractfs") >= 0) {
							s =s.replace("/var/luna/data/extractfs", "");
							var x = s.indexOf(":0:0:");
							s = s.substr(0, x);
						}
						////this.log("!!!!!+=============>>>>>" + s)
						
		    			*/
		    			
					}
		    		else {
		    			this.img.exifdata = {};
						EXIF.getData(this.img, (enyo.bind(this,(function() {
							////this.log("THIS================>>>>>>" + this.name)
							this.doGotExif(this.img.exifdata);
						}))));
					}

		    };

		})));
		
		this.img.onerror = (enyo.bind(this,(function () {
			if (this.src.indexOf("/var/luna/data/extractfs") >= 0) {
				this.src = this.src.replace("/var/luna/data/extractfs", "");
				var x = this.src.indexOf(":0:0:");
				this.src = this.src.substr(0, x);
				this.loadPicture();
			}
			
		})))
		//if (this.panPic == true) {
		if (this.src == this.img.src && this.src.length > 0) {
			////this.log("src=")
			this.drawPicture()
		}
		else if (this.src.indexOf("/var/luna/data/extractfs") < 0 && this.src.indexOf("Thumbnail") < 0 && this.useExtractFs == true && this.src.length > 0 && this.src.substr(0,7) != "images/") {
			////this.log("extract")	
				i.src = this.src;
				this.img.src = "/var/luna/data/extractfs" +  this.src + ":0:0:1024:1024:2";	
			
		}
		else {
			////this.log("changed")
			if (this.src.indexOf("/var/luna/data/extractfs") >= 0 && this.src.indexOf("Thumbnail") >= 0) {
				var s = this.src
				s =s.replace("/var/luna/data/extractfs", "");
				var x = s.indexOf(":0:0:");
				s = s.substr(0, x);
				this.src = s
			}
			this.img.src = this.src;	
		}
		
		//enyo.nextTick(this, this.drawPicture);
	},
	clearPicture: function () {
		this.img.src = "";
		enyo.nextTick(this, this.drawPicture);
	},
	drawPicture: function (forceIt) {
		if (!this.hasNode()) {return;}
		this.hasNode();
		var can = this.node;
		var w = this.picWidth;
		var h = this.picHeight;
		can.width = w;
		can.height = h;
		var c = can.getContext('2d');
		var offY = 0;
        var offX = 0;
        var h1 = (this.img.height );
    	var w1 = (this.img.width );
    	////this.log(this.name + "DRAWPICTURE:" + this.panPic + "," + this.frozen)
    	if (((h1 > 0) && (w1 > 0) && (this.panPic == false )) || forceIt == true ) {
    		if (this.picRotate != 0) {
		    	switch (this.picRotate) {
	    		    case 1: case 3: {
	    		    	var j = w
	    		    	w = h
	    		    	h = j
	    		    	break;
	    		    }
	    		}
	    	};

    		if (this.stretch === false) {
		    	var xX = 0;
		    	
		    		
		        if ((h1 >= w1) && (h1>=h)) {
		        	xX = h1 - h;
		        	xX = xX / h1;
		        	w1 = w1 - (w1 * xX);
		        	offX = (w - w1) / 2;
		        	w = w1;
		        }
		        else if ((w1>= h1) && (w1>= w)) {
		        	xX = w1 - w;
		        	xX = xX / w1;
		        	h1 = h1 - (h1 * xX);
		        	offY = (h - h1) / 2;
		        	h = h1;
		        }
		        else {
		        	if ((h1 >= w1) ) {
			        	xX = h - h1;
			        	xX = xX / h1;
			        	w1 = w1 + (w1 * xX);
			        	offX = (w - w1) / 2;
			        	w = w1;
			        }
			        else if ((w1 >= h1) ) {
			        	xX = w - w1;
			        	xX = xX / w1;
			        	h1 = h1 + (h1 * xX);
			        	offY = (h - h1) / 2;
			        	h = h1;
			        }
		        	/*offX = (w - w1) / 2;
		        	offY = (h - h1) / 2;
		        	w = w1;
		        	h = h1;*/
		        }//}
    		}
    		//c.save()
    		if (this.picRotate != 0) {
    			
    			var angle = this.picRotate * 90
        		//c.translate((this.picWidth) * 0.5,( this.picHeight) * 0.5)
        		c.rotate(angle * Math.PI / 180)
        		//c.translate(-(this.picWidth) * 0.5,-( this.picHeight) * 0.5)
        		switch (angle) {
	        		case 90: {

	        	        c.drawImage(this.img,offX ,-1 * (h + offY) ,w,h);
	        			break;
	        		}
	        		case 180: {
	        			 c.drawImage(this.img,-1 * (w + offX) ,-1 * (h + offY) ,w,h);
	        			break;
	        		}
	        		case 270: {
	        			 c.drawImage(this.img,-1 * (w + offX) ,(offY) ,w,h);
	        			break;
	        		}
        		}
    			c.rotate((360-angle) * Math.PI / 180)
    		}
    		else {
    			c.drawImage(this.img, offX,offY,w,h);
    			//this.log(offX +", " + offY +", " + w +", " + h)
    		}

    		//c.restore()
    	}
    	else if ((h1 > 0) && (w1 > 0) && this.panPic == true) {
    		this.panImage() 
    	}
    	else {
    		c.clearRect(0, 0, c.width, c.height);
    	}
    	this.doPicLoaded();
	},
	setWidthAndHeight: function(w, h) {
		this.ROTATED = false
		this.picWidth = w;
		this.picHeight = h;
		enyo.nextTick(this, this.drawPicture);
	},
	drawText: function(stext, x, y, lineHeight) {
		this.hasNode();
		var can = this.node;
		var w = this.txtWidth;
		var h = this.txtHeight;
		//can.width = w;
		//can.height = h;
    	var c = can.getContext('2d');
		c.font=this.textFont;
		c.lineWidth=3;
		c.fillStyle=this.textColor;
		c.lineStyle="#880000";
		c.strokeStyle = "rgba(255, 0, 0 , 1)";
		
		fitWidth = w - 40;
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
		        words = sections[i].split(' ');
		        index = 1;
		        while (words.length > 0 && index <= words.length) {
		        	str = words.slice(0, index).join(' ');
		            wordWidth = c.measureText(str).width;
		            if (wordWidth > fitWidth) {
		                if (index === 1) {
		                    str = words.slice(0, 1).join(' ');
		                    words = words.splice(1);
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
		            printNextLine(words.join(' '));
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
		//this.setStyle("width:" + w + "px;height:" + h + "px;")
	}
});
