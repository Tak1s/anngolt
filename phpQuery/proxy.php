<?php 
    //   if (isDomainAvailible('http://api-fotki.yandex.ru/api/users/annagoltsberg/albums/'))
    require ('phpQuery.php');
    $url = $_GET['url'];
    
    $results_page = file_get_contents($url);
  
    $document = phpQuery::newDocument($results_page);

    echo $document;
?>