(function($){
	$.fn.btnTypeAhead = function(options){
		var settings = $.extend({
				target : 'data-target', //Attr of Url Ajax Target
				aValue : 'uid_platform', // Attr used to retrieve id value on JSON Ajax Object
				aText : 'title_platform', // Attr used to retrieve text value on JSON Ajax Object,
				query: 'queryz', // Get Parameters
				method : 'POST', // Method used to send input value
				StartOn : 5, // Minimum length to trigger ajax call,
				Save: true, // Enter send a prevent form post and post value to same or to saveUrl,
				saveUrl: 'data-save',
				timeBetween: 120, // Time between to save post,
				autoList: true,
				saveSentence : 'Type enter to save your value'
			}
			,options);
				
		var that = this;
		var lastPost = 0;//$.now();
		that.each(function() {
			// The "this" points to the current select element:
			var input = $(this);
			var position = input.position();
			/*  */
			top = parseInt(position.top);
			height = parseInt(input.outerHeight());
			var top = top + height;
			
			var $aheadlist = $('<ul class="btnTypeAhead-ul typeahead dropdown-menu" style="display: none; width:'+input.outerWidth()+'px; top: '+top+'px; left:'+position.left+'px;"/>');
			input.after($aheadlist);
			
			var ul = input.next('ul');
			
			var $buttonlist = $('<ul class="btnTypeAhead-selected inline" style="margin-top:5px;" />');
			ul.after($buttonlist);
			var div = ul.next('ul');
			
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
								ul.hide();
								div.append('<li><span class="btn btn-infos"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+data[settings.aValue]+'" /> '+data[settings.aText]+' <i class="icon-remove"></i></span></li>');
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
					//Query Data
					query = {  };
					query[settings.query] = input.val();
					
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
								if($('.a-'+input.attr('name')+'[value="'+value.uid_platform+'"]').length == 0)
								{
									input.next('ul').append('<li><a href="#" class="btnTypeAhead-href" data-value="'+value[settings.aValue]+'">'+value[settings.aText]+'</a></li>');
								}
							});
							
							if((ul.find('li').length == 0 ) && (settings.Save == true))
							{
								input.next('ul').append('<li>'+settings.saveSentence+'</li>');
							}
							
							//Show
							ul.show();
							
						});
				}
				}
			});
			
			input.click(function() {
				if(ul.find('li').length > 0 )
				{
					ul.toggle();
				}
			});
		});
		
		$(document).on('click', '.btnTypeAhead-href', function(e) {
			e.preventDefault();
			href = $(this);
			ul = href.parents('.btnTypeAhead-ul');
			href.parent('li').remove();
			name = 'a-'+that.attr('name');
			ul.next('.btnTypeAhead-selected').append('<li><span class="btn btn-infos"><input type="hidden" class="'+name+'" name="'+name+'[]" value="'+href.attr('data-value')+'" /> '+href.text()+' <i class="icon-remove"></i></span></li>');
			
			ul.hide();
			
			return false;
		});
		
		$(document).on('click', '.btn > .icon-remove', function() {
			$(this).parent('.btn').remove();
			return true;
		});
	
		return that;
	};

})(jQuery);

$('input.btnTypeAhead').btnTypeAhead();