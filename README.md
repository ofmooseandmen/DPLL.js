# DPLL.js

An implementation of the Davis–Putnam–Logemann–Loveland (DPLL) algorithm for solving for solving the CNF-SAT problem.

A CNF is a propositional logic formulae in conjunctive normal form - i.e. an ANDs of ORs

see http://en.wikipedia.org/wiki/DPLL_algorithm

## Usage
The following code snippet solves the SAT problem for the following CNF: (a | b) & (-b | c | -d) & (d | -e)
    
    var CNF = require('src/CNF.js');
    var DPLL = require('src/DPLL.js');
    var cnf = new CNF();
    var a = {};
    var b = {};
    var c = {};
    var d = {};
    var e = {};
    cnf.openClause(a).or(b).close()
       .openClauseNot(b).or(c).orNot(d).close()
       .openClause(d).orNot(e).close();
    var dpll = new DPLL(cnf);
    var solution = dpll.solve().solution();
    console.log(solution.getSolution(a));

## License (MIT)

 Copyright (C) 2013 Cedric Liegeois.

 Permission is hereby granted, free of charge, to any person obtaining 
 a copy of this software and associated documentation files (the 
 "Software"), to deal in the Software without restriction, including 
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject 
 to the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

