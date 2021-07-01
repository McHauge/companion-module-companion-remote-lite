exports.getActions = function () {
	return {
		BankPress: {
			label: 'Press a Bank/Button',
			options: [
				{
					type: 'dropdown',
					id: 'command',
					label: 'Bank Press Command',
					default: 'BANK-PRESS',
					choices: [
						{ id: 'BANK-PRESS', label: 'Press and Release' },
						{ id: 'BANK-DOWN', label: 'Press Down' },
						{ id: 'BANK-UP', label: 'Release' },
					],
				},
				{
					type: 'number',
					label: 'Page',
					id: 'page',
					min: 1,
					max: 99,
					default: 1,
				},
				{
					type: 'number',
					label: 'Bank/Button',
					id: 'bank',
					min: 1,
					max: 32,
					default: 1,
				},
			],
		},
		PageSet: {
			label: 'Set Remote Surface to Page',
			options: [
				{
					type: 'dropdown',
					id: 'command',
					label: 'Page Command',
					default: 'PAGE-SET',
					choices: [
						{ id: 'PAGE-SET', label: 'Set Page' },
						{ id: 'PAGE-UP', label: 'Increase Page' },
						{ id: 'PAGE-DOWN', label: 'Decrease Page' },
					],
				},
				{
					type: 'textinput',
					label: 'Surface ID',
					id: 'surfaceID',
				},
				{
					type: 'number',
					label: 'Page (only used with "Set")',
					id: 'page',
					min: 1,
					max: 99,
					default: 1,
				},
			],
		},
	}
}

exports.executeAction = function (action) {
	var self = this
	var opt = action.options
	var conf = self.config
	var cmd

	switch (action.action) {
		case 'BankPress':
			cmd = opt.command + ' ' + opt.page + ' ' + opt.bank
			break
		case 'PageSet':
			if (opt.command == 'PAGE-SET') {
				cmd = opt.command + ' ' + opt.page + ' ' + opt.surfaceID
			} else {
				cmd = opt.command + ' ' + opt.surfaceID
			}
			break
		default:
			break
	}

	if (cmd !== undefined) {
		cmd = cmd + '\n\r'

		console.log(cmd)
		if (self.config.prot == 'tcp') {
			self.debug('sending', cmd, 'to', self.config.host)

			if (self.socket !== undefined && self.socket.connected) {
				self.socket.send(cmd)
			} else {
				self.debug('Socket not connected :(')
			}
		}

		if (self.config.prot == 'udp') {
			if (self.udp !== undefined) {
				self.debug('sending', cmd, 'to', self.config.host)
				self.udp.send(cmd)
			}
		}
	}
}
