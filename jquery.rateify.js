/***                                  _      _                   _                                _          _                                                                                                             
*  jQuery Plugin - CCI Rates "Rateify" Plugin
*  Animated live currency rates provided by CCI
*  version 0.1  |  2018.03.01
*  author: Jonathan Farrell
*
***/


(function($) {
    $.fn.rateify = function(method) {
		
        var defaults = {
			 //DEFAULT SETTINGS
			 cciWidth: 300,
			 cciHeaderColor: '#333',
			 cciLogo: true,
			 cciType: 'box',
			 cciPairs: ['BTC', 'ETH', 'XRP', 'BCH'],
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
					helpers.init_cci();
					helpers.init_rates($element);
					helpers.start_ticker($element);
                });
            }
        }

        var helpers = {
			// function build_table
			// @param parent: jQuery reference of DOM object
			// @description Sets up the HTML with Correct DOM elements
			build_table: function(parent) {
				//ADD QUOTE BOX
				if(settings.cciWidth == "responsive"){
					var columnWidth = "33%";
					var fullWidth = "100%;";
				}
				else{
					var columnWidth = settings.cciWidth / 3 + "px";
					var fullWidth = settings.cciWidth + "px";
				}
				
				
				if(settings.cciType == "box"){
					if(settings.cciLogo){
					parent.append("<div style='width: "+fullWidth+"'><center><img src='lib/logo.png'></center></div>");	
				}
					parent.append("<table class='cciTable' cellSpacing='0' style='width: "+fullWidth+"'><thead><th><b>CCI</b>10</th><th><b>CCI</b>25</th><th><b>CCI</b>50</th></thead><tr class='cci'><td id='cci10price'></td><td id='cci25price'></td><td id='cci50price'></td></tr></table>");
					parent.append("<table class='stockTable' cellSpacing='0' style='width: "+fullWidth+"'><thead><th class='instrument' style='background-color:"+settings.cciHeaderColor+"; width:"+columnWidth+";'>Symbol</th><th class='price' style='background-color:"+settings.cciHeaderColor+"; width:"+columnWidth+";'>Price</th><th class='change' style='background-color:"+settings.cciHeaderColor+"; width:"+columnWidth+";'>Change (24h)</th></thead><tbody class='qBody'></tbody></table>");
					parent.append("<div id='cci'>Powered by <a href='http://www.thecryptocoinindex.com' target='_blank'>Crypto Coin Index | www.thecryptopcoinindex.com</a></div>");
				}
				
				else if (settings.cciType == "scroll"){
						parent.append("<div id='marquee' class='cci_quotes'><ul class='qBody'><li id='cci' style='color:"+settings.cciHeaderColor+"'>Powered by <a href='http://www.thecryptocoinindex.com.com' target='_blank' style='color:"+settings.cciHeaderColor+"'>Crypto Coin Index | www.thecryptopcoinindex.com</a></li><li class='cci_scroll'><b>CCI</b>10: <span id='cci10price'></span></li><li class='cci_scroll'><b>CCI</b>25: <span id='cci25price'></span></li><li class='cci_scroll'><b>CCI</b>50: <span id='cci50price'></span></li></ul></div>");
						parent.find('[class^="cci_quotes"]').each(function(){
							$(this).css("width", fullWidth);
						});
					
				}
            },
			
			// function build_pairs
			// @param parent: jQuery reference of DOM object
			// @description obtains and sets settings based on DOM and CSS properties.
			build_pairs: function(parent){	
				settings.cciPairs.forEach(function(pair){
					if(settings.cciType == "box"){
						parent.find('[class^="qBody"]').each(function(){
							var id = pair.replace("/", "");
							$(this).append('<tr class="'+id+'"><td>'+pair+'</td><td id="'+id+'price"></td><td id="'+id+'change"></td></tr>');
						});	
					}
					else if(settings.cciType == "scroll"){
						parent.find('[class^="qBody"]').each(function(){
							var id = pair.replace("/", "");
							$(this).append('<li class="'+id+'">'+pair+': <span id="'+id+'price"></span> / <span id="'+id+'change"></span></li>');
							if(settings.cciLogo){
								$(this).append("<li><img class='logo-cube' src='lib/logo.png'></li>");	
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
			parent.find('[class^="cci_quotes"]').each(function(){
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

			// function cci_pricing
			// @param indexNum: variable for specific cci index
			// @description Calculates cci index
			cci_pricing: function(indexNum){
		    	var url="https://api.coinmarketcap.com/v1/ticker/?limit="+indexNum;
					
		    	jQuery.getJSON( url, function( data ) {
		        var cci_price = 0;
		        var cci_change = 0;
		        //jQuery("#recentTimestamp").html(new Date($.now()));
		        jQuery.each( data, function( key, val ) {
		          cci_price += parseFloat(val.market_cap_usd);
		        });
						
						var baseDiv = 2;
						if(indexNum == 10){baseDiv = 1270050924;}
						else if(indexNum == 25){baseDiv = 1352400115;}
						else if(indexNum == 50){baseDiv = 1399416738;}
						
		        cci_price = (cci_price / baseDiv).toFixed(2);
		        cci_price = "$"+cci_price.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				jQuery("#cci"+indexNum+"price").html(cci_price);
						
		      	});
 		 	},

 		 	// function init_cci
			// @param none
			// @description Setup cci indexes
			init_cci: function(){
				helpers.cci_pricing(10);
				helpers.cci_pricing(25);
				helpers.cci_pricing(50);
			},
			
			// function init_rates
			// @param parent: jQuery reference of DOM object
			// @description Sets up actions and to events
			init_rates: function(parent) {

				jQuery.getJSON( "https://api.coinmarketcap.com/v1/ticker/", function( data ) {

			  		//jQuery("#recentTimestamp").html(new Date(jQuery.now()));

					//set crypto pricing
					  jQuery.each( data, function( key, val ) {
					  	var price = parseFloat(val.price_usd).toFixed(2);
					  	price = "$"+price.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
							var market_cap = parseFloat(val.market_cap_usd).toFixed(2);
							market_cap = "$"+market_cap.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");	
							var percent_change_24h = parseFloat(val.percent_change_24h).toFixed(2);			
							var change_hour = "black";
							var change_day = "black";
							if(val.percent_change_1h > 0){
								 change_hour = "green";
							}
							else{
								change_hour = "red";
							}
							if(val.percent_change_24h > 0){
								 change_day = "green";
							}
							else{
								change_day = "red";
							}

							jQuery("#"+val.symbol+"price").html(price);
							jQuery("#"+val.symbol+"change").html("<span style='color:"+change_day+";'>"+percent_change_24h+"%</span>");
					  });
					});
				
			},
			
			// function remove_default
			// @param parent: jQuery reference of DOM object
			// @description Removes the DOM element with the panel that is intended to appear when the plugin doesn't load.
			remove_default: function(parent){
				parent.find('#defaultcci').empty();
				parent.find('#defaultcci').remove();
				parent.addClass('cci_quotes');
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