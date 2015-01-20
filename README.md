Rateify
=======

Animated live currency rates provided by WorldWideMarkets.

Features
-------- 
* Customizable
* Set width or responsive width
* Custom header colors
* Option to display or remove WWM logo
* Select custom currency pairs
* Insert multiple rates per page

Setting Up
----------
The Rateify plugin relies on a div tag with specific id to generate the rates pane.

Include the two .css files at the top of your document.
Include the three .js files at the close of your head tag.
Place the div within your html document wherever you’d like it to display.

Call the “rateify” method on your div:
    <script type="text/javascript">
    jQuery(document).ready(function() {
        jQuery('#rates').rateify();							
    });
    </script>

This script tag should go before the close of your <head> tag but after the scripts you imported above.

Check out sampleusage.html for an example of basic usage.


Customization
-------------
The Rateify plugin is highly customizable. You can override the default settings of the plugin by passing parameters

	jQuery('#rates').rateify({
		'wwmWidth': 300,   		
    		'wwmHeaderColor': '#666',	
    		'wwmLogo': false,	  	
    		'wwmType': 'box',		
    		'wwmPairs': ['Gold', 'Silver', 'EUR/USD', 'USD/CAD']
	});

* wwmWidth: Custom width as a number. Use 300 for 300px wide. For full width user ‘responsive’.
* wwmHeaderColor: Custom color for header (hex value). Note: Font color will be white.
* wwmLogo: true to display a WWM logo, false for no logo
* wwmPairs: The currency pairs you’d like this instance to subscribe to. Valid pairs are: Gold, Silver, USD/JPY, USD/CHF, GBP/USD, USD/CAD, EUR/USD, AUD/USD, GBP/JPY, UR/JPY