var CALCULATOR = {
    initOptions: 'wait',
    init: function (options) {
        'use strict';

        var siteType = $('.site-type'),
            counter = 0;

        this.initOptions = options;

        for (var opt in options.siteType) {
            if (options.siteType.hasOwnProperty(opt)) {
                siteType.find('li').eq(counter).attr('ratio', options.siteType[opt]);
                counter += 1;
            }
        }

        $('#type_css2').attr('ratio', options.markupStandard.xhtml_css2);
        $('#type_css3').attr('ratio', options.markupStandard.html5_css3);

    },
    calculate: function (sliderValue) {
        'use strict';

        var pageCount = $('#page_amount').val(),
            termRatio = getTermRatio(this.initOptions.workTerms),
            baseAmount = $('#base_plan_price'),
            standardAmount = $('#standard_plan_price'),
            maxAmount = $('#max_plan_price'),
            radioBtnType = $('[name="markup-type"]:checked'),
            siteType = $('.site-type li.active'),
            markupType = $('.markup-type li.active');

        /** Multiply all price components and return calculated value. */
        function makeCake(mixin) {
            var commonIngredients = [
                siteType.attr('ratio'),
                pageCount,
                radioBtnType.attr('ratio'),
                termRatio
            ];

            commonIngredients.push(mixin);

            return commonIngredients.reduce(function (init, current) {
                return init * current;
            }, 1).toFixed();
        }

        function getTermRatio(settings) {
            if (typeof sliderValue == 'undefined') {
                // Default value, start position, minimum cost.
                return settings.anyTime;
            } else {
                switch (sliderValue) {
                    case 0:
                        return settings.yetYesterday;
                    case 20:
                        return settings.quickly;
                    case 40:
                        return settings.termsImportant;
                    case 60:
                        return settings.qualityImportant;
                    case 80:
                        return settings.termsNotImportant;
                    default:
                        return settings.anyTime;
                }
            }
        }

        baseAmount.text(makeCake(this.initOptions.markupType[markupType.data('type')].base));
        standardAmount.text(makeCake(this.initOptions.markupType[markupType.data('type')].pro));
        maxAmount.text(makeCake(this.initOptions.markupType[markupType.data('type')].max));
    }
};
