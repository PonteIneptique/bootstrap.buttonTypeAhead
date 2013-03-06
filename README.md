#buttonTypeAhead
=========================

##What is buttonTypeAhead (BTA) for
BTA is at the crossing way of a enhanced select like chosen and an input typeahead. It provides you a typeahead which will look for an ajax source. Clicking on a typeahead value will drop either an hidden value in a span (Select multiple) or disable the input ( Select Single ).
The most interesting is that if you do want your user to save new datas, a save method is provided and will add it through ajax as well as a preexisting value.

##Call and Options

				target : 'data-target', //Attr of Url Ajax Target
				aValue : 'id', // Attr used to retrieve id value on JSON Ajax Object
				aText : 'text', // Attr used to retrieve text value on JSON Ajax Object,
				query: 'queryz', // Get Parameters
				method : 'POST', // Method used to send input value
				StartOn : 5, // Minimum length to trigger ajax call,
				Save: true, // Enter send a prevent form post and post value to same or to saveUrl,
				saveUrl: 'data-save',
				timeBetween: 120, // Time between to save post,
				autoList: true,
				btnClass : 'btn btn-infos',
				listStyle:'unstyled',
				btnStyle:'btn btn-primary',
				saveSentence : 'Type enter to save your value',
				single: false // Single choice
