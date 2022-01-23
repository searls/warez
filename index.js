const devices = {
  all: {},
  current: null
}

function hasCapability (name) {
  if (!globalThis.matchMedia) return true

  return globalThis.matchMedia(name).matches
}

function logDevice (name) {
  devices.all[name] = devices.all[name] || {}
  devices.all[name].lastSeen = new Date().getTime()
  devices.current = name
}

function seenInLast (name, ms) {
  const lastSeen = (devices.all[name] && devices.all[name].lastSeen) || 0
  return new Date().getTime() - lastSeen < ms
}

const listeners = [
  { events: ['pointerover', 'pointermove', 'pointerdown', 'gotpointercapture'], handler (e) {
    logDevice(e.pointerType)
  }},

  // Only fires from keyboard, not iPadOS Scribble, BUT not every keyboard
  // interaction triggers keypress (backspace for example), so debounce keydown
  // events of keydown relative to the most recent pen event
  { events: ['keypress'], handler (e) { logDevice('keyboard') } },
  { events: ['keydown'], handler (e) {
    if (!seenInLast('pen', 5000)) logDevice('keyboard')
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
  allDevices () { return Object.keys(devices.all) }
}

