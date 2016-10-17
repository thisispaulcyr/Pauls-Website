<?php
/**
 *  pages/front-page.php
 */
namespace app;

$this->titleSet('Hello, this is Paul.', true);
?>
<div class="banner">
    <h1>Hello, this is Paul.</h1>
</div>
<div class="container clearfix">
    <h2>
        <span class="line">What can I do</span>
        <span class="line">for you?</span>
    </h2>
    <nav class="services">
        <div class="buttons">
            <a class="button web" href="<?php echo SITE_ROOT_URL . _('services'); ?>">
                <div class="image">
                    <div class="plane" aria-hidden="true"></div>
                </div>
                <div class="title">Website Design</div>
            </a>
            <a class="button it" href="<?php echo SITE_ROOT_URL . _('services'); ?>">
                <div class="image" aria-hidden="true">
                    <samp id="console-it" class="console">
                        <div class="ruler">
                            <span class="text">
                                <span>&nbsp;<br /></span>
                                <span>&nbsp;<br></span>
                                <span>&nbsp;<br></span>
                                <span><span class="text"><span class="heading">Systems:</span>&nbsp;Server design &amp; build, Redundancy &amp; disaster recovery, Windows Server 2012, RADIUS<br><span class="heading">Networking:</span>&nbsp;VPN, IPv6, DNS, DHCP, Ethernet (802.3), VLAN (802.1), Wireless (802.11)<br><span class="heading">Telephony:</span>&nbsp;PBX (Asterisk, FreePBX), VoIP/SIP, Trunking, IP phone provisioning<br><span class="heading">Languages:</span>&nbsp;PHP, Java, C, HTML5, JavaScript + jQuery, CSS3, XML, VBA, (Msft) Transact-SQL, MySQL</span><br></span>
                                <span>&nbsp;</span>
                            </span>
                        </div>
                        <span class="login" style="display:none;"><span class="prompt"><em>Login:</em></span> <span class="text"></span><br /></span>
                        <span class="password" style="display:none;"><span class="prompt"><em>Password:</em></span> <span class="text"></span><br /></span>
                        <span class="services cmd-show" style="display:none;"><span class="prompt">pcyr@srv1:~$</span> <span class="text"></span><br /></span>
                        <span class="services output" style="display:none;"><span class="text"></span><br /></span>
                        <span class="end-prompt" style="display:none;"><span class="prompt">pcyr@srv1:~$</span> </span>
                    </samp>
                </div>
                <div class="title">Small Business IT</div>
            </a>
        </div>
    </nav>
    <br />
    <h3>Something Else?</h3>
    <p>Whether you're looking to implement your digital plan or just trying to figure out where to begin, I'll work with you and your team on a reliable and easy-to-use solution that meets your goals.</p>
    <p><a href="<?php echo SITE_ROOT_URL . _('contact'); ?>">Contact me to get started.</a></p>
</div>
<script>
function defer() {
    if (window.jQuery) {
        $.getScript(SITE_ROOT + 'assets/js/page-front.min.js');        
    } else {
        setTimeout(function() { defer() }, 50);
    }
}
defer();
</script>