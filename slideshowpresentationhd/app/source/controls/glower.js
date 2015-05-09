enyo.kind({
	name: "GlowRing",
	kind: "Control",
	published: {
		aniIndex: 0
	},
	flex:1,
	style: "position:absolute; top:200px; left:300px; z-index:100000;",
	showing: false,
	components: [
	    {kind:"Image", style:"width:280px;height:280px;", name: "img"}         
	],
	startAni: function() {
		this.center()
		this.setShowing(true)
		this.job = window.setInterval(enyo.hitch(this, "ani"), 100);
		//this.$.pic.start();
	},
	stopAni: function() {
		this.setShowing(false)
		window.clearInterval(this.job);
		//this.$.pic.stop();
	},
	center: function() {
		var x = window.screen.width
		var y = window.screen.height
		x = (x - 280 ) / 2
		y = (y - 280) / 2
		////enyo.log( x + "," + y)
		this.setStyle("position:absolute; top:"+ y + "px; left:" + x + "px; z-index:100000;")
	},
	ani: function() {
		this.$.img.setSrc("images/glow" + this.aniIndex.toString() + ".png")
		this.aniIndex++
		if (this.aniIndex > 7) { this.aniIndex = 0}
		this.$.img.render();
		//this.$.msg.setContent(this.message);
		//window.location.reload()
	}
	
	
});