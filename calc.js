perform = {
  performOperation: function(operator) {
    var operatorFcns = {
      "+": function(a, b) { return a + b; },
      "-": function(a, b) { return a - b; },
      "*": function(a, b) { return a * b; },
      "/": function(a, b) { return a / b; }
    };
    return operatorFcns[operator];
  },
  calculatorResponse: function(calcExpression) {
    var splitCalc = calcExpression.match(/([0-9]+)(\W)([0-9]+)/),
        num1 = Number(splitCalc[1]),
        num2 = Number(splitCalc[3]),
        operator = splitCalc[2],
        calculation = perform.performOperation(operator)(num1, num2);
    return calculation.toString();
  }
};
module.exports = perform;
