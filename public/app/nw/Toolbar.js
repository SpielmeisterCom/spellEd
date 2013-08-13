Ext.define('Spelled.nw.Toolbar', {
	alias: 'widget.nwtoolbar',
	extend: 'Ext.container.Container',
	requires: [ 'Spelled.view.build.menu.Targets' ],
	isToolbar: true,

	mergeWithXtype: function( menu ) {
		if( !menu.xtype ) return

		var cmp = Ext.create( 'widget.' + menu.xtype )

		menu.items = Ext.Array.map(
			cmp.items.items,
			function( item ) {
				if( !item.action ) item.action = menu.action
				return item
			}
		)
	},

	generateMenu: function() {
		var me = this
		me.generated = true

		var gui     = require('nw.gui'),
			win     = gui.Window.get(),
			menubar = new gui.Menu( { type: 'menubar' } ),
			events  = {}

		var generateSubMenu = function( menu ) {
			var subMenu  = new gui.Menu()

			me.mergeWithXtype( menu )

			Ext.each( menu.items, function(subItem) {
				var hidden = !!subItem.hidden

				if( subItem.menu ) {
					subMenu.append(new gui.MenuItem({
						label: subItem.text,
						submenu: generateSubMenu( subItem.menu )
					}));
				} else {
					events[ subItem.action ] = true

					if( !hidden ) {
						subMenu.append(new gui.MenuItem({
							enabled: !subItem.disabled,
							label: subItem.text,
							keyEquivalent: subItem.keyEquivalent,
							appleSelector: (subItem.appleSelector) ? subItem.appleSelector : 'invoke:',
							click: function() {
								me.fireEvent( subItem.action, me, subItem )
							}
						}));
					}
				}
			});

			return subMenu
		}

		Ext.each(me.items.items, function(item) {
			if(item.menu) {
				var subMenu = generateSubMenu( item.menu )

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