Ext.define('Spelled.nw.Toolbar', {
	alias: 'widget.nwtoolbar',
	extend: 'Ext.container.Container',
	isToolbar: true,

	initComponent: function() {
		var me = this

		me.callParent( arguments )

		var gui     = require('nw.gui'),
			win     = gui.Window.get(),
			menubar = new gui.Menu( { type: 'menubar' } ),
			events  = {}

		Ext.each(me.items.items, function(item) {
			if(item.menu) {
				var subMenu = new gui.Menu();

				Ext.each(item.menu.items, function(subItem) {
					var hidden = !!subItem.hidden

					events[ subItem.action ] = true

					if( !hidden ) {
						subMenu.append(new gui.MenuItem({
							label: subItem.text,
							keyEquivalent: subItem.keyEquivalent,
							appleSelector: (subItem.appleSelector) ? subItem.appleSelector : 'invoke:',
							click: function() {
								me.fireEvent( subItem.action, me )
							}
						}));
					}
				});

				menubar.append(
					new gui.MenuItem({
						label: item.text,
						submenu: subMenu
					})
				);
			} else {

				//not supported by node-webkit
			}



		})

		this.addEvents( events );

		var subMenu = new gui.Menu();

		subMenu.append(new gui.MenuItem({
			label: 'Open Development Console',
            keyEquivalent: 'c',
			click: function() {
				var gui = require('nw.gui');
				var win = gui.Window.get();
				win.showDevTools();
			}
		}));

		subMenu.append(new gui.MenuItem({
			label: 'Eject Warp Core [WebKit]',
			click: function() {

				window.setTimeout( function() {
					window.triggerError('WebKit Warp Core Ejection');
				}, 1);
			}
		}));

		subMenu.append(new gui.MenuItem({
			label: 'Eject Warp Core [Node]',
			click: function() {
				window.triggerError('Node WebKit Warp Core Ejection');
			}
		}));

		menubar.append(
			new gui.MenuItem({
				label: 'Debug',
				submenu: subMenu
			})
		);

		win.menu = menubar;
	}

});