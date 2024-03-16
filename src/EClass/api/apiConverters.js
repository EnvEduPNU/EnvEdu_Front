export class ApiConverter {
  converters = [new MatrixApiConverter(), new ChartApiConverter()];

  convert(data) {
    const type = data.classroomSequenceType;
    const converter = this.converters.filter(converter =>
      converter.isSupport(type)
    );

    if (converter.length != 1) return data;

    return converter[0].convert(data);
  }
}

class MatrixApiConverter {
  isSupport(type) {
    return type === "MATRIX";
  }
  convert(data) {
    return {
      ...data,
      properties: JSON.stringify(data.data[0]),
      data: JSON.stringify(data.data.slice(1)),
    };
  }

  convertArrToApiArr(arr) {
    return "[" + arr.join(",") + "]";
  }
}

class ChartApiConverter {
  isSupport(type) {
    return type === "CHART";
  }
  convert({
    classroomSequenceType,
    studentVisibleStatus,
    title,
    canSubmit,
    canShare,
    data,
  }) {
    console.log(data);
    const { graphIdx, variables, axisData, metaData } = data;
    return {
      classroomSequenceType,
      studentVisibleStatus,
      properties: JSON.stringify(data.data.slice(1)),
      data: JSON.stringify(data.data[0]),
      title,
      canSubmit,
      canShare,
      chartType: this.convertChartType(graphIdx),
      uuid: null,
      legendPosition: metaData.legendPostion.toUpperCase(),
      labelPosition: metaData.datalabelAnchor.toUpperCase(),
      axisProperties: this.convertAxisProperties(graphIdx, variables, axisData),
    };
  }

  convertAxisProperties(graphIdx, variables, axisData) {
    if (graphIdx == 0 || graphIdx == 1) {
      return variables.map(variable =>
        this.convertAxisPropertie(variable, axisData)
      );
    }

    if (graphIdx == 2 || graphIdx == 4) {
      return variables.map(variable =>
        this.convertAxisPropertieWithBubble(variable, axisData)
      );
    }
    return [];
  }

  convertChartType(graphIdx) {
    switch (graphIdx) {
      case 0:
        return "BAR";
      case 1:
        return "LINE";
      case 2:
        return "BUBBLE";
      case 4:
        return "SCATTER";
      case 5:
        return "MIX";
      default:
        return -1;
    }
  }

  convertAxisPropertie(variable, axisData) {
    return {
      axis: variable.axis === "Y" ? "Y1" : "X",
      axisName: variable.name,
      axisType: variable.type.toUpperCase(),
      minimumValue: axisData.min,
      maximumValue: axisData.max,
      stepSize: axisData.stepSize,
    };
  }

  convertAxisPropertieWithBubble(variable, axisData) {
    const { xAxis, yAxis } = axisData;
    return {
      axis: variable.axis === "Y" ? "Y1" : variable.axis,
      axisName: variable.name,
      axisType: variable.type.toUpperCase(),
      minimumValue: variable.axis === "X" ? xAxis.min : yAxis.min,
      maximumValue: variable.axis === "X" ? xAxis.max : yAxis.max,
      stepSize: variable.axis === "X" ? xAxis.stepSize : yAxis.stepSize,
    };
  }
}
