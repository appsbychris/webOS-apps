enyo.kind({
	name: "myScroller",
	kind: "Component",
	scrollTo:function(inIndex, scr){
		scr = scr.$.scroller;
		inIndex = inIndex - 2;
		if (inIndex < 0) {inIndex = 0;};
		var scrollSpot=0;
		for (var h in scr.heights) {
			if (h) {
				scrollSpot=scr.heights[h] * inIndex;
				break;
			}
		}
		this.log(scrollSpot)
		scr.$.scroll.setScrollPosition(-scrollSpot);
		scr.start();
		
	  },
	  scrollAhead:function(wndWidth, scr){
		scr = scr.$.scroller;
		
		this.log(scr.$.scroll.getScrollPosition())
		var x = scr.$.scroll.getScrollPosition()
		this.log(x + "," + scr.$.scroll.getRightBoundary())
		if (x > scr.$.scroll.getRightBoundary() - 2) {
			x = x - (wndWidth * 0.90)
			scr.$.scroll.setScrollPosition(x);
			scr.start();
		}
	  },
	  scrollBack:function(wndWidth, scr){
		scr = scr.$.scroller;
		
		this.log(scr.$.scroll.getScrollPosition())
		var x = scr.$.scroll.getScrollPosition()
		if (x < 0) {
			x = x + (wndWidth * 0.90)
			scr.$.scroll.setScrollPosition(x);
			scr.start();
		}
	  },
});