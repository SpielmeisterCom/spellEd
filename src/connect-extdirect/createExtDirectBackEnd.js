define(
	'connect-extdirect/createExtDirectBackEnd',
	[
		'mongodb',
		'querystring',
        'formidable'
	],
	function(
		mongodb,
		querystring,
        formidable
	) {
		'use strict'


		/**
		 * private
		 */
		function parseMultipart( request, callback ) {

			var form  = new formidable.IncomingForm(),
                data  = {},
                files = []

            form
                .on('field', function( field, value ) {
                    data[ field ] = value
                })
                .on('file', function( field, file ) {
                    files.push( {
                            name: field,
                            file: file
                        }
                    );
                })
                .on('end', function() {
                    data.files = files
                    callback.call( null, data );
                })

            form.parse( request )
		}

		function parseJson(request, callback) {
			request.setEncoding('utf8');
			var data = '';
			request.addListener('data', function(chunk) {
				data += chunk;
			});
			request.addListener('end', function() {
				var json;
				try {
					json = JSON.parse(data);
				} catch (e) {
				}
				if (!json) {
					json = querystring.parse(data);
				}
				callback.call(null, json);
			});
		}


		/**
		 * public
		 */

		return function( remotingUrl, remotingNamespace, remotingActions ) {
			Function.prototype.method = function(name, func) {
				this.prototype[name] = func;
				return this;
			};

			Function.method('remoting', function(cfg) {
				var that = this;
				var name = cfg.name || '';
				var len = cfg.len || 0;
				var form_handler = cfg.form_handler || false;
				if (!remotingActions[cfg.action]) {
					remotingActions[cfg.action] = {};
				}

				remotingActions[cfg.action][name] = {
					name: name,
					len: len,
					func: that,
					form_handler: form_handler
				};

				return function() {
					return that.apply(null, arguments);
				};
			});

			function get_api(request, response)  {
				var actions = {};
				for (var act in remotingActions) {
					actions[act] = [];
					for (var m in remotingActions[act]) {
						var cfg = remotingActions[act][m];
						actions[act].push({
							name: cfg.name,
							len: cfg.len,
							formHandler: cfg.form_handler
						});
					}
				}
				var config = {
					'url'       : remotingUrl,
					'namespace' : remotingNamespace,
					'type'      : 'remoting',
					'actions'   : actions
				}

				var api = JSON.stringify(config)
				response.writeHead(200, {'Content-Type': 'text/javascript'});
				response.end(api);
			}

			function router(request, response, next) {

				var contentType = request.headers['content-type'],
					onEndCallback = function(data) {
						var total_req = data.length,
							complited_req = 0,
							responses = [];

						if (!(data instanceof Array)) {
							data = [data];
						}

						for (var i in data) {
							var act_data = data[i];
							if (act_data['extAction']) {
								var extdirect_req = {
									action: act_data['extAction'],
									method: act_data['extMethod'],
									tid: act_data['extTID'],
									type: act_data['extType'],
									isForm: true,
									isUpload: act_data['extUpload'] == "true"
								}
							} else {
								extdirect_req = act_data;
							}

							// Workaround for saving the Ext-Id on the specified Request
							request.extDirectId = data[i].tid

							var extdirect_res = extdirect_req;

							var action = extdirect_req.action;
							var method = extdirect_req.method;

							var mcfg = {};

							for( var t in remotingActions[action] ) {
								var config = remotingActions[action][t]
								if( config.name === method ) mcfg = config
							}

							if (extdirect_req.isForm) {
								var extdirect_post_data = act_data;
								delete extdirect_post_data.extAction;
								delete extdirect_post_data.extMethod;
								delete extdirect_post_data.extTID;
								delete extdirect_post_data.extType;
								delete extdirect_post_data.extUpload;
							} else {
								var extdirect_post_data = act_data.data;
							}

							try {
								var func = mcfg.func;
								var callback = function(extdirect_res){
									return function(result) {
										extdirect_res['result'] = result;
										responses.push(extdirect_res);
										complited_req++;
										if (complited_req == data.length) {
											//For SpellBuildActions don't respond at this point
											if( extdirect_res.action !== "SpellBuildActions" ) {
												if (!extdirect_res.isUpload) {
													response.writeHead(200, {'Content-type': 'application/json'});
												} else {
													response.writeHead(200, {'Content-type': 'text/html'});
												}
												response.end(JSON.stringify(responses), 'utf8');
											}
										}
									}
								}.apply(null, [extdirect_res]);

								callback(
									func.call(
										callback,
										request,
										response,
										extdirect_post_data,
										next
									)
								)

							} catch( e ) {
								console.log( e )
								response.writeHead( 500, {'Content-type': 'application/json'});
								response.end( e.toString(), 'utf8' );
                                return
							}
						}
					};
				if (contentType.match(/multipart/i)) {
					parseMultipart(request, onEndCallback);
				} else {
					parseJson(request, onEndCallback);
				}
			}

			return {
				get_api : get_api,
				router : router
			}
		}
	}
)
