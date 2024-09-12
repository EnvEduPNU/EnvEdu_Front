class Axis {
  constructor() {
    this._min = 0;
    this._max = 0;
    this._stepSize = 0;
  }

  setting(min, max, stepSize) {
    this.setMin(min);
    this.setMax(max);
    this.setStepSize(stepSize);
  }

  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  get stepSize() {
    return this._stepSize;
  }

  setMin(min) {
    this._min = min;
  }

  setMax(max) {
    this._max = max;
  }

  setStepSize(stepSize) {
    this._stepSize = stepSize;
  }

  copy() {
    const newAxis = new Axis();
    newAxis.setMin(this._min);
    newAxis.setMax(this._max);
    newAxis.setStepSize(this._stepSize);
    return newAxis;
  }
}

export default Axis;
