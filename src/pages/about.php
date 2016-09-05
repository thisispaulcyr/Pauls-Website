<?php
/**
 *  pages/about.php
 */
namespace app;

$this->titleSet('About');
?>
<h2>About Paul</h2>
<p>I'm a web designer, database builder, software developer, systems administrator, and staunch user of the Oxford comma, all rolled into one.</p>
<p>Things I like:</p>
<ul>
    <li>The <abbr title="Don't Repeat Yourself">DRY</abbr> principle</li>
    <li>Frameworks (i.e. jQuery, CakePHP)</li>
    <li><abbr title="Model-View-Controller">MVC</abbr> design</li>
    <li><a href="https://en.wikipedia.org/wiki/Scaffold_(programming)" target="_blank">Scaffolding</a></li>
    <li>Open APIs and interoperability</li>
    <li>Maintainable and extensible code</li>
</ul>
<p>I studied computer science at the University of Waterloo, and over the past six years, my passion has been writing code that is clean, reusable and maintainable, and designing and implementing back-end and end-user systems that are intuitive, seamless, and efficient.</p>
<p><a href="#portfolio">Check out some examples of my work</a>, below the outline of my areas of experience:</p>
<div class="msie-fallback msie-all edge-fallback clearfix" style="transform: translateX(-50%); left: 50%; margin: 2em 0;" aria-hidden="true">
    <abbr title="Web Accessibility Initiative – Accessible Rich Internet Applications" style="position: absolute; top: 25.95%; left: 37.6%; width: 8.65%; height: 2.35%; color: white;"></abbr>
    <?php echo image('skill-chart-fallback.png'); ?>
</div>
<?php
echo image(
    'skill-chart.svg',
    ['attributes' => ['class' => 'msie-disable msie-disable-all edge-disable skill-chart']]
);
?>
<div id="skill-chart-description" class="aria-description">
    <h1>Programming and Web Languages</h1>
    <ul>
        <li>PHP</li>
        <li>C</li>
        <li>Java</li>
        <li>HTML5, including <abbr title="Web Accessibility Initiative – Accessible Rich Internet Applications">WAI-ARIA</abbr></li>
        <li>CakePHP</li>
        <li>JavaScript</li>
        <li>jQuery</li>
        <li>CSS3</li>
        <li>XML</li>
    </ul>
    <h1>Databases</h1>
    <ul>
        <li>Transact-SQL (MS/Sybase)</li>
        <li>PostgreSQL</li>
        <li>MySQL</li>
        <li><abbr title="Microsoft">MS</abbr> Access</li>
    </ul>
    <h1>Systems, Networking, and Telephony</h1>
    <h2>Operating Systems</h2>
    <ul>
        <li>Windows Server 2012 and client editions</li>
        <li>OS X</li>
        <li>CentOS 7</li>
        <li>Raspbian</li>
    </ul>
    <h2><abbr title="Private Branch (Telephone) Exchange">PBX</abbr>s</h2>
    <ul>
        <li>Asterisk</li>
        <li>FreePBX</li>
        <li>IP phone provisioning</li>
    </ul>
    <h2><abbr title="Open Systems Interconnection model">OSI</abbr> components and <abbr title="Institute of Electrical and Electronics Engineers">IEEE</abbr> Protocols</h2>
    <ul>
        <li>
            <span id="802-1"><dfn aria-describedby="802-1">802.1</dfn> (LAN Management)</span>
        </li>
        <li>
            <span id="802-3"><dfn aria-describedby="802-3">802.3</dfn> (Ethernet)</span>
        </li>
        <li>
            <span id="802-11"><dfn aria-describedby="802-11">802.11</dfn> (Wireless LAN)</span>
        </li>
        <li><abbr title="Internet Protocol, version 6">IPv6</abbr></li>
        <li><abbr title="Virtual Private Network">VPN</abbr></li>
        <li><abbr title="Dynamic Host Configuration Protocol">DHCP</abbr></li>
        <li><abbr title="Domain Name Service">DNS</abbr></li>
        <li><abbr title="Internet Message Access Protocol">IMAP</abbr></li>
        <li><abbr title="Post Office Protocol 3">POP3</abbr></li>
        <li><abbr title="Remote Authentication Dial-In User Service">RADIUS</abbr></li>
        <li><abbr title="Simple Mail Transfer Protocol">SMTP</abbr></li>
        <li><abbr title="Session Initiation Protocol">SIP</abbr>/<abbr title="Voice over Internet Protocol">VoIP</abbr></li>
        <li><abbr title="Secure Shell">SSH</abbr></li>
        <li>Telnet</li>
    </ul>
    <h1>Content Management and Publishing</h1>
    <ul>
        <li>WordPress</li>
        <li>Illustrator</li>
        <li>Photoshop</li>
        <li>Microsoft SharePoint</li>
        <li><abbr title="Microsoft">MS</abbr> Access</li>
    </ul>
