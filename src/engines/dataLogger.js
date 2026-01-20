export class DataLogger {
  constructor(simId) {
    this.simId = simId;
    this.events = [];
  }

  log(type, payload) {
    const event = {
      time: Date.now(),
      sim: this.simId,
      type,
      payload
    };
    this.events.push(event);
    console.log(event);
  }

  logParameterChange(name, oldVal, newVal) {
    this.log("parameter_change", { name, oldVal, newVal });
  }

  logEvent(type) {
  console.log(`[DataLogger] Event: ${type} at ${Date.now()}`);
}
}
