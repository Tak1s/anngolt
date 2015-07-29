linkSpase = 
	link:{
		recent:[]
	}
	num:""
	album:""

_templ = (pattern, object) ->
	_template = Handlebars.compile($(pattern).html());
	return result = _template(object);

positionViewport = ->
	$("#viewport").height($("#maxphoto").height());


#Изменение размера фотографий рецент
resizeRecent = ->
	$("#content_recent.content .blockCenter .contentPhoto .img").height($(window).height()-140);
	# $("#content_recent.content .blockCenter .contentPhoto").width("auto");
	# DeveloperTool.Init().ReloadAllCSSThisPage();

#Вывод фото на екран
DisplayPhoto = (album_name)->
		_.each linkSpase.link[album_name], (linkPhoto)->
			$('#content_'+album_name+' .blockCenter').append(_templ('#addPhoto-template',{page:album_name, link:linkPhoto}));
		# setTimeout( ->
		resizeRecent();
		# , 1500);


#Центрирование фото в миниатюре    
positionPhotos = (link)->  
	console.log link           
	$(".photo_hide_"+link).each ->
		if($(this).width() > $(this).height())
			$(this).addClass("horizontalPozitionImg");
		else
			$(this).addClass("verticalPozitionImg");
	bindEvent(link);

request =
	#Запрос Json документов
	getJson: (setUrl, callback) ->
		$.ajax({
			type: "GET"
			url: "phpQuery/proxy.php"
			dataType:"json"
			data: {url:setUrl}
			success: (data)->
				callback(data);
			error: (err)->
				alert('error');
		});

	#Получение фотографий
	getLinkPhotos: (setUrl)->
		request.getJson setUrl, (result)->
			linkSpase.link[result.title] = [];
			_.each result.entries, (obj)->
				linkSpase.link[result.title].push(obj.img.XXXL.href);
			DisplayPhoto(result.title);
			
	#Получение альбомов
	album: (setUrl)->
		request.getJson setUrl+"?format=json", (result)->
			_.each result.entries, (obj)->
				request.getLinkPhotos(obj.links.photos);

	#Получение последних 15-и фотографий
	recent: (setUrl) ->
		request.getJson setUrl+"?format=json", (result)->
			_.each _.first(result.entries,15), (obj)->
				linkSpase.link.recent.push(obj.img.XXXL.href);
			$('#content_recent').fadeIn(1000);
			DisplayPhoto('recent');

	#Получение сервисного документа
	service: ->
		request.getJson "firstQuery", (result)->
			request.album(result.collections["album-list"].href);
			request.recent(result.collections["photo-list"].href);


$(document).ready ->
	
	$(".link a").on click: ->
		link = $(this).parent().attr("id");
		$('.content').fadeOut(400);
		setTimeout(->
			$('#content_'+link).fadeIn(400);
			if link != "recent" then positionPhotos(link) else resizeRecent()
		,400); 
	

request.service();
resizeRecent();

#Масштабирование изображений на главной
$(window).resize ->
	resizeRecent();
	#positionViewport();

#Перелистывание фотографий
# $(document).keydown ->
# 	if ((e.which == 37) || (e.keyCode == 37)) then prePhoto();
# 	if ((e.which == 39) || (e.keyCode == 39)) then nextPhoto();