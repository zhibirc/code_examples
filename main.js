$(function () {
    'use strict';

    initEvents();
});

function initEvents() {
    'use strict';

    var siteTypes = $('.site-type li'),
        markupTypes = $('.markup-type li'),
        pricePlans = $('.price-plan-header'),
        pageAmount = $('#page_amount'),
        slider = $('#slider'),
        amount = $('#amount'),
        $container = $('#work_example_container'),
        $priceTxt = $('#price-requirements'),
        $sliderMarkers = $('.slider-markers');

    // Disable unwanted behaviour when anchors with hashes (#) being clicked.
    $('body').on('click', function (e) {
        $(e.target).is('[href=#]') && e.preventDefault();
    });

    $('#back_to_top').on('click', function () {
        $('html').animate({ scrollTop: 0 }, 1000);
    });

    $('a', '#work_presentation_menu').on('click', function () {
        switch ($(this).index()) {
        case 0:
            $container.isotope({ filter: '*' });
            setActiveState($('#work_presentation_menu a'), this);
            break;
        case 2:
            $container.isotope({ filter: '.adaptive' });
            setActiveState($('#work_presentation_menu a'), this);
            break;
        case 3:
            $container.isotope({ filter: '.email' });
            setActiveState($('#work_presentation_menu a'), this);
            break;
        default:
            $container.isotope({ filter: '.site' });
            setActiveState($('#work_presentation_menu a'), this);
        }
    });

    $('#page_amount, #amount').on('focus', function () {
        $(this).blur();
    });

    amount.on('update', function () {
        var self = $(this);
        self.css('width', (self.val().length - 4) * 13 + 55 + 'px');
    });

    siteTypes.on('click', function () {
        setActiveState(siteTypes, this);
        CALCULATOR.calculate();
        setAmountValue();
    });

    markupTypes.on('click', function () {
        setActiveState(markupTypes, this);
        CALCULATOR.calculate();
        setAmountValue();
    });

    pricePlans.on('click', function () {
        setActiveState(pricePlans, this);
        setAmountValue();
    });

    $('#amount_plus').on('click', function () {
        var pageAmountValue = +pageAmount.val();
        pageAmountValue < 99 ? pageAmount.val(pageAmountValue + 1) : void 0;
        CALCULATOR.calculate();
        setAmountValue();
        setActiveState($('#amount_minus'), this);
    });

    $('#amount_minus').on('click', function () {
        var pageAmountValue = +pageAmount.val();
        pageAmountValue > 1 ? pageAmount.val(pageAmountValue - 1) : void 0;
        CALCULATOR.calculate();
        setAmountValue();
        setActiveState($('#amount_plus'), this);
    });

    $('[name="markup-type"]').on('click', function () {
        CALCULATOR.calculate();
        setAmountValue();
    });

    /** Highlight blocks or list elements when clicked (makes them "active"). */
    function setActiveState(elems, elem) {
        elems.removeClass('active');
        $(elem).addClass('active');
    }

    /** Set total calculated value of price in the particular field. */
    function setAmountValue() {
        amount
            .val($('.price-plan-header.active').next().children(':first').text())
            .trigger('update');
    }

    /** Set particular state to the slider and invoke calculation method. */
    function handleSlider(valueNum, valueTxt) {
        slider.slider('value', valueNum);
        CALCULATOR.calculate(valueNum);
        setAmountValue();
        $priceTxt.text($sliderMarkers.children().eq(valueTxt).text());
    }

    /** Animate elements when scroll. */
    function animateScreens() {
        $(window).on('scroll', function () {
            var userViewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                userViewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                pageHeight = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight),
                scrollTop = window.pageYOffset || document.documentElement.scrollTop,
                $credoPartBlocks = $('.credo-part'),
                $screens = $('.steps-scheme .circle-labels'),
                topOffset = {
                    credoPartBlocks: $credoPartBlocks.eq(0).offset().top,
                    screens: $screens.parent().offset().top
                };

            //if ((scrollTop + userViewportH / 2) > topOffset.credoPartBlocks && topOffset.credoPartBlocks > (scrollTop + userViewportH / 3) && +$credoPartBlocks.css('opacity') !== 1) {
            //    $credoPartBlocks.each(function (idx) {
            //        $(this).fadeTo(idx *= 100, 1)
            //            .animate({'width': '115%'}, 300)
            //            .animate({'width': '100%'}, 300);
            //    });
            //}

            if ((scrollTop + userViewportH / 2.5) > topOffset.screens && topOffset.screens > (scrollTop + userViewportH / 3.5) && +$screens.css('opacity') !== 1) {
                $screens
                    .fadeTo(0, 1)
                    .animate({marginLeft: '2.5%', marginRight: '2.5%'}, 400)
                    .animate({marginLeft: '0', marginRight: '0'}, 200);
            }
        });
    }

    /** jQuery UI Slider initialization. */
    slider.slider({
        max: 100,
        min: 0,
        step: 1,
        value: 100,
        stop: function(event, ui) {
            if (ui.value >= 0 && ui.value <= 10){
                handleSlider(0, 0);
                return;
            }
            if (ui.value >= 11 && ui.value <= 30){
                handleSlider(20, 1);
                return;
            }
            if (ui.value >= 31 && ui.value <= 50){
                handleSlider(40, 2);
                return;
            }
            if (ui.value >= 51 && ui.value <= 70){
                handleSlider(60, 3);
                return;
            }
            if (ui.value >= 71 && ui.value <= 90){
                handleSlider(80, 4);
                return;
            }
            if (ui.value >= 91 && ui.value <= 100) {
                handleSlider(100, 5);
            }
        }
    });

    /** Isotope plugin initialization. */
    $container.isotope({
        itemSelector: '.work-example',
        // Default state on page load.
        filter: '.site',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s'
    });

    /** Initialize calculator module with all price preferences. */
    CALCULATOR.init({
        siteType: {
            cutaway: 1500,
            landing: 1000,
            corporate: 1700,
            shop: 1800,
            service: 2000,
            mobile: 1900,
            email: 1000
        },
        markupType: {
            fixed: {
                base: 1,
                pro: 2,
                max: 3
            },
            adaptive: {
                base: 2,
                pro: 3.5,
                max: 4.5
            },
            responsive: {
                base: 1.5,
                pro: 2,
                max: 3
            }
        },
        markupStandard: {
            html5_css3: 1,
            xhtml_css2: 1.3
        },
        workTerms: {
            yetYesterday: 2,
            quickly: 1.5,
            termsImportant: 1.4,
            qualityImportant: 1.3,
            termsNotImportant: 1.2,
            anyTime: 1
        }
    });

    CALCULATOR.calculate();
    setAmountValue();
    animateScreens();
}
