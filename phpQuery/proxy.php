<?php 
    //   if (isDomainAvailible('http://api-fotki.yandex.ru/api/users/annagoltsberg/?format=json'))
    require ('phpQuery.php');
    $url = $_GET['url'];

    if ($url === "firstQuery"){
    	$url = "http://api-fotki.yandex.ru/api/users/annagoltsberg/?format=json";
    };
    
    $results_page = file_get_contents($url);
  
    $document = phpQuery::newDocument($results_page);

    echo $document;
?> 