</div>
<h3 name="portfolio">Sample Projects</h3>
<?php 
imageGallery([
    'dms.png' => [
        'attributes' => [
            'title' => 'Data Management System',
            'data-description' => 'Built on <a href="http://cakephp.org/" target="_blank">CakePHP</a> and PostgreSQL, this under-development system uses a relational database to consolidate and filter millions of records of data for analysis by the client. It currently provides geographical groupings by region and postal code, allowing the client to drill down into selected datapoints for those records. Goals for the system include expanding the dataset to 16 tables, providing granular user access control, including access auditing, and adding statistical analysis to allow the client to simulate various scenarios in order to obtain desired outcomes.'
        ]
    ],
    'waterloo-ndp.png' => [
        'attributes' => [
            'title' => 'Waterloo NDP Association',
            'data-description' => 'This client requested an easy-to-manage website for their local political association. Built on PHP with WordPress, the responsive (smartphone-friendly) website includes various features such as an image slider &ndash; which the client can either customize or set to centrally-controlled image &ndash; a blog, integration with social media, an RSS feed from the central party website, and contact and engagement forms. See the next image for an example of the site\'s mobile view.',
            'data-url' => 'http://waterloondp.ca'
        ]
    ],
    'waterloo-ndp-mobile.png' => [
        'attributes' => [
            'title' => 'Waterloo NDP Association - Mobile',
            'data-description' => 'The mobile version of this client\'s website maintains all the functionality of the standard site with a design specifically for mobile devices such as smartphones and tablets. The design is "responsive" and requires no browser redirections or reloading in order to support both designs. See the previous image for a fuller description of the site and example of its standard view.',
            'data-url' => 'http://waterloondp.ca'
        ]
    ],
    'dearlove.png' => [
        'attributes' => [
            'title' => 'Cameron Dearlove for Waterloo Regional Council',
            'data-description' => 'This website was designed for a political candidate who required a professional and engaging website on a limited budget. Built on PHP with WordPress, the site includes an image slider, blog, and contact and engagement forms. The site also integrates with social media.',
            'data-url' => 'http://camerondearlove.ca'
        ]
    ],
    'better-choices.png' => [
        'attributes' => [
            'title' => 'Better Choices Waterloo Region',
            'data-description' => 'The design of this community organization\'s website was meant to provide a repository of information over a large number of pages, but with a simple and easy-to-navigate design. The website includes an image slider, a blog, integration with social media, and contact and engagement forms.',
            'data-url' => 'http://betterchoiceswr.ca'
        ]
    ],
    'holland.png' => [
        'attributes' => [
            'title' => 'Mary Rita Holland for Kingscourt&mdash;Rideau',
            'data-description' => 'This website was designed for a political candidate who required a professional and engaging website on a limited budget. Built on PHP with WordPress, the site includes an image slider, blog, and contact and engagement forms. The site also integrates with social media.',
            'data-url' => 'http://maryritaholland.ca'
        ]
    ]
]);
?>
<script src="<?php echo SITE_ROOT_URL; ?>assets/js/page-about.min.js"></script>