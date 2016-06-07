// Tab jQuery Plugin
// A jQuery tabs plugin.

(function($) {
    var Tab = function(element, options) {
        this.tab = $(element);

        // Default module configuration
        this.defaults = {
            defaultOpenedTab: 1,
            closeOnClick: false,
            adjustOnResize: true,
            onFocus: $.noop,
            beforeOpen: $.noop,
            afterOpen: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop,
            onBlur: $.noop,
            labels: {
                ariaText: 'Cliquer pour afficher cet onglet',
            },
            classes: {
                ariaText: 'aria-text',
                tabWrapper: 'tab-wrapper',
                tabTrigger: 'tab-trigger',
                tabContent: 'tab-content',
                states: {
                    active: 'is-active'
                }
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, (window.project ? window.project.classes : {}));

        // Merge default labels with window.project.labels
        this.labels = $.extend(true, this.defaults.labels, (window.project ? window.project.labels : {}));

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        // Get the tabs wrapper
        this.tabWrapper = this.tab.find('.' + this.classes.tabWrapper);

        // Get the tab trigger and transform the tags in a <button> tag
        this.tab.find('.' + this.classes.tabTrigger).buttonize({
            a11y: this.config.a11y
        });

        // Add type button so no submit is triggered on click of the buttons
        this.tab.find('.' + this.classes.tabTrigger).attr('type', 'button');

        // Get all the tab triggers
        this.tabTrigger = this.tab.find('.' + this.classes.tabTrigger);

        // Get the tab content
        this.tabContent = this.tab.find('.' + this.classes.tabContent);

        // Create and get the aria text
        this.tabTrigger.append('<span class="' + this.classes.ariaText + ' visuallyhidden">' + this.labels.ariaText + '</span>');

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
                if (!$(element).parents('.' + this.classes.tabWrapper).hasClass(this.classes.states.active)) {
                    this.changeTab($(element).parents('.' + this.classes.tabWrapper).index());
                } else if (this.config.closeOnClick) {
                    this.tabContent.hide();
                    $(element).parents('.' + this.classes.tabWrapper).removeClass(this.classes.states.active);
                }
            }, this));

            // Window resize events
            if(this.config.adjustOnResize) {
                $(window).on('resize', $.proxy(function() {
                    this.waitForFinalEvent($.proxy(function(){
                        this.tab.css({
                            paddingTop: this.calculateHighestTabTrigger()
                        });
                        this.adjustTabTrigger();
                    },this), 250, "adjustTabTrigger");
                }, this));
            }

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
            this.tabWrapper.eq(index).find('.' + this.classes.tabContent).show();
            this.tabWrapper.removeClass(this.classes.states.active).eq(index).addClass(this.classes.states.active);
            this.tabTrigger.removeClass(this.classes.states.active).eq(index).addClass(this.classes.states.active);
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
        },

        // Source: http://stackoverflow.com/a/4541963/2196908
        waitForFinalEvent: function () {
          var timers = {};
          return function (callback, ms, uniqueId) {
            if (!uniqueId) {
              uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
              clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
          };
        }()
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
