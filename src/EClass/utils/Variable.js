class Variable {
  constructor(name) {
    this._name = name;
    this._type = "Numeric";
    this._isSelected = true;
    this._axis = null;
    this._graph = null;
    this._unit = "";
  }

  setting(type, axis, graph) {
    this._type = type;
    this._axis = axis;
    this._graph = graph;
  }

  get isSelected() {
    return this._isSelected;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get axis() {
    return this._axis;
  }

  get graph() {
    return this._graph;
  }

  get unit() {
    return this._unit;
  }

  setName(name) {
    this._name = name;
  }

  setType(type) {
    this._type = type;
  }

  toggleSelected() {
    this._isSelected = !this._isSelected;
  }

  setIsSelected(isSelected) {
    this._isSelected = isSelected;
  }

  setAxis(axis) {
    if (this._axis === axis) {
      axis = null;
    }
    this._axis = axis;
  }

  setGraph(graph) {
    if (this._graph === graph) {
      graph = null;
    }
    this._graph = graph;
  }

  setUnit(unit) {
    this._unit = unit;
  }

  copy() {
    const newVariable = new Variable(this._name);
    newVariable.setIsSelected(this._isSelected);
    newVariable.setType(this._type);
    newVariable.setAxis(this._axis);
    newVariable.setGraph(this._graph);
    newVariable.setUnit(this._unit);
    return newVariable;
  }
}

export default Variable;
