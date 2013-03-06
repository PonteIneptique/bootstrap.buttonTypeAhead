(function($){
	//<-- Snippet from http://stackoverflow.com/questions/1318076/jquery-hasattr-checking-to-see-if-there-is-an-attribute-on-an-element
	$.fn.hasAttr = function(name) {  
	   return this.attr(name) !== undefined;
	};
	// -->
	
	$.fn.btnTypeAhead = function(options){
		var settings = $.extend({
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
			}
			,options);
				
		var that = this;
		var lastPost = 0;//$.now();
		var uid = 0;
		
		that.each(function() {
			// The "this" points to the current select element:
			var input = $(this);
			/*Setting Ul Asbolute position */
			var position = input.position();
			var inTop = parseInt(position.top);
			var inLeft = parseInt(position.left);
			var height = parseInt(input.outerHeight());
			var top = inTop + height;
			var name = 'a-'+input.attr('name');
			++uid;
			
			//Give infos to input
			input.attr('uid', uid);
			input.addClass('btnTypeAhead-input-'+uid);
			
			//Search attr for id field on json object
			if(input.attr('data-id-equivalent') !== 0)
			{
				var id = input.attr('data-id-equivalent');
			}
			else
			{
				var id = settings.aValue; 
			}
			
			//Search attr for text field on json object
			if(input.attr('data-text-equivalent') !== 0)
			{
				var text = input.attr('data-text-equivalent');
			}
			else
			{
				var text = settings.aText;
			}
						
			//Search attr for list Style overing default
			if(input.attr('data-listStyle-equivalent'))
			{
				var listStyle = input.attr('data-listStyle-equivalent');
			}
			else
			{
				var listStyle = settings.listStyle;
			}
			
			//Search attr for btn Style overing default
			if(input.attr('data-btnStyle-equivalent'))
			{
				var btnStyle = input.attr('data-btnStyle-equivalent');
			}
			else
			{
				var btnStyle = settings.btnStyle;
				input.attr('data-btnStyle-equivalent', btnStyle);
			}
			
			//Search attr for single Style overing default
			if(input.attr('data-single-equivalent'))
			{
				var single = input.attr('data-single-equivalent');
			}
			else
			{
				var single = settings.single;
				input.attr('data-single-equivalent', single);
			}
			
			//Creating new DOM Elements : List of results && list of selected option
			var $aheadlist = $('<ul class="btnTypeAhead-ul btnTypeAhead-ul-'+uid+' typeahead dropdown-menu" uid="'+uid+'" style="display: none; width:'+input.outerWidth()+'px; top: '+top+'px; left:'+position.left+'px;"/>');
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
			
			var $buttonlist = $('<ul class="btnTypeAhead-selected btnTypeAhead-selected-'+uid+' '+listStyle+'" uid="'+uid+'" style="margin-top:5px;" />');
			ul.after($buttonlist);
			var div = ul.next('ul');
			
			//Saving option
			if(settings.Save == true)
			{
				input.keypress(function(e){
					if( e.which == 13 )
					{
						e.preventDefault();
						
						//Set query
						query = {  };
						query[settings.query] = input.val();
						
						//Check time difference
						if(($.now() - lastPost) > settings.timeBetween)
						{
							$.ajax({
								method :settings.method,
								url: input.attr(settings.saveUrl),
								data: query,
								dataType: 'json'
							}).done(function(data) {
								//After Ajax auery success
								ul.hide();
								if(single === false)
								{
									div.append('<li><span class="'+btnStyle+'"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+data[id]+'" /> '+data[text]+' <i class="icon-remove"></i></span></li>');
								}
								else
								{
									if(input.parent('.input-prepend').length == 1)
									{
										input.parent('.input-prepend').addClass('input-append');
										input.attr('disabled', 'disabled').val(data[text]).after('<span class="add-on btnTypeAhead-add-on"><i class="icon-remove"></i></span>');
										$('.btnTypeAhead-selected-'+uid).append('<input type="hidden" class="'+name+'" name="'+name+'" value="'+data[id]+'" />');
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
				if((settings.Save == true) && (e.which == 13 ))
				{
					return false;
				}
				else
				{
					//Setting objects
					//<--
					// Query Data
					query = {  };
					query[settings.query] = input.val();
					//->
					
					if(input.val().length >= settings.StartOn)
					{
						$.ajax({
							method :settings.method,
							url: input.attr(settings.target),
							data: query,
							dataType: 'json'
						}).done(function(data) {
							//Cleaning Datas
							ul.find('li').remove();
							
							$.each( data, function( key, value ) {
								if($('.a-'+input.attr('name')+'[value="'+value[id]+'"]').length == 0)
								{
									// alert(value.uid_feature);
									ul.append('<li><a href="#" class="btnTypeAhead-href btnTypeAhead-href-'+uid+'" data-value="'+value[id]+'">'+value[text]+'</a></li>');
								}
							});
							
							if((ul.find('li').length == 0 ) && (settings.Save == true))
							{
								ul.append('<li>'+settings.saveSentence+'</li>');
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
				if(ul.find('li').length > 0 && (single === false))
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
		});
		
		$(document).on('click', '.btnTypeAhead-href', function(e) {
			e.preventDefault();
			href = $(this);
			ul = href.parents('.btnTypeAhead-ul');
			uid = ul.attr('uid');
			input = $('input.btnTypeAhead-input-'+uid);
			href.parent('li').remove();
			
			name = 'a-'+input.attr('name');
			if(input.attr('data-single-equivalent') === "false")
			{
				$('.btnTypeAhead-selected-'+uid).append('<li class="btnTypeAhead-li btnTypeAhead-li-'+uid+'"><span class="'+input.attr('data-btnStyle-equivalent')+'"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+href.attr('data-value')+'" /> '+href.text()+' <i class="icon-remove"></i></span></li>');
			}
			else
			{
				if(input.parent('.input-prepend').length == 1)
				{
					input.parent('.input-prepend').addClass('input-append');
					input.attr('disabled', 'disabled').val(href.text()).after('<span class="add-on btnTypeAhead-add-on"><i class="icon-remove"></i></span>');
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
		 
		$(document).on('click', '.btnTypeAhead-li .icon-remove', function() {
			$(this).parents('.btnTypeAhead-li').remove();
			return true;
		});
		
		$(document).on('click', '.btnTypeAhead-add-on .icon-remove', function() {
			//Collecting dom objects
			addon = $(this).parent();
			input = addon.prev('input');
			name = 'a-'+input.attr('name');
			
			//Reenable
			input.attr('disabled', false);
			addon.remove();//Remove cross
			$('input[name="'+name+'"]').remove();//Remove hidden
			
			return true;
		});
	
		return that;
	};

})(jQuery);

$('input.btnTypeAhead').btnTypeAhead();