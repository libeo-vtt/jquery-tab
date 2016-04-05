// Tab jQuery Plugin
// A jQuery tabs plugin.

(function($) {
    var Tab = function(element, options) {
        this.tab = $(element);

        this.config = $.extend({
            defaultOpenedTab: 1,
            closeOnClick: false,
            ariaTextClass: 'aria-text',
            tabWrapperClass: 'tab-wrapper',
            tabTriggerClass: 'tab-trigger',
            tabContentClass: 'tab-content',
            ariaText: 'Cliquer pour afficher cet onglet',
            onFocus: $.noop,
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop,
            onBlur: $.noop,
            customGlobalClasses: {}
        }, options || {});

        this.classes = $.extend({
            active: 'is-active',
            open: 'is-open',
            hover: 'is-hover',
            clicked: 'is-clicked',
            extern: 'is-external',
            error: 'is-error'
        }, (window.classes !== undefined ? window.classes : this.config.customGlobalClasses) || {});

        // Get the tabs wrapper
        this.tabWrapper = this.tab.find('.' + this.config.tabWrapperClass);

        // Get the tab trigger and transform the tags in a <button> tag
        this.tab.find('.' + this.config.tabTriggerClass).buttonize({
            a11y: this.config.a11y
        });
        this.tabTrigger = this.tab.find('.' + this.config.tabTriggerClass);

        // Get the tab content
        this.tabContent = this.tab.find('.' + this.config.tabContentClass);

        // Create and get the aria text
        this.tabTrigger.append('<span class="' + this.config.ariaTextClass + ' visuallyhidden">' + this.config.ariaText + '</span>');

        this.init();
    };

    $.extend(Tab.prototype, {

        // Component initialization
        init: function() {
            this.tab.css({
                position: 'relative',
                paddingTop: this.calculateHighestTabTrigger()
            });

            // Hide all tabs content
            this.tabContent.hide();

            this.changeTab(this.config.defaultOpenedTab - 1);
            // Bind events
            this.bindEvents();
            // Initialize tabTrigger positions
            this.adjustTabTrigger();
        },

        // Bind events with actions
        bindEvents: function() {
            // Click events
            this.tabTrigger.on('click', $.proxy(function(e) {
                var element = e.currentTarget;
                if (!$(element).parents('.' + this.config.tabWrapperClass).hasClass(this.classes.active)) {
                    this.changeTab($(element).parents('.' + this.config.tabWrapperClass).index());
                } else if (this.config.closeOnClick) {
                    this.tabContent.hide();
                    $(element).parents('.' + this.config.tabWrapperClass).removeClass(this.classes.active);
                }
            }, this));

            // Focus events
            this.tabTrigger.on('focus', this.config.onFocus);
            this.tabTrigger.on('blur', this.config.onBlur);
        },

        // Initialize tabTrigger positions
        adjustTabTrigger: function() {
            this.tabTrigger.each($.proxy(function(index, el) {
                $(el).css({
                    position: 'absolute',
                    top: '0',
                    left: this.calculateLeftOffset(index)
                });
            }, this));
        },

        // Function to change active tab
        changeTab: function(index) {
            this.tabContent.hide();
            this.tabWrapper.eq(index).find('.' + this.config.tabContentClass).show();
            this.tabWrapper.removeClass(this.classes.active).eq(index).addClass(this.classes.active);
            this.tabTrigger.removeClass(this.classes.active).eq(index).addClass(this.classes.active);
        },

        // Function to calculate the height of the highest tab trigger
        calculateHighestTabTrigger: function() {
            var height = 0;

            this.tabTrigger.each(function(index, el) {
                if ($(el).outerHeight() > height) {
                    height = $(el).outerHeight();
                }
            });
            //Add unit
            height = height/16 + "rem" ;
            return height;
        },

        // Function to calculate the height of the highest tab trigger
        calculateLeftOffset: function(index) {
            var offset = 0;

            for (var i = 0; i < index; i++) {
                offset += this.tabTrigger.eq(i).outerWidth(true);
            }
            //Add unit
            offset = offset/16 + "rem";
            return offset; //.eminize();
        }

    });

    $.fn.tab = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('tab')) return;

            // pass options to plugin constructor
            var tab = new Tab(this, options);

            // Store plugin object in this element's data
            element.data('tab', tab);
        });
    };
})(jQuery);
