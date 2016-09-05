<?php
/**
 *  includes/header.php
 */
?>
<!DOCTYPE html>
<!--[if lte IE 9]><html class="msie msie-old"" lang="en-CA"><![endif]-->
<!--[if gte IE 10]><!--><html lang="en-CA"><!--<![endif]-->
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title><?php $this->titleGet(); ?></title>
  <meta property="og:title" content="<?= $this->page_title ?>" />
  <meta property="og:site_name" content="<?= self::$site_title ?>" />
  <meta property="og:author" content="Paul Cyr" />
  <meta property="og:url" content="<?= $page->canonicalURL ?>" />
  <meta property="og:locale" content="en_UK" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:locale:alternate" content="en_CA" />
  
  <meta property="og:image" content="<?= SITE_ROOT_URL ?>assets/img/me1.jpg" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- JavaScript -->
  <script class="site-root">const SITE_ROOT = <?php echo json_encode(SITE_ROOT_URL); ?>;</script>
  <script src="<?php echo SITE_ROOT_URL; ?>assets/js/jquery-2.2.4.min.js"></script>
  <!-- CSS -->
  <link rel="stylesheet" href="<?php echo SITE_ROOT_URL; ?>assets/bootstrap/3.3.6/css/bootstrap.min.css" />
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,900,900italic,300italic,300,400italic,500,500italic,700,700italic|Lora:400,400italic,700,700italic&subset=latin,latin-ext" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="<?php echo SITE_ROOT_URL; ?>assets/picol/css/picol.css" />
  <link rel="stylesheet" href="<?php echo SITE_ROOT_URL; ?>assets/css/style.min.css" />
  <link rel="stylesheet" href="<?php echo SITE_ROOT_URL; ?>assets/css/loader.min.css" />
  <?= $this->head(); ?>
</head>
<body class="<?php echo $this->className(); ?>">
  <div class="overlay solid">
    <noscript>
      <style>
        .overlay noscript { font-size: 1.25rem; }
        .overlay noscript > div {
          z-index: 1;
          text-align: center;
        }
        .overlay noscript > div > p:first-child {
          margin-bottom:0.75em;
          font-size: 2em;
          font-weight:bold;         
        }
        .overlay noscript > div > p:last-child { margin-bottom:0; }
        .overlay noscript a { color: hsl(272, 63%, 45.1%); }
        .overlay noscript a:hover, .overlay noscript a:active { color: hsl(272, 63%, 14.7%); }
      </style>
      <div class="alert alert-warning" role="alert">
        <p>:(&emsp;</p>
        <p><?php _e('It appears that you don\'t have <a href="https://simple.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> turned on. JavaScript makes a lot of this site work, so it would be best if you viewed this site <a href="https://www.google.ca/search?q=how%20to%20enable%20javascript" target="_blank">with JavaScript enabled</a>.'); ?></p>
      </div>
    </noscript>
  	<div class="loading-animation" aria-hidden="true">
      <div class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
      </div>
    </div>
  </div>
  <header id="header" role="banner">
  	<div class="container clearfix">
      <nav id="header-nav-super" class="super icon-type-contact icon-color-fff icon-size-22" role="complementary">
      	<div class="container clearfix">
          <?php $this->menuSuper->generate(["set" => 0]); ?>
        </div>
      </nav>
      <nav id="header-nav-primary" class="primary" role="navigation">
        <div class="container clearfix">
      	 <a class="toggle" tabindex="1">&#9776; <?php _e('Menu'); ?></a>
      	 <?php $this->menuPrimary->generate(["offset" => 1]); ?>
        </div>
      </nav>
    </div>
  </header><!-- #header -->
  <main id="main" role="main">
    <div class="container">