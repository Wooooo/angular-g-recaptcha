/* global
    angular,
    minErr,
    inherits
 */
var $greMinErr = minErr('$grecaptcha');

/**
 * @ngdoc object
 * 
 * @name wo.grecaptcha.$grecaptchaProvider
 * @requires wo.grecaptcha.$greLanguageCodes
 * 
 * 
 * @description 
 * Provider for $grecaptcha service
 * 
 **/
function $grecaptchaProvider($greLanguageCodes) { /*jshint ignore:line */
    
    var _grecaptcha                 // grecaptcha Object
    ,   _languageCode               // languageCode value
    ,   _scriptTag                  // tag that contains recaptcha script
    ,   _scriptLoadTimeout = 5000   // miliseconds of load time out
    ,   self = this                 // this reference
    ,   init_promise                // a promise of init method                 
                
    // method name of recaptcha script callback
    ,   _onLoadMethodName = "onRecaptchaApiLoaded"
    
    // parameter Object
    ,   _parameters = {     
        sitekey             : undefined
    ,   theme               : 'light'
    ,   type                : 'image'
    ,   size                : 'normal'
    ,   tabindex            : 0
    ,   callback            : angular.noop
    ,   'expired-callback'  : angular.noop
    };
    
    var config_properties = ['sitekey', 'theme', 'type', 'size', 
                'tabindex', 'callback', 'expired-callback'];
    
    var provider_properties = ['languageCode', 'grecaptcha', 'onLoadMethodName'].concat(config_properties);
    
    
    /**
     * @private
     * @description
     * Set value to key of target which defaults to _parameters
     * 
     * The purpose of this method is not just to set value 
     * but also to validate the given key and value
     * 
     * @exapmple
     * setLanguageCode('ko')                // can set languageCode of _parameters
     * 
     * setLanguageCode('ko', {})            // can validate whether given 'ko' is right languageCode or not
     * 
     * setLanguageCode('ko', myVariable)    // can also set value of not _parameters but myVariable
     * 
     * @param {string=} key property name
     * @param {*=} value property value
     * @param {Object} ctx the target which be set key and value
     * @returns {Object} self
     */
    function setValue(key, value, ctx) {
        (ctx || _parameters)[key] = value;
    }
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setSitekey
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description 
     * Set a sitekey of default config with 'sitekey'.<br>
     * Can't validate 'sitekey'.
     * 
     * @example
     * <pre>
     * // test sitekey provided in official google recaptcha site
     * $grecaptchaProvider.setSitekey('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'); 
     * 
     * </pre>
     * @param {string} sitekey New default sitekey
     * @return {Object} self
     */
    this.setSitekey = function(sitekey){
        // TODO How can validate sitekey?
        
        //set phase
        setValue('sitekey', sitekey, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setTheme
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description 
     * Set a theme of default config with 'theme'.<br>
     * Validate whether 'theme' is in correct options.
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setTheme('dark'); // dark theme
     * 
     * $grecaptchaProvider.setTheme('light'); // light theme
     * 
     * $grecaptchaProvider.setTheme('dARk'); // dark theme
     * </pre>
     * 
     * @param {string} theme New default theme, allow any uppercase character
     * 
     * valid options: 
     * <ul>
     *  <li>'light'(default) : white </li>
     *  <li>'dark' : black </li>
     * </ul>
     * 
     * @returns {Object} self
     */
    this.setTheme = function(theme){
        
        //validate phase
        var themes = ['dark', 'light'];
        
        theme = angular.isString(theme) ? theme.toLowerCase() : void 0;
        
        if( !theme || themes.indexOf(theme) === -1 ) {
            throw new $greMinErr('badtheme', 'A theme has to be one of {0}.', themes);
        }
        
        //set phase
        setValue('theme', theme, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setType
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a type of default config with 'type'.<br>
     * Validate whether 'type' is in correct optionss or not.
     * 
     * 
     * @param {string} type New default type, allow any uppercase characater
     * 
     * valid options: 
     * <ul>
     *  <li> 'image'(default) : choose images corresponding to given topic </li>
     *  <li> 'audio' : write numbers which be spoken in recaptcha box </li>
     * </ul>
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setType('audio'); //audio type
     * 
     * $grecaptchaProvider.setType('IMAGE'); //image type
     * 
     * $grecaptchaProvider.setType('touch'); //will throw an error
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setType = function(type) {
        
        //validate phase
        var types = ['audio', 'image'];
        
        type = angular.isString(type) ? type.toLowerCase() : void 0;
        
        if( !type || types.indexOf(type) === -1 ) {
            throw new $greMinErr('badtype', 'A type has to be one of {0}.', types);
        }
        
        //set phase
        setValue('type', type, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setSize
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a size of default config with 'size'.<br>
     * Validate whether 'size' is in correct candidates or not.<br>
     * 
     * @param {string} size New default size, allow any uppercase character
     * 
     * valid options: 
     * <ul>
     *  <li> 'normal'(default) : normal size, 300px </li>
     *  <li> 'compcat' : small size  </li>
     * </ul>
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setSize('compact');
     * 
     * $grecaptchaProvider.setSize('big'); //will throw an error
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setSize = function(size) {
        //validate phase
        var sizes = ['compact', 'normal'];
        
        size = angular.isString(size) ? size.toLowerCase() : void 0;
        
        if( !size || sizes.indexOf(size) === -1 ) {
            throw new $greMinErr('badsize', 'A size has to be one of {0}.', sizes);
        }
        
        //set phase
        setValue('size', size, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setTabindex
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default tabindex of recaptcha box with 'tabindex'.<br>
     * Validate whether 'tabindex' is number or not.
     * 
     * @param {number} tabindex New default tabindex
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setTabindex(10);
     * 
     * $grecaptchaProvider.setTabindex('100'); //will throw an error
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setTabindex = function(tabindex) {
        //validate phase
        if( !angular.isNumber(tabindex) ) {
            throw new $greMinErr('badtabindex', 'A tabindex has to be a number.');
        }
        
        //set phase
        setValue('tabindex', tabindex, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setCallback
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a default callback which will be called after recaptcha confirm. <br>
     * Validate if 'callback' is function.
     * 
     * The callback function will accept response argument 
     * which be returned by recaptcha box when validating be finished.
     * 
     * @example 
     * <pre>
     * // will log recaptcha response on console when validating be done
     * $grecaptchaProvider.setCallback(function(res) {
     *   console.log(res);
     * });
     * </pre>
     * 
     * @param {Function} callback New default callback
     * 
     * @returns {Object} self
     */
    this.setCallback = function(callback) {
        
        //validate phase
        if( !angular.isFunction(callback) && !angular.isArray(callback)) {
            throw new $greMinErr('badcb', 
                'A callback has to be a function or a array of functions.');
        }
        
        //set phase
        setValue('callback', callback, arguments[1]);
        
        return self;
    };
    
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setExpiredCallback
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set expired-callback which will be called when recaptcha be expired. <br>
     * Validate if 'expired-callback' is function.
     * 
     * @param {Function} expiredCallback New default expired-callback
     * 
     * @example
     * <pre>
     * //will log 'Expired!!!!' on console when expired.
     * $grecaptchaProvider.setExpiredCallback(function(){
     *   console.log('Expired!!!!');
     * });
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setExpiredCallback = function(expiredCallback) {
        
        //validate phase
        if( !angular.isFunction(expiredCallback) && !angular.isArray(expiredCallback) ) {
            throw new $greMinErr('badexpcb', 
                'A expired-callback has to a function or a array of functions.');
        }
        
        //set phase
        setValue('expired-callback', expiredCallback, arguments[1]);
        
        return self;
    };
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setLanguageCode
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a languageCode of default config with 'languageCode'. <br>
     * Validate whether 'languageCode' is in {@link wo.grecaptcha.$greLanguageCodes $greLanguageCodes} or not.
     * 
     * @param {string} languageCode new languageCode
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setLanguageCode('ko');
     * 
     * $grecaptchaProvider.setLanguageCode('en');
     * 
     * $grecaptchaProvider.setLanguageCode('kr'); //will throw an error
     * 
     * $grecaptchaProvider.setLanguageCode('jp'); //will throw an error
     * </pre>
     * @returns {Object} self
     */
    this.setLanguageCode = function(languageCode){
        if( $greLanguageCodes[languageCode] === void 0 ) {
            throw new $greMinErr('badlan', "The languageCode is invalid.", languageCode);
        }
        
        _languageCode = languageCode;
        
        return self;
    };
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setGrecaptcha
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set grecaptcha object with 'grecaptcha'
     * 
     * It may be dangerous to insert a custom grecaptcha object.
     * 
     * @param {Object} grecaptcha An object to insert into private grecaptcha object
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.setGrecaptcha(myGrecaptcha);
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setGrecaptcha = function(grecaptcha) {
        _grecaptcha = grecaptcha;
        
        return self;
    };
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#setOnLoadMethodName
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set onLoadMethodName used as recaptcha script loaded method name
     * 
     * @param {string} onLoadMethodName New methodname
     * 
     * @example
     * <pre>
     * // The name of onload method becomes 'myCustomMethodName'
     * $grecaptchaProvider.setOnLoadMethodName('myCustomMethodName'); 
     * </pre>
     * 
     * @returns {Object} self
     */
    this.setOnLoadMethodName = function(onLoadMethodName){
        _onLoadMethodName = onLoadMethodName;
        
        return self;
    };
    
    
    
    /**
     * @private
     * @description
     * Generate camelCase with given snakeCase
     * (eg. 'camel-case' -> 'camelCase', 'ca-mel-case' -> 'caMelCase')
     * 
     * @param {string} str string to convert
     * @returns {string} result of converting
     */
    function camelCase(str) {
        return str.split('-').reduce(function(pre, cur){
            pre += cur.charAt(0).toUpperCase()+cur.slice(1);
            return pre;
        });
    }
    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#set
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set default parameters of recaptcha box with given arguments
     * by using above setting/validating functions.<br>
     * If first argument is object, this method will be executed.
     * 
     * @param {Object} params new default params
     * @param {boolean=} includeOthers
     * if the 'params' include other property and 'includeOthers' is true, it will not throw an error<br>
     * However, it includes other property but 'includeOthers' is false or undefined, then it will throw an error
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.set({
     *      theme: 'dark',
     *      type: 'audio',
     *      size: 'compact',
     *      languageCode: 'ko',
     *      sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
     *      onLoadMethodName: 'myCustomLoadName',
     *      callback: function(res) {
     *          console.log(res);
     *      },
     *      'expired-callback': function() {
     *          console.log('It\'s expired!');
     *      }
     * });
     * 
     * // This will not throw an error though has 'otherProperty', 
     * // because includeOthers is true.
     * $grecaptchaProvider.set({
     *      theme: 'dark',
     *      type: 'audio',
     *      size: 'compact',
     *      languageCode: 'ko',
     *      sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
     *      onLoadMethodName: 'myCustomLoadName',
     *      callback: function(res) {
     *          console.log(res);
     *      },
     *      'expired-callback': function() {
     *          console.log('It\'s expired!');
     *      },
     *      'otherProperty': 'otherValue'
     * }, true);
     * 
     * 
     * </pre>
     * 
     * @returns {Object} self
     */
     
     /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#set
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Set a value of 'key' property. It will throw an error if 'key' doesn't exist in config properties.<br>
     * If first argument is string, this method will be executed.
     * 
     * @param {string} key A key of grecaptcha default config
     * <ul>
     *  <li> theme : the theme of a recaptcha box</li>
     *  <li> type : the type of a recaptcha box</li>
     *  <li> size : the size of a recaptcha box</li>
     *  <li> sitekey: the sitekey which validates a recaptcha box </li>
     *  <li> tabindex: the tabindex of a recaptcha box </li>
     *  <li> callback: the callback executed when recaptcha validating be completed </li>
     *  <li> 'expired-callback': the callback executed when a recaptcha box is expired </li>
     *  <li> onLoadMethodName: the global method name for method which be performed on recaptcha script loaded </li>
     *  <li> grecaptcha: can set grecaptcha directly, but don't recommend </li>
     *  <li> languageCode: the languageCode of recaptcha box </li>
     * </ul>
     * <br>
     * More detail descriptions are below.
     * @param {*} value a value of the key
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.set('theme', 'light');
     * 
     * $grecaptchaProvider.set('callback', function(res) {
     *      console.log(res);
     * });
     * 
     * $grecaptchaProvider.set('key', 'value'); // will throw an error
     * </pre>
     * @returns {Object} self
     */
    this.set = function(){
        var args = arguments, that = this;
        
        if( angular.isObject(args[0]) ) {
            var params = args[0], includeOthers = args[1];
            
            
            for(var key in params) {
                if( !params.hasOwnProperty(key) ) continue;
                
                
                try {
                    that.set(key, params[key]);
                } 
                catch(e) {
                    // if includeOthers is true, ignoring the error
                    if( !includeOthers ) throw e;
                }
            }
        }
        
        else if( angular.isString(args[0]) ) {
            var _key = args[0], value = args[1];
            
            
            if( provider_properties.indexOf(_key) !== -1 ) {
                var methodName = camelCase('set-'+_key);
                
                that[methodName](value);
            }
            else {
                throw new $greMinErr('setnosuchkey', 
                    'There is no such key {0} in {1}.', _key, provider_properties);
            }
        }
        
        return self;
    };

    
    
    /**
     * @ngdoc function
     * 
     * @name wo.grecaptcha.$grecaptchaProvider#get
     * @methodOf wo.grecaptcha.$grecaptchaProvider
     * 
     * @description
     * Get a value of default config's 'key' property.
     * 
     * @param {string} key A key to get value
     * <ul>
     *  <li> theme : the theme of a recaptcha box</li>
     *  <li> type : the type of a recaptcha box</li>
     *  <li> size : the size of a recaptcha box</li>
     *  <li> sitekey: the sitekey which validates a recaptcha box </li>
     *  <li> tabindex: the tabindex of a recaptcha box </li>
     *  <li> callback: the callback executed when recaptcha validating be completed </li>
     *  <li> 'expired-callback': the callback executed when a recaptcha box is expired </li>
     *  <li> onLoadMethodName: the global method name for method which be performed on recaptcha script loaded </li>
     *  <li> grecaptcha: can set grecaptcha directly, but don't recommend </li>
     *  <li> languageCode: the languageCode of recaptcha box </li>
     * </ul>
     * 
     * @example
     * <pre>
     * $grecaptchaProvider.get('theme'); // 'light'
     * 
     * $grecaptchaProvider.get('type'); // 'image'
     * 
     * $grecaptchaProvider.get('sitekey'); // undefined
     * $grecaptchaProvider
     * .set('sitekey', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')
     * .get('sitekey'); // '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
     * </pre>
     * 
     * @returns {*} A value of 'key' property
     */
    this.get = function(key) {
        if( key == 'languageCode' ) {
            return _languageCode;
        }
        
        else if( key == 'onLoadMethodName' ) {
            return _onLoadMethodName;
        }
        
        else if( key == 'grecaptcha' ) {
            return _grecaptcha;
        }
        else if( config_properties.indexOf(key) !== -1 ) {
            return _parameters[key];
        }
        
        else {
            throw new $greMinErr('getnosuchkey', 
                'There is no such key {0} in {1}.', key, provider_properties);
        }
    };
    
    
    /**
     * @private
     * @description
     * Create script tag containing recaptcha script 
     * and register onload callback 
     * so that init grecaptcha Object
     */
    function createScript($document){
        var src = "//www.google.com/recaptcha/api.js?render=explicit&"+
                "onload="+_onLoadMethodName+
                (_languageCode ? "&hl="+_languageCode : "");
            
        var option = {
            type    : "text/javascript"
        ,   async   : true
        ,   defer   : true
        ,   src     : src
        };
        
        _scriptTag = angular.extend($document[0].createElement('script'), option);
        
        $document[0].querySelector('head').appendChild(_scriptTag);
        
        return _scriptTag;
    }
    
    
    
    this.$get = function($q, $window, $rootScope, $document, $timeout, TinyEmitterFactory){
        var greList = {};   // key: widget Id, value: greInstance
        var map = {};       //weakMap for using private variables
        
        /**
         * @private
         * @description
         * Get reference from private map object to maintain encapsulization.
         * If not exists, generate it and insert.
         */
        function _private(target) {
            return (map[target] || (map[target] = {}));
        }
        
        
        /**
         * @private
         * @description
         * Delete 'target' from private map object.
         */
        function delete_private(target) {
            delete map[target];
        }
        
        /**
         * @ngdoc object
         * 
         * @name wo.grecaptcha.$grecaptcha:gre
         * 
         * 
         * @description
         * Grecaptcha instance that contains parameters and element, wigetId.
         * Returned by $grecaptcha service.
         */
        function gre(param){
            var config = angular.copy(_parameters);
            
            //validating param
            self.set(param || {}, config);
            
            //setting _config
            _private(this)._config = config;
        }
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha:gre#on
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Register a 'listener' on the 'event'.
         * 
         * @param {string} event name of a event
         * @param {Function} listener event listener
         * 
         * @example
         * <pre>
         * 
         * gre.on('destroy', function() {
         *  //...
         * });
         * 
         * gre.on('reset', function(response) {
         *  //...
         * });
         * 
         * </pre>
         * 
         * @returns {Object} self
         */
         
        inherits(gre, TinyEmitterFactory);
        
        
        var greMinErr = minErr('gre');
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#reset
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Reset the gre's recaptcha box.
         * 
         * @example
         * <pre>
         * var el = $document[0].createElement('div');
         * 
         * 
         * var promise = gre.render(el);
         * 
         * // later
         * promise.then(function(){
         *      gre.reset();
         * }
         * </pre>
         * 
         * @returns {Object} self
         */
        
        /**
         * @ngdoc event
         * 
         * @name wo.grecaptcha.$grecaptcha:gre#reset
         * @eventOf wo.grecaptcha.$grecaptcha:gre
         * @eventType emit on gre instance
         * @description
         * Event fired when reset method is executed.
         * 
         * @param {string} response recaptcha box's response
         * 
         * @example
         * <pre>
         * gre.on('reset', function(response) {
         *      console.log(response);      // recaptcha box response
         * });
         * </pre>
         */
        gre.prototype.reset = function(){
            this.emit("reset", this.getResponse()); //emit with response
            _grecaptcha.reset(_private(this)._widgetId);
            return this;
        };
        
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#getResponse
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Get the gre's response from recaptcha box if exists.
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * 
         * // after validating phase
         * gre.getResponse(); // will give response of recaptcha box
         * </pre>
         * 
         * @returns {string} response
         */
        gre.prototype.getResponse = function() {
            return _grecaptcha.getResponse(_private(this)._widgetId);
        };
        
        
        
        /**
         * @ngdoc function
         * @name wo.grecaptcha.$grecaptcha:gre#getElement
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Get the element where recaptcha box is rendered if exists.
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * 
         * var el = $document[0].createElement('div');
         * 
         * 
         * gre.render(el).then(function(){
         *      gre.getElement(); // jQuery object wrapping 'el'
         * };
         * </pre>
         * 
         * @returns {object} jQuery object wrapping element where recaptcha box is rendered
         */
        gre.prototype.getElement = function() {
            return _private(this)._element;
        };
        
        
        
        /**
         * @ngdoc function
         * @name wo.grecaptcha.$grecaptcha:gre#getWidgetId
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Get the recaptcha box's widget id if exists.
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * var el = $document[0].createElement('div');
         * 
         * gre.render(el).then(function(){
         *      gre.getWidgetId(); // 0
         * });
         * </pre>
         * 
         * @returns {number} widget id
         */
        gre.prototype.getWidgetId = function() {
            return _private(this)._widgetId;
        };
        
        
        
        
        /**
         * @ngdoc function
         * 
         * @method
         * @name wo.grecaptcha.$grecaptcha:gre#init
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Set private grecaptcha object from $window after recaptcha script loaded if undefined.
         * <br><br>
         * By returning a promise which be resolved on script loaded,<br> 
         * can check whether grecaptcha initialization is over or not.
         * 
         * @param {Function=} onInit a callback performed after initialization is finished
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * 
         * gre.init(function(){
         *      console.log('Initializing!!');
         * }).then(function(){
         *      console.log('Init is over.');
         * });
         * 
         * </pre>
         * 
         * @returns {Promise} Promise that will be resolved when onload callback be execute.
         * <br> It will be rejected if times out.
         */
        gre.prototype.init = function(onInit){
            var that = this;
            
            if( !!_grecaptcha ) {
                init_promise = $q.when(that);    
            }
            
            
            if( !!init_promise ) {
                return init_promise;
            }
            
            return init_promise = $q(function(resolve, reject) {
                $timeout(function(){
                    var error = new greMinErr('srcdelay', 'A recaptcha script load is timed out.');
                    
                    reject(error);
                }, _scriptLoadTimeout);
                
                
                $window[_onLoadMethodName] = function(){
                    $rootScope.$apply(function(){
                        self.setGrecaptcha($window.grecaptcha);
                        
                        (onInit || angular.noop)();
                        
                        resolve(that);
                    });
                };
                
                createScript($document);
            });
        };
        
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#remove
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * var el = $document[0].createElement('div');
         * 
         * gre.render(el).then(function(){
         *      el.remove();
         * });
         * </pre>
         * 
         * @description
         * Delete the gre instance from private map object and greList.
         */ 
         
        /**
         * @ngdoc event
         * @name wo.grecaptcha.$grecaptcha:gre#destroy
         * @eventOf wo.grecaptcha.$grecaptcha:gre
         * @eventType emit on gre instance
         * @description
         * Event fired when gre instance is destroyed.
         * 
         * @example
         * <pre>
         * gre.on('destroy', function(){
         *      console.log('Destroyed!!');
         * });
         * </pre>
         */
        gre.prototype.remove = function(){
            this.emit("destroy");
            
            this.destroyEmitter();
            
            delete greList[_private(this)._widgetId];
            delete_private(this);
        };
        
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#render
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Render a recaptcha box at 'element'.
         * 
         * @example
         * <pre>
         * var gre = $grecaptcha();
         * var el = $document[0].createElement('div');
         * 
         * var promise = gre.render(el, function() { console.log('It\'s destroyed.'); });
         * 
         * promise.then(function(){
         *      console.log(res.getWidgetid()); // 0
         * });
         * </pre>
         * 
         * @param {(DOMElement|string)} element the element string or Object
         * @param {Function=} onDestory a callback to be executed when element be destroyed
         * @param {Function=} onInit a callback to be executed when init method is being done
         * @returns {Promise} Promise that will be resolved when _grecaptcha.render is reached.
         * <br> The value promise reolve is the widget id of renedered recaptcha box.
         */
        gre.prototype.render = function(el, onDestroy, onInit){
            var that = this, internal = _private(this);
            
            // if gre has widgetId return promise
            if( internal._widgetId !== void 0 ) {
                return $q.when(this);
            }
            
            // validate element
            if( !angular.isElement(el) ) {
                throw new greMinErr('badel', 'The element is invalid.');
            }
            
            if( internal._config.sitekey === void 0 ) {
                throw new greMinErr('nositekey', 'The sitekey has to be provided.');
            }
            
            function wrap(param) {
                var promiseArr = [].concat(param);
                
                var ret = function(value) {
                    var promise = $q.when(value);
                    
                    for(var i = 0 ; i < promiseArr.length ; i++) {
                        promise = promise.then(promiseArr[i]);
                    }
                    
                    promise.catch(function(reason){
                        throw new Error(reason);
                    });
                };
                
                return ret;
            }
            
            return this.init(onInit).then(function(){
                var config = angular.copy(internal._config);
                
                
                angular.extend(config, {
                    callback: wrap(config.callback), 
                    'expired-callback': wrap(config['expired-callback'])
                    
                });
                
                angular.extend(internal, {
                    _widgetId   : _grecaptcha.render(el, config),
                    _element    : angular.element(el)
                });
                
                internal._element.on('$destroy', function(){
                    that.remove();
                    
                    (onDestroy || angular.noop)();
                });
                
                return greList[internal._widgetId] = that;
            });
        };
        
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#set
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Set 'params' to gre config. <br>
         * If first argument is object, this method is executed.
         * 
         * This is same with {@link wo.grecaptcha.$grecaptchaProvider $grecaptchaProvider}'s set method.
         * 
         * @param {Object} params New parameters
         * @param {boolean=} includeOthers the flag whether include other properties or not
         * 
         * @returns {Object} self
         */
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#set
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Set 'key' of gre config with 'value'. <br>
         * If first argument is string, this method is executed.
         * 
         * This is same with {@link wo.grecaptcha.$grecaptchaProvider $grecaptchaProvider}'s set method.
         * 
         * @param {string} key A key of gre config
         * @param {*} value A value of the key
         * 
         * @returns {Object} self
         */
        gre.prototype.set = function() {
            var args = arguments, that = this;
            
            if( angular.isObject(args[0]) ) {
                var params = args[0], includeOthers = args[1];
                
                for(var key in params) {
                    if( !params.hasOwnProperty(key) ) continue;
                    
                    try {
                        that.set(key, params[key]);
                    } 
                    catch(e) {
                        if( !includeOthers ) throw e;
                    }
                }
            }
            
            else if( angular.isString(args[0]) ) {
                var _key = args[0], value = args[1];
                
                if( config_properties.indexOf(_key) !== -1 ) {
                    var methodName = camelCase('set-'+_key);
                    
                    self[methodName](value, _private(that)._config);
                }
            }
            
            else {
                throw new greMinErr('badsetargs', 
                'The first argument of set method has to be either object or string.');
            }
            
            return this;
        };
         
        
        
        /**
         * @ngdoc function
         * 
         * @function
         * @name wo.grecaptcha.$grecaptcha:gre#get
         * @methodOf wo.grecaptcha.$grecaptcha:gre
         * 
         * @description
         * Get the value of gre config's 'key' property
         * 
         * @param {string} key the key of parameters to get
         * 
         * @example 
         * <pre>
         * var gre = $grecaptcha({theme: 'dark'});
         * 
         * gre.get('theme'); // 'dark'
         * 
         * gre.get('type'); // 'image' ('image' is defualt type.)
         * </pre>
         * 
         * @returns {*} a value of the key
         */ 
        gre.prototype.get = function(key) {
            if( config_properties.indexOf(key) !== -1 ) {
                 return _private(this)._config[key];
            }
            
            else {
                throw new greMinErr('getnosuchkey', 
                    'There is no such key {0} in {1}.', key, config_properties);
            }
        };
        
        
        
        /**
         * @ngdoc object
         * 
         * @name wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Returns existing gre instance or creates new gre instance with 'param' according to 'param' type.
         * 
         * @param {Object|number=} param If object or undefined, creates new gre instance.
         * 
         * If number, returns the gre instance which have 'param' widget id if exists.
         * 
         * Else throws an error.
         * 
         * @requires ng.$q
         * @requires ng.$window
         * @requires ng.$document
         * @requires ng.$rootScope
         * @requires ng.$timeout
         * 
         * @example
         * <pre>
         * //returns new gre instance
         * $grecaptcha({sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', theme: 'light', type: 'audio'}); 
         * 
         * // returns gre instance with 0 widget id
         * $grecaptcha(0); 
         * </pre>
         * 
         * @returns {Object} {@link wo.grecaptcha.$grecaptcha:gre gre} instance
         */
         
        function $grecaptcha(param){
            if( angular.isNumber(param) ) {
                if( greList[param] === void 0 ) {
                    throw new $greMinErr('nogre', 'There is no gre which has wiget_id {0}', param);
                }
                return greList[param];
            }
            
            else if( angular.isUndefined(param) || angular.isObject(param) ) {
                return new gre(param);
            }
            
            else {
                throw new $greMinErr('badconf', 'Grecaptcha configuration must be a number or object.');
            }
        }
        
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha#getLanguage
         * @methodOf wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Return the current languageCode.
         * 
         * @example
         * <pre>
         * // in config phase
         * $grecaptchaProvider.setSitekey('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
         * 
         * 
         * // in run phase
         * $grecaptcha.getSitekey(); // '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
         * </pre>
         * 
         * @returns {string} the languageCode
         */
        $grecaptcha.getLanguageCode = function(){
            return _languageCode;
        };
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha#getOnLoadMethodName
         * @methodOf wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Return the current onLoadMethodName.
         * 
         * @example
         * <pre>
         * // in config phase
         * $grecaptchaProvider.setOnLoadMethodName('myCustomLoadMethod');
         * 
         * // in run phase
         * $grecaptcha.getOnLoadMethodName(); // 'myCustomLoadMethod'
         * </pre>
         * @returns {string} the onLoadMetethodName
         */
        $grecaptcha.getOnLoadMethodName = function(){
            return _onLoadMethodName;
        };
        
        
        /**
         * @ngdoc function
         * 
         * @name wo.grecaptcha.$grecaptcha#getGrecaptcha
         * @methodOf wo.grecaptcha.$grecaptcha
         * 
         * @description
         * Return the current grecaptcha object.
         * 
         * @example
         * <pre>
         * // in config phase
         * $grecaptchaProvider.setGrecaptcha(window.grecaptcha);
         * 
         * // in run phase
         * $grecaptcha.getGrecaptcha(); // window.grecaptcha
         * </pre>
         * 
         * @returns {Object} grecaptcha object
         */
        $grecaptcha.getGrecaptcha = function() {
            return _grecaptcha;
        };
        
        
        return $grecaptcha;
    };
}