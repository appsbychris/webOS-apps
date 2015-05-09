enyo.kind({
   name:"BaseApp",
   kind:"Component",
   appWindow:null,
   dockWindow:null,
   components:[
      {kind: "ApplicationEvents", onLoad:"onload", onUnload:"unload",
      onApplicationRelaunch: "onload"/*,
      onWindowParamsChange: "windowParamsChangeHandler"*/},
   ],
   create:function(){
      this.inherited(arguments);
      //enyo.log();
   },
   windowParamsChangeHandler: function() {
      if(enyo.windowParams.cmd == "unload"){
    	  //enyo.log(enyo.windowParams.source+" closed");
         if(enyo.windowParams.source == "SlideShowApp" || enyo.windowParams.source == "AppView"){
            this.appWindow = null;
            //this.destroy()
         }
         if (enyo.windowParams.source == "exhib" || enyo.windowParams.source == "ExhibitionView") {
            this.dockWindow = null;
            //this.destroy()
         }
      }
   },
   onload:function(){
	   //enyo.log(enyo.windowParams);
      if (enyo.windowParams && enyo.windowParams.windowType == "dockModeWindow" && enyo.windowParams.dockMode == true) {
         if(this.dockWindow){
        	 //enyo.log("dock view exists")
            enyo.windows.activateWindow(this.dockWindow);
         }else 
            this.dockWindow = enyo.windows.openWindow("exhibitionview.html","ExhibitionView",{params: {exhibition: true}},{window:"dockMode"});
         
      }else{
         if(this.appWindow){
         //   //enyo.log("app view exists")
           enyo.windows.activateWindow(this.appWindow);
        }else 
            this.appWindow = enyo.windows.openWindow("appview.html","AppView",{}); /*appview.html*/
         
         }
   },
   appRelaunch:function(){
	   //enyo.log();
   },
   unload:function(){
	   //enyo.log();
   }
})