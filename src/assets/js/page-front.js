// front-page.js
var i=0;
(function page() {
    if (typeof tip !== 'object') {
        i++;
        if (i<=25) { setTimeout(function() { page(); }, 100); }
        else { throw 'dependency error: Required object \'tip\' is missing.' }
        return;
    }

    tip.page.create('front', function() {$(window).off('resize.typedIT');});

    tip.page.front.css = new tip.PageCSS();
    
    // Console typing for IT button
    tip.page.front.typing = function() {

        var selector = '#console-it';

        if(typeof $(selector).data('typed') === 'object') return;

        var execTimerTriggered = false,
            typedSettings = {
                showCursor: true,
                cursorChar: "&ensp;",
                typeSpeed: 50,
                onKeystroke: function() { $(selector).scrollTop(1000); },
            }

        function _1_login() {
            var settings = Object.assign(typedSettings, {
                startDelay: 3000,
                strings: ["pcyr"],
                callback: function() { setTimeout(_2_password, 700); }
            });
            $('.login', selector).css('display', '');
            $('.login > .text', selector).first().typed(settings);
        }
        function _2_password() {
            var settings = Object.assign(typedSettings, {
                startDelay: 1500,
                strings: ["**********"],
                callback: function() { setTimeout(_3_prompt, 700); }
            });
            $('.typed-cursor', selector).remove();
            $('.password', selector).css('display', '');
            $('.password .text', selector).first().typed(settings);
        }
        function _3_prompt() {
            var listPrint = false;
            $('.typed-cursor', selector).remove();
            $('.services.cmd-show .text', selector).append('<span class="typed-cursor">&ensp;</span>');
            $('.services.cmd-show', selector).css('display', '');
            $(selector).closest('.button').on('mouseover.console-it' , function() {
                $(selector).closest('.button').off('focus.console-it');
                $(selector).closest('.button').off('mouseover.console-it');
                if (!listPrint) {
                    listPrint = true;
                    _4_servicesShow();
                }
            });
            $(selector).closest('.button').on('focus.console-it' , function() {
                $(selector).closest('.button').off('focus.console-it');
                $(selector).closest('.button').off('mouseover.console-it');
                if (!listPrint) {
                    listPrint = true;
                    _4_servicesShow();
                }
            });
        }
        function _4_servicesShow() {
            var settings = Object.assign(typedSettings, {
                strings: ['services show summary'],
                typeSpeed: 65,
                callback: function() { setTimeout(_5_servicesOutput, 700); }
            });
            $('.typed-cursor', selector).remove();
            $('.services.cmd-show .text', selector).typed(settings); 
        }
        function _5_servicesOutput() {
            var settings = Object.assign(typedSettings, {
                strings: ['<span class="heading">Systems:</span> Server design &amp; build, Redundancy &amp; disaster recovery, Windows Server 2012, RADIUS<br /><span class="heading">Networking:</span> VPN, IPv6, DNS, DHCP, Ethernet (802.3), VLAN (802.1), Wireless (802.11)<br /><span class="heading">Telephony:</span> PBX (Asterisk, FreePBX), VoIP/SIP, Trunking, IP phone provisioning<br /><span class="heading">Languages:</span> PHP, Java, C, HTML5, JavaScript + jQuery, CSS3, XML, VBA, (Msft) Transact-SQL, MySQL'],
                typeSpeed: 0.01,
                callback: _6_promptEnd
            });
            $('.typed-cursor', selector).remove();
            $('.services.output', selector).css('display', '');
            $('.services.output .text', selector).typed(settings);
        }
        function _6_promptEnd() {
            $('.typed-cursor', selector).remove();
            $('.end-prompt', selector).append('<span class="typed-cursor">&ensp;</span>');
            $('.end-prompt', selector).css('display', '');
        }
        function exec() {
            var child = $(selector);
            (function consoleSize() {
                child.css('width', '');
                child.css('padding-right', '');
                var rulerWidth = $('.ruler', child).width()
                var parent = child.parent();
                var parentWidth = parent.width();
                var newWidth = 1.96*parentWidth - rulerWidth;
                child.css('overflow-y', 'hidden');
                child.css('width', newWidth);
                child.css('padding-right', parentWidth-rulerWidth);
                child.css('overflow-y', 'scroll');
            })();
            (function textSize() {
                var containerHeight = $(selector).height();
                var text = $('.ruler .text', selector);
                var textHeight = text.height();
                if (containerHeight == 0) {
                    setTimeout(exec, 100);
                    return;
                }
                if(textHeight < containerHeight) {
                    while (textHeight < containerHeight) {
                        text.css('font-size', (parseFloat(text.css('font-size'))+0.05)+'px');
                        var textHeight = text.height();
                    };
                    text.css('font-size', (parseFloat(text.css('font-size'))-0.05)+'px');
                } else if (textHeight > containerHeight) {
                    while (textHeight > containerHeight) {
                        text.css('font-size', (parseFloat(text.css('font-size'))-0.05)+'px');
                        var textHeight = text.height();
                    };
                }
                $(selector).css('font-size', text.css('font-size'));
            })();
            child.css('overflow-y', 'auto');
        };

        (function init() {
            if (typeof $.fn.typed !== 'function') {
                $.getScript(SITE_ROOT + 'assets/js/typed.min.js');
                setTimeout(init, 50);
                return;
            }
            setTimeout(_1_login, 3500);
        })();

        exec();

        $(window).on('resize.typedIT', function() {
            if(!$(selector).length) {
                $(window).off('resize.typedIT');
                return;
            }
            if(execTimerTriggered) return;
            execTimerTriggered = true;
            exec();
            $(selector).scrollTop(1000);
            setTimeout(function() {
                    exec();
                    $(selector).scrollTop(1000);
                    execTimerTriggered = false;
                },
                $.fx.interval
            );
        });
    }();

})();