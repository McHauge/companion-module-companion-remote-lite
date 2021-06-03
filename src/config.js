exports.getConfigFields = function () {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 12,
			default: '',
			// regex: self.REGEX_IP
		},
		// {
		// 	type: 'textinput',
		// 	id: 'httpPort',
		// 	label: 'HTTP Port (Default: 8080)',
		// 	width: 6,
		// 	default: 8080,
		// 	regex: this.REGEX_PORT,
		// },
		{
			type: 'textinput',
			id: 'tcpPort',
			label: 'TCP Port (Default: 51234)',
			width: 6,
			default: 51234,
			regex: this.REGEX_PORT,
		},
		{
			type: 'textinput',
			id: 'udpPort',
			label: 'UDP Port (Default: 51235)',
			width: 6,
			default: 51235,
			regex: this.REGEX_PORT,
		},
		{
			type: 'dropdown',
			id: 'prot',
			label: 'Connect with TCP / UDP',
			width: 6,
			default: 'tcp',
			choices:  [
				{ id: 'tcp', label: 'TCP' },
				{ id: 'udp', label: 'UDP' },
				// { id: 'http', label: 'HTTP' }
			]
		},
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'Ports values are set as the default ones used in Bitfocus Companion, so you should only need to change the IP to match',
		},
	]
}
