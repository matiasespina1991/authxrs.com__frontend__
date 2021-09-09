/**
 * Available spaces
 * _window.$usb - USBuilder class instance
 * _window.$usbcore - Mini library of various methods
 * _window.$usbdata - Data for import into the USBuilder
 * _window.$usof - UpSolution CSS Framework
 *
 * Note: Double underscore `__funcname` is introduced for functions that are created through `$usbcore.debounce(...)`.
 */
! function( $, undefined ) {

	// Private variables that are used only in the context of this function, it is necessary to optimize the code.
	var _window = window,
		_document = document;

	// Check for is set objects
	_window.$usbdata = _window.$usbdata || {};

	/**
	 * The functionality for expanding objects
	 * TODO: All methods `$usbcore.$el...` move under `$usbcore.$el( node )` to `$usbcore.$el.prototype`.
	 *
	 * @var {{}}
	 */
	$usbcore = {};

	/**
	 * The generate unique identifier.
	 *
	 * @param {string} prefix
	 * @return {string}
	 */
	$usbcore.genUniqueId = function( prefix ) {
		return ( prefix || '' ) + Math.random().toString( 36 ).substr( 2, 9 );
	};

	// Prototype mixin for all classes working with events
	$usbcore.mixins = {};
	$usbcore.mixins.events = {
		/**
		 * Attach a handler to an event for the class instance
		 *
		 * @param {string} eventType A string containing event type
		 * @param {function} handler A functionto execute each time the event is triggered
		 */
		on: function( eventType, handler ) {
			if ( this.$$events === undefined ) {
				this.$$events = {};
			}
			if ( this.$$events[ eventType ] === undefined ) {
				this.$$events[ eventType ] = [];
			}
			this.$$events[ eventType ].push( handler );
			return this;
		},
		/**
		 * Remove a previously-attached event handler from the class instance
		 *
		 * @param {string} eventType A string containing event type
		 * @param {function} [handler] The functionthat is to be no longer executed.
		 * @chainable
		 */
		off: function( eventType, handler ) {
			if (
				this.$$events === undefined
				|| this.$$events[ eventType ] === undefined
			) {
				return this;
			}
			if ( handler !== undefined ) {
				var handlerPos = $.inArray( handler, this.$$events[ eventType ] );
				if ( handlerPos !== - 1 ) {
					this.$$events[ eventType ].splice( handlerPos, 1 );
				}
			} else {
				this.$$events[ eventType ] = [];
			}
			return this;
		},
		/**
		 * Execute all handlers and behaviours attached to the class instance for the given event type
		 *
		 * @param {string} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		trigger: function( eventType, extraParams ) {
			if (
				this.$$events === undefined
				|| this.$$events[ eventType ] === undefined
				|| this.$$events[ eventType ].length === 0
			) {
				return this;
			}
			var params = ( arguments.length > 2 || ! $.isArray( extraParams ) )
				? [].slice.call( arguments, 1 )
				: extraParams;
			for ( var index = 0; index < this.$$events[ eventType ].length; index ++ ) {
				this.$$events[ eventType ][ index ].apply( this.$$events[ eventType ][ index ], params );
			}
			return this;
		}
	};

	/**
	 * Get the size of the element and its position relative to the viewport (Vanilla JS).
	 *
	 * @param {node} node The node from document
	 * @return {{}}
	 */
	$usbcore.$elRect = function( node ) {
		return this.isEl( node )
			? node.getBoundingClientRect()
			: {};
	};

	/**
	 * Add class (Vanilla JS).
	 *
	 * @param {node} node The node from document
	 * @param {string} className The class name
	 * @return self
	 */
	$usbcore.$elAddClass = function( node, className ) {
		if ( this.isEl( node ) && className ) {
			node.classList.add( className );
		}
		return this;
	};

	/**
	 * Remove class (Vanilla JS).
	 *
	 * @param {node} node The node from document
	 * @param {string} className The class name class name
	 * @return self
	 */
	$usbcore.$elRemoveClass = function( node, className ) {
		if ( this.isEl( node ) && className ) {
			( className.split( ' ' ) || [] ).map( function( itemClassName ) {
				if ( ! itemClassName ) return;
				node.classList.remove( itemClassName );
			} );
		}
		return this;
	};

	/**
	 * Determine whether any of the matched elements are assigned the given class (Vanilla JS).
	 * Note: The code is not used.
	 *
	 * @param {node} node The node from document
	 * @param {string} className The class name class name
	 * @return {boolean}
	 */
	$usbcore.$elHasClass = function( node, className ) {
		if ( this.isEl( node ) && className ) {
			var classList = ( className.split( ' ' ) || [] );
			for ( var i in classList ) {
				className = '' + classList[ i ];
				if ( ! className ) continue;
				if ( node.className.indexOf( className ) !== -1 ) {
					return true;
				}
			}
		}
		return false;
	};

	/**
	 * Get the attribute value (Vanilla JS)
	 *
	 * @param {node} node The node from document
	 * @param {string} name The attribute name
	 * @return {string}
	 */
	$usbcore.$elGetAttr = function( node, name ) {
		return ( this.isEl( node ) && !! node[ 'getAttribute' ] )
			? node.getAttribute( name ) || ''
			: '';
	};

	/**
	 * Add a new attribute or changes the value of an existing attribute on the selected element (Vanilla JS)
	 *
	 * @param {node} node The node from document
	 * @param {string} name The attribute name
	 * @param {string} value The value
	 * @return {self}
	 */
	$usbcore.$elSetAttr = function( node, name, value ) {
		if ( this.isEl( node ) && !! name ) {
			node.setAttribute( name, value );
		}
		return this;
	};

	/**
	 * Remove element (Vanilla JS)
	 *
	 * @param {node} node The node from document
	 * @return self
	 */
	$usbcore.$elRemove = function( node ) {
		if ( this.isEl( node ) ) {
			node.remove();
		}
		return this;
	};

	/**
	 * Determines whether the specified elm is node type (Vanilla JS)
	 *
	 * @param {node|mixed} node The node from document
	 * @return {boolean} True if the specified elm is node type, False otherwise
	 */
	$usbcore.isEl = function( node ) {
		return !! node && node.nodeType;
	};

	/**
	* Redirecting messages from a frame to an object event (Vanilla JS)
	*
	* @param {Event} e The Event interface represents an event which takes place in the DOM.
	* @param void
	* @private
	*/
	$usbcore._onMessage = function( e ) {
		var data;
		try {
			data = JSON.parse( e.data );
		} catch ( e ) {
			return;
		}
		if ( data instanceof Array && data[ /* Namespace */ 0 ] === 'usb' && data[ /* Event */ 1 ] !== undefined ) {
			this.trigger( data[ /* Event */ 1 ], data[ /* Arguments */ 2 ] || [] );
		}
	};

	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The functionwill be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the functionon the
	 * leading edge, instead of the trailing. The functionalso has a property 'clear'
	 * that is a functionwhich will clear the timer to prevent previously scheduled executions.
	 *
	 * @param {function} fn Function to wrap
	 * @param {number} wait Timeout in ms (`100`)
	 * @param {boolean} immediate Whether to execute at the beginning (`false`)
	 * @return {function}
	 */
	$usbcore.debounce = function( fn, wait, immediate ) {
		if ( fn === undefined ) {
			return $.noop;
		}
		var timeout, args, context, timestamp, result;
		if ( null == wait ) wait = 100;
		function later() {
			var last = Date.now() - timestamp;
			if ( last < wait && last >= 0 ) {
				timeout = setTimeout( later, wait - last );
			} else {
				timeout = null;
				if ( ! immediate ) {
					result = fn.apply( context, args );
					context = args = null;
				}
			}
		}
		var debounced = function() {
			context = this;
			args = arguments;
			timestamp = Date.now();
			var callNow = immediate && ! timeout;
			if ( ! timeout ) timeout = setTimeout( later, wait );
			if ( callNow ) {
				result = fn.apply( context, args );
				context = args = null;
			}
			return result;
		};
		debounced.prototype = {
			clear: function() {
				if ( timeout ) {
					clearTimeout( timeout );
					timeout = null;
				}
			},
			flush: function() {
				if ( timeout ) {
					result = fn.apply( context, args );
					context = args = null;
					clearTimeout( timeout );
					timeout = null;
				}
			}
		};

		return debounced;
	};

	/**
	 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
	 * @param {function} fn The callback function
	 * @param {int} delay The delay in milliseconds
	 */
	$usbcore.timeout = function( fn, delay ) {
		var start = new Date().getTime(),
			handle = {};

		function loop() {
			var current = new Date().getTime(),
				delta = current - start;
			delta >= delay
				? fn.call()
				: handle.value = _window.requestAnimationFrame( loop );
		};
		handle.value = _window.requestAnimationFrame( loop );
		return handle;
	};

	/**
	 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
	 * @param {int|object} fn The callback function
	 */
	$usbcore.clearTimeout = function( handle ) {
		if ( handle ) {
			_window.cancelAnimationFrame( handle.value );
		}
	};

	// Export to window
	_window.$usbcore = $usbcore;

	/**
	 * Available modes for use
	 * @type {[]}
	 */
	var _availableModes = [ 'editor', 'preview', 'drag:add', 'drag:move' ];

	/**
	 * Default page data object.
	 *
	 * @private
	 * @var {{}}
	 */
	var _defaultPageData = {
		content: '',	// Page content
		customCss: '',	// Page Custom CSS
		pageMeta: {},	// Page Meta Data
		fields: {},		// Page fields post_title, post_status, post_name etc.
	};

	/**
	 * @class USBuilder
	 * @param {string} container The main container
	 * TODO: Create a navigator for the panel. This will reduce the amount of code and apply the settings.
	 */
	var USBuilder = function( container ) {

		// Base elements
		this.$document = $( _document );
		this.$html = $( 'html', this.$document );
		this.$body = $( 'body', this.$html );
		// Main container
		this.$container = $( container );
		this.$notifyPrototype = $( '.us-builder-notification', this.$container );
		// Panel elements
		this.$panel = $( '.us-builder-panel', this.$container );
		this.$panelBody = $( '.us-builder-panel-body', this.$panel );
		this.$panelElms = $( '.us-builder-panel-elms', this.$panel );
		this.$panelImportContent = $( '.us-builder-panel-import-content', this.$panel );
		this.$panelImportTextarea = $( '.us-builder-panel-import-content textarea:first', this.$panel );
		this.$panelMenu = $( '.us-builder-panel-menu', this.$panel );
		this.$panelMessages = $( '.us-builder-panel-messages', this.$panel );
		this.$panelPageCustomCss = $( '.us-builder-panel-page-custom-css', this.$panel );
		this.$panelPageSettings = $( '.us-builder-panel-page-settings', this.$panel );
		this.$panelSearchElms = $( '[data-search-text]', this.$panel );
		this.$panelSearchField = $( 'input[name=search]', this.$panel );
		this.$panelSearchNoResult = $( '.us-builder-panel-elms-search-noresult', this.$panel );
		this.$panelTitle = $( '.us-builder-panel-header-title', this.$panel );
		// Panel Actions
		this.$panelActionElmAdd = $( '.usb_action_elm_add', this.$panel );
		this.$panelActionPageCustomCss = $( '.usb_action_show_page_custom_css', this.$panel );
		this.$panelActionPageSettings = $( '.usb_action_show_page_settings', this.$panel );
		this.$panelActionSaveChanges = $( '.usb_action_save_changes', this.$panel );
		this.$panelActionSavePastedContent = $( '.usb_action_save_pasted_content', this.$panel );
		this.$panelActionShowMenu = $( '.usb_action_show_menu', this.$panel );
		this.$panelActionToggleResponsiveMode = $( '.usb_action_toggle_responsive_mode', this.$panel );
		// Preview elements
		this.$preview = $( '.us-builder-preview', this.$container );
		this.$iframe = $( 'iframe', this.$preview );
		this.$iframeWrapper = $( '.us-builder-preview-iframe-wrapper', this.$preview );
		// Preview toolbar elements
		this.$previewToolbar = $( '.us-builder-preview-toolbar', this.$preview );
		this.$toolbarResponsiveStates = $( '[data-responsive-state]', this.$previewToolbar );

		// The add information from `UserAgent` to bind styles to specific browsers or browser versions.
		this.$html
			.attr( 'data-useragent', ( _window.navigator.userAgent || '' ).toLowerCase() );

		// Variables
		this.iframe = this.$iframe[0] || {};
		this.iframe.isLoad = false;
		this._fieldsets = {}; // Other fieldsets

		// Loaded page data from iframe.
		this.pageData = $.extend( {}, _defaultPageData );

		/**
		 * Private temp data
		 * @private
		 */
		this._$temp = {
			generatedIds: [], // List of generated IDs
			isProcessSave: false, // The AJAX process of saving data on the backend
			savedPageData: $.extend( {}, _defaultPageData ), // Save the last saved page data.
			transit: null, // Transit data
			xhr: {} // XMLHttpRequests
		};
		/**
		 * Public temp data
		 * @private
		 */
		this._temp = {};

		/**
		 * Default responsive state
		 * @var {string}
		 */
		this.defaultResponsiveState = 'default';

		/**
		 * The main container that is the root of the current page
		 */
		this.mainContainer = 'container';

		/**
		 * The variable store the current mode
		 *
		 * @private
		 * @var {string} Builder mode: 'editor', 'preview', 'drag:add', 'drag:move'
		 */
		this._mode = this.isHidePanel()
			? 'preview'
			: 'editor';

		/**
		 * @var {string} Hovered element's usbid, e.g. 'us_btn:1'
		 */
		this.hoveredElmId;

		/**
		 * @var {string} Selected element (shortcode) usbid, e.g. 'us_btn:1'
		 */
		this.selectedElmId;

		/**
		 * @var {string} Active fieldset for an element
		 */
		this.activeElmFieldset = null;

		/**
		 * @var {node} Active fieldset DOM element
		 */
		this.$activeElmFieldset = null;

		/**
		 * Load usb settings
		 * Note: The object stores all received settings from the backend,
		 * this is a single entry point for settings
		 */
		this.settings = {
			shortcode: {
				// List of container shortcodes (with a closing tag)
				containers: [],
				// List of shortcodes whose value is content
				edit_content: {},
				// List of default values for shortcodes
				default_values: {},
				// The a list of strict relations between shortcodes
				relations: {},
			},

			// Templates shortcodes or html
			template: {},

			// Default parameters for AJAX requests
			ajaxArgs: {},

			// Get screen sizes of responsive states
			breakpoints: {},

			// Default placeholder (Used in importing shortcodes)
			placeholder: '',

			// Post types for selection in Grid element (Used in importing shortcodes)
			grid_post_types: [],

			// Meta key for post custom css
			metaKeyForCustomCss: '_wpb_post_custom_css',

			// Link to preview page
			iframeSrc: '',

			// The start and end character settings for templates variable
			startSymbol: '{%',
			endSymbol: '%}'
		};
		if ( this.$container.is( '[onclick]' ) ) {
			this.settings = $.extend( this.settings, this.$container[ 0 ].onclick() || {} );
			this.$container.removeAttr( 'onclick' );
		}

		// Get fieldsets in the builder panel for elements
		this._elmsFieldset = {};
		$usbcore.timeout( function() { // Delay 1ms. allows you to skip initialization in the thread, it will be done later.
			$( '.us-builder-panel-fieldset', this.$container )
				.each( function( _, fieldset ) {
					var $fieldset = $( fieldset );
					this._elmsFieldset[ $fieldset.data('name') ] = $fieldset;
				}.bind( this ) );
		}.bind( this ), 1 );

		// This event is needed to get various data from the iframe
		_window.onmessage = $usbcore._onMessage.bind( this );

		/*
		 * When the user is trying to load another page, or reloads current page
		 * show a confirmation dialog when there are unsaved changes.
		 */
		_window.onbeforeunload = function( e ) {
			if ( this.isPageChanged() ) {
				e.preventDefault();
				// The return string is needed for browser compat.
				// See https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event.
				return this.getTextTranslation( 'page_leave_warning' );
			}
		}.bind( this );

		/**
		 * Bondable events.
		 *
		 * @private
		 * @var {{}}
		 */
		this._events = {
			// Global changes
			contentChange: this._contentChange.bind( this ),
			modeChange: this._modeChange.bind( this ),

			// Event handlers for devive toolbar
			hideResponsiveToolbar: this._hideResponsiveToolbar.bind( this ),
			switchStates: this._switchStates.bind( this ),

			// Event handlers for panel
			changePastedContent: this._changePastedContent.bind( this ),
			resetSearchInPanel: this._resetSearchInPanel.bind( this ),
			saveChanges: this._saveChanges.bind( this ),
			savePastedContent: this._savePastedContent.bind( this ),
			searchPanelElms: this._searchPanelElms.bind( this ),
			submitPreviewChanges: this._submitPreviewChanges.bind( this ),
			switchPanel: this._switchPanel.bind( this ),
			toggleResponsiveMode: this._toggleResponsiveMode.bind( this ),

			// Event handlers for panel screens
			showPanelImportContent: this._showPanelImportContent.bind( this ),
			showPanelPageCustomCss: this._showPanelPageCustomCss.bind( this ),
			showPanelPageSettings: this._showPanelPageSettings.bind( this ),

			// Track DragAndDrop events when adding a new element
			dragstart: this._dragstart.bind( this ), // Standard `dragstart` browser event handler.
			endDrag: this._endDrag.bind( this ),
			maybeDrag: this._maybeDrag.bind( this ),
			maybeStartDrag: this._maybeStartDrag.bind( this ),
			showPanelElms: this.showPanelAddElms.bind( this ),

			// Event handlers for fieldsets
			afterHideField: this._afterHideField.bind( this ),
			changeDesignField: this._changeDesignField.bind( this ),
			changeField: this._changeField.bind( this ),
			changeFieldResponsiveState: this._changeFieldResponsiveState.bind( this ),
			changePageCustomCss: this._changePageCustomCss.bind( this ),
			changePageMeta: this._changePageMeta.bind( this ),
			changePageSettings: this._changePageSettings.bind( this ),
			toggleTabs: this.$$fieldsets._toggleTabs.bind( this ),

			// Other handlers
			closeNotification: this._closeNotification.bind( this ),
			elmDelete: this._elmDelete.bind( this ),
			elmDuplicate: this._elmDuplicate.bind( this ),
			elmLeave: this._elmLeave.bind( this ),
			elmMove: this._elmMove.bind( this ),
			elmSelected: this._elmSelected.bind( this ),
			iframeLoad: this._iframeLoad.bind( this )
		};

		// Subscription to private events
		[
			'contentChange',			// The event is triggered every time the html on the preview page has changed
			'elmDelete',				// The handler when the delete element
			'elmDuplicate',				// The handler when the duplicate element
			'elmLeave',					// The event when the cursor moves out of the bounds of an element
			'elmMove',					// The event when the cursor enters the bounds of an element
			'elmSelected',				// The event of selecting an element, and getting an id
			'endDrag',					// The completion handler is drag and drop in iframe
			'modeChange'				// The watches the mode change
		].map( function( method ) {
			if ( !! this._events[ method ] && $.isFunction( this._events[ method ] ) ) {
				this.on( method, this._events[ method ] );
			}
		}.bind( this ) );

		// Fields initialization for page_custom_css
		var pageCustomCss = new $usof.field( $( '.type_css', this.$panelPageCustomCss )[0] );
			pageCustomCss.init( pageCustomCss.$row );
			pageCustomCss.on( 'change', $usbcore.debounce( this._events.changePageCustomCss, 1 ) );
		this._fieldsets.pageCustomCss = pageCustomCss;

		// Fields initialization for page fields
		var pageFields = new $usof.GroupParams( $( '.for_page_fields', this.$panelPageSettings )[0] );
		for ( var k in pageFields.fields ) {
			pageFields.fields[ k ].on( 'change', $usbcore.debounce( this._events.changePageSettings, 1 ) );
		}
		this._fieldsets.pageFields = pageFields;

		// Fields initialization for meta data
		var pageMeta = new $usof.GroupParams( $( '.us-builder-panel-page-meta', this.$panelPageSettings )[0] );
		for ( var k in pageMeta.fields ) {
			pageMeta.fields[ k ].on( 'change', $usbcore.debounce( this._events.changePageMeta, 1 ) );
		}
		this._fieldsets.pageMeta = pageMeta;

		// Events
		this.$document
			// Reset drag start defaults
			.on( 'dragstart', this._events.dragstart )
			// Close notification handler
			.on( 'click', '.usb_action_notification_close', this._events.closeNotification )
			// Hide responsive states toolbar
			.on( 'click', '.usb_action_hide_states_toolbar', this._events.hideResponsiveToolbar );

		this.$previewToolbar
			// Handler for switching responsive states on the toolbar
			.on( 'click', '[data-responsive-state]', this._events.switchStates );

		this.$iframe
			// Temporary - add highlight to first row
			.on( 'load', this._events.iframeLoad );

		this.$panel
			// Toggles the USOF tabs of the settings panel
			.on( 'click', '.usof-tabs-item', this._events.toggleTabs )
			// Show/Hide panel
			.on( 'click', '.usb_action_panel_switch', this._events.switchPanel )
			// Show a list of elements to add
			.on( 'click', '.usb_action_elm_add', this._events.showPanelElms )
			// Show/Hide responsive mode
			.on( 'click', '.usb_action_toggle_responsive_mode', this._events.toggleResponsiveMode )
			// Saving changes to the backend
			.on( 'click', '.usb_action_save_changes', this._events.saveChanges )
			// Search box character input handler
			.on( 'input', 'input[name=search]', $usbcore.debounce( this._events.searchPanelElms, 1 ) )
			// Handler for reset search in Panel
			.on( 'click', '.usb_action_reset_search', this._events.resetSearchInPanel )
			// Show import content `Paste Row/Section`
			.on( 'click', '.usb_action_show_import_content', this._events.showPanelImportContent )
			// Handler for changes in the import content.
			.on( 'change input blur', '.us-builder-panel-import-content textarea', this._events.changePastedContent )
			// Handler for save pasted content button.
			.on( 'click', '.usb_action_save_pasted_content', this._events.savePastedContent )
			// Handler for showing custom css input for the page
			.on( 'click', '.usb_action_show_page_custom_css', this._events.showPanelPageCustomCss )
			// Handler for showing page settings.
			.on( 'click', '.usb_action_show_page_settings', this._events.showPanelPageSettings )
			// Handler for create revision and show a preview page
			.on( 'submit', 'form#wp-preview', this._events.submitPreviewChanges );

		// Show the section "Add elements" (Default)
		this.showPanelAddElms();
	};

	/**
	 * @type {USBuilder}
	 */
	var $usbPrototype = USBuilder.prototype;

	/**
	 * Transports for send messages between windows or objects
	 */
	$.extend( $usbPrototype, $usbcore.mixins.events, {
		/**
		 * Send message to iframe
		 *
		 * @param {string} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		postMessage: function( eventType, extraParams ) {
			if ( ! this.iframe.isLoad ) return;
			this.iframe.contentWindow.postMessage( JSON.stringify( [ /* Namespace */'usb', eventType, extraParams ] ) );
		},

		/**
		 * Forwarding events through document
		 *
		 * @param {string} eventType A string containing event type
		 * @param {[]} extraParams Additional parameters to pass along to the event handler
		 * @chainable
		 */
		triggerDocument: function( eventType, extraParams ) {
			this.$document
				.trigger( /* Namespace */'usb.' + eventType, extraParams );
		}
	});

	/**
	 * Functionality for implementing notifications
	 */
	$.extend( $usbPrototype, {
		/**
		 * Types of notifications
		 */
		_NOTIFY_TYPE: {
			SUCCESS: 'success',
			ERROR: 'error'
		},

		/**
		 * Show notify.
		 *
		 * @param {string} message The message
		 * @param {string} type The type
		 *
		 * TODO: Add displaying multiple notifications as a list!
		 */
		notify: function( message, type ) {
			var // Time after which the notification will be remote.
				autoCloseDelay = 4000, // 4 seconds
				// Get prototype
				$notification = this.$notifyPrototype
					.clone()
					.removeClass( 'hidden' );
			// Set notification type
			if ( !! type && Object.values( this._NOTIFY_TYPE ).indexOf( type ) > -1 ) {
				$notification
					.addClass( 'type_' + type );
			}
			// If the notification type is not an error, then add a close timer.
			if ( type !== this._NOTIFY_TYPE.ERROR ) {
				$notification
					.addClass( 'auto_close' )
					.data( 'handle', $usbcore.timeout( function() {
						$notification
							.find( '.usb_action_notification_close' )
							.trigger( 'click' );
					}, autoCloseDelay ) );
			}
			// Add message to notification
			$notification
				.find( 'span' )
				.html( '' + message );
			// Show notification
			this.$panel
				.append( $notification );
		},

		/**
		 * Close notification handler
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_closeNotification: function( e ) {
			var $notification = $( e.target ).closest( '.us-builder-notification' ),
				handle = $notification.data( 'handle' );
			if ( !! handle ) {
				$usbcore
					.clearTimeout( handle );
			}
			$notification
				.fadeOut( 'fast', function() {
					$notification.remove();
				} );
		},

		/**
		 * Closes all notification
		 */
		closeAllNotification: function() {
			$( '.us-builder-notification', this.$body )
				.fadeOut( 'fast', function() {
					$( this ).remove();
				} );
		}
	} );

	/**
	 * Functional for implementing responsive states
	 */
	$.extend( $usbPrototype, {

		/**
		 * Determines if hide responsive toolbar
		 *
		 * @return {boolean} True if hide responsive toolbar, False otherwise.
		 */
		isHideResponsiveToolbar: function() {
			return ! this.$preview.is( '.responsive_mode' );
		},

		/**
		 * Hide responsive toolbar
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_hideResponsiveToolbar: function( e ) {
			if ( this.isHideResponsiveToolbar() ) return;
			// Hide responsive toolbar
			this.toggleResponsiveToolbar( false );
			// Set the preview state
			this.setResponsiveState(/* default */);
			// Forwarding events through document
			this.triggerDocument( 'setResponsiveState' /* default */ );
		},

		/**
		 * Handler for switching responsive states on the toolbar
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_switchStates: function( e ) {
			var responsiveState = $usbcore.$elGetAttr( e.target, 'data-responsive-state' );
			this.setResponsiveState( responsiveState );
			// Forwarding events through document
			this.triggerDocument( 'setResponsiveState', responsiveState );
		},

		/**
		 * Show/Hide responsive toolbar
		 *
		 * @param {boolean} mode The responsive mode
		 */
		toggleResponsiveToolbar: function( mode ) {
			mode = !! mode;
			this.$preview
				.toggleClass( 'responsive_mode', mode );
			this.$panelActionToggleResponsiveMode
				.toggleClass( 'active', mode );
		},

		/**
		 * Set the preview responsive state
		 *
		 * @param {string} [responsiveState] responsive state (if you do not pass the parameter, the default type will be set)
		 */
		setResponsiveState: function( responsiveState ) {

			// Check the correctness of the passed parameter
			if ( $.inArray( responsiveState, ( this.settings.responsiveStates || [] ) ) === -1 ) {
				responsiveState = this.defaultResponsiveState;
			}

			// Check the changes
			if (
				this.isHideResponsiveToolbar()
				&& this._$temp.currentResponsiveState === responsiveState
			) return;
			this._$temp.currentResponsiveState = responsiveState;

			// Highlight the current state
			this.$toolbarResponsiveStates
				.removeClass( 'active' )
				.filter( '[data-responsive-state="'+ responsiveState +'"]:first' )
				.addClass( 'active' );

			// Set the current mod
			this.$iframeWrapper
				.usMod( 'responsive_state', ( responsiveState === this.defaultResponsiveState ) ? /* Remove mod */false : responsiveState );

			// Apply max-width to the iframe
			this.$iframe
				.css( 'max-width', ( this.settings.breakpoints || {} )[ responsiveState ]['breakpoint'] || '100%' );
		},

		/**
		 * Get the current responsive state
		 *
		 * @return {string} responsive state slug
		 */
		getCurrentResponsiveState: function() {
			return this._$temp.currentResponsiveState || this.defaultResponsiveState;
		}
	} );

	/**
	 * Functionality for handling private events
	 */
	$.extend( $usbPrototype, {
		/**
		 * The handler that is called every time of the year the mode is changed
		 *
		 * @private
		 * @event handler
		 * @param {string} newMode
		 * @param {string} oldMode
		 */
		_modeChange: function( newMode, oldMode ) {
			// The hide all highlights
			this.postMessage( 'doAction', 'hideHighlight' );
		},

		/**
		 * Handler when the selecting an element, and getting an id
		 *
		 * @private
		 * @event handler
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmSelected: function( id ) {
			if (
				! this.isMode( 'editor' )
				|| ! this.doesElmExist( id )
				|| this.selectedElmId === id
			) {
				return;
			}
			if ( this.doesElmExist( id ) ) {
				this.initElmFieldset( id );
				// Setting initial positions for scrolling
				this.$panelBody
					.get( 0 )
					.scrollTo( /*X*/0, /*Y*/0 );
			} else {
				// The hide all highlights
				this.postMessage( 'doAction', 'hideHighlight' );
			}
		},

		/**
		 * Handler when the cursor enters the bounds of an element
		 *
		 * @private
		 * @event handler
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmMove: function( id ) {
			if (
				! this.isMode( 'editor' )
				|| ! this.doesElmExist( id )
				|| this.hoveredElmId == id
			) {
				return;
			}
			this.hoveredElmId = id;
		},

		/**
		 * Handler when the cursor moves out of the bounds of an element
		 *
		 * @private
		 * @event handler
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmLeave: function( id ) {
			if ( ! this.isMode( 'editor' ) ) {
				return;
			}
			this.hoveredElmId = null;
		},

		/**
		 * Handler when the duplicate element
		 *
		 * @private
		 * @event handler
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmDuplicate: function( id ) {
			if ( ! this.isValidId( id ) ) return;
			var // Definition is TTA (Tabs/Tour/Accordion) section
				isTTASection = ( 'vc_tta_section' === this.getElmType( id ) ),
				// Get parent ID
				parentId = this.getElmParentId( id ),
				// Get shortcode string
				strShortcode = this.getElmShortcode( id ) || '',
				newId; // New spare ID

			strShortcode = strShortcode
				// Removing all `el_id` from the design_options
				.replace( /(\s?el_id="([^\"]+)")/gi, '' )
				// Replace all identifiers
				.replace( /usbid="([^\"]+)"/gi, function( _, elmId ) {
					elmId = this.getSpareElmId( this.getElmType( elmId ) );
					if ( ! newId ) newId = elmId;
					return 'usbid="'+ elmId +'"';
				}.bind( this ) );

			if ( ! strShortcode || ! newId ) return;

			// Determine index for duplicate
			var index = 0,
				siblingsIds = this.getElmSiblingsId( id ) || [];
			for ( var i in siblingsIds ) {
				if ( siblingsIds[ i ] === id ) {
					index = ++i;
					break;
				}
			}

			// Added shortcode to content
			if ( ! this._addShortcodeToContent( parentId, index, strShortcode ) ) {
				return;
			}

			// Send a signal to add a duplicate
			this.trigger( 'contentChange' );

			var // Position to add on the preview page
				position = 'after',
				isContainer = this.isElmContainer( this.getElmType( id ) );

			// Add temporary loader
			this.postMessage( 'showPreloader', [ id, position, isContainer, /* Preloader id */newId ] );

			// Get a rendered shortcode
			this._renderShortcode( /* request id */newId, {
				data: {
					content: isTTASection // If the duplicate is item TTA section then we get the whole code TTA
						? this.getElmShortcode( parentId )
						: strShortcode
				},
				success: function( res ) {
					// Remove temporary loader
					this.postMessage( 'hidePreloader', newId );
					if ( ! res.success ) return;
					var html = '' + res.data.html;
					// Show all elements that have animations.
					html = html.replace( 'us_animate_this', 'us_animate_this start' );

					// Add new shortcde to preview page
					if ( isTTASection ) {
						this.postMessage( 'updateSelectedElm', [ parentId, html ] );
					} else {
						this.postMessage( 'insertElm', [ id, position, html ] );
						// Init its JS if needed
						this.postMessage( 'maybeInitElmJS', newId );
						// Initialize editing a duplicate element
						this.trigger( 'elmSelected', newId );
					}
					this.postMessage( 'duplicateElmId', newId );
				},
				abort: function( abortId ) {
					this.postMessage( 'hidePreloader', abortId );
				}
			} );
		},

		/**
		 * Handler when the delete element
		 *
		 * @private
		 * @event handler
		 * @param {string} removeId Shortcode's usbid, e.g. "us_btn:1"
		 */
		_elmDelete: function( removeId ) {
			if ( ! this.isValidId( removeId ) ) return;

			var // Get a list of children
				children = this.isElmContainer( removeId )
					? this.getElmChildren( removeId )
					: [];

			// Get confirmation on deleting elements of container type if they are not
			// empty and have content
			if (
				children.length
				&& this.isElmContainer( removeId )
			) {
				if ( ! confirm( this.getTextTranslation( 'all_inner_elms_del' ) ) ) return;
			}

			// The check if this is the last column then delete the parent row*
			if (
				this.isSecondElmContainer( removeId )
				&& this.getElmSiblingsId( removeId ).length === 1
			) {
				removeId = this.getElmParentId( removeId );
			}

			// Remove the element
			this.removeElm( removeId );
		},

		/**
		 * Loads a preview
		 *
		 * @private
		 * @event handler
		 */
		_iframeLoad: function() {
			this.iframe.isLoad = true;
			if ( ! this.iframe.contentDocument ) return;

			// Remove reboot class if installed.
			if ( this.$iframe.is('.reboot') ) {
				this.$iframe.removeClass( 'reboot' );
			}

			// Get iframe window.
			var iframeWindow = this.iframe.contentWindow;

			// If meta parameters are set for preview we ignore data saving.
			if ( ( iframeWindow.location.search || '' ).indexOf( '&meta' ) !== -1 ) {
				return;
			}

			// The hide all highlights
			this.postMessage( 'doAction', 'hideHighlight' );

			/**
			 * The importing page data from iframe.
			 * Note: The data is unrelated because the preview can be reloaded to show the changes.
			 *
			 * @type {{}}
			 */
			var pageData = $.extend( /* deep copy */true, {}, _defaultPageData, ( iframeWindow.$usbdata || {} ).pageData || {} );

			// Set custom css
			if ( this._fieldsets.pageCustomCss instanceof $usof.field ) {
				this._fieldsets.pageCustomCss.setValue( pageData.customCss );
			}
			// Set page fields
			if ( this._fieldsets.pageFields instanceof $usof.GroupParams ) {
				this._fieldsets.pageFields.setValues( pageData.fields, /* quiet mode */true );
				pageData.fields = this._fieldsets.pageFields.getValues(); // Note: Force for data type compatibility.
			}
			// Set meta data
			if ( this._fieldsets.pageMeta instanceof $usof.GroupParams ) {
				this._fieldsets.pageMeta.setValues( pageData.pageMeta, /* quiet mode */true );
				pageData.pageMeta = this._fieldsets.pageMeta.getValues(); // Note: Force for data type compatibility.
			}

			// Save the current and last saved data.
			this.pageData = pageData;
			this._$temp.savedPageData = $.extend( /* deep copy */true, {}, pageData );
		},

		/**
		 * Reload preview page
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__iframeReload: $usbcore.debounce( function() {
			this.$iframe.addClass( 'reboot' );
			this.iframe.src = this.settings.iframeSrc + '&' + $.param( { meta: this.pageData.pageMeta || {} } );
		}, 1 ),

		/**
		 * Handler when content changes on the preview page
		 * Note: All handler calls must be after change `$usb.pageData.content`!
		 *
		 * @private
		 * @event handler
		 */
		_contentChange: function() {
			// The Disabled/Enable save button
			var isPageChanged = this.isPageChanged();
			this.$panelActionSaveChanges
				.toggleClass( 'disabled', ! isPageChanged )
				.prop( 'disabled', ! isPageChanged );
		},

		/**
		 * This handler is called every time the column/column_inner in change
		 *
		 * @private
		 * @param {string} rootContainerId  The root container id
		 */
		_vcColumnChange: function( rootContainerId ) {
			// TODO: Here add an algorithm for calculating the width of the columns and
			// saving the sizes in the shortcode settings and transferring to the
			// render handler.

			// The handler is called every time the column/column_inner in change
			this.postMessage( 'vcColumnChange', /* row/row_inner ID */rootContainerId );
		},

		/**
		 * Handler for сhange in custom css.
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} _
		 * @param {string} css This is the actual value for any change.
		 */
		_changePageCustomCss: function( _, css ) {
			// Update page custom css.
			this.pageData.customCss = '' + css;
			// Update styles on the preview page.
			this.postMessage( 'updatePageCustomCss', this.pageData.customCss );
			// Send a signal to update element field.
			this.__contentChange.call( this );
		},

		/**
		 * Handler for сhange in custom css
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} field
		 * @param {mixed} value
		 */
		_changePageSettings: function( field, value ) {
			if ( ! ( field instanceof $usof.field ) ) return;
			var name = field.name;
			// Update page field
			this.pageData.fields[ name ] = value;
			if ( name === 'post_title' ) {
				// Update the title of the builder page
				_document.title = ( this.settings.adminPageTitleMask || value ).replace( '%s', value );
				// Update all title on the preview page
				this.postMessage( 'updateElmContent', [ /* Selectors */'.post_title,head > title', value, /* Method */'text' ] );
			}
			// Send a signal to update element field
			this.__contentChange.call( this );
		},

		/**
		 * Handler for сhange in page meta data
		 * Note: The second parameter in the method is passed a value, but this may differ
		 * from ` arguments[1] !== usofField.getValue()` by data type. Example: `1,2` !== [1,2].
		 *
		 * @private
		 * @event handler
		 * @param {$usof.field} usofField
		 */
		_changePageMeta: function( usofField ) {
			if ( ! ( usofField instanceof $usof.field ) ) return;

			// Get field name
			var name = usofField.name,
				value = usofField.getValue();

			// Check the parameter changes.
			if ( this.pageData.pageMeta[ name ] === value ) return;

			// Update the value for the name.
			this.pageData.pageMeta[ name ] = value;

			// Reload Preview Page (Data change check happens inside the method)
			if ( !! usofField.$row.data( 'usb-preview' ) ) {
				// Reload the page after saving.
				this._$temp.isReloadPreviewAfterSave = true;
				this.__iframeReload.call( this );
			}

			// Send a signal to update element field
			this.__contentChange.call( this );
		},
	});

	/**
	 * Functionality for adding new elements via Drag And Drop
	 */
	$.extend( $usbPrototype, {

		// The number of pixels when dragging after which the movement will be initialized
		_dragStartDistance: 5, // The recommended value of 3, which will be optimal for all browsers, was found out after tests

		/**
		 * Show the section "Add elements"
		 *
		 * @event handler
		 */
		showPanelAddElms: function() {
			var $actionElmAdd = this.$panelActionElmAdd;
			if ( $actionElmAdd.is( '.active' ) ) return;

			this.clearPanel(); // Hide all sections
			this.postMessage( 'doAction', 'hideHighlight' );

			// Set focus to search field
			// Note: Focus does not work when the developer console is open!
			$usbcore.timeout( function() {
				this.$panelSearchField
					.focus();
			}.bind( this ), 1 );

			// Get add button
			$actionElmAdd // Set active class to add button
				.addClass( 'active' );
			this.$panelElms // Show all list elements
				.removeClass( 'hidden' );
			// Set the panel header title
			this.setPanelTitle( /* Get action title */$actionElmAdd.attr( 'title' ) );
			this.$document
				// Track events for DragAndDrop
				.on( 'mousedown', this._events.maybeStartDrag )
				.on( 'mousemove', this._events.maybeDrag )
				.on( 'mouseup', this._events.endDrag );
			// Reset all data by default for more reliable operation
			this.setTemp( 'drag', {
				startX: 0, // X-axis start position
				startY: 0 // Y-axis start position
			} );
		},

		/**
		 * Hide the section "Add elements"
		 *
		 * @private
		 */
		_hidePanelAddElms: function() {
			this.$panelActionElmAdd // Remove active class from button
				.removeClass( 'active' );
			this.$panelElms // Hide all elements
				.addClass( 'hidden' );
			this.$document
				// Remove events
				.off( 'mousedown', this._events.maybeStartDrag )
				.off( 'mousemove', this._events.maybeDrag )
				.off( 'mouseup', this._events.endDrag );
			// Flush all data for drag
			this.flushTemp( 'drag' );
		},

		/**
		 * Get a new unique id for an element
		 *
		 * @return {string} The unique id e.g. "us_btn:1"
		 */
		getNewElmId: function() {
			return ( this.getTemp( 'drag' ) || {} )[ 'newElmId' ] || '';
		},

		/**
		 * Get the event data for send iframe
		 *
		 * @private
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 * @return {{}} The event data
		 */
		_getEventData: function( e ) {
			if ( ! this.iframe.isLoad ) return;
			// Get data on the coordinates of the mouse for iframe and relative to this iframe
			var rect = $usbcore.$elRect( this.iframe ),
				iframeWindow = this.iframe.contentWindow,
				data = {
					clientX: e.clientX,
					clientY: e.clientY,
					eventX: e.pageX - rect.x,
					eventY: e.pageY - rect.y,
					pageX: ( e.pageX + iframeWindow.scrollX ) - rect.x,
					pageY: ( e.pageY + iframeWindow.scrollY ) - rect.y,
				};
			// Additional check of values for errors
			for ( var prop in data ) {
				var value = data[ prop ] || NaN;
				if ( isNaN( value ) || value < 0 ) {
					data[ prop ] = 0;
				} else {
					data[ prop ] = Math.ceil( data[ prop ] );
				}
			}
			return data;
		},

		/**
		 * Determines if parent dragging
		 *
		 * @return {boolean} True if dragging, False otherwise
		 */
		isParentDragging: function() {
			return !! this._$temp.isParentDragging;
		},

		/**
		 * Show the transit
		 *
		 * @param {string} type The type element
		 * @param {number} pageX The event.pageX
		 * @param {number} pageY The event.pageY
		 */
		showTransit: function( type, pageX, pageY ) {
			if (
				! type
				|| this.isUndefined( pageX )
				|| this.isUndefined( pageY )
			) return;

			// The destroying an object if it is set
			if ( this.hasTransit() ) {
				this.hideTransit();
			}

			// If type is an `id` then we get from `id` type
			if ( this.isValidId( type ) ) {
				type = this.getElmType( type );
			}

			var // Get a node by attribute type
				target = _document.querySelector( '[data-type="'+ type +'"]' );
			if ( ! $usbcore.isEl( target ) ) return;

			var // Create a transit element to snap into the mouse while moving
				rect = $usbcore.$elRect( target ),
				isModeAdd = !! this.isMode( 'drag:add' ),
				// Get start offset
				offset = {
					x: Math.abs( pageX - ( isModeAdd ? rect.left : /*not offset*/0 ) ), // X axis
					y: Math.abs( pageY - ( isModeAdd ? rect.top : /*not offset*/0 ) )	// Y axis
				};

			// Checking the value on NAN
			for ( var prop in offset ) {
				if ( isNaN( offset[ prop ] || NaN ) ) {
					offset[ prop ] = 0;
				}
			}

			// The create an object for transit
			var transit = {
				target: target.cloneNode( true ),
				offset: offset,
			};

			$usbcore // Remove class `hidden` if element is hidden
				.$elRemoveClass( transit.target, 'hidden' );

			// Set the height and width of the transit element
			[ 'width', 'height' ].map( function( prop ) {
				var value = Math.ceil( rect[ prop ] );
				transit.target.style[ prop ] = value
					? value + 'px'
					: 'auto';
			}.bind( this ) );

			$usbcore // Add a css class to apply basic styles
				.$elAddClass( transit.target, 'elm_transit' )
				.$elAddClass( transit.target, ! isModeAdd ? 'mode_drag_move' : '' );

			// Add transit element to document
			_document.body.append( transit.target );

			// Save transit to _$temp
			this._$temp.transit = transit;
		},

		/**
		 * Determines if transit
		 *
		 * @return {boolean} True if transit, False otherwise.
		 */
		hasTransit: function() {
			return !! this._$temp.transit;
		},

		/**
		 * Set the transit position
		 *
		 * @param {number} pageX The event.pageX
		 * @param {number} pageY The event.pageY
		 */
		setTransitPosition: function( pageX, pageY ) {
			if (
				! this.hasTransit()
				|| ! this.isMode( 'drag:add', 'drag:move' )
			) return;
			var transit = this._$temp.transit || {};
			if ( $usbcore.isEl( transit.target ) ) {
				transit.target.style.left = ( pageX - transit.offset.x ).toFixed( 3 ) + 'px';
				transit.target.style.top = ( pageY - transit.offset.y ).toFixed( 3 ) + 'px';
			}
		},

		/**
		 * Hide the transit
		 */
		hideTransit: function() {
			var transit = this._$temp.transit || {};
			if (
				! this.hasTransit()
				|| ! $usbcore.isEl( transit.target )
			) return;
			$usbcore.$elRemove( transit.target );
			delete this._$temp.transit;
		},

		/**
		 * Determines the start of moving elements
		 * This should be a single method to determine if something needs to be moved or not
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeStartDrag: function( e ) {
			// If there is no target, then terminate the method
			if ( ! this.iframe.isLoad || ! e.target ) return;
			var i = 0,
				found,
				target = e.target,
				maxIteration = 1000;
			// The check if the goal is a new element
			while ( ! ( found = !! $usbcore.$elGetAttr( target, 'data-type' ) ) && i++ < maxIteration ) {
				if ( ! target.parentNode ) {
					found = false;
					break;
				}
				target = target.parentNode;
			}
			// If it was possible to determine the element, then we will save all the data into a temporary variable
			if ( found ) {
				// Set temp data
				this.setTemp( 'drag', {
					startDrag: true,
					startX: e.pageX || 0,
					startY: e.pageY || 0,
					target: target,
				} );
			}
		},

		/**
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_maybeDrag: function( e ) {
			var temp = this.getTemp( 'drag' );
			if ( ! temp.startDrag || ! temp.target ) return;

			// Get offsets from origin along axis X and Y
			var diffX = Math.abs( temp.startX - e.pageX ),
				diffY = Math.abs( temp.startY - e.pageY );

			// The check the distance of the germinated mouse and if it is more than
			// the specified one, then activate all the necessary methods
			if ( diffX > this._dragStartDistance || diffY > this._dragStartDistance ) {
				if ( this.isMode( 'editor' ) ) {
					// Set state parent dragging
					this._$temp.isParentDragging = true;
					// Selecting mode of adding elements
					this.setMode( 'drag:add' );
					// Get target type
					var tempTargetType = $usbcore.$elGetAttr( temp.target, 'data-type' );
					// Get new element ID ( Saving to `temp` is required for this.getNewElmId() )
					temp.newElmId = this.getSpareElmId( tempTargetType );
					// Show the transit
					this.showTransit( tempTargetType, e.pageX, e.pageY );
					// Add helpers classes for visual control
					$usbcore
						.$elAddClass( temp.target, 'elm_add_shadow' )
						.$elAddClass( _document.body, 'elm_add_draging' );
				}
				// Firefox blocks events between current page and iframe so will use onParentEventData
				// Other browsers in iframe intercepts events
				if ( this.isFirefox() && this.isParentDragging() ) {
					var eventData =  this._getEventData( e );
					if ( eventData.pageX ) {
						this.postMessage( 'onParentEventData', [ '_maybeDrop', eventData ] );
					}
				}

				// Set the transit element position
				this.setTransitPosition( e.pageX, e.pageY );
			}
		},

		/**
		 * End a drag
		 *
		 * @private
		 * @event handler
		 */
		_endDrag: function() {
			if ( ! this.iframe.isLoad ) return;

			// Get temp data
			var temp = this.getTemp( 'drag' );

			// Remove classes
			if ( $usbcore.isEl( temp.target ) ) {
				$usbcore
					.$elRemoveClass( temp.target, 'elm_add_shadow' )
					.$elRemoveClass( _document.body, 'elm_add_draging' );
			}

			// Check is parent dragging
			if ( ! this.isParentDragging() ) {
				this.flushTemp( 'drag' );
				return;
			};

			// Create the new element
			if ( !! temp.parentId && !! temp.currentId ) {
				this.createElm( this.getElmType( temp.currentId ), temp.parentId, temp.currentIndex || 0 );
			}

			// Firefox blocks events between current page and frame so will use onParentEventData
			// Other browsers in iframe intercepts events
			if ( this.isFirefox() ) {
				this.postMessage( 'onParentEventData', '_endDrag' );
			}

			// Reset all data
			this.hideTransit();
			this._$temp.isParentDragging = false;
			this.flushTemp( 'drag' );
			this.setMode( 'editor' );
			// Clearing all asset and temporary data to move
			this.postMessage( 'doAction', 'clearDragAssets' );
		},

		/**
		 * Standard `dragstart` browser event handler.
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 * @return {boolean} If the event occurs in context `MediaFrame`, then we will enable it, otherwise we will disable it.
		 */
		_dragstart: function( e ) {
			return !! $( e.target ).closest( '.media-frame' ).length;
		}
	} );

	/**
	 * Functionality for the implementation of the Panel
	 */
	$.extend( $usbPrototype, {

		/**
		 * Hide all sections
		 */
		clearPanel: function() {
			this._destroyElmFieldset(); // Destroy a set of fields for an element
			this._hidePanelAddElms(); // Hide the section "Add elements".
			this._hidePanelImportContent(); // Hide the import content (Paste Row/Section).
			this._hidePanelMessages(); // Hide the section "Messages".
			this._hidePanelPageCustomCss(); // Hide the panel page custom css.
			this._hidePanelPageSettings(); // Hide the panel page settings.
		},

		/**
		 * Determines if hide panel
		 *
		 * @return {boolean} True if hide panel, False otherwise
		 */
		isHidePanel: function() {
			return this.$panel.is( '.hide' )
		},

		/**
		 * Set the panel header title
		 *
		 * @param {string} title The title
		 */
		setPanelTitle: function ( title ) {
			this.$panelTitle.html( '' + title );
		},

		/**
		 * Get the current preview iframe offset
		 *
		 * @return {{}} Returns the offset along the X and Y axes
		 */
		getCurrentPreviewOffset: function() {
			var rect = $usbcore.$elRect( this.iframe );
			return {
				y: rect.y || 0,
				x: rect.x || 0
			};
		},

		/**
		 * Send setResponsiveState event to main document
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @type debounced
		 */
		__setResponsiveState: $usbcore.debounce( function() {
			this.triggerDocument.call( this, 'setResponsiveState', this.getCurrentResponsiveState() );
		}, 100 ),

		/**
		 * Initializes the fieldset.
		 * TODO: Update after USOF2 implementation!
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		initElmFieldset: function( id ) {
			if ( ! this.doesElmExist( id ) ) {
				return;
			}

			var panelTitle,
				name = this.getElmName( id ),
				values = this.getElmValues( id ) || {};

			if ( name && this._elmsFieldset && !! this._elmsFieldset[ name ] ) {
				this.clearPanel(); // Hide all sections

				// Set value to variables
				this.selectedElmId = id;
				this.$activeElmFieldset = this._elmsFieldset[ name ].clone();
				this.activeElmFieldset = new $usof.GroupParams( this.$activeElmFieldset );

				// Get title for element
				panelTitle = this.getElmTitle( id );

				// Set value to fieldsets
				this.$activeElmFieldset.addClass( 'inited usof-container' );
				this.activeElmFieldset.setValues( values, /* quiet mode */true );
				this.$panelBody
					.prepend( this.$activeElmFieldset );

				// Forwarding events through document on item selection
				if ( ! this.isHideResponsiveToolbar() ) {
					this.__setResponsiveState.call( this );
				}

				// Initialization check and watch on field events
				for ( var fieldId in this.activeElmFieldset.fields ) {
					var field = this.activeElmFieldset.fields[ fieldId ];
					field
						.on( 'change', this._events.changeField )
						.on( 'afterHide', this._events.afterHideField )
						// The event only exists in the `design_options`
						.on( 'changeDesignField', this._events.changeDesignField )
						// Watches the choice of responsive state in the fields
						.on( 'changeResponsiveState', this._events.changeFieldResponsiveState );
				}

				// Initialization check and watch on group events
				for ( var groupName in ( this.activeElmFieldset.groups || {} ) ) {
					this.activeElmFieldset.groups[ groupName ]
						.on( 'change', this._events.changeField );
				}

				// Adds tabs data
				if ( this.activeElmFieldset.isGroupParams ) {
					this.activeElmFieldset.$tabsItems = $( '.usof-tabs-item', this.$activeElmFieldset );
					this.activeElmFieldset.$tabsSections = $( '.usof-tabs-section', this.$activeElmFieldset );
					// Run the method to check for visible fields and control the showing of tabs
					this.$$fieldsets.autoShowingTabs.call( this );
				}
			} else {
				// Get title from other shortcode
				panelTitle = this.getElmName( id );
				// Display message on panel
				this.showPanelMessage( this.getTextTranslation( 'editing_not_supported' ) );
			}

			// Show highlight for editable element
			this.postMessage( 'doAction', [ 'showEditableHighlight', id ] );

			// Set shortcode title to header title
			this.setPanelTitle( panelTitle );
		},

		/**
		 * Destroy a set of fields for an element
		 *
		 * @private
		 */
		_destroyElmFieldset: function() {
			if ( ! this.activeElmFieldset ) {
				return;
			}
			// Remove a node
			if ( this.$activeElmFieldset instanceof $ ) {
				this.$activeElmFieldset.remove();
			}
			// Hide highlight for editable element
			this.postMessage( 'doAction', 'hideEditableHighlight' );
			// Destroy all data
			this.selectedElmId = null;
			this.activeElmFieldset = null;
			this.$activeElmFieldset = null;
		},

		/**
		 * Normalization of instructions
		 * Note: `instructions = true` - force an ajax request to get the element code
		 *
		 * @private
		 * @param {mixed} instructions Instructions for previewing elements
		 * @return {mixed}
		 */
		_normalizeInstructions: function( instructions ) {
			// The converting to an array of instructions
			if ( !! instructions && ! $.isArray( instructions ) && instructions !== true ) {
				instructions = $.isPlainObject( instructions )
					? [ instructions ]
					: [];
			}
			return instructions;
		},

		/**
		 * Field changes for a design_options
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private
		 * @param {{}} _
		 * @param {$usof.field|$usof.Group} field
		 * @param {$usof.field} designField
		 */
		_changeDesignField: function( field, designField ) {
			if ( field.type !== 'design_options' ) return;
			this._changeField( designField, designField.getValue(), /* Skip save option */true );
		},

		/**
		 * Handler for selecting the responsive state in the $usof.Field
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private
		 * @param {{}} _
		 * @param {$usof.field|$usof.Group} field
		 * @param {string} responsiveState
		 */
		_changeFieldResponsiveState: function( field, responsiveState ) {
			// Show/Hide responsive toolbar
			this.toggleResponsiveToolbar( !! responsiveState );
			// Set the preview responsive state
			this.setResponsiveState( responsiveState );
		},

		/**
		 * Send a signal to update element field
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {[]} args Array of arguments for the trigger
		 * @type debounced
		 */
		__contentChange: $usbcore.debounce( function( args ) {
			this.trigger( 'contentChange', args );
		}, 1 ),

		/**
		 * Controls the number of columns in a row
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {mixed} layout The layout
		 * @type debounced
		 */
		__updateColumnsLayout: $usbcore.debounce( function( id, layout ) {
			this._updateColumnsLayout( id, layout );
		}, 1 ),

		/**
		 * Updating content after 1s
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {function} fn The function to be executed
		 * @type debounced
		 */
		__updateShortcode: $usbcore.debounce( function( fn ) {
			if ( $.isFunction( fn ) ) fn();
		}, 1 ),

		/**
		 * Updating content after 150s
		 * Note: The code is moved to a separate function since `debounced` must be initialized before calling.
		 *
		 * @private
		 * @param {function} fn The function to be executed
		 * @type debounced
		 */
		__updateShortcode_long: $usbcore.debounce( function( fn ) {
			if ( $.isFunction( fn ) ) fn();
		}, 150 ),

		/**
		 * Field changes for a fieldsets
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param {$usof.field|$usof.Group} usofField
		 * @param {mixed} _ The usofField value
		 * @param {boolean} _skipSave Skip save option
		 */
		_changeField: function( usofField, _, _skipSave ) {
			// Run the method to check for visible fields and control the showing of tabs
			this.$$fieldsets.autoShowingTabs.call( this );

			// If there is no editable element, then exit the method
			if ( ! this.selectedElmId ) return;

			var isGroup = usofField instanceof $usof.Group,
				isField = usofField instanceof $usof.field;

			// If the object is not a field or a group then exit the method
			if ( ! ( isField || isGroup ) ) return;

			var id = this.selectedElmId,
				name = usofField.name || usofField.groupName,
				elmType = this.getElmType( id ),
				fieldType = isField
					? usofField.type
					: 'group',
				value = usofField.getValue(),
				instructions = isField
					// Get preview settings for field
					? usofField.$row.data( 'usb-preview' )
					// Get preview settings for group
					: usofField.$field.data( 'usb-preview' );

			// The normalization of instructions
			instructions = this._normalizeInstructions( instructions );

			// Execute callback functions if any
			if ( $.isArray( instructions ) ) {
				// Get a list of callback functions for parameters
				var previewCallbacks = $.isPlainObject( _window.$usbdata.previewCallbacks )
					? _window.$usbdata.previewCallbacks
					: {};
				for ( var i in instructions ) {
					var funcName = ( elmType + '_' + name ).toLowerCase();
					if (
						! instructions[ i ][ 'callback' ]
						|| ! $.isFunction( previewCallbacks[ funcName ] )
					) continue;
					try {
						instructions = previewCallbacks[ funcName ]( value ) || /* Default */true;
					} catch( e ) {
						this._debugLog( 'Error executing callback function in instructions', e );
					}
				}
				// The normalization of instructions
				instructions = this._normalizeInstructions( instructions );
			}

			/**
			 * Updates to shortcode options
			 */
			var _updateShortcode = function() {
				var defaultValue = usofField.getDefaultValue(),
					oldShortcode = this.getElmShortcode( id );
				if ( ! oldShortcode ) {
					return;
				}

				var shortcodeObj = this.parseShortcode( oldShortcode ),
					/**
					 * Shortcode which stores the type as content
					 * Note: `content` is a reserved name which implies that the values are the content of the
					 * shortcode for example: [example]content[/example]
					 */
					isShortcodeContent = ( [ 'editor' ].indexOf( fieldType ) !== -1 || name === 'content' );

				// Attribute updates
				var atts = this.parseAtts( shortcodeObj.atts );
				if (
					isShortcodeContent
					|| (
						defaultValue === value
						// Excluding a group so the value contains all settings
						&& fieldType !== 'group'
					)
				) {
					delete atts[ name ];
				} else {
					atts[ name ] = value;
				}
				shortcodeObj.atts = this.buildAtts( atts );

				// Set value as shortcode content
				if ( isShortcodeContent ) {
					shortcodeObj.content = value;
				}

				var updatedShortcode = this.buildShortcode( shortcodeObj );

				// Shortcode updates
				this.pageData.content = ( '' + this.pageData.content )
					.replace( shortcodeObj.input, updatedShortcode );

				// Send a signal to update element field
				this.__contentChange.call( this );

				// Changing columns layout according to the row setting
				if ( $.inArray( elmType, [ 'vc_row', 'vc_row_inner' ] ) !== -1 && name === 'columns' ) {
					this.__updateColumnsLayout.call( this, id, value );
				}

				// Update html code
				if ( instructions === true ) {
					// When editing section from TTA, force the entire TTA to be updated
					if ( 'vc_tta_section' === this.getElmType( id ) ) {
						id = this.getElmParentId( id );
						updatedShortcode = this.getElmShortcode( id );
					}

					this.postMessage( 'showPreloader', id );
					// Get a rendered shortcode
					this._renderShortcode( /* request id */'_renderShortcode', {
						data: {
							content: updatedShortcode
						},
						success: function( res ) {
							// At this point, there is no need to post message `hidePreloader`
							// since the element is loader and will be replaced with a new code
							if ( res.success ) {
								var html = ( ''+res.data.html )
									// Enable animation appearance
									.replace( /(class=".*?animate_this)/i, "$1 start" );
								this.postMessage( 'updateSelectedElm', [ id, html ] );
							}
						}
					} );
				}
			}.bind( this );

			// Skip saving parameter to shortcode
			if ( _skipSave !== true ) {
				if ( fieldType === 'color' && instructions === true ) {
					this.__updateShortcode( _updateShortcode );
				} else {
					this.__updateShortcode_long( _updateShortcode );
				}
			}

			// Spot updating styles, classes or other parameters
			if ( instructions !== true && instructions ) {
				var doPostMessagePreviewParamChange = function() {
					this.postMessage( 'onPreviewParamChange', [ id, instructions, value, fieldType ] );
				}.bind( this );

				// TODO maybe rewrite _changeField / _changeDesignField functions so this code is placed in better location
				// Checking if we are doing preview changes for design options
				if ( fieldType === 'design_options' ) {
					var jsoncss,
						bgAttachment,
						hasBgAttachment = false,
						bgAttachmentLoaded = false;
					try {
						jsoncss = JSON.parse( unescape( '' + value ) || '{}' );
					} catch ( e ) {
						jsoncss = {};
					}

					// Check if the design options have background image set
					if ( jsoncss.default !== undefined && jsoncss.default['background-image'] !== undefined ) {
						hasBgAttachment = true;
						bgAttachment = wp.media.attachment( parseInt( jsoncss.default[ 'background-image' ] ) );
						// Check if the background image URL info was loaded
						if ( bgAttachment.attributes.url !== undefined ) {
							bgAttachmentLoaded = true;
						}
					}
					// In case the design options have background image and it's info wasn't loaded yet ...
					// ... fire preview change event only after trying to load the image info
					if ( hasBgAttachment && ! bgAttachmentLoaded ) {
						bgAttachment.fetch( { success: doPostMessagePreviewParamChange } );
					} else {
						doPostMessagePreviewParamChange();
					}

					// For fields with type other than design options, just fire preview change event
				} else {
					doPostMessagePreviewParamChange();
				}
			}
		},

		/**
		 * Field handler after hidden for a fieldsets
		 * TODO: Update after USOF2 implementation!
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param $usof.field usofField The field object
		 */
		_afterHideField: function( usofField ) {
			if ( usofField instanceof $usof.field && usofField.inited ) {
				// Set default value for hidden field
				usofField.setValue( usofField.getDefaultValue(), /* not quiet */false );
			}
		},

		/**
		 * Switch Show/Hide panel
		 *
		 * @private
		 * @event handler
		 */
		_switchPanel: function() {
			var isHide = ! this.isHidePanel();
			this.$panel
				.toggleClass( 'hide', isHide );
			if ( isHide ) {
				this.clearPanel(); // Hide all sections
				this.postMessage( 'doAction', 'hideHighlight' );
			} else {
				this.showPanelAddElms(); // Show the section "Add elements"
			}
			this.setMode( isHide ? 'preview' : 'editor' );
			// Send a message about changing the panel display
			this.postMessage( 'changeSwitchPanel' );
		},

		/**
		 * Search box character input handler
		 *
		 * @private
		 * @event handler
		 */
		_searchPanelElms: function() {
			var $input = this.$panelSearchField,
				isFoundResult = true,
				value = ( $input[0].value || '' ).trim().toLowerCase();
			$input // Reset button displaying control
				.next( '.usb_action_reset_search' )
				.toggleClass( 'hidden', ! value );
			// By default, hide all elements that are included in the search
			this.$panelSearchElms
				.toggleClass( 'hidden', !! value );
			if ( value ) {
				// Show all elements that contain a search string in their title
				isFoundResult = !! this.$panelSearchElms
					.filter( '[data-search-text^="' + value + '"], [data-search-text*="' + value + '"]' )
					.removeClass( 'hidden' )
					.length;
			}
			// Control the output of lists and headers
			$( '.us-builder-panel-elms-list', this.$panelElms )
				.each( function( _, list ) {
					var isEmptyList = ! $( '[data-search-text]:not(.hidden)', list ).length;
					$( list )
						.toggleClass( 'hidden', isEmptyList )
						.prev( '.us-builder-panel-elms-header' )
						.toggleClass( 'hidden', isEmptyList );
				} );
			// The output of an empty result message
			this.$panelSearchNoResult
				.toggleClass( 'hidden', isFoundResult );
		},

		/**
		 * Reset search in Panel
		 *
		 * @private
		 * @event handler
		 */
		_resetSearchInPanel: function() {
			var $input = this.$panelSearchField;
			if ( ! $input.val() ) return;
			$input
				.val( '' )
				.trigger( 'input' );
		},

		/**
		 * Show the panel messages
		 *
		 * @param {string} text
		 */
		showPanelMessage: function( text ) {
			this.clearPanel(); // Hide all sections
			this.$panelMessages
				.removeClass( 'hidden' )
				.html( text );
		},

		/**
		 * Hide the panel messages
		 *
		 * @private
		 */
		_hidePanelMessages: function() {
			this.$panelMessages
				.addClass( 'hidden' )
				.html( '' );
		},

		/**
		 * Toggle Responsive Mode
		 *
		 * @private
		 * @event handler
		 */
		_toggleResponsiveMode: function() {
			// Show/Hide responsive toolbar
			this.toggleResponsiveToolbar( this.isHideResponsiveToolbar() );
			// Set the default responsive state
			this.setResponsiveState(/* default */);
			// Forwarding events through document
			this.triggerDocument( 'setResponsiveState'/*, 'default' */ );
		},

		/**
		 * Show import content (Paste Row/Section)
		 *
		 * @private
		 * @event handler
		 */
		_showPanelImportContent: function() {
			this.clearPanel();
			this.$panelImportContent.removeClass( 'hidden' );
			// Clear field and set focus to it
			this.$panelImportTextarea
				.val( '' )
				.focus()
				.removeClass( 'validate_error' );
			// Disable save button
			this.$panelActionSavePastedContent
				.prop( 'disabled', true )
				.addClass( 'disabled' );
			// Update panel title
			this.setPanelTitle( this.getTextTranslation( 'paste_row' ) );
		},

		/**
		 * Hide import content (Paste Row/Section)
		 *
		 * @private
		 */
		_hidePanelImportContent: function() {
			this.$panelImportContent.addClass( 'hidden' );
		},

		/**
		 * Pasted content change handler.
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_changePastedContent: function( e ) {
			// Close all notifications
			this.closeAllNotification();

			var target = e.target,
				pastedContent = target.value.trim();

			// Remove usbid's from pasted content.
			if ( pastedContent.indexOf( 'usbid=' ) !== -1 ) {
				pastedContent = pastedContent.replace( /(\s?usbid="([^\"]+)?")/g, '' );
			}

			// Save the cleaned content
			if ( target.value !== pastedContent ) {
				target.value = pastedContent;
			}

			// Remove helper classes
			$( target ).removeClass( 'validate_error' );

			// Enable save button
			this.$panelActionSavePastedContent
				.prop( 'disabled', ! pastedContent )
				.toggleClass( 'disabled', ! pastedContent );
		},

		/**
		 * Save pasted content.
		 *
		 * @private
		 * @event handler
		 */
		_savePastedContent: function() {
			// Elements
			var $textarea = this.$panelImportTextarea,
				$saveButton = this.$panelActionSavePastedContent,
				// Get pasted content
				pastedContent = ( $textarea.val() || '' );

			if ( ! pastedContent ) {
				// Disable save button
				$saveButton
					.prop( 'disabled', true )
					.addClass( 'disabled' );
				return;
			};

			// Remove html from start and end pasted сontent
			pastedContent = this.removeHtmlWrap( pastedContent );

			// The check the correctness of the entered shortcode.
			var isValid = ! (
				!/^\[vc_row([\s\S]*)\/vc_row\]$/gim.test( pastedContent )
				|| pastedContent.indexOf( '[vc_column' ) === -1
			);

			// Added helper classes
			$textarea.toggleClass( 'validate_error', ! isValid );

			// If there is an error, we will display a notification and complete the processing.
			if ( ! isValid ) {
				this.notify( this.getTextTranslation( 'invalid_data' ), this._NOTIFY_TYPE.ERROR );
				return;
			}

			// Disable the input field at the time of adding content.
			$textarea
				.prop( 'disabled', true )
				.addClass( 'disabled' );

			// Disable save button
			$saveButton
				.addClass( 'loading disabled' )
				.prop( 'disabled', true );

			// Add a unique usbid for each shortcode.
			pastedContent = pastedContent.replace( /\[(\w+)/g, function( match, tag ) {
				return match + ' usbid="' + this.getSpareElmId( tag ) + '"';
			}.bind( this ) );

			// Get default image
			var placeholder = this.settings.placeholder || '';

			// Search and replace use:placeholder
			pastedContent = pastedContent.replace( /use:placeholder/g, placeholder );

			// Replacing images for new design options
			pastedContent = pastedContent.replace( /css="([^\"]+)"/g, function( matches, match ) {
				if ( match ) {
					var jsoncss = ( decodeURIComponent( match ) || '' )
						.replace( /("background-image":")(.*?)(")/g, "$1"+ placeholder +"$3" );
					return 'css="%s"'.replace( '%s', encodeURIComponent( jsoncss ) );
				}
				return matches;
			} );

			// Checking the post_type parameter
			pastedContent = pastedContent.replace( /\s?post_type="(.*?)"/g, function( match, post_type ) {
				if ( ( this.settings.grid_post_types || [] ).indexOf( post_type ) === - 1 ) {
					return ' post_type="post"'; // Default post_type
				}
				return match;
			}.bind( this ) );

			// TODO: Determine the need for this filter.
			// Removing [us_post_content..] if post type is not us_content_template
			// if ( this.data.post_type !== 'us_content_template' ) {
			// 	pastedContent = pastedContent.replace( /(\[us_post_content.*?])/g, '' );
			// }

			// Render pasted content
			this._renderShortcode( /* request id */'_renderPastedContent', {
				data: {
					content: pastedContent,
					isReturnContent: true, // Add content to the result (This can be useful for complex changes)
				},
				// Successful request handler.
				success: function( res ) {
					if ( ! res.success || ! res.data.html ) return;
					// Add pasted content to `this.pageData.content`
					this.pageData.content += (
						res.data.content || pastedContent.replace( /(grid_layout_data="([^"]+)")/g, 'items_layout=""' )
					);
					// Add html to the end of the document.
					this.postMessage( 'insertElm', [ this.mainContainer, 'append', res.data.html, /* scroll into view */true ] );
					// Send a signal to move element
					this.trigger( 'contentChange' );
				},
				// Handler to be called when the request finishes (after success and error callbacks are executed).
				complete: function( _, textStatus ) {
					var isSuccess = textStatus === 'success';

					// Disable the loader and block m or display the button depending on its status.
					$saveButton
						.prop( 'disabled', isSuccess )
						.removeClass( 'loading' )
						.toggleClass( 'disabled', isSuccess );

					// Enable input field
					$textarea
						.prop( 'disabled', false )
						.removeClass( 'disabled' );

					// Clear data on successful request
					if ( isSuccess ) {
						$textarea.val('');
					}
				}
			} );
		},

		/**
		 * Show the panel page custom css.
		 *
		 * @private
		 * @event handler
		 */
		_showPanelPageCustomCss: function() {
			this.clearPanel();
			this.$panelPageCustomCss.removeClass( 'hidden' );
			this.$panelActionPageCustomCss.addClass( 'active' );

			// Update panel title
			this.setPanelTitle( this.getTextTranslation( 'page_custom_css' ) );

			// Set the cursor at the end of existing content
			if ( this._fieldsets.pageCustomCss instanceof $usof.field ) {
				try {
					var cmInstance = this._fieldsets.pageCustomCss.editor.codemirror;
					cmInstance.focus();
					cmInstance.setCursor( cmInstance.lineCount(), 0 );
				} catch( e ) {}
			}
		},

		/**
		 * Hide the panel page custom css.
		 *
		 * @private
		 */
		_hidePanelPageCustomCss: function() {
			this.$panelPageCustomCss.addClass( 'hidden' );
			this.$panelActionPageCustomCss.removeClass( 'active' );
		},

		/**
		 * Show the panel page settings.
		 *
		 * @private
		 * @event handler
		 */
		_showPanelPageSettings: function () {
			this.clearPanel();
			this.$panelPageSettings.removeClass( 'hidden' );
			this.$panelActionPageSettings.addClass( 'active' );
			// Update panel title
			this.setPanelTitle( this.getTextTranslation( 'page_settings' ) );
		},

		/**
		 * Hide the panel page settings.
		 *
		 * @private
		 */
		_hidePanelPageSettings: function() {
			this.$panelPageSettings.addClass( 'hidden' );
			this.$panelActionPageSettings.removeClass( 'active' );
		},

		/**
		 *
		 * @private
		 * @event handler
		 */
		_saveChanges: function() {
			if (
				! this.isPageChanged()
				|| this._$temp.isProcessSave
			) return;
			// Set the save execution flag
			this._$temp.isProcessSave = true;
			// Disable button and enable loading
			this.$panelActionSaveChanges
				.prop( 'disabled', true )
				.addClass( 'loading' );
			var // Updated data
				data = {
					// The available key=>value:
					//	post_content: '',
					//	post_status: '' ,
					//	post_title: '',
					//	pageMeta: [ key => value ]
					pageMeta: {},
				};
			// Add updated content
			if ( this.isСontentСhanged() ) {
				data.post_content = this.pageData.content;
			}
			if ( this.isPageFieldsChanged() ) {
				for ( var prop in this.pageData.fields ) {
					data[ prop ] = this.pageData.fields[ prop ];
 				}
			}
			// Add updated meta data
			if ( this.isPageMetaChanged() ) {
				for ( var prop in this.pageData.pageMeta ) {
					data.pageMeta[ prop ] = this.pageData.pageMeta[ prop ];
				}
			}
			if ( this.isPageCustomCssСhanged() ) {
				data.pageMeta[ this.settings.metaKeyForCustomCss || '' ] = this.pageData.customCss;
			}
			// Send data to server
			this.ajax( /* request id */'_saveChanges', {
				data: $.extend( data, {
					action: this.settings.action_save_post,
					_nonce: this.settings._nonce
				} ),
				// Handler to be called if the request succeeds
				success: function( res ) {
					if ( ! res.success ) return;
					this.notify( this.getTextTranslation( 'page_updated' ), this._NOTIFY_TYPE.SUCCESS );
					// Reload preview page
					if ( !! this._$temp.isReloadPreviewAfterSave && this.isPageMetaChanged() ) {
						// Reset value after page reload.
						this._$temp.isReloadPreviewAfterSave = false;
						this.iframe.src = this.settings.iframeSrc;
					}
					// Saving the last page data.
					this._$temp.savedPageData = $.extend( /* deep copy */true, {}, this.pageData || {} );
				}.bind( this ),
				// Handler to be called when the request finishes (after success and error callbacks are executed).
				complete: function() {
					this.$panelActionSaveChanges
						.removeClass( 'loading' )
						.addClass( 'disabled' );
					this._$temp.isProcessSave = false;
				}.bind( this )
			} );
		},

		/**
		 * Handler for create revision and show a preview page
		 * Note: Going to the change preview page creates the revision for which data is needed `post_conent`
		 *
		 * @private
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_submitPreviewChanges: function( e ) {
			// Add data before sending
			$( 'textarea[name="post_content"]', e.target )
				.val( this.pageData.content );
			// Add data for custom page css (postmeta)
			$( 'textarea[name=vc_post_custom_css]', e.target )
				.val( this.pageData.customCss );
		}

	} );

	/**
	 * Functionality for the implementation of Fieldsets
	 */
	$usbPrototype.$$fieldsets = {
		/**
		 * Toggles the USOF tabs of the settings panel
		 *
		 * @private For fieldsets
		 * @event handler
		 * @param {Event} e The Event interface represents an event which takes place in the DOM.
		 */
		_toggleTabs: function( e ) {
			var $target = $( e.currentTarget ),
				$sections = $target
					.parents( '.usof-tabs:first' )
					.find( '> .usof-tabs-sections > *' );

			// This is toggling the tab title
			$target
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' );

			// This is toggling the tab sections
			$sections
				.removeAttr( 'style' )
				.eq( $target.index() )
				.addClass( 'active' )
				.siblings()
				.removeClass( 'active' );
		},

		/**
		 * Auto showing or hidden of tabs for fieldsets
		 *
		 * @private
		 */
		autoShowingTabs: function() {
			if ( ! this.activeElmFieldset || ! this.activeElmFieldset.isGroupParams ) {
				return;
			}
			$.each( this.activeElmFieldset.$tabsSections, function( index, section ) {
				var fields = $( '> *', section ).toArray(),
					isHidden = true;
				for ( var k in fields ) {
					var $field = $( fields[ k ] ),
						isShown = $field.data( 'isShown' );
					if ( this.isUndefined( isShown ) ) {
						isShown = ( $field.css( 'display' ) != 'none' );
					}
					if ( isShown ) {
						isHidden = false;
						break;
					}
				}
				this.activeElmFieldset.$tabsItems
					.eq( index )
					.toggleClass( 'hidden', isHidden );
			}.bind( this ) );
		}
	};

	/**
	 * Functionality for the implementation of Main API
	 */
	$.extend( $usbPrototype, {

		/**
		 * Get text translation by key
		 *
		 * @param {string} key The key
		 * @return {string} The text
		 */
		getTextTranslation: function( key ) {
			if ( ! key ) return '';
			return ( _window.$usbdata.textTranslations || {} )[ key ] || key;
		},

		/**
		 * Detect Firefox
		 *
		 * @return {boolean} True if firefox, False otherwise.
		 */
		isFirefox: function() {
			return navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1
		},

		/**
		 * Determines if ontent hanged.
		 *
		 * @return {boolean} True if ontent hanged, False otherwise.
		 */
		isСontentСhanged: function() {
			return ( this._$temp.savedPageData.content || '' ) !== this.pageData.content;
		},

		/**
		 * Determines if page custom css hanged.
		 *
		 * @return {boolean} True if page custom css hanged, False otherwise.
		 */
		isPageCustomCssСhanged: function() {
			return ( this._$temp.savedPageData.customCss || '' ) !== this.pageData.customCss;
		},

		/**
		 * Determines if page fields changed.
		 *
		 * @return {boolean} True if page fields changed, False otherwise.
		 */
		isPageFieldsChanged: function() {
			return JSON.stringify( this._$temp.savedPageData.fields || {} ) !== JSON.stringify( this.pageData.fields || {} );
		},

		/**
		 * Determines if page meta data changed.
		 *
		 * @return {boolean} True if page meta data changed, False otherwise.
		 */
		isPageMetaChanged: function() {
			return JSON.stringify( this._$temp.savedPageData.pageMeta || {} ) !== JSON.stringify( this.pageData.pageMeta || {} );
		},

		/**
		 * Determines if page changed.
		 *
		 * @return {boolean} True if page changed, False otherwise.
		 */
		isPageChanged: function() {
			return (
				this.isСontentСhanged()
				|| this.isPageMetaChanged()
				|| this.isPageFieldsChanged()
				|| this.isPageCustomCssСhanged()
			);
		},

		/**
		 * Showing error messages for debugging
		 *
		 * @private
		 * @param {string} text
		 * @param {mixed} data
		 */
		_debugLog: function( text, data ) {
			console.log( text, data );
		},

		/**
		 * Get the temporary object
		 *
		 * @param {string} key The key
		 * @return {{}}
		 */
		getTemp: function( key ) {
			if ( key && ! this._temp[ key ] ) {
				return this._temp[ key ] = {};
			}
			return key ? this._temp[ key ] : this._temp;
		},

		/**
		 * Set data the temporary
		 *
		 * @param {string} key The key name
		 * @param {mixes} value The value
		 */
		setTemp: function( key, value ) {
			this._temp[ '' + key ] = value || {};
		},

		/**
		 * Flush temporary data
		 *
		 * @param {string} key The key name
		 */
		flushTemp: function( key ) {
			this.setTemp( key );
		},

		/**
		 * Saving content temporarily in a temporary variable, this is necessary
		 * for the move mode where the moved element should not be present in
		 * the content. These method are mainly needed for Drag and Drop in move mode.
		 */
		saveTempContent: function() {
			this._$temp.tempContent = '' + this.pageData.content;
		},

		/**
		 * Restoring content from a temporary variable, these method are mainly
		 * needed for Drag and Drop in move mode. This method works from `this.saveTempContent()`
		 *
		 * @return {boolean} True if the content has been restored, False otherwise.
		 */
		restoreTempContent: function() {
			if ( ! this.isEmptyTempContent() ) {
				this.pageData.content = ( '' + this._$temp.tempContent ) || this.pageData.content;
				delete this._$temp.tempContent;
				return true
			}
			return false;
		},

		/**
		 * This method to determine if temporary content is installed.
		 *
		 * @return {boolean} True if temporary content, False otherwise.
		 */
		isEmptyTempContent: function() {
			return this.isUndefined( this._$temp.tempContent )
		},

		/**
		 * This method determines whether the page content is empty or not
		 *
		 * @return {boolean} True if empty content, False otherwise.
		 */
		isEmptyContent: function() {
			return ( '' + this.pageData.content ).indexOf( '[vc_row' ) === -1;
		},

		/**
		 * Determines whether the specified value is undefined
		 *
		 * @param {mixed} value The value
		 * @return {boolean} True if the specified value is undefined, False otherwise
		 */
		isUndefined: function( value ) {
			return value === undefined;
		},

		/**
		 * Determines if mode
		 * As parameters, you can set both one mode and several to check for matches,
		 * if at least one of the results matches, then it will be true
		 *
		 * @return {boolean} True if the specified mode is mode, False otherwise
		 */
		isMode: function() {
			// Get set modes, example: 'editor', 'preview', 'drag:add', 'drag:move'
			var args = arguments;
			for ( var i in args ) {
				if ( _availableModes.indexOf( args[ i ] ) !== -1 && this._mode === args[ i ] ) return true;
			}
			return false;
		},

		/**
		 * Set the mode
		 *
		 * @param {string} mode The mode
		 * @return {boolean} True if mode changed successfully, False otherwise
		 */
		setMode: function( mode ) {
			if (
				mode
				&& _availableModes.indexOf( mode ) !== -1
				&& mode !== this._mode
			) {
				var oldMode = this._mode;
				// The mode change event
				this.trigger( 'modeChange', [ /* newMode */this._mode = mode, oldMode ] );
				return true;
			}
			return false;
		},

		/**
		 * Gets the mode
		 * Note: The code is not used.
		 *
		 * @return {string} The mode
		 */
		getMode: function() {
			return this._mode || '';
		},

		/**
		 * Get the attachment url
		 *
		 * @param {numeric} id The attachment id
		 * @return {string}
		 */
		getAttachmentUrl: function( id ) {
			if ( ! id || ! wp.media ) return id;
			return wp.media.attachment( id ).get( 'url' ) || '';
		},

		/**
		 * Generate a RegExp to identify a shortcode
		 * Note: RegExp does not know how to work with nesting the shortcode in itself.
		 *
		 * Capture groups:
		 *
		 * 1. An extra `[` to allow for escaping shortcodes with double `[[]]`
 		 * 2. The shortcode name
 		 * 3. The shortcode argument list
 		 * 4. The self closing `/`
 		 * 5. The content of a shortcode when it wraps some content
 		 * 6. The closing tag
 		 * 7. An extra `]` to allow for escaping shortcodes with double `[[]]`
		 *
		 * @param {string} tag The shortcode tag "us_btn" or "vc_row|vc_column|..."
		 * @return {regexp} The elm shortcode regular expression
		 */
		getShortcodePattern: function( tag ) {
			return new RegExp( '\\[(\\[?)(' + tag + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)', 'g' );
		},

		/**
		 * Remove html from start and end content
		 *
		 * @param {string} content
		 * @return {string}
		 */
		removeHtmlWrap: function( content ) {
			return ( '' + content )
				.replace( /^<[^\[]+|[^\]]+$/gi, '' );
		},

		/**
		 * Parse shortcode text in parts
		 *
		 * @param {string} shortcode The shortcode text
		 * @return {{}}
		 */
		parseShortcode: function( shortcode ) {
			if ( ! shortcode ) return {};
			// Remove html from start and end content
			shortcode = this.removeHtmlWrap( shortcode );

			// Get shortcode parts
			var firstTag = ( shortcode.match( /^.*?\[(\w+)\s/ ) || [] )[ /* Tag name */1 ] || '',
				result = ( this.getShortcodePattern( firstTag ) ).exec( shortcode );

			if ( result ) {
				return {
					tag: result[ 2 ],				// The shortcode tag of the current object
					atts: result[ 3 ] || '',		// The a string representation of the shortcode attributes
					input: result[ 0 ],				// The input shortcode text
					content: result[ 5 ] || '',		// The content of the shortcode if there is of course
					hasClosingTag: !! result[ 6 ]	// The need for an closing tag
				};
			}

			return {};
		},

		/**
		 * Convert attributes from string to object
		 *
		 * @param {string} atts The string atts
		 * @return {{}}
		 */
		parseAtts: function( str ) {
			var result = {};
			if ( ! str ) return result;
			// Map zero-width spaces to actual spaces.
			str = str.replace( /[\u00a0\u200b]/g, ' ' );
			// The retrieving attributes from a string
			( str.match( /[\w-_]+="([^\"]+)?"/g ) || [] ).forEach( function( item ) {
				item = item.match( /([\w-_]+)="([^\"]+)?"/ );
				if ( ! item ) return;
				result[ item[ /* Name */1 ] ] = ( '' + ( item[ /* Value */2 ] || '' ) ).trim();
			});
			return result;
		},

		/**
		 * Converts a shortcode object to a string
		 *
		 * @param {{}} object The shortcode object
		 * @param {{}} attsDefaults The default atts
		 * @return {string}
		 */
		buildShortcode: function( shortcode, attsDefaults ) {
			if ( $.isEmptyObject( shortcode ) ) return '';
			// Create shortcode
			var result = '[' + shortcode.tag;
			// The add attributes
			if ( shortcode.atts || attsDefaults ) {
				if ( ! $.isEmptyObject( attsDefaults ) ) {
					shortcode.atts = this.buildAtts( this.parseAtts( shortcode.atts ), attsDefaults );
				}
				result += ' ' + shortcode.atts.trim();
			}
			result += ']';
			// The add content
			if ( shortcode.content ) {
				result += shortcode.content;
			}
			// The add end tag
			if ( shortcode.hasClosingTag ) {
				result += '[/'+ shortcode.tag +']';
			}
			return '' + result;
		},

		/**
		 * Returns a string representation of an attributes
		 *
		 * @param {{}} atts This is an attributes object
		 * @param {{}} defaults The default atts
		 * @return {string} String representation of the attributes
		 */
		buildAtts: function( atts, defaults ) {
			if ( ! atts || $.isEmptyObject( atts ) ) {
				return '';
			}
			if ( $.isEmptyObject( defaults ) ) {
				defaults = {};
			}
			var result = [];
			for ( var k in atts ) {
				var value = atts[ k ];
				// Checking the values for correctness, otherwise we will skip the additions.
				if (
					value === null
					|| value+'' === 'undefined'
					|| (
						! this.isUndefined( defaults[ k ] )
						&& defaults[ k ] === value
					)
				) {
					continue;
				}
				// Converting parameter list to string (for wp link)
				if ( $.isPlainObject( value ) ) {
					var inlineValue = [];
					for ( var i in value ) {
						if ( value[ i ] ) {
							inlineValue.push( i + ':' + value[ i ] );
						}
					}
					value = inlineValue.join('|');
				}
				result.push( k + '="' + value + '"' );
			}
			return result.join( ' ' );
		},

		/**
		 * Convert pattern to string from result
		 *
		 * @param {string} template The string template
		 * @param {{}} params The parameters { key: 'value'... }
		 * @return {string}
		 */
		buildString: function( template, params ) {
			if ( ! $.isPlainObject( params ) ) {
				params = {};
			}
			var // Create pattern for regular expression. Variable example: `{%var_name%}`
				pattern = this.escapeRegExp( this.settings.startSymbol );
				pattern += '([A-z\\_\\d]+)';
				pattern += this.escapeRegExp( this.settings.endSymbol );
			// Replace all variables with values
			return ( '' + template ).replace( new RegExp( pattern, 'gm' ), function( _, varName ) {
				return '' + ( params[ varName ] || '' );
			} );
		},

		/**
		 * Get the shortcode siblings ids
		 *
		 * @private
		 * @param {string} content The content
		 * @return {[]} The shortcode siblings
		 */
		_getShortcodeSiblingsIds: function( content ) {
			content = '' + content || '';

			if ( ! content ) return [];
			var i = 0,
				result = [],
				firstShortcode;

			while ( firstShortcode = this.parseShortcode( content ) ) {
				if ( i++ > /* max number of iterations */9999 || $.isEmptyObject( firstShortcode ) ) {
					break;
				}

				var usbid = this.parseAtts( firstShortcode.atts )['usbid'] || null;
				if ( usbid ) {
					result.push( usbid );
				}
				content = content.replace( firstShortcode.input, '' );
			}

			return result;
		},

		/**
		 * Determines whether the specified id is valid id
		 *
		 * @private
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {boolean} True if the specified id is valid id, False otherwise
		 */
		isValidId: function( id ) {
			return id && /^([\w\-]+):(\d+)$/.test( id );
		},

		/**
		 * Determines if the specified id is a container, defines any types
		 * for example: `vc_row`, `vc_row_inner`, `vc_column`, `vc_column_inner`, `vc_tta_*`,
		 * `vwrapper`, `hwrapper` etc.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {boolean} True if the specified id is container, False otherwise.
		 */
		isElmContainer: function( id ) {
			if ( this.isValidId( id ) ) {
				id = this.getElmName( id );
			}
			return id && ( this.settings.shortcode.containers || [] ).indexOf( id ) !== -1;
		},

		/**
		 * Determines whether the specified id is second elm container,
		 * for example: `vc_column`, `vc_column_inner`, `vc_tta_section` etc.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {boolean} True if the specified id is elm root container, False otherwise.
		 */
		isSecondElmContainer: function( id ) {
			if ( this.isValidId( id ) ) {
				id = this.getElmName( id );
			}
			return (
				id
				&& this.isElmContainer( id )
				&& ! this.isRootElmContainer( id )
				&& !! ( ( this.settings.shortcode.relations.as_child || {} )[ id ] || {} )['only']
			);
		},

		/**
		 * Determines whether the specified id is elm root container,
		 * for example: `vc_row`, `vc_row_inner`, `vc_tta_tabs`, `vc_tta_accordion` etc.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {boolean} True if the specified id is elm root container, False otherwise.
		 */
		isRootElmContainer: function( id ) {
			if ( this.isValidId( id ) ) {
				id = this.getElmName( id );
			}
			return (
				this.isElmContainer( id )
				&& !! ( ( this.settings.shortcode.relations.as_parent || {} )[ id ] || {} )['only']
			);
		},

		/**
		 * Determines whether the specified id is main container id,
		 * this is the root whose name is assigned to `this.mainContainer`,
		 * for example name: `container`
		 *
		 * @param {string} id Shortcode's usbid, e.g. "container"
		 * @return {boolean} True if the specified id is container id, False otherwise
		 */
		isMainContainer: function( id ) {
			return id && id === this.mainContainer;
		},

		/**
		 * Determine if the type or id is in the vc_tta_accordion, vc_tta_tab, vc_tta_tour group or vc_tta_section.
		 *
		 * @param {string} name The name e.g. "vc_tta_section:1"
		 * @return {boolean}  True if the specified type is vc_tta_*, False otherwise.
		 */
		isElmTTA: function( name ) {
			name += '';
			if ( this.isValidId( name ) ) {
				name = this.getElmName( name );
			}
			return name && this.isElmContainer( name ) && name.indexOf( 'vc_tta_' ) === 0;
		},

		/**
		 * Determines whether the specified identifier is tab.
		 *
		 * @param {string} name The name e.g. "vc_tta_tabs:1"
		 * @return {boolean} True if the specified identifier is tab, False otherwise.
		 */
		isElmTab: function( name ) {
			if ( ! this.isElmTTA( name ) ) return false;
			if ( this.isValidId( name ) ) {
				name = this.getElmType( name );
			}
			return [ 'vc_tta_tabs', 'vc_tta_tour' ].indexOf( name ) > -1;
		},

		/**
		 * Escape special characters for regular expression
		 *
		 * @param {string} string The value
		 * @return {string}
		 */
		escapeRegExp: function( string ) {
			return string.replace(/[.*+?^${}()|\:[\]\\]/g, '\\$&'); // $& means the whole matched string
		},

		/**
		 * Escape special characters for attributes
		 * Note: The code is not used.
		 *
		 * @private
		 * @param {string} string The value
		 * @return {string} Returns a string replacing html tags with entities
		 */
		_escapeHtml: function( string ) {
			return ( '' + string )
				.replace( '&', '&amp;' )
				.replace( '<', '&lt;' )
				.replace( '>', '&gt;' )
				.replace( '"', '&quot;' )
				.replace( "'", '&#039;' );
		},

		/**
		 * Checking the possibility of moving the shortcode to the specified parent
		 * Note: This method has specific exceptions in `move:add` for this.mainContainer
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {string} parent Shortcode's usbid, e.g. "vc_column:1"
		 * @param {boolean} strict The ON/OFF strict mode
		 * @return {boolean} True if able to be child of, False otherwise.
		 */
		canBeChildOf: function( id, parent, strict ) {
			var isMainContainer = this.isMainContainer( parent );
			if (
				this.isMainContainer( id ) // It is forbidden to move the main container!
				|| ! this.isValidId( id )
				|| ! ( this.isValidId( parent ) || isMainContainer )
			) {
				return false;
			}
			// Get all relations for shortcodes
			var shortcodeRelations = $.extend( {}, this.settings.shortcode.relations || {} );

			// If there are no deps, we will allow everyone to move.
			if ( $.isEmptyObject( shortcodeRelations ) ) {
				this._debugLog( 'Notice: There are no relations and movement is allowed for every one', arguments );
				return true;
			}

			// Get all names without prefixes and indices
			var targetName = this.getElmName( id ),
				parentName = isMainContainer
					? parent
					: this.getElmName( parent ),
				result = true;

			/**
			 * The a checking all shortcodes relations
			 *
			 * Relations name `as_parent` and `as_child` obtained from Visual Composer
			 * @see https://kb.wpbakery.com/docs/developers-how-tos/nested-shortcodes-container/
			 *
			 * Example relations: {
			 *		as_child: {
			 *			vc_row: {
			 *				only: 'container',
			 *			},
			 *			vc_tta_section: { // Separate multiple values with comma
			 *				only: 'vc_tta_tabs,vc_tta_accordion...',
			 *			},
			 *			...
			 *		},
			 *		as_parent: {
			 *			vc_row: {
			 *				only: 'vc_column',
			 *			},
			 *			hwrapper: { // Separate multiple values with comma
			 *				except: 'vc_row,vc_column...',
			 *			},
			 *			...
			 *		}
			 * }
			 */
			for ( var name in shortcodeRelations ) {
				if ( ! result ) break;
				var relations = shortcodeRelations[ name ][ name === 'as_child' ? targetName : parentName ];
				if ( ! this.isUndefined( relations ) ) {
					for ( var condition in relations ) {
						// If checking occurs in `move:add` then skip the rule for the main container, when adding
						// a new element, it is allowed to add simple elements to the main container
						if (
							this.isMode( 'drag:add' )
							&& parentName === this.mainContainer
							&& ! this.isSecondElmContainer( id )
						) {
							continue;
						}
						// If the rules have already prohibited the specified connection, then we complete the check
						if ( ! result ) break;
						var allowed = ( relations[ condition ] || '' ).split(','),
							isFound = allowed.indexOf( name === 'as_child' ? parentName : targetName ) !== -1;
						if (
							( condition === 'only' && ! isFound )
							|| ( condition === 'except' && isFound )
						) {
							result = false;
						}
					}
				}
			}

			// Strict validation will ensure that secondary elements are allowed to
			// move within the same parent.
			if (
				result
				&& !! strict
				&& this.isSecondElmContainer( id )
			) {
				// The check if  temporary content, then we will restore it to get the correct data,
				// this is only necessary for the `drag:move`
				var isTempContent = ( this.isMode( 'drag:move' ) && ! this.isEmptyTempContent() ),
					tempContent;
				if ( isTempContent ) {
					tempContent = this.pageData.content;
					this.restoreTempContent();
				}

				// Get a parent for the floated `id`
				var elmParentId = this.getElmParentId( id );

				// After receiving the data, we restore the variable,
				// this is only necessary for the `drag:move`
				if ( isTempContent && tempContent ) {
					this.saveTempContent();
					this.pageData.content = '' + tempContent;
				}

				return parent === elmParentId;
			}

			return result;
		},

		/**
		 * Determine has same type parent.
		 *
		 * @param {string} type The tag type "us_btn|us_btn:1"
		 * @param {string} parent Shortcode's usbid, e.g. "vc_column:1"
		 * @return {boolean} True if able to be parent of, False otherwise.
		 */
		hasSameTypeParent: function( type, parent ) {
			if (
				this.isMainContainer( type )
				|| this.isMainContainer( parent )
				|| ! this.isValidId( parent )
			) return false;
			// Get type
			type = this.isValidId( type )
				? this.getElmType( type )
				: type;
			// If the type is from the parent of the same type.
			if ( type === this.getElmType( parent ) ) return true;
			// Search all parents
			var index = 0;
			while( parent !== null || this.isMainContainer( parent ) ) {
				// After exceeding the specified number of iterations, the loop will be stopped
				if ( index++ >= /* max number of iterations */9999 ) break;
				parent = this.getElmParentId( parent );
				if ( this.getElmType( parent ) === type ) return true;
			}
			return false;
		},

		/**
		 * Get the elm type
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string} The elm type
		 */
		getElmType: function( id ) {
			return this.isValidId( id )
				? id.split(':')[ /* Type */0 ] || ''
				: '';
		},

		/**
		 * Get the elm name.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string}
		 */
		getElmName: function( id ) {
			var type = this.getElmType( id );
			return ( type.match( /us_(.*)/ ) || [] )[ /* Name */1 ] || type;
		},

		/**
		 * Get the elm title
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string}
		 */
		getElmTitle: function( id ) {
			if ( ! this.isValidId( id ) ) return 'Unknown';
			var name = this.getElmName( id ),
				// Get title for current element
				title = ( this._elmsFieldset && !! this._elmsFieldset[ name ] )
					? this._elmsFieldset[ name ].data( 'title' ) || name
					: name;
			return title;
		},

		/**
		 * Check if a shortcode with a given name exists or not
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {bool}
		 */
		doesElmExist: function( id ) {
			if ( ! this.isValidId( id ) || ! this.pageData.content ) {
				return false;
			}
			return ( new RegExp( '\\['+ this.getElmType( id ) +'[^\\]]+usbid=\\"'+ this.escapeRegExp( id ) +'\\"' ) )
				.test( '' + this.pageData.content );
		},

		/**
		 * Get the elm id
		 *
		 * @param {node} target The target element
		 * @return {string} id Shortcode's usbid, e.g. "us_btn:1"
		 */
		getElmId: function( target ) {
			var id = $usbcore.$elGetAttr( target, 'data-usbid' );
			return ( this.isValidId( id ) || this.isMainContainer( id ) )
				? id
				: '';
		},

		/**
		 * Generate a spare shortcode usbid for a new element
		 *
		 * @param {string} type
		 * @return {string}
		 */
		getSpareElmId: function( type ) {
			if ( ! type ) {
				return '';
			}
			if ( ! this._$temp.generatedIds ) {
				this._$temp.generatedIds = [];
			}
			for ( var index = 1;; index++ ) {
				var id = type + ':' + index;
				if ( ! this.doesElmExist( id ) && this._$temp.generatedIds.indexOf( id ) === -1 ) {
					this._$temp.generatedIds.push( id );
					return id;
				}
			}
		},

		/**
		 * Get element's direct parent's ID or a 'container' if element is at the root
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string|null}
		 */
		getElmParentId: function( id ) {
			var parentId = this.mainContainer;

			if ( id === parentId || ! this.doesElmExist( id ) ) return null;

			var content = ( '' + this.pageData.content ),
				// Get the index of the start of the shortcode
				elmRegex = new RegExp( '\\['+ this.getElmType( id ) +'[^\\]]+usbid=\\"'+ this.escapeRegExp( id ) +'\\"' ),
				startPosition = content.search( elmRegex ),
				// Get content before and after shortcode
				prevContent = content.slice( 0, startPosition ),
				nextContent = content.slice( startPosition )
					// Remove all shortcodes of the set type
					.replace( this.getShortcodePattern( this.getElmType( id ) ), '' ),
				closingTags = nextContent.match( /\[\/(\w+)/g ) || [],
				parentTagMatch, parentTag, parentTagAtts;

			$.each( closingTags, function( index, closingTag ) {
				closingTag = closingTag.substr( 2 );
				// Trying to find last opening tag in prevContent
				// TODO: make sure that tags without atts work
				parentTagMatch = prevContent.match( new RegExp( '\\[' + closingTag + '\\s([^\\]]+)(?!.*\\[\\/' + closingTag + '(\\s|\\]))', 's' ) );

				if ( parentTagMatch !== null ) {
					// If matching tag found, checking if its content has current element
					parentTagAtts = this.parseAtts( parentTagMatch[ 1 ] );
					parentTag = this.getElmShortcode( parentTagAtts['usbid'] );
					if ( parentTag.search( elmRegex ) !== -1 ) {
						parentId = parentTagAtts['usbid'];
						return false;
					}
				}
			}.bind( this ) );

			// Return parent usbid
			return parentId;
		},

		/**
		 * Get the element next id
		 * Note: The code is not used.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string|null} The element next id or null
		 */
		getElmNextId: function( id ) {
			if ( ! this.isValidId( id ) || this.isMainContainer( id ) ) return null;
			var children = this.getElmChildren( this.getElmParentId( id ) ),
				currentIndex = children.indexOf( id );
			if ( currentIndex < 0 || children.length === currentIndex ) return null;
			return children[ ++currentIndex ] || null;
		},

		/**
		 * Get the element previous id
		 * Note: The code is not used.
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {string|null} The element previous id or null
		 */
		getElmPrevId: function( id ) {
			if ( ! this.isValidId( id ) || this.isMainContainer( id ) ) return null;
			var children = this.getElmChildren( this.getElmParentId( id ) ),
				currentIndex = children.indexOf( id );
			if ( currentIndex < 0 || currentIndex === 0 ) return null;
			return children[ --currentIndex ] || null;
		},

		/**
		 * Get the element siblings id
		 *
		 * @param {string} id The id  e.g. "us_btn:1"
		 * @return {[]} The element siblings id
		 */
		getElmSiblingsId: function( id ) {
			if ( ! this.isValidId( id ) || this.isMainContainer( id ) ) return [];
			return this.getElmChildren( this.getElmParentId( id ) );
		},

		/**
		 * Get element's direct children IDs (or empty array, if element doesn't have children)
		 *
		 * @param {string} id Shortcode's usbid, e.g. "vc_row:1"
		 * @return {[]}
		 */
		getElmChildren: function( id ) {
			var isMainContainer = this.isMainContainer( id );

			if (
				! id
				|| ! ( this.isValidId( id ) || isMainContainer )
			) return [];

			var content = ! isMainContainer
				? ( this.parseShortcode( this.getElmShortcode( id ) ) || {} ).content || ''
				: '' + this.pageData.content;

			return this._getShortcodeSiblingsIds( content );
		},

		/**
		 * Get all element's direct children IDs (or empty array, if element doesn't have children)
		 *
		 * @param {string} id Shortcode's usbid, e.g. "vc_row:1"
		 * @return {[]}
		 */
		getElmAllChildren: function( id ) {
			if ( ! this.isValidId( id ) || ! this.isElmContainer( id ) ) return [];
			var results = [],
				childrenIDs = this.getElmChildren( id );
			for ( var i in childrenIDs ) {
				var childrenId = childrenIDs[i];
				if ( ! this.isValidId( childrenId ) ) continue;
				results.push( childrenId );
				if ( this.isElmContainer( childrenId ) ) {
					results = results.concat( this.getElmAllChildren( childrenId ) );
				}
			}
			return results;
		},

		/**
		 * Get element's shortcode (with all the children if they exist)
		 *
		 * @param {string} id Shortcode's usbid (e.g. "us_btn:1")
		 * @return {string}
		 */
		getElmShortcode: function( id ) {
			var content = ( '' + this.pageData.content );
			if ( this.isUndefined( id ) ) return content;
			if ( ! this.isValidId( id ) ) return '';

			// The getting shortcodes
			var matches = content.match( this.getShortcodePattern( this.getElmType( id ) ) );

			if ( matches ) {
				for ( var i in matches ) {
					if ( matches[ i ].indexOf( 'usbid="' + id + '"' ) !== -1 ) {
						return matches[ i ];
					}
				}
			}
			return '';
		},

		/**
		 * Get shortcode's params values
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @return {{}}
		 */
		getElmValues: function( id ) {
			if ( ! this.doesElmExist( id ) ) return {};
			// The convert attributes from string to object
			var shortcode = this.parseShortcode( this.getElmShortcode( id ) );
			if ( ! $.isEmptyObject( shortcode ) ) {
				var result = this.parseAtts( shortcode.atts ),
					elmName = this.getElmName( id );
				// Add content value to the result
				var editContent = this.settings.shortcode.edit_content || {};
				if ( !! editContent[ elmName ] ) {
					result[ editContent[ elmName ] ] = '' + shortcode.content;
				}
				return result;
			}
			return {};
		},

		/**
		 * Set shortcode's params values
		 *
		 * @param {string} id Shortcode's usbid, e.g. "us_btn:1"
		 * @param {{}} values
		 */
		setElmValues: function( id, values ) {
			if ( ! this.doesElmExist( id ) || $.isEmptyObject( values ) ) return;

			// Get the shortcode object
			var shortcodeText = this.getElmShortcode( id ),
				shortcode = this.parseShortcode( shortcodeText );
			if ( $.isEmptyObject( shortcode ) )
				return;

			// Set new attributes for the shortcode
			shortcode.atts = ' ' + this.buildAtts( $.extend( this.getElmValues( id ), values ) );

			// Apply content changes
			var newContent = ( this.pageData.content || '' )
				.replace(
					// The original shortcode text
					shortcodeText,
					// The converts a shortcode object to a shortcode string
					this.buildShortcode( shortcode )
				);
			this.pageData.content = newContent;
			// Send a signal to update element attributes
			this.trigger( 'contentChange' );
		},

		/**
		 * Send data to the server using a HTTP POST request
		 *
		 * @param {string} requestId This is a unique identifier for the request
		 * @param {{}} settings A set of key/value pairs that configure the Ajax request.
		 */
		ajax: function( requestId, settings ) {
			if ( ! requestId || $.isEmptyObject( settings ) ) {
				return;
			}
			settings = $.extend(
				// Default settings
				{
					data: {}, // Data to be sent to the server
					abort: $.noop, // A function to be called if the request abort
					complete: $.noop, // A function to be called when the request finishes (after success and error callbacks are executed).
					error: $.noop, // A function that will be called if an error occurs in the request
					success: $.noop // A function to be called if the request succeeds
				},
				// Get settings
				settings || {}
			);
			// Abort prev request
			if ( ! this.isUndefined( this._$temp.xhr[ requestId ] ) ) {
				this._$temp.xhr[ requestId ].abort();
				if ( $.isFunction( settings.abort ) ) {
					settings.abort.call( this, requestId );
				}
			}
			/**
			 * @see https://api.jquery.com/jquery.ajax/
			 */
			this._$temp.xhr[ requestId ] = $.ajax({
				data: $.extend( {}, this.settings[ 'ajaxArgs' ] || {}, settings.data ),
				dataType: 'json',
				timeout: 15000,
				type: 'post',
				url: _window.ajaxurl,
				cache: false,
				/**
				 * Handler to be called if the request succeeds
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 *
				 * @param {{}} res
				 */
				success: function( res ) {
					delete this._$temp.xhr[ requestId ];
					// In case of an error on the backend, we will show notifications with the error text
					if ( ! res.success ) {
						this.notify( res.data.message, this._NOTIFY_TYPE.ERROR );
					}
					if ( $.isFunction( settings.success ) ) {
						settings.success.call( this, res );
					}
				}.bind( this ),
				/**
				 * Handler to be called if the request fails.
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 */
				error: function( _, textStatus, errorThrown ) {
					if ( textStatus === 'abort' ) return;
					if ( $.isFunction( settings.error ) ) {
						settings.error.call( this, requestId );
					}
					// The showing request jqXHR errors
					this.notify( 'Ajax: ' + textStatus + ' ' + errorThrown, this._NOTIFY_TYPE.ERROR );
				}.bind( this ),
				/**
				 * Handler to be called when the request finishes (after success and error callbacks are executed).
				 * @see https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
				 */
				complete: function( _, textStatus ) {
					if ( textStatus === 'abort' ) return;
					if ( $.isFunction( settings.complete ) ) {
						settings.complete.call( this, requestId, textStatus );
					}
				}.bind( this )
			});
		},

		/**
		 * Rendered shortcode
		 *
		 * @private
		 * @param {string} requestId The request id
		 * @param {{}} settings A set of key/value pairs that configure the Ajax request.
		 */
		_renderShortcode: function( requestId, settings ) {
			if ( ! requestId || $.isEmptyObject( settings ) ) {
				return;
			}
			if ( ! $.isPlainObject( settings.data ) ) {
				settings.data = {};
			}
			// Add required settings
			$.extend( settings.data, {
				_nonce: $usb.settings._nonce,
				action: $usb.settings.action_render_shortcode
			} );
			// Content preparation
			if ( this.isUndefined( settings.data.content ) ) {
				settings.data.content = '';
			}
			settings.data.content += '';
			// Send a request to the server
			this.ajax( requestId, settings );
		},

		/**
		 * Controls the number of columns in a row
		 *
		 * @param {string} id Shortcode's usbid, e.g. "vc_row:1"
		 * @param {string} layout The layout
		 */
		_updateColumnsLayout: function( rowId, layout ) {
			var columns = this.getElmChildren( rowId ),
				columnsCount = columns.length,
				renderNeeded = false,
				rowType = this.getElmType( rowId ),
				columnType = ( rowType === 'vc_row_inner' ) ? 'vc_column_inner' : 'vc_column',
				newColumnsWidths = [],
				newColumnsWidthsBase = 0,
				newColumnsWidthsTmp,
				newColumnsCount;

			// Making sure layout has the string type, so our checks will be performed right way
			layout = '' + layout;

			// Parsing layout value into columns array
			// Complex layout with all column widths specified
			if ( layout.indexOf( '-' ) > - 1 ) {
				newColumnsWidthsTmp = layout.split( '-' );
				newColumnsCount = newColumnsWidthsTmp.length;
				// Calculate columns width base
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					newColumnsWidthsBase += parseInt( newColumnsWidthsTmp[ i ] );
				}
				// Calculate and assign columns widths
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					var columnWidthBaseTmp = newColumnsWidthsBase / newColumnsWidthsTmp[ i ];
					// Try to transform width to a simple value (for example 2/4 will be transformed to 1/2)
					if ( columnWidthBaseTmp % 1 === 0 ) {
						newColumnsWidths.push( '1/' + columnWidthBaseTmp );
					} else {
						newColumnsWidths.push( newColumnsWidthsTmp[ i ] + '/' + newColumnsWidthsBase );
					}
				}
				// Simple layout with column number only
			} else {
				newColumnsCount = parseInt( layout );
				for ( var i = 0; i < newColumnsCount; i ++ ) {
					newColumnsWidths.push( '1/' + layout );
				}
			}

			// Adding new columns if needed
			if ( columnsCount < newColumnsCount ) {
				for ( var i = columnsCount; i < newColumnsCount; i ++ ) {
					var newColumnId = this.getSpareElmId( columnType );
					this._addShortcodeToContent( rowId, i, '[' + columnType + ' usbid="' + newColumnId + '"][/' + columnType + ']' );
				}
				columnsCount = newColumnsCount;
				// Wee need to render newly added columns
				renderNeeded = true;
				// Trying to remove extra columns if needed (only empty columns may be removed)
			} else if ( columnsCount > newColumnsCount ) {
				var columnsCountDifference = columnsCount - newColumnsCount;
				for ( var i = columnsCount - 1; ( i >= 0 ) && ( columnsCountDifference > 0 ); i -- ) {
					var columnChildren = this.getElmChildren( columns[ i ] );
					if ( columnChildren.length === 0 ) {
						this.removeElm( columns[ i ] );
						columnsCountDifference--;
					}
				}
				columnsCount = newColumnsCount + columnsCountDifference;
			}

			// Refreshing columns list
			columns = this.getElmChildren( rowId );

			// Send a signal to add new columns
			this.trigger( 'contentChange' );

			// Set new widths for columns
			for ( var i = 0; i < columnsCount; i ++ ) {
				this.setElmValues( columns[ i ], { width: newColumnsWidths[ i % newColumnsWidths.length ] } );
			}

			if ( renderNeeded ) {
				// Add temporary loader
				this.postMessage( 'showPreloader', rowId );

				// Render updated shortcode
				this._renderShortcode( /* request id */'_renderShortcode', {
					data: {
						content: this.getElmShortcode( rowId )
					},
					success: function( res ) {
						if ( res.success ) {
							this.postMessage( 'updateSelectedElm', [rowId, '' + res.data.html] );
						}
					}
				} );
			}
		},

		/**
		 * Get the insert position
		 *
		 * @private
		 * @param {string} parent Shortcode's usbid, e.g. "us_btn:1" or "container"
		 * @param {number} index Position of the element inside the parent
		 * @return {{}} Object with new data
		 */
		getInsertPosition: function( parent, index ) {
			var position, isParentElmContainer = this.isElmContainer( parent );
			// Index check and position determination
			index = parseInt( index );
			if ( isNaN( index ) ) {
				index = 0;
			}
			// Positioning definitions within any containers
			if ( this.isMainContainer( parent ) || isParentElmContainer ) {
				var children = this.getElmChildren( parent );
				if ( index === 0 || children.length === 0 ) {
					position = 'prepend'
				} else if ( index > children.length || children.length === 1 ) {
					index = children.length;
					position = 'append';
				} else {
					parent = children[ index - 1 ] || parent;
					position = 'after';
				}
			} else {
				position = ( index < 1 ? 'before' : 'after' );
			}
			return {
				position: position,
				parent: parent
			}
		},

		/**
		 * Add shortcode to a given position
		 *
		 * @private
		 * @param {string} parent Shortcode's usbid, e.g. "us_btn:1"
		 * @param {number} index Position of the element inside the parent
		 * @param {string} newShortcode The new shortcode
		 * @return {boolean} True if successful, False otherwise
		 */
		_addShortcodeToContent: function( parent, index, newShortcode ) {
			// Check the correctness of the data in the variables
			if (
				! newShortcode
				|| ! ( this.isValidId( parent ) || this.isMainContainer( parent ) )
			) {
				return false;
			}

			// Get the insert position
			var insertPosition = this.getInsertPosition( parent, index );
				parent = insertPosition.parent;
			// Get old data
			var insertShortcode = '',
				isMainContainer = this.isMainContainer( parent ),
				oldShortcode = ! isMainContainer
					? this.getElmShortcode( parent )
					: this.pageData.content || '',
				elmType = ! isMainContainer
					? this.getElmType( parent )
					: '';

			// Remove html from start and end
			oldShortcode = this.removeHtmlWrap( oldShortcode );

			// Check the position for the root element, if the position is before or after then add the element to the `prepend`
			var position = insertPosition.position;
			if ( isMainContainer ) {
				position = 'container:' + position;
				if ( [ 'before', 'after' ].indexOf( position ) !== -1 ) {
					position = 'container:prepend';
				}
			}

			// Create new shortcode
			switch ( position ) {
				case 'before':
				case 'container:prepend':
					insertShortcode = newShortcode + oldShortcode;
					break;
				case 'prepend':
					insertShortcode = oldShortcode.replace( new RegExp( '^(\\['+ elmType +'.*?[\\^\\]]+)' ), "$1" + newShortcode );
					break;
				case 'append':
					if ( this.parseShortcode( oldShortcode ).hasClosingTag ) {
						insertShortcode = oldShortcode.replace( new RegExp( '(\\[\\/'+ elmType +'\])$' ), newShortcode + "$1" );
					} else {
						insertShortcode = oldShortcode + newShortcode;
					}
					break;
				case 'after':
				case 'container:append':
				default:
					insertShortcode = oldShortcode + newShortcode;
			}

			// Update content variable
			this.pageData.content = ( '' + this.pageData.content ).replace( oldShortcode, insertShortcode );
			return true;
		},

		/**
		 * Add row wrapper for passed content
		 *
		 * @private
		 * @param {string} content The content
		 * @return {string}
		 */
		_addRowWrapper: function( content ) {
			// Convert pattern to string from result
			return this.buildString(
				this.settings.template[ 'vc_row' ] || '',
				// The values for variables `{%var_name%}`
				{
					vc_row: this.getSpareElmId( 'vc_row' ),
					vc_column: this.getSpareElmId( 'vc_column' ),
					content: ''+content
				}
			);
		},

		/**
		 * Get the default content
		 * Note: Getting content by default has been moved to a separate method to unload and simplify methods
		 *
		 * @private
		 * @param {string} elmType The elm type
		 * @return {string} The default content
		 */
		_getDefaultContent: function( elmType ) {
			var // Child type, if any for the current `elmType`
				child,
				// Get settings for shortcodes
				shortcodeSettings = this.settings.shortcode || {},
				/**
				 * Get the default content
				 *
				 * @private
				 * @param {string} type The type
				 * @return {string} The default content
				 */
				_getDefaultContent = function( type ) {
					var defaultValues = ( shortcodeSettings.default_values || {} )[ type ] || false,
						editContent = ( shortcodeSettings.edit_content || {} )[ type ] || false;
					if ( editContent && defaultValues && defaultValues[ editContent ] ) {
						return defaultValues[ editContent ];
					}
					return '';
				};
			// Determine the descendant if any
			var asChild = $.extend( {}, shortcodeSettings.relations.as_child || {} );
			for ( var k in asChild ) {
				if ( ( ( asChild[ k ][ 'only' ] || '' ).split( ',' ) ).indexOf( elmType ) > -1 ) {
					child = k;
					break;
				}
			}
			if ( ! child ) {
				return _getDefaultContent( elmType );
			}
			// Adding elements for tab structures
			if ( this.isElmTTA( child ) ) {

				// Get a title template for a section
				var titleTemplate = this.getTextTranslation( 'section' ),

				// Get parameters for a template
				params = {
					title_1: ( titleTemplate + ' 1' ),
					title_2: ( titleTemplate + ' 2' ),
					vc_column_text: this.getSpareElmId( 'vc_column_text' ),
					vc_column_text_content: _getDefaultContent( 'vc_column_text' ),
					vc_tta_section_1: this.getSpareElmId( 'vc_tta_section' ),
					vc_tta_section_2: this.getSpareElmId( 'vc_tta_section' )
				};
				// Build shortcode
				return this.buildString( this.settings.template[ 'vc_tta_section' ], params );

				// Adding an empty element with no content
			} else {
				return '['+ child +' usbid="'+ this.getSpareElmId( child ) +'"][/'+ child +']';
			}
			return '';
		},

		/**
		 * Create the element
		 *
		 * @param {string} type The element type
		 * @param {string} parent The parent id
		 * @param {number} index Position of the element inside the parent
		 * @param {{}} values The element values
		 * @param {function} callback The callback
		 * @return {mixed}
		 */
		createElm: function( type, parent, index, values, callback ) {
			var isMainContainer = this.isMainContainer( parent );
			if (
				! type
				|| ! parent
				|| ! ( this.isValidId( parent ) || isMainContainer )
			) {
				this._debugLog( 'Error: Invalid params', arguments );
				return;
			}

			// Check parents and prohibit investing in yourself
			if ( this.hasSameTypeParent( type, parent ) ) {
				this._debugLog( 'Error: It is forbidden to add descendants of itself', arguments );
				return;
			}

			// The hide all highlights
			this.postMessage( 'doAction', 'hideHighlight' );

			// Index check and position determination
			index = parseInt( index );
			if ( isNaN( index ) ) {
				index = 0;
			}

			// If there is no parent element, add the element to the `container`
			if ( ! isMainContainer && ! this.doesElmExist( parent ) ) {
				parent = this.mainContainer;
				index = 0;
			}

			var elmId = this.getSpareElmId( type ),
				// Get name from ID
				elmName = this.getElmName( elmId ),
				// Get insert position
				insert = this.getInsertPosition( parent, index );

			// Validating Values
			if ( ! values || $.isEmptyObject( values ) ) {
				values = {};
				// Fix for group default values
				var defaultValues = ( this.settings.shortcode.default_values || {} )[ elmName ] || false;
				if ( defaultValues ) {
					for ( var _attr in defaultValues ) {
						if ( defaultValues.hasOwnProperty( _attr ) && _attr !== 'content' ) {
							values[ _attr ] = defaultValues[ _attr ];
						}
					}
				}
			}

			var // Create shortcode string
				buildShortcode = this.buildShortcode({
					tag: type,
					atts: this.buildAtts( $.extend( { usbid: elmId }, values ) ),
					content: this._getDefaultContent( elmName ),
					hasClosingTag: ( this.isElmContainer( elmName ) || !! this.settings.shortcode.edit_content[ elmName ] )
				} );

			// The check if the element is not the root container and is added to the main container,
			// then adding a wrapper `vc_row`. It is forbidden to add elements without a line to the root container!
			if (
				this.isMainContainer( parent )
				&& ! this.isSecondElmContainer( elmId )
				&& this.getElmName( elmId ) !== 'vc_row'
			) {
				buildShortcode = this._addRowWrapper( buildShortcode );
			}

			// Added shortcode to content
			if ( ! this._addShortcodeToContent( parent, index, buildShortcode ) ) {
				return false;
			}
			// Get html shortcode code and set on preview page
			this.postMessage( 'showPreloader', [
				insert.parent,
				insert.position,
				// If these values are true, then a container class will be added for customization
				/* isContainer */this.isElmContainer( type )
			] );
			// Get a rendered shortcode
			this._renderShortcode( /* request id */'_renderShortcode', {
				data: {
					content: buildShortcode
				},
				success: function( res ) {
					this.postMessage( 'hidePreloader', insert.parent );
					if ( res.success ) {
						// Add new shortcde to preview page
						this.postMessage( 'insertElm', [ insert.parent, insert.position, ''+res.data.html ] );
						// Init its JS if needed
						this.postMessage( 'maybeInitElmJS', [ elmId ] );
						// Initialize editing a new element
						this.trigger( 'elmSelected', elmId );
						// Send a signal to create a new element
						this.trigger( 'contentChange' );
					}
					if ( $.isFunction( callback ) ) {
						// This callback function from method arguments which will be called
						// after adding the new element
						callback.call( this, elmId );
					}
				}
			} );

			return elmId;
		},

		/**
		 * Move the element to a new position
		 *
		 * @param moveId string ID of the element that is being moved, e.g. "us_btn:1"
		 * @param newParent string ID of the element's new parent element
		 * @param newIndex int Position of the element inside the new parent
		 * @return {boolean}
		 */
		moveElm: function( moveId, newParent, newIndex ) {
			if ( this.isMainContainer( moveId ) ) {
				this._debugLog( 'Error: Cannot move container', arguments );
				return false;
			}
			var isMainContainer = this.isMainContainer( newParent );

			// Check parents and prohibit investing in yourself
			if ( this.hasSameTypeParent( moveId, newParent ) ) {
				this._debugLog( 'Error: It is forbidden to add descendants of itself', arguments );
				return;
			}

			// Checking the correctness of ids
			if (
				! this.isValidId( moveId )
				|| ! ( this.isValidId( newParent ) || isMainContainer )
			) {
				this._debugLog( 'Error: Invalid id specified', arguments );
				return false;
			}
			if (
				! this.doesElmExist( moveId )
				|| ! ( this.doesElmExist( newParent ) || isMainContainer )
			) {
				this._debugLog( 'Error: Element doesn\'t exist', arguments );
				return false;
			}

			// Index check and position determination
			newIndex = parseInt( newIndex );
			if ( isNaN( newIndex ) ) {
				newIndex = 0;
			}

			// The hide all highlights
			this.postMessage( 'doAction', 'hideHighlight' );

			// If there is no newParent element, add the element to the `container`
			if ( ! isMainContainer && ! this.doesElmExist( newParent ) ) {
				newParent = this.mainContainer;
				newIndex = 0;
			}

			// Get old shortcode and remove in content
			var oldShortcode = this.getElmShortcode( moveId );
			this.pageData.content = ( '' + this.pageData.content )
				.replace( oldShortcode, '' );

			// TODO:Find out whether it is necessary here or not, and then it is possible to delete it.
			// The check if the element is not the root container and is move to the main container,
			// then adding a wrapper `vc_row`. It is forbidden to add elements without a line to the root container!
			// if (
			// 	this.isMainContainer( newParent )
			// 	&& ! this.isSecondElmContainer( moveId )
			// 	&& this.getElmName( moveId ) !== 'vc_row'
			// ) {
			// 	oldShortcode = this._addRowWrapper( oldShortcode );
			// }

			// Get parent position
			var insert = this.getInsertPosition( newParent, newIndex );

			// Added shortcode to content
			if ( ! this._addShortcodeToContent( newParent, newIndex, oldShortcode ) ) {
				return false;
			}

			// TODO: If move is type vc_column/vc_column_inner then handler `this._vcColumnChange(...)` must be called

			// Move element on preview page
			this.postMessage( 'moveElm', [ insert.parent, insert.position, moveId ] );

			// Send a signal to move element
			this.trigger( 'contentChange' );

			return true;
		},

		/**
		 * Remove the element
		 *
		 * @param removeId string ID of the element that is being removed, e.g. "us_btn:1"
		 * @return {boolean}
		 */
		removeElm: function( removeId ) {
			if ( ! this.isValidId( removeId ) ) {
				return false;
			}
			// Remove element from preview
			this.postMessage( 'removeHtmlElm', removeId );
			var selectedElmId = this.selectedElmId,
				removeName = this.getElmName( removeId ),
				allChildren = this.getElmAllChildren( removeId ),
				rootContainerId;
			// Get the root container to send the change event
			if ( removeName === 'vc_column' || removeName === 'vc_column_inner' ) {
				rootContainerId = this.getElmParentId( removeId );
			}
			// Removing shortcode from content
			this.pageData.content = ( '' + this.pageData.content )
				.replace( this.getElmShortcode( removeId ), '' );
			// Send a signal to remove element
			this.trigger( 'contentChange' );
			if( rootContainerId ) {
				// The private handler is called every time the column/column_inner in change
				this._vcColumnChange( rootContainerId );
			}
			if (
				selectedElmId
				&& (
					removeId == selectedElmId
					|| allChildren.indexOf( selectedElmId ) > -1
				)
			) {
				this.showPanelAddElms(); // Show the section "Add elements"
			}
			return true;
		}
	} );

	$( function() {
		_window.$usb = new USBuilder( '#us-builder-wrapper' );
	} );
}( window.jQuery );
