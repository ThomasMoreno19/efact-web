<?php
$version = getenv('APP_ENV');

if ($version === 'local') {
  $version = time();
} else {
  $version = getenv('VERSION');
}

define('CACHE_TIME', 1800); // 30 min
define('APP_VERSION', $version);
