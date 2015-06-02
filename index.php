<?php
$sToken = md5(session_id() . $_SERVER['REMOTE_ADDR']);
?><!Doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="x-ua-compatible" content="x-ua-compatible" />
<title>test</title>
<link rel="stylesheet" type="text/css" href="css/screen.css"/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBRKqsD1Nl2ULa7y2f5w9zCrc-Idl3VNwI&sensor=false&libraries=places"></script>
<script type="text/javascript" src="/js/gmap.js"></script>
</head>
<body class="index">
<div id="map-canvas"></div>
<div class="place-list">
    <ul class="list-group">
        <!--container  -->
    </ul>
</div>
</div>
</body>
</html>
