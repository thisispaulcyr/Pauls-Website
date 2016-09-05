<?php
/**
 *  pages/login.php
 */
namespace app;

$this->titleSet('Client Login');

$inputs = [
    'email' => [
        'class' => 'width-full',
        'input' => [
            'label' => _('Email'),
            'type' => 'email',
            'required' => 'required',
            'maxlength' => 255,
            'autocomplete' => 'email'
        ]
    ],
    'password' => [
        'input' => [
            'label' => _('Password'),
            'type' => 'password',
            'inputmode' => 'verbatim',
            'spellcheck' => 'false',
            'maxlength' => 255,
            'autocomplete' => 'current-password',
        ]
    ],
];

?>
<div class="container">
    <h2>Client Login</h2>
    <form id="login-client" class="login client" method="post">
        <p class="note"><dfn class="required">*</dfn> indicates a required field.</p>
        <fieldset class="user-info">
            <?php
            outputInput('email', $inputs['email']);
            outputInput('password', $inputs['password']);
            ?>
        </fieldset>
        <fieldset class="submit">
            <input type="hidden" name="form" value="login" />
            <input type="submit" name="submit" class="btn btn-primary btn-lg" />
        </fieldset>
    </form>
</div>
<script src="<?php echo SITE_ROOT_URL; ?>assets/js/page-client_login.min.js"></script>