#buttonTypeAhead
=========================

  > As I'm still improving the plugin, the ReadMe is still quite empty. Don't be affraid to aske me anything through [twitter](https://twitter.com/PonteIneptique). 
  > This plugin has been developed by Thibault Clerice for Kings College of London eCerch
	
	
##What is buttonTypeAhead (BTA) for
BTA is at the crossing way of a enhanced select like chosen and an input typeahead. It provides you a typeahead which will look for an ajax source. Clicking on a typeahead value will drop either an hidden value in a span (Select multiple) or disable the input ( Select Single ).
The most interesting is that if you do want your user to save new datas, a save method is provided and will add it through ajax as well as a preexisting value.

##Dependencies
It's an only javascript plugin. It uses twitter bootstrap css and jquery javascript plugin.

##Call and Options

```js
$(el).btnTypeAhead({
	target : 'data-target', //Input Attr of Url Ajax Read json file
	aValue : 'id', // Attr used to retrieve id value on JSON Ajax Object
	aText : 'text', // Attr used to retrieve text value on JSON Ajax Object,
	query: 'queryz', // Get Parameters
	method : 'POST', // Method used to send input value
	StartOn : 5, // Minimum length to trigger ajax call,
	Save: false, // Enter send a prevent form post and post value to same or to saveUrl,
	saveUrl: 'data-save', //Input Attr of Url Ajax Write Json File, must use same key than trget file 
	timeBetween: 120, // Time between to save post,
	autoList: true, // Not used at the moment
	btnClass : 'btn btn-infos', // Class of your button
	listStyle:'unstyled', // Selected value list style
	btnStyle:'btn btn-primary', //Style of span used to show text value and hidden input with id value
	saveSentence : 'Type enter to save your value', // Default sentence when saving is true and no results are given
	single: false // Single choice or multiple choice
<<<<<<< HEAD
	});
=======
});
>>>>>>> Readme Commit and update js
```

Default value will basically call url given through **<input data-target="here" />** and will give a range of offers. It will read a json object **[{id : "DATA", text: "DATA"}, etc. ]**

<<<<<<< HEAD
##Preview
=======
##Preview // Screenshot
![Alt text](/mdFiles/preview.png "Screenshot")