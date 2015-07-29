$(document).ready(function () {
        
    var linkSpase = {};
    linkSpase.link = {};
    linkSpase.num = '';
    linkSpase.album = '';
    
    
    Servis(); 
    
    $(window).resize(function(){//Масштабирование изображений на главной
         resizeRecent();
         positionViewport();
    });
    
    $(document).keydown(function (e) {//Перелистывание фотографий
            if ((e.which === 37) || (e.keyCode === 37)) {
                    prePhoto();
            }
            if((e.which === 39) || (e.keyCode === 39)){
                nextPhoto();
            }
        });
   
    var wDelta = 120;
    function scrollDoc(e) {
        resizeRecent();
        if (!e) e = event;
        if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
        var __delta = e.wheelDelta || -e.detail;
        __delta /= Math.abs(__delta);
        document.documentElement.scrollLeft -= __delta * wDelta; // FF, Opera, IE
        if (this.attachEvent) return false;
        document.body.scrollLeft -= __delta * wDelta; // Chrome
    };
    window.onload = function() {
        if(location.hash === '' || location.hash === '#recent'){
            var html = document.documentElement;
            if (html.attachEvent) {
                html.attachEvent("onmousewheel", scrollDoc); // IE and Opera
            } else {
                html.addEventListener("DOMMouseScroll", scrollDoc, false); // FF
                html.addEventListener("mousewheel", scrollDoc, false); // Chrome
            }
        };
    };
   
   
   function positionViewport(){
       positionCenter($("#maxphoto"));
       $("#viewport").height($("#maxphoto").height());
       valignCenter($("#viewport"));
   };
    
    positionCenter($("#menu"));
    valignCenter($("#footerLeft, #footerRight"));
    
    function valignCenter(elem){//Позиционирование по горизонтали
        elem.css({
           marginTop: '-' +elem.height() / 2 + 'px'
        });
    };
    
    function positionCenter(elem){//Позиционирование по центру
         elem.css({
            marginTop: '-' +elem.height() / 2 + 'px',
            marginLeft: '-' +elem.width() / 2 + 'px'
        });
    };
    
    $(".link").click(function(){//Переход по ссылкам
        var link = $(this).attr("id");
        $('.content').fadeOut(400);
        setTimeout(function(){
            $('#content_'+link).fadeIn(400);
            if(link !== "recent"){positionPhotos(link);} else {resizeRecent();};
        },400);      
    });
    
    function resizeRecent(){//Изменение размера фотографий рецент
        var sizePhoto = 0;
        $("#content_recent img").each(function(){             
            sizePhoto+= $(this).outerWidth(true);            
         });
           $("#content_recent").width(sizePhoto+1);
    };
    
    function addBlockPosition(page){//Обертывание в блоки для позиционирования
         $(".photo_hide_"+page).wrapAll("<div class='blockCenter' />");       
         $(".photo_hide_"+page).wrap("<div class='miniPhoto' />");
    };
    
    function DisplayPhoto(page){//Вывод фотографий на экран
        var template_addPhoto = Handlebars.compile( $('#addPhoto-template').html() );
        for(var link in linkSpase.link[page]){
            if(page === "recent") {
                $('#content_'+page).append(template_addPhoto({_page:page, _link: linkSpase.link[page][link], flag:true}));
            }else{
                // var template_Norecent = Handlebars.compile( $('#no_recent-template').html() );
                $('#content_'+page).append(template_addPhoto({_page:page, _link: linkSpase.link[page][link], flag:false}));
            };
        };
        if(page !== "recent"){
            addBlockPosition(page);
        }else{
            Visibl(page);
        };
     };
    
    function Visibl(page){//Включение видимости изображений
        $('img.photo_hide_'+page+':hidden:first').each(function(){
            $(this).fadeIn(800);
            setTimeout(function(){resizeRecent();},500);            
        });
   };
   
   function checkLink(album, link){
       var _album = album.split("_");
       linkSpase.album = _album[1];
       for(var num in linkSpase.link[_album[1]]){
           if(linkSpase.link[_album[1]][num] === link){
               linkSpase.num = num;
               return false;
           };
       };
   };
   
   function nextPhoto(){
       if(linkSpase.album !== '' || linkSpase.num !== ''){
           linkSpase.num++;
           var nextLink = linkSpase.link[linkSpase.album][linkSpase.num];
           if(nextLink === undefined){
               linkSpase.num = 0;
               nextLink = linkSpase.link[linkSpase.album][linkSpase.num];
           };
           $("#maxphoto").attr('src', nextLink);
           positionViewport();
       };
   };

   function prePhoto(){
      if(linkSpase.album !== '' || linkSpase.num !== ''){
           linkSpase.num--;
           var preLink = linkSpase.link[linkSpase.album][linkSpase.num];  
            if(preLink === undefined){
               linkSpase.num = linkSpase.link[linkSpase.album].length-1;
               preLink = linkSpase.link[linkSpase.album][linkSpase.num];
           };                   
           $("#maxphoto").attr('src', preLink);
           positionViewport();
       };
   };
   
   function bindEvent(link){//Вешаем обработчик
       $('.photo_hide_'+link).bind('click', function(){
              var _src = $(this).attr("src");               
              checkLink($(this).parents().parents().parents().attr("id"), _src);
              var template_fullPhoto = Handlebars.compile( $('#createfullPhoto_template').html() );
              $("body").append(template_fullPhoto({src:_src}));
              $("#wind_opacity").css({display: "block"});
             // positionCenter($("#maxphoto"));
              positionViewport();
              $("#wind_opacity, #wind_opacity .fa-times").bind('click', function(){
                  $("#wind_opacity").remove();
                  linkSpase.album = '';
                  linkSpase.num = '';
                  return false;
              });
              $("#viewport").bind('click', function(){
                  return false;
              });
              $("#arrowLeft").bind('click', function(){
                  prePhoto();
                  return false;
              });
              
              $('#arrowLeft').bind('keypress', function(e) 
                {
                     if(e.keyCode === 37)
                     {
                          prePhoto();
                          return false;
                     }
                });
                
              $("#arrowRight").bind('click', function(){
                  nextPhoto();
                  return false;
              });
              
              $('#arrowRight').bind('keypress', function(e) 
                {
                     if(e.keyCode === 39)
                     {
                          nextPhoto();
                          return false;
                     }
                });
                
              $("#maxphoto").bind('click', function(){
                  return false;
              });
              return false;
         });
   };
   
   function positionPhotos(link){ //Центрирование фото в миниатюре                 
        $(".photo_hide_"+link).each(function(){
            if($(this).width() > $(this).height()){
                $(this).css({width: "auto", height: "100%", left:"50%"});
                $(this).css({marginLeft: '-' +$(this).width() / 2 + 'px'});
            }else{
               $(this).css({width: "100%", height: "auto", top:"50%"});
               $(this).css({marginTop: '-' +$(this).height() / 2 + 'px'});
            };
        });
        bindEvent(link);
    };
    
    function Servis(){//Получение сервисного документа
        Get_xml('http://api-fotki.yandex.ru/api/users/annagoltsberg/?format=json', function(result){
            var ResultUrl = $(result).find('collection#album-list').attr('href');
            var RecentUrl = $(result).find('collection#photo-list').attr('href');
            Album(ResultUrl);
            Recent(RecentUrl);
        });
    };
    
    function Recent(setUrl){//Получение последних 15-и фотографий
        Get_xml(setUrl, function(result){
            linkSpase.link.recent = [];
            var CountRicent=0;
            $(result).find('entry').each(function(){
                if(CountRicent===15){return false;};
                    $(this).find('img').each(function(){
                        if($(this).attr('size') === 'XXXL'){
                            linkSpase.link.recent.push($(this).attr('href'));
                            return false;
                        };
                    });
                CountRicent++;
            });
            $('#content_recent').fadeIn(400);
            DisplayPhoto('recent');
        });
    };        
    
    function Album(setUrl){//Получение списка альбомов
        Get_xml(setUrl, function(result){
            var arrayPosition;
            $(result).find('entry').each(function(){
                arrayPosition = $(this).find('title').text();
                $(this).find('link').each(function(){
                    if($(this).attr('rel') === 'photos'){
                        getLinkPhotos($(this).attr('href'), arrayPosition);
                    };
                });
            });
        });
    };
    
   function getLinkPhotos(setUrl, arrayPosition){//Получение списка фотографий
        linkSpase.link[arrayPosition] = [];
        Get_xml(setUrl, function(result){
            $(result).find('entry').each(function(){
                    $(this).find('img').each(function(){
                        if($(this).attr('size') === 'XXXL'){                        
                            linkSpase.link[arrayPosition].push($(this).attr('href'));
                            return false;
                        };
                    });
            });
            DisplayPhoto(arrayPosition);
            console.log(linkSpase.link);
        });
    };
        
    function Get_xml(setUrl, callback){//Запрос XML документов
        $.ajax({
            type:'GET',
            url:"phpQuery/proxy.php",
            data:{url:setUrl},
            success: function(data){
                callback(data);
            },
            error: function(err){
                alert('error');
            }
        });
    };

});//end ready