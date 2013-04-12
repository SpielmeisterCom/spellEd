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
						click: function() {

							me.fireEvent(
								subItem.action
							);

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
		win.menu = menubar;
	}

});