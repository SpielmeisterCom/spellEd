Ext.define('Spelled.nw.Toolbar', {
	alias: 'widget.nwtoolbar',
	extend: 'Ext.container.Container',
	isToolbar: true,

	initComponent: function() {
		var me = this;
		me.callParent();

		var gui = require('nw.gui');
		var win = gui.Window.get();
		var menubar = new gui.Menu({ type: 'menubar' });

		var events = {};

		Ext.each(me.items.items, function(item) {
			if(item.menu) {
				var subMenu = new gui.Menu();

				Ext.each(item.menu.items, function(subItem) {

					events[ subItem.action ] = true;

					subMenu.append(new gui.MenuItem({
						label: subItem.text,
                        keyEquivalent: subItem.keyEquivalent,
                        appleSelector: (subItem.appleSelector) ? subItem.appleSelector : 'invoke:',
						click: function() {
							me.fireEvent( subItem.action, me )
						}
					}));
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

		menubar.append(
			new gui.MenuItem({
				label: 'Debug',
				submenu: subMenu
			})
		);

		win.menu = menubar;
	}

});