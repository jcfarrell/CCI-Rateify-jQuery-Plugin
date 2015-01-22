/***           
                        _      _                   _                                _          _        
                       | |    | |          ( )    | |                              | |        | |       
 __      __ ___   _ __ | |  __| |__      __ _   __| |  ___  _ __ ___    __ _  _ __ | | __ ___ | |_  ___ 
 \ \ /\ / //   \ | '__|| | /  ` |\ \ /\ / /| | /  ` | / _ \| '_ ` _ \  /  ` || '__|| |/ // _ \| __|/ __|
  \ V  V /| ( ) || |   | || ( | | \ V  V / | || ( | ||  __/| | | | | || ( | || |   |   <|  __/| |_ \__ \
   \_/\_/  \___/ |_|   |_| \__,_|  \_/\_/  |_| \__,_| \___||_| |_| |_| \__,_||_|   |_|\_\\___| \__||___/
                                                                                                        
                                                                                                        
*  jQuery Plugin - WWM Rates "Rateify" Plugin
*  Animated live currency rates provided by WorldWideMarkets
*  version 0.1  |  2015.01.19
*  author: Jonathan Farrell
*
***/


(function($) {
    $.fn.rateify = function(method) {
		
        var defaults = {
			 //DEFAULT SETTINGS
			 wwmWidth: 300,
			 wwmHeaderColor: '#666',
			 wwmLogo: true,
			 wwmType: 'box',
			 wwmPairs: ['EUR/USD', 'USD/JPY', 'USD/CAD', 'GBP/USD'],
        }

        var settings = {}

        var methods = {
            init : function(options) {
                settings = $.extend({}, defaults, options)
                return this.each(function() {
                    var $element = $(this);
					helpers.remove_default($element);
					helpers.build_table($element);
					helpers.build_pairs($element);
					helpers.init_rates($element);
                });
            }
        }

        var helpers = {
			// function build_table
			// @param parent: jQuery reference of DOM object
			// @description Sets up the HTML with Correct DOM elements
			build_table: function(parent) {
				//ADD QUOTE BOX
				if(settings.wwmWidth == "responsive"){
					var columnWidth = "33%";
					var fullWidth = "100%;";
				}
				else{
					var columnWidth = settings.wwmWidth / 3 + "px";
					var fullWidth = settings.wwmWidth + "px";
				}
				
				
				if(settings.wwmType == "box"){
					if(settings.wwmLogo){
					parent.append("<div style='width: "+fullWidth+"'><center><img src='lib/logo.png'></center></div>");	
				}
					parent.append("<table class='stockTable' cellSpacing='0' style='width: "+fullWidth+"'><thead><th class='instrument' style='background-color:"+settings.wwmHeaderColor+"; width:"+columnWidth+";'>Instrument</th><th class='bid' style='background-color:"+settings.wwmHeaderColor+"; width:"+columnWidth+";'>Bid</th><th class='ask' style='background-color:"+settings.wwmHeaderColor+"; width:"+columnWidth+";'>Ask</th></thead><tbody class='qBody'></tbody></table>");
					parent.append("<div id='wwm'>Powered by <a href='http://www.worldwidemarkets.com' target='_blank'>WorldWideMarkets - Online Trading</a></div>");
				}
				
				else if (settings.wwmType == "scroll"){
						parent.append("<div id='marquee' class='wwm_quotes'><ul class='qBody'><li id='wwm' style='color:"+settings.wwmHeaderColor+"'>Powered by <a href='http://www.worldwidemarkets.com' target='_blank' style='color:"+settings.wwmHeaderColor+"'>WorldWideMarkets - Online Trading</a></li></ul></div>");
						parent.find('[class^="wwm_quotes"]').each(function(){
							$(this).css("width", fullWidth);
						});
					
				}
            },
			
			// function build_pairs
			// @param parent: jQuery reference of DOM object
			// @description obtains and sets settings based on DOM and CSS properties.
			build_pairs: function(parent){
					settings.wwmPairs.forEach(function(pair){
						if(settings.wwmType == "box"){
							parent.find('[class^="qBody"]').each(function(){
								var id = pair.replace("/", "");
								$(this).append('<tr class="'+id+'"><td>'+pair+'</td><td id="'+id+'bid"></td><td id="'+id+'ask"></td></tr>');
							});	
						}
						else if(settings.wwmType == "scroll"){
							
							parent.find('[class^="qBody"]').each(function(){
								
								var id = pair.replace("/", "");
								$(this).append('<li class="'+id+'">'+pair+' <span id="'+id+'bid"></span> / <span id="'+id+'ask"></span></li>');
								if(settings.wwmLogo){
									$(this).append("<li><img class='logo-cube' src='lib/logo-cube.png'></li>");	
								}
							});	
							
							
						}
					});
		
			},
			
			// function start_ticker
			// @param parent: jQuery reference of DOM object
			// @description Starts the scrolling marquee of quotes
			start_ticker: function(parent) {
				console.log(parent);
			parent.find('[class^="wwm_quotes"]').each(function(){
							$(this).marquee({
								//speed in milliseconds of the marquee
								duration: 6000,
								//gap in pixels between the tickers
								gap: 10,
								//time in milliseconds before the marquee will start animating
								delayBeforeStart: 0,
								//'left' or 'right'
								direction: 'left',
								//true or false - should the marquee be duplicated to show an effect of continues flow
								duplicated: true,
								pauseOnHover: true
							});	
						});
			
			 
			},
			
			// function init_rates
			// @param parent: jQuery reference of DOM object
			// @description Sets up actions and to events
			init_rates: function(parent) {
				
				$.when(
					$.getScript("https://reports.onlineglobalmarkets.com/TabWebStreamer/JavaScript/fm.js"),
					$.getScript("https://reports.onlineglobalmarkets.com/TabWebStreamer/JavaScript/fm.websync.js"),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
				var client = new fm.websync.client('https://reports.onlineglobalmarkets.com/TabWebStreamer/websync.ashx');
				client.connect( {

                            onSuccess: function(e){
								//alert("Connected to WebSync");
                            },

                            onFailure: function(e){
                                parent.append("Can't Connect to WebSync");
                                e.setRetry(false);
                            },

                            onStreamFailure: function(e){
                                parent.append("Streaming Failure");
                            }
                        });

                        client.subscribe({

                            channel: '/MARKET_DATA_GROUP_01',

                            onSuccess: function (e) {
                               
							   var arr = JSON.parse(e.getMetaJson()).split("|");
							   arr.forEach(function(pair){
								  var deets = pair.split(",");
								  var pairID = deets[0].replace("/","");
								  var bid = deets[1];
								  var ask = deets[2];
								  
								  if(deets[0] == "Gold" && deets.length > 4){
									  bid = deets[1]+","+deets[2];
									  ask = deets[3]+","+deets[4]
								  }
								  
								  parent.find('[id^="'+pairID+'bid"]').each(function(){
									  $(this).html(bid);
								  });
								  
								  parent.find('[id^="'+pairID+'ask"]').each(function(){
									  $(this).html(ask);
								  });
								  
							   });
							   
							  if(settings.wwmType == "scroll"){
								helpers.start_ticker(parent);	
							  }
							 
                            },

                            onFailure: function (e) {
                                parent.append("Subscription Failure");
                            },
                            onReceive: onMessage
                        });

				   function onMessage(message){
						
				       var arr = message.getData().split("|");
					   arr.forEach(function(pair){
						  var deets = pair.split(",");
						  var pairID = deets[0].replace("/","");
						  var bid = deets[1];
						  var ask = deets[2];
						  
						  if(deets[0] == "Gold" && deets.length > 4){
							  bid = deets[1]+","+deets[2];
							  ask = deets[3]+","+deets[4];
							  
							  var change = parseFloat(bid.replace(",","")) - parseFloat($("#"+pairID+"bid").html().replace(",",""));
						  }
						  else{
						 	 var change = bid - parseFloat($("#"+pairID+"bid").html());
						  }
						  
							if(change > 0){
								$("."+pairID).animate({color: 'green'}, 600 );
								setTimeout(function(){$("."+pairID).animate({color: '#333'}, 600 );}, 2500);
							}
							else if(change < 0){
								$("."+pairID).animate({color: 'red'}, 600 );
								setTimeout(function(){$("."+pairID).animate({color: '#333'}, 600 );}, 2500);
								
							}
							else{
								$("."+pairID).animate({color: '#333'}, 600 );
							}
						  
						  parent.find('[id^="'+pairID+'bid"]').each(function(){
							  $(this).html(bid);
						  });
						  
						  parent.find('[id^="'+pairID+'ask"]').each(function(){
							  $(this).html(ask);
						  });
							   });
	
           			}
				});
			},
			
			// function remove_default
			// @param parent: jQuery reference of DOM object
			// @description Removes the DOM element with the panel that is intended to appear when the plugin doesn't load.
			remove_default: function(parent){
				parent.find('#defaultwwm').empty();
				parent.find('#defaultwwm').remove();
				parent.addClass('wwm_quotes');
			},
			
        }

        // if a method as the given argument exists
        if (methods[method]) {

            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {

            // call the initialization method
            return methods.init.apply(this, arguments);

        // otherwise
        } else {

            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in Rateify plugin!');
        }
    }

})(jQuery);