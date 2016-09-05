<?php
/**
 *  pages/contact.php
 */
namespace app;

$this->titleSet('Contact');

$prov = [
    [['value' => '', 'attributes' => 'disabled="disabled" selected="selected"', 'label' => '&mdash;']],
    [
        'type' => 'group',
        'label' => 'Canada',
        'options' => ['AB','BC','MB','NB','NL','NS','NU','NW','ON','PE','QC','SK','YK'],
    ],
    [
        'type' => 'group',
        'label' => 'U.S.',
        'options' => ['AA', 'AE', 'AK', 'AL', 'AP', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'FM', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY']
    ]
];

$inputs = [
    'name-first' => [
        'class' => 'width-half',
        'input' => [
            'label' => _('First Name'),
            'inputmode' => 'latin-name',
            'spellcheck' => 'false',
            'maxlength' => '19',
            'autocomplete' => 'given-name',
            'required' => 'required',
            'pattern' => '^.*$'
        ]
    ],
    'name-last' => [
        'class' => 'width-half',
        'input' => [
            'label' => _('Last Name'),
            'inputmode' => 'latin-name',
            'spellcheck' => 'false',
            'minlength' => '2',
            'maxlength' => '19',
            'autocomplete' => 'family-name',
            'required' => 'required',
            'pattern' => '^.*$'
        ]
    ],
    'street-address' => [
        'input' => [
            'label' => _('Street Address'),
            'element' => 'textarea',
            'rows' => '2',
            'cols' => '40',
            'wrap' => 'hard',
            'spellcheck' => 'false',
            'maxlength' => '120',
            'autocomplete' => 'street-address'
        ]
    ],
    'city' => [
        'input' => [
            'label' => _('City'),
            'spellcheck' => 'false',
            'maxlength' => '40',
            'autocomplete' => 'address-level2',
            'pattern' => '.{3,40}'
        ]
    ],
    'prov' => [
        'input' => [
            'label' => _('Province / State'),
            'element' => 'select',
            'spellcheck' => 'false',
            'autocomplete' => 'address-level1',
            'options' => $prov
        ]
    ],
    'pcode' => [
        'input' => [
            'label' => _('Postal / Zip Code'),
            'inputmode' => 'verbatim',
            'spellcheck' => 'false',
            'maxlength' => '10',
            'autocomplete' => 'postal-code',
            'pattern' => '\w{2}[\w ]{0,8}'
        ]
    ],
    'email' => [
        'class' => 'width-half',
        'input' => [
            'label' => _('Email'),
            'type' => 'email',
            'required' => 'required',
            'maxlength' => '255',
            'autocomplete' => 'email'
        ]
    ],
    'tel' => [
        'input' => [
            'label' => _('Phone'),
            'type' => 'tel',
            'maxlength' => '25',
            'autocomplete' => 'tel',
            'pattern' => '^[\+(]?\d{1}[\d-() ]{2,20}$'
        ]
    ],
    'tel-ext' => [
        'input' => [
            'label' => '<abbr title="' . _('Telephone Extension') . '">' . _('Ext.') . '</abbr>',
            'type' => 'tel',
            'maxlength' => '5',
            'pattern' => '^\d{1,5}$'
        ]
    ],
    'subject' => [
        'input' => [
            'label' => _('Subject'),
            'inputmode' => 'latin-prose',
            'spellcheck' => 'true',
            'minlength' => '2',
            'maxlength' => '50',
            'required' => 'required',
            'pattern' => '^.{1,50}$'
        ]
    ],
    'message' => [
        'input' => [
            'label' => _('Message'),
            'element' => 'textarea',
            'spellcheck' => 'true',
            'inputmode' => 'latin-prose',
            'rows' => '5',
            'minlength' => '10',
            'maxlength' => '1500',
            'required' => 'required',
        ]
    ]
];

?>
<h2>Contact</h2>
<p>Email is the best way to get in contact with me, but you can also reach me by LinkedIn or phone.</p>
<span class="icon-type-contact icon-color-782bbb icon-size-26">
    <p><a href="mailto:web@thisispaul.ca?subject=Web%20Inquiry" class="icon email" target="_blank"><span class="image"></span><span>web&#x40;thisispaul&#x2E;&#x63;&#x61;</span></a></p>
    <p><a href="https://ca.linkedin.com/in/paulcyr1" target="_blank" class="icon linkedin"><span class="image"></span><span>My LinkedIn profile</span></a></p>
    <p><a href="tel:+1-226-476-1961" target="_blank" class="icon phone"><span class="image"></span><span>226-476-1961</span></a></p>
</span>
<br />
<div class="privacy">
    <a class="btn btn-default btn-xs" role="button" data-toggle="collapse" data-target="#privacypolicy" aria-expanded="false" aria-controls="privacypolicy">Privacy Policy</a>
    <div id="privacypolicy" class="collapse" style="margin-top: 1em; font-size: 75%;">
        <div class="container">
            <h3>Third-Parties</h3>
            <p>The personally-identifiable information you enter will be not be shared with any third-party unless you explicitly give me permission or it is implicitly required by a request of yours (e.g. setting up an account with a service provider).</p>
            <h3>Data Retention</h3>
            <p>A copy of the information you enter will be retained for my records, to contact you in response to your correspondance, or to contact you if you give permission to receive promotional emails.</p>
            <h3>Promotional Communication</h3>
            <p>I won't ever use the information you enter to send you promotional emails unless you explicitly opt-in to receiving promotional emails. Even then, any promotional email I send will contain a link for you to easily unsubscribe in accordance with <a href="http://www.crtc.gc.ca/ANTISPAM" target="_blank">Canada's Anti-Spam Legislation (CASL)</a>.</p> 
        </div>
    </div>
</div>
<br />
<p style="font-weight:400; font-size: 120%;">You can also use the form below to contact me.</p>
<form id="contact" class="contact" method="post">
    <p class="note"><dfn class="required">*</dfn> indicates a required field.</p>
    <fieldset class="submitter">
        <legend><?php _e('Your Information'); ?></legend>
        <fieldset class="name">
            <div class="webkit-fix">
                <?php
                outputInput('name-first', $inputs['name-first']);
                outputInput('name-last', $inputs['name-last']);
                ?>
            </div>
        </fieldset>
        <div class="email-tel">
            <div class="webkit-fix">
                <?php outputInput('email', $inputs['email']); ?>
                <fieldset class="tel">
                    <div class="webkit-fix">
                        <?php
                        outputInput('tel', $inputs['tel']);
                        outputInput('tel-ext', $inputs['tel-ext']);
                        ?>
                    </div>
                </fieldset>
            </div>
        </div>
        <fieldset class="address">
                <?php outputInput('street-address', $inputs['street-address']); ?>
            <div class="webkit-fix">
                <?php
                outputInput('city', $inputs['city']);
                outputInput('prov', $inputs['prov']);
                outputInput('pcode', $inputs['pcode']);
                ?>
            </div>
        </fieldset>
    </fieldset>
    <fieldset class="message">
        <legend><?php _e('Message'); ?></legend>
        <?php
        outputInput('subject', $inputs['subject']);
        outputInput('message', $inputs['message']);
        ?>
    </fieldset>
    <div class="sidebar">
        <fieldset class="opt-in">
            <div id="update-opt-in" class="form-group update-opt-in checkbox">
                <label>
                    <input id="input-update-opt-in" name="update-opt-in" type="checkbox" />
                    <?php _e('It is okay to send me promotional emails.'); ?>
                </label>
            </div>
        </fieldset>
        <fieldset class="submit">
            <div class="form-group captcha">
                <div id="g-recaptcha" class="recaptcha" data-sitekey="<?php echo CAPTCHA_SITE_KEY ?>"></div>
            </div>
            <input type="hidden" name="form" value="contact" />
            <input type="submit" name="submit" class="btn btn-primary btn-lg" />
        </fieldset>
    </div>
</form>
<script src="<?php echo SITE_ROOT_URL; ?>assets/js/page-contact.min.js"></script>