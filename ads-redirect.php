<?php
// Ezoic Ads.txt Redirect Script
// This script redirects ads.txt requests to Ezoic's ads.txt manager
// Replace [YOUR_DOMAIN].com with your actual domain name

// Get the domain from the request
$domain = $_SERVER['HTTP_HOST'];

// Redirect to Ezoic's ads.txt manager
header('Location: https://srv.adstxtmanager.com/19390/' . $domain, true, 301);
exit;
?>