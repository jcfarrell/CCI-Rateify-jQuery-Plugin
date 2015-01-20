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
			 wwmLogo: false,
			 wwmType: 'box',
			 wwmPairs: ['Gold', 'Silver', 'EUR/USD', 'USD/CAD'],
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
					var columWidth = "33%";
					var fullWidth = "100%;";
				}
				else{
					var columWidth = settings.wwmWidth / 3 + "px";
					var fullWidth = settings.wwmWidth + "px";
				}
				if(settings.wwmLogo){
					parent.append("<div style='width: "+fullWidth+"'><center><img src='http://worldwidemarkets.co.uk/blog/wp-content/uploads/2013/12/WWMLogo.png'></center></div>");	
				}
				parent.append("<table class='stockTable' cellSpacing='0' style='width: "+fullWidth+"'><thead><th class='instrument' style='background-color:"+settings.wwmHeaderColor+"; width:"+columWidth+";'>Instrument</th><th class='bid' style='background-color:"+settings.wwmHeaderColor+"; width:"+columWidth+";'>Bid</th><th class='ask' style='background-color:"+settings.wwmHeaderColor+"; width:"+columWidth+";'>Ask</th></thead><tbody class='qBody'></tbody></table>");
            },
			
			// function build_pairs
			// @param parent: jQuery reference of DOM object
			// @description obtains and sets settings based on DOM and CSS properties.
			build_pairs: function(parent){
					settings.wwmPairs.forEach(function(pair){
						parent.find('[class^="qBody"]').each(function(){
							var id = pair.replace("/", "");
							$(this).append('<tr class="'+id+'"><td>'+pair+'</td><td id="'+id+'bid"></td><td id="'+id+'ask"></td></tr>');
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
							   
							   parent.append("<div id='wwm'>Powered by <a href='http://www.worldwidemarkets.com' target='_blank'>WorldWideMarkets - Online Trading</a></div>");
							 
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