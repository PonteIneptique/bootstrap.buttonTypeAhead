(function($){
	//<-- Snippet from http://stackoverflow.com/questions/1318076/jquery-hasattr-checking-to-see-if-there-is-an-attribute-on-an-element
	$.fn.hasAttr = function(name) {  
	   return this.attr(name) !== undefined;
	};
	// -->
	
	$.fn.btnTypeAhead = function(options){
		var options = $.extend({
				target : 'data-target', //Input Attr of Url Ajax Read json file
				aValue : 'id', // Attr used to retrieve id value on JSON Ajax Object
				aText : 'text', // Attr used to retrieve text value on JSON Ajax Object,
				textParser:false, // false or function call back
				query: 'queryz', // Get Parameters
				method : 'POST', // Method used to send input value
				StartOn : 3, // Minimum length to trigger ajax call,
				Save: true, // Enter send a prevent form post and post value to same or to saveUrl,
				saveUrl: 'data-save', //Input Attr of Url Ajax Write Json File, must use same key than trget file 
				timeBetween: 120, // Time between to save post,
				btnClass : 'btn btn-infos', // Class of your button
				listStyle:'inline', // Selected value list style
				btnStyle:'btn btn-primary', //Style of span used to show text value and hidden input with id value
				saveSentence : 'Type enter to save your value', // Default sentence when saving is true and no results are given
				single: false // Single choice or multiple choice
			}
			,options);
				
		var that = this;
		var lastPost = 0;//$.now();
		
		that.each(function() {
			// The "this" points to the current select element:
			var input = $(this);
			/*Setting Ul Asbolute position */
			var position = input.position();
			var inTop = parseInt(position.top);
			var inLeft = parseInt(position.left);
			var height = parseInt(input.outerHeight());
			var top = inTop + height;
			
			//Save name and erase it 
			input.attr('data-name', input.attr('name'));
			input.removeAttr('name');
			var name = input.attr('data-name');
			var uid = name;
			//input.data("settings") improvments
			input.data("settings", options);
			input.data("settings", "uid", name);
			
			//Give infos to input
			input.addClass('btnTypeAhead-input-'+name);
			
			//Search attr for id field on json object
			if(input.attr('data-id-equivalent'))
			{
			$.extend({ aValue : input.attr('data-id-equivalent')}, input.data("settings"));
				input.data("settings", $.extend({ aValue : input.attr('data-id-equivalent')}, input.data("settings")));
			}
			
			//Search attr for text field on json object
			if(input.attr('data-text-equivalent'))
			{
				input.data("settings", $.extend({  aText : input.attr('data-text-equivalent') }, input.data("settings")));
			}
						
			//Search attr for list Style overing default
			if(input.attr('data-listStyle-equivalent'))
			{
				input.data("settings",$.extend({ listStyle  :  input.attr('data-listStyle-equivalent') }, input.data("settings")));
			}
			
			//Search attr for btn Style overing default
			if(input.attr('data-btnStyle-equivalent'))
			{
				input.data("settings", $.extend({  btnStyle  :  input.attr('data-btnStyle-equivalent') }, input.data("settings")));
			}
			
			//Search attr for single Style overing default
			if(input.attr('data-single-equivalent'))
			{
				input.data("settings", $.extend({ single : true }, input.data("settings")));
			}
			
			//Creating new DOM Elements : List of results && list of selected option
			var $aheadlist = $('<ul class="btnTypeAhead-ul btnTypeAhead-ul-'+uid+' typeahead dropdown-menu" uid="'+uid+'" style="display: none; min-width:'+input.outerWidth()+'px; top: '+top+'px; left:'+position.left+'px;"/>');
			if(input.parent().hasClass('input-prepend'))
			{
				input.parent().after($aheadlist);
				var ul = input.parent().next('ul');
			}
			else
			{
				input.after($aheadlist);
				var ul = input.next('ul');
			}
			
			var $buttonlist = $('<ul class="btnTypeAhead-selected btnTypeAhead-selected-'+uid+' '+input.data("settings").listStyle+'" uid="'+uid+'" style="margin-top:5px;" />');
			ul.after($buttonlist);
			var div = ul.next('ul');
			
			//Saving option
			if(input.data("settings").Save == true)
			{
				input.keypress(function(e){
					if( e.which == 13 )
					{
						e.preventDefault();
						
						//Set query
						query = {  };
						query[input.data("settings").query] = input.val();
						
						//Check time difference
						if(($.now() - lastPost) > input.data("settings").timeBetween)
						{
							$.ajax({
								method :input.data("settings").method,
								url: input.attr(input.data("settings").saveUrl),
								data: query,
								dataType: 'json'
							}).done(function(data) {
								//After Ajax auery success
								ul.hide();
								
								//Get the callback parser if setted	
								if (typeof input.data("settings").textParser == 'function') {								
									data[input.data("settings").aText] = input.data("settings").textParser(data[input.data("settings").aText]);
								}
									
								
								if(input.data("settings").single === false)
								{
									div.append('<li class="btnTypeAhead-li btnTypeAhead-li-'+uid+'"><span class="'+input.data("settings").btnStyle+'"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+data[input.data("settings").aValue]+'" /> '+data[input.data("settings").aText]+' <i class="icon-remove"></i></span></li>');
									input.val('')
								}
								else
								{
									if(input.parent('.input-prepend').length == 1)
									{
										input.parent('.input-prepend').addClass('input-append');
										input.attr('disabled', 'disabled').val(data[input.data("settings").aText]).after('<span class="add-on btnTypeAhead-add-on"><i class="icon-remove"></i></span>');
										$('.btnTypeAhead-selected-'+uid).append('<input type="hidden" class="'+name+'" name="'+name+'" value="'+data[input.data("settings").aValue]+'" />');
									}
									else
									{
										//Will see later
									}
								}
								
							});
							
						}
					}
					
				});
			}
			
			//Key Up Event
			input.keyup(function(e) {
				input = $(this);
				
				if((input.data("settings").Save == true) && (e.which == 13 ))
				{
					return false;
				}
				else
				{
					//Setting objects
					//<--
					// Query Data
					query = {  };
					query[input.data("settings").query] = input.val();
					//->
					if(input.val().length >= input.data("settings").StartOn)
					{
						$.ajax({
							method :input.data("settings").method,
							url: input.attr(input.data("settings").target),
							data: query,
							dataType: 'json'
						}).done(function(data) {
							//Cleaning Datas
							ul.find('li').remove();
							
							$.each( data, function( key, value ) {
								if($('.'+input.attr('data-name')+'[value="'+value[input.data("settings").aValue]+'"]').length == 0)
								{
									ul.append('<li><a href="#" class="btnTypeAhead-href btnTypeAhead-href-'+uid+'" data-value="'+value[input.data("settings").aValue]+'">'+value[input.data("settings").aText]+'</a></li>');
								}
							});
							
							if((ul.find('li').length == 0 ) && (input.data("settings").Save == true))
							{
								ul.append('<li>'+input.data("settings").saveSentence+'</li>');
							}
							
							//Check LEFT && TOP
							temppos = input.position();
							if(inTop != parseInt(temppos.top))
							{
								var inTop = parseInt(temppos.top);
								var top =  parseInt(temppos.top) + parseInt(input.outerHeight());
								ul.css('top', top);
							}
							
							if(inLeft != parseInt(temppos.left))
							{
								var inLeft = parseInt(temppos.left);
								var left =  parseInt(temppos.left);
								ul.css('left', left);
							}
							//
							
							//Show
							ul.show();
							
						});
				}
				}
			});
			
			input.click(function() {
				if(ul.find('li').length > 0 && (input.data("settings").single === false) && input.val().length > input.data("settings").StartOn)
				{
					//Check LEFT && TOP
					temppos = input.position();
					if(inTop != parseInt(temppos.top))
					{
						var inTop = parseInt(temppos.top);
						var top =  parseInt(temppos.top) + parseInt(input.outerHeight());
						ul.css('top', top);
					}
					
					if(inLeft != parseInt(temppos.left))
					{
						var inLeft = parseInt(temppos.left);
						var left =  parseInt(temppos.left);
						ul.css('left', left);
					}
					//-->
					
					ul.toggle();
				}
			});
			
			$(document).on('click', '.btnTypeAhead-href-'+input.data("settings").uid, function(e) {
				e.preventDefault();
				href = $(this);
				ul = href.parents('.btnTypeAhead-ul');
				
				input = input.data("settings").input;
				
				href.parent('li').remove();
				
				text = href.text();
				
				if (typeof input.data("settings").textParser == 'function') {								
					text = input.data("settings").textParser(text);
				}

				name = input.attr('data-name');
				if(input.data("settings").single == false)
				{
					
					$('.btnTypeAhead-selected-'+uid).append('<li class="btnTypeAhead-li btnTypeAhead-li-'+input.data("settings").uid+'"><span class="'+input.data("settings").btnStyle+'"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+href.attr('data-value')+'" /> '+text+' <i class="icon-remove"></i></span></li>');
				}
				else
				{
					if(input.parent('.input-prepend').length == 1)
					{
						input.parent('.input-prepend').addClass('input-append');
						input.attr('disabled', 'disabled').val(text).after('<span class="add-on btnTypeAhead-add-on"><i class="icon-remove"></i></span>');
						$('.btnTypeAhead-selected-'+uid).append('<input type="hidden" class="'+name+'" name="'+name+'" value="'+href.attr('data-value')+'" />');
					}
					else
					{
						//Will see later
					}
				}
				ul.hide();
				
				return false;
			});
			 
			$(document).on('click', '.btnTypeAhead-li-'+input.data("settings").uid+' .icon-remove', function() {
				$(this).parents('.btnTypeAhead-li').remove();
				return true;
			});
		});
		
		
		$(document).on('click', '.btnTypeAhead-add-on .icon-remove', function() {
			//Collecting dom objects
			addon = $(this).parent();
			input = addon.prev('input');
			name = input.attr('data-name');
			
			//Reenable
			input.attr('disabled', false);
			addon.remove();//Remove cross
			$('input[name="'+name+'"]').remove();//Remove hidden
			
			return true;
		});
	
		return that;
	};

})(jQuery);