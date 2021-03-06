//
// A propositional logic formula in conjunctive normal form (CNF) - or more simply put:
// > an *AND* of *OR*s.
//
// Let's build the following CNF formula:
//
// *(x1 &or; &not;x2) &and; (&not;x1 &or; x2 &or; x3) &and; (&not;x1)*
//
// Or in plain english:
//
// *(x1 or not x2) and (not x1 or x2 or x3) and (not x1)*
//
//
//     var CnfFormula = require('./CnfFormula');
//     var cnf = new CnfFormula();
//     var x1 = {}, x2 = {}, x3 = {};
//
//     cnf.openClause(x1).orNot(x2).close()
//        .openClauseNot(x1).or(x2).or(x3).close()
//        .openClauseNot(x1).close();
//
// ## Definitions
//
// Each chunk of *or* between *()* is called a [clause](./Clause.html).
//
// *x1*, *x2* and *x3* are called variables. Their instances are irrevelant to the algorithm.
//
// *x1* and *&not;x1* are called [literals](./Literal.html). A literal is either:
//
// - just a variable - such as *x1*, it is then called a *positive literal*,
// - the negation of a variable - such as *&not;x1*, it is then called a *negative literal*.
//
// ## Implementation notes
//
// The execution of the DPLL algorithm does not modify the `CNFFormula`. In other words: once built, a `CNFFormula` is
// immutable.
//
// This implementation makes use of [maps](./Map.html) and [sets](./Set.html) to keep tracks of the clauses, variables
// and literals of this formula.
// If a variable implements the `equals` function it will be used instead of the `===` operator to determine variable
// equality.
//
// ## More about...
//
// - Clause: [Clause.js](./Clause.html)
//
// - Literal: [Literal.js](./Literal.html)
//
// - Map: [Map.js](./Map.html)
//
// - Set: [Set.js](./Set.html)
//
// ## Source code
//
// import Map.js
var Map = require('./Map');

// import Set.js
var Set = require('./Set');

// import Clause.js
var Clause = require('./Clause');

//
// Constructor - no argument.
//
function CnfFormula() {
    
    'use strict';

    // the `array` of Clauses of this formula.
    var clauses = [];

    // a `map` whose keys are variables and value the number of occurences in the formula.
    var variables = new Map();

    // a `map` whose keys are variables and values are associated positive literal.
    var positiveLiterals = new Map();

    // a `map` whose keys are variables and values are associated negative literal.
    var negativeLiterals = new Map();

    //
    // adds all the variables of the specified `array` to this formula. This fills the `variables` attribute.
    //
    function addVariables(someVars) {
        var it = someVars.iterator();
        while (it.hasNext()) {
            var someVar = it.next();
            var occ = variables.get(someVar);
            if (occ === undefined) {
                variables.put(someVar, 1);
            } else {
                variables.put(someVar, occ + 1);
            }
        }
    };

    //
    // Returns a new `clause` with specified `variable` as first `literal`. This `literal` will be positive.
    //
    this.openClause = function(variable) {
        return new Clause(variable, false, this);
    };

    //
    // Returns a new `clause` with specified `variable` as first `literal`. This `literal` will be negative (negation of
    // variable).
    //
    this.openClauseNot = function(variable) {
        return new Clause(variable, true, this);
    };

    //
    // Adds the specified `clause` to this formula.
    //
    this.addClause = function(clause, vars, literals) {
        clauses.push(clause);
        addVariables(vars);
        var it = literals.iterator();
        while (it.hasNext()) {
            var l = it.next();
            if (l.isPositive()) {
                positiveLiterals.put(l.variable(), l);
            } else {
                negativeLiterals.put(l.variable(), l);
            }
        }
        return this;
    };

    // returns the `variables` attribute.
    this.variables = function() {
        return variables;
    };

    //
    // Evaluate this formula against the specified `valuation` and returns
    //
    // - `true` if this formula is satisfied under the specified `valudation`
    // - `false` if this formula is not satisfied under the specified `valudation`
    // - `undefined` if the specified `valudation` does not allow to evaluate this formula - i.e. some variables are
    // still unassigned
    //
    // This method just loop through all the clauses of this formula calling in turn `Clause#evaluate`.
    //
    this.evaluate = function(valuation) {
        var result = true;
        var length = clauses.length;
        for (var index = 0; index < length && result !== undefined && result; index++) {
            result = clauses[index].evaluate(valuation);
        }
        return result;
    };

    //
    // Performs the *unit propagation* step. If a clause is a unit clause, i.e. it contains only a single unassigned
    // literal, this clause can only be satisfied by assigning the necessary value to make this literal true. Thus, no
    // choice is necessary. In practice, this often leads to deterministic cascades of units, thus avoiding a large part
    // of the naive search space.
    //
    // The specified `valuation` will be filled with computed variable truth assignments upon return.
    //
    // This method just loop through all the clauses of this formula calling in turn `Clause#evaluate`.
    //
    this.unitPropagate = function(valuation) {
        var length = clauses.length;
        for (var index = 0; index < length; index++) {
            clauses[index].unitPropagate(valuation);
        }
    };

    //
    // Performs the *pure literal elimination* step. If a propositional variable occurs with only one polarity in the
    // formula,
    // it is called pure. Pure literals can always be assigned in a way that makes all clauses containing them `true`.
    // Thus, these clauses do not constrain the search anymore and can be deleted.
    //
    // The specified `valuation` will be filled with computed variable truth assignments upon return.
    //
    this.pureLiteralAssign = function(valuation) {
        var it = valuation.unassigned().iterator();
        while (it.hasNext()) {
            var variable = it.next();
            // variable not assign, check if pure literal.
            var pLiteral = positiveLiterals.containsKey(variable);
            var nLiteral = negativeLiterals.containsKey(variable);
            if (pLiteral && !nLiteral) {
                valuation.putSolution(variable, true);
            } else if (nLiteral && !pLiteral) {
                valuation.putSolution(variable, false);
            }
        }
    };

}

// expose API to Node.js
module.exports = CnfFormula;
