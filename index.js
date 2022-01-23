const devices = {
  all: {},
  current: null,
  handlers: {
    deviceChange: new Set()
  }
}

function hasCapability (name) {
  if (!globalThis.matchMedia) return true

  return globalThis.matchMedia(name).matches
}

function triggerDeviceChangeHandlers (newDevice, oldDevice) {
  devices.handlers.deviceChange.forEach(handler => {
    handler({ current: newDevice, previous: oldDevice })
  })
}

function logDevice (name) {
  if (name !== devices.current) {
    triggerDeviceChangeHandlers(name, devices.current)
  }

  devices.all[name] = devices.all[name] || {}
  devices.all[name].lastSeen = new Date().getTime()
  devices.current = name
}

function seenInLast (name, ms) {
  const lastSeen = (devices.all[name] && devices.all[name].lastSeen) || 0
  return new Date().getTime() - lastSeen < ms
}

const listeners = [
  {
    events: ['pointerover', 'pointermove', 'pointerdown', 'gotpointercapture'],
    handler (e) { logDevice(e.pointerType) }
  },

  // Keypress only fires from keyboard, not iPadOS Scribble, BUT not every
  // keyboard interaction triggers keypress (backspace for example), so
  // debounce keydown events of keydown relative to the most recent pen event.
  // 10 seconds seems really long, but that's how long an iPad can take to stop
  // waiting on pen input before translating it to keyboard events
  { events: ['keypress'], handler (e) { logDevice('keyboard') } },
  { events: ['keydown'], handler (e) {
    if (!seenInLast('pen', 10000)) logDevice('keyboard')
  } },
]

module.exports = {
  start (node = globalThis.document) {
    listeners.forEach(listener => {
      listener.events.forEach(event => {
        node.addEventListener(event, listener.handler, {capture: true})
      })
    })
  },
  stop (node = globalThis.document) {
    listeners.forEach(listener => {
      listener.events.forEach(event => {
        node.removeEventListener(event, listener.handler, {capture: true})
      })
    })
  },
  currentDevice () { return devices.current },
  allDevices () { return Object.keys(devices.all) },
  onDeviceChange (handler) {
    devices.handlers.deviceChange.add(handler)
  },
  removeDeviceChangeHandler (handler) {
    devices.handlers.deviceChange.delete(handler)
  }
}

