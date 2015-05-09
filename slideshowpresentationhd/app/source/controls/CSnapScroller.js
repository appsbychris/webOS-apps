/**
_enyo.SnapScroller_ is a scroller that snaps to the positions of the controls it contains.
When dragged, the scroller moves normally; when a drag is finished, the scroller snaps to the 
scroll position of the control closest to the dragged position.

Snapping can only occur along one axis at a time. By default this is the horizontal axis. SnapScroller has an HFlexLayout,
so its controls layout from left to right. Setting the layoutKind to VFlexLayout will enable
vertical snapping. Here's an example:

	{kind: "VFlexBox", components: [
		{kind: "SnapScroller", flex: 1, components: [
			{style: "background: red; width: 1000px;"},
			{style: "background: white; width: 1000px;"},
			{style: "background: blue; width: 1000px;"}
		]}
	]}

*/
enyo.kind({
	name: "CSnapScroller",
	kind: "BasicScroller",
	published: {
		/**
		Sets index to scroll directly (without animation) to the position of the
		control in scroller's list of controls at the value of index.
		*/
		index: 0
	},
	events: {
		/**
		Event that fires when the user finishes dragging and snapping occurs.
		*/
		onSnap: "",
		/**
		Event that fires when snapping and scroller animation completes.
		*/
		onSnapFinish: ""
	},
	//* @protected
	layoutKind: "HFlexLayout",
	dragSnapWidth: 20,
	// experimental
	revealAmount: 0,
	//
	create: function() {
		this.inherited(arguments);
		// adjust scroll friction
		this.$.scroll.kFrictionDamping = 1.5 //0.85;
	},
	layoutKindChanged: function() {
		this.inherited(arguments);
		this.scrollH = this.layoutKind == "HFlexLayout";
		var p = this.revealAmount + "px";
		this.$.client.applyStyle("padding", this.scrollH ? "0 "+p : p+" 0");
	},
	indexChanged: function() {
		var p = this.calcPos(this.index);
		if (p !== undefined) {
			this.scrollToDirect(p);
		}
	},
	/*flicking: false,
	flickHandler: function(inSender, e) {
		this.flicking = true
		this.inherited(arguments)
	},*/
	getCurrentPos: function() {
		return this.scrollH ? this.getScrollLeft() : this.getScrollTop();
	},
	vertStart: 0,
	scrollStart: function() {
		this.inherited(arguments);
		this.startPos = this.getCurrentPos();
		this.vertStart = this.getScrollTop();
		this.horStart = this.getScrollLeft();
	},
	scroll: function(inSender) {
		
		//if (!this.flicking) {
		//if ((Math.abs(inSender.y) - Math.abs(this.vertStart) ) < (Math.abs(inSender.x) - Math.abs(this.horStart))) {
			this.inherited(arguments);
			this.pos = this.getCurrentPos();
			// determine swipe prev or next
			this.goPrev = this.pos0 != this.pos ? this.pos0 > this.pos : this.goPrev;
			if (this.dragging) {
				this.snapable = true;
			} else if (this.snapable && this.startPos !== this.pos) {
				var bs = this.getBoundaries();
				
				if (this.pos > bs[this.scrollH ? "left" : "top"] && this.pos < bs[this.scrollH ? "right" : "bottom"]) {
					this.snapable = false;
					// within the scroll boundaries, e.g. not in overscroll
					this.snap();
				}
				else {
					this.log(bs.left)
					if (this.pos < bs.left) {
						this.log("LEFT")
						this.snapToView(0)
					}
					else {
						this.scrollToDirect(bs.right)	
					}
					
				}
			} else if (!this.snapping) {
				this.snapable = true;
			}
			this.pos0 = this.pos;
		//}
		//else {
		//}
		//}
	},
	scrollStop: function() {
		if (this.snapping) {
			this.snapping = false;
			if (this.index != this.oldIndex) {
				// scroll animation may not scroll to the exact pos, e.g. 1073 vs 1072.733952370556
				// force to scoll exactly to the exact pos
				var p = this.getCurrentPos();
				if (this.snapPos != p && Math.abs(this.snapPos - p) < 1) {
					this.log("SRCOLL STOP")
					this.scrollToDirect(this.snapPos);
				}
				this.snapFinish();
			}
			this.inherited(arguments);
		}
	},
	snapFinish: function() {
		this.doSnapFinish();
	},
	snapScrollTo: function(inPos) {
		this.snapPos = inPos;
		this.pos = inPos;
		this.snapping = true;
		this.snapable = false;
		if (this.scrollH) {
			this.scrollTo(0, inPos);
		} else {
			this.scrollTo(inPos, 0);
		}
	},
	autosnapping: false,
	scrollToDirect: function(inPos) {
		this.log(this.startPos + ", " + this.getScrollTop())
		this.calcBoundaries();
		this.stop();
		this.pos = inPos;
		/*newTop = this.getScrollTop()
		if (newTop > this.getScrollTop()) {
			newTop = newTop - 100
		}
		else {
			newTop = newTop + 100
		}*/
		//if (this.autosnapping == true) {
			if (this.scrollH) {
				this.setCustomScrollPositionDirect(inPos,  0);
			} else {
				this.setScrollPositionDirect(0, inPos);
			}
		/*}
		else {
			this.snapScrollTo(inPos)
			//this.start()
		}*/
		/*if (this.autosnapping == false) {
			var s = this.$.scroll
			//s.y = s.y0 = -newTop;
			s.setScrollPosition(-newTop)
			s.start()
			//this.scrollTop = newTop
		}*/
		this.autosnapping = false
	},
	setCustomScrollPositionDirect: function(inX, inY) {
		this.scrollTop = inY;
		this.scrollLeft = inX;
		// update ScrollStrategy positions
		var s = this.$.scroll;
		s.y = s.y0 = -this.scrollTop;
		s.x = s.x0 = -this.scrollLeft;
		this.start()
		//this.effectScroll();
	},
	// FIXME: may need a better test for which control to snap to, probably based on what 
	// direction you moved and how far from a snap edge you are.
	calcSnapScroll: function() {
		for (var i=0, c$ = this.getControls(), c, p; c=c$[i]; i++) {
			p = c.hasNode()["offset" + (this.scrollH ? "Left" : "Top")] - this.revealAmount;
			if (this.pos < p) {
				var l = this.scrollH ? c.hasNode().clientWidth : c.hasNode().clientHeight;
				var passMargin = Math.abs(this.pos + (this.goPrev ? 0 : l) - p) > this.dragSnapWidth;
				//this.log(this.dragSnapWidth)
				if (passMargin) {
					return this.goPrev ? i-1 : i;
				} else {
					return this.index;
				}
			}
		}
	},
	calcPos: function(inIndex) {
		var c = this.getControls()[inIndex];
		if (c && c.hasNode()) {
			return c.hasNode()["offset" + (this.scrollH ? "Left" : "Top")] - this.revealAmount;
		}
	},
	snap: function() {
		var i = this.calcSnapScroll();
		if (i !== undefined) {
			this.autosnapping = i == this.index ? false : true;
			this.snapToView(i);
		}
	},
	//* @public
	/**
	Scrolls to the position of the control contained in the scroller's list of controls at inIndex.
	*/
	snapTo: function(inIndex) {
		this.oldIndex = this.index;
		var p = this.calcPos(inIndex);
		if (p !== undefined) {
			this.index = inIndex;
			this.snapScrollTo(p);
			if (this.index != this.oldIndex) {
				this.doSnap(inIndex);
			}
		}
	},
	snapToView: function(inIndex) {
		this.oldIndex = this.index;
		var p = this.calcPos(inIndex);
		if (p !== undefined) {
			this.index = inIndex;
			//if (this.index != this.oldIndex) {
				this.doSnap(inIndex);
			/*	this.autosnapping = true
			}
			else {

				this.autosnapping = false
			}*/
			this.scrollToDirect(p);
		}
	},
	/**
	Scrolls to the control preceding (left or top) the one currently in view.
	*/
	previous: function() {
		!this.snapping && this.snapTo(this.index-1);
	},
	/**
	Scrolls to the control following (right or bottom) the one currently in view.
	*/
	next: function() {
		!this.snapping && this.snapTo(this.index+1);
	}
});

