var tcp = require('../../../tcp')
var udp = require('../../../udp')
const instance_skel = require('../../../instance_skel')
const { executeAction, getActions } = require('./actions')
const { getConfigFields } = require('./config')
// const { executeFeedback, initFeedbacks } = require('./feedback')
// const { updateVariableDefinitions } = require('./variables')
// const { initPresets } = require('./presets')

/**
 * Companion instance class for Teracom TCW181b
 */
class CompanionRemoteLite extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		this.config.host = this.config.host
		this.config.port = this.config.port || 'tcp'
		// this.config.httpPort = this.config.httpPort || 8080
		this.config.tcpPort = this.config.tcpPort || 51234
		this.config.udpPort = this.config.udpPort || 51235
		// this.updateVariableDefinitions = updateVariableDefinitions
	}

	// Init module
	init() {
		if (this.config.prot == 'tcp') {
			this.init_tcp()
		}

		if (this.config.prot == 'udp') {
			this.init_udp()
		}

		// if (this.config.prot == 'http') {
		// 	self.status(self.STATE_OK);
		// };

		this.actions()
		// this.init_feedbacks()
		// initPresets.bind(this)()

		this.status(this.STATE_OK)
	}

	// 192.168.191.88

	init_udp() {
		var self = this
		if (self.udp !== undefined) {
			self.udp.destroy()
			delete self.udp
		}

		self.status(self.STATE_WARNING, 'Connecting')

		if (self.config.host !== undefined) {
			self.udp = new udp(self.config.host, self.config.udpPort)

			self.udp.on('error', function (err) {
				self.debug('Network error', err)
				self.status(self.STATE_ERROR, err)
				self.log('error', 'Network error: ' + err.message)
			})

			// If we get data, thing should be good
			self.udp.on('data', function () {
				self.status(self.STATE_OK)
			})

			self.udp.on('status_change', function (status, message) {
				self.status(status, message)
			})
		}
	}

	init_tcp() {
		var self = this

		if (self.socket !== undefined) {
			self.socket.destroy()
			delete self.socket
		}

		self.status(self.STATE_WARNING, 'Connecting')

		if (self.config.host) {
			self.socket = new tcp(self.config.host, self.config.tcpPort)

			self.socket.on('status_change', function (status, message) {
				self.status(status, message)
			})

			self.socket.on('error', function (err) {
				self.debug('Network error', err)
				self.status(self.STATE_ERROR, err)
				self.log('error', 'Network error: ' + err.message)
			})

			self.socket.on('connect', function () {
				self.status(self.STATE_OK)
				self.debug('Connected')
			})

			self.socket.on('data', function (data) {})
		}
	}

	// New config saved
	updateConfig(config) {
		if (this.udp !== undefined) {
			this.udp.destroy()
			delete this.udp
		}

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config

		if (this.config.prot == 'tcp') {
			this.init_tcp()
		}

		if (this.config.prot == 'udp') {
			this.init_udp()
		}

		// if (this.config.prot == 'http') {
		// 	this.status(this.STATE_OK);
		// };

		this.actions()
		// this.init_feedbacks()
		// initPresets.bind(this)()
	}

	// Set config page fields
	config_fields() {
		return getConfigFields.bind(this)()
	}

	// Instance removal clean up
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.udp !== undefined) {
			this.udp.destroy()
		}

		this.debug('destroy', this.id)
	}

	// Set available actions
	actions() {
		this.system.emit('instance_actions', this.id, getActions.bind(this)())
	}

	// Execute action
	action(action) {
		executeAction.bind(this)(action)
	}

	// // Set available feedback choices
	// init_feedbacks() {
	// 	const feedbacks = initFeedbacks.bind(this)()
	// 	this.setFeedbackDefinitions(feedbacks)
	// }

	// // Execute feedback
	// feedback(feedback, bank) {
	// 	return executeFeedback.bind(this)(feedback, bank)
	// }
}

module.exports = CompanionRemoteLite
