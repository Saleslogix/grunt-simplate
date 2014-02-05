/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */

'use strict';

module.exports = function(grunt) {
    var util = require('util'),
        Simplate = require('../libs/simplate.js'),
        traverse = require('ast-traverse'),
        esprima = require('esprima');

    grunt.registerMultiTask('simplate', 'pre-compiles simplate templates.', function() {
        var options,
            done,
            cached = {},
            outfile,
            simplateFn,
            outputTemplate;

        options = this.options();
        done = this.async();

        if (options.output) {
            outfile = options.output;
        }

        this.files.forEach(function(file) {
            file.src.forEach(function(filepath) {
                var content = grunt.file.read(filepath),
                    ast = esprima.parse(content);

                traverse(ast, {
                    pre: function(node, parent, prop, idx) {
                        var simplateArgs,
                            codeGen = [],// arguments passed into the "new Simplate" expression
                            code = '',
                            fn;
                        if (node.type === 'NewExpression' && node.callee && node.callee.name === 'Simplate') {
                            if (node.arguments && node.arguments.length > 0) {
                                simplateArgs = node.arguments[0];
                                if (simplateArgs.type === 'Literal') {
                                    codeGen.push(simplateArgs.value);
                                } else if (simplateArgs.type === 'ArrayExpression') {
                                    simplateArgs.elements.forEach(function(el) {
                                        codeGen.push(el.value);
                                    });
                                }

                                code = codeGen.join('');
                                code = code.replace(/'/g, "\\\'");
                                fn = Simplate.make(code);
                                cached[code] = fn; 
                            }
                        }
                    }
                });
            });
        });

        if (outfile) {
            grunt.log.debug('Writing ' + outfile);
            simplateFn = Simplate.make([
                // AMD
                "/* This file is generated, do not modify */",
                "{% if ($.amd) { %}",
                    "define('{%= $.amd %}', [], function() {",
                    "var results = function() {",
                "{% } %}",

                "{% Object.keys($.cached).forEach(function(key) { %}",
                "Simplate.setCache('{%= key %}', {%= $.cached[key] %});", 
                "{% }); %}",

                // AMD
                "{% if ($.amd) { %}",
                    "};",
                    "return results;",
                    "});",
                "{% } %}"
            ]);
            outputTemplate = simplateFn.call(this, {cached: cached, amd: options.amd});
            grunt.file.write(outfile, outputTemplate);
        }

    });
};

