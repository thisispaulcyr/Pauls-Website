<?php
/**
 *  includes/foot.php
 */
?>
    </div><!-- .container -->
  </main><!-- #main -->
  <footer id="footer" >
  	<div class="container clearfix">
        <!-- These menus have aria-hidden="true" property because their content is provided in the document header (per WAI-ARIA 1.0 c.6 §6). -->
    	<nav id="footer-nav-super" class="super icon-type-contact icon-color-fff icon-size-64" role="complementary" aria-hidden="true">
            <div class="container clearfix">
                <?php $this->menuSuper->generate(["set" => -1]); ?>
            </div>
    	</nav>
    	<nav id="footer-nav-primary" class="primary" role="navigation" aria-hidden="true">
            <div class="container clearfix">
                <?php $this->menuPrimary->generate(["set" => -1]); ?>
            </div>
    	</nav>
    </div>
    <!-- Select icons by Picol (http://picol.org) licensed under CC BY 3.0 (http://creativecommons.org/licenses/by/3.0/) -->
  </footer><!-- #footer -->
  <!-- JavaScript -->
  <script src="<?php echo SITE_ROOT_URL; ?>assets/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <script src="<?php echo SITE_ROOT_URL; ?>assets/js/functions.min.js"></script>
  <script src="<?php echo SITE_ROOT_URL; ?>assets/js/js-cookie.min.js"></script>
  <?= $this->foot(); ?>
</body>
</html>