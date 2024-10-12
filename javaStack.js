/*!
 * javaStack v1.0.0
 * A simple and easy library for highlighting Java stack traces
 * License: Apache 2
 * Author: ShareVB
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.javaStack = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function javaStack(element, options) {
        // Default settings
        var settings = Object.assign({
            method: 'st-methodName',
            file: 'st-fileName',
            line: 'st-lineNumber',
            exception: 'st-exception',
			prettyprint: true,
        }, options);

        var atLineModel = /^\s*at ([^(]+)\(([^:]+)(?::(\d+))?\)$/i;

        var stacktrace = escapeHtml(element.textContent);
		if (settings.prettyprint){
			stacktrace = stacktrace.replace(/\sat\s/g, '\nat ');
		}
        var lines = stacktrace.split('\n'),
            stack = '',
            parts,
            elementObj;

        function template_line(line, element) {
            line = line
				.replace(element.methodName + '(', '<span class="'+ settings.method +'">' + element.methodName + '</span>(')
				.replace('(' + element.file, '(<span class="'+ settings.file +'">' + element.file + '</span>')
                .replace(':' + element.lineNumber + ')', ':<span class="'+ settings.line +'">' + element.lineNumber + '</span>)');
            line = line.replace(/&lt;/g, '<span>&lt;</span>').replace(/&gt;/g, '<span>&gt;</span>');

            return line;
        }

        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        for (var i = 0, j = lines.length; i < j; ++i) {
            var line = '';

            if ((parts = /^([^:\s]+): (.+)$/.exec(lines[i]))) {
                line = '<span class="' + settings.exception + '">' + parts[1] + '</span>: ' + parts[2];			
            } else if ((parts = atLineModel.exec(lines[i]))) {
                elementObj = {
                    'file': parts[2],
                    'methodName': parts[1],
                    'lineNumber': +parts[3],
                };
                line = template_line(lines[i], elementObj);
            } else {
                line = lines[i].replace(/&lt;/g, '<span>&lt;</span>').replace(/&gt;/g, '<span>&gt;</span>');
            }

            if (lines.length - 1 == i) {
                stack += line;
            } else {
                stack += line + '\n';
            }
        }

        element.innerHTML = stack;
    }

    // Function to initialize the plugin on elements
    function initjavaStack(elements, options) {
        elements.forEach(function(element) {
            javaStack(element, options);
        });
    }

    // Expose the plugin globally
    function javaStackLibrary(selector, options) {
        var elements = document.querySelectorAll(selector);
        initjavaStack(Array.from(elements), options);
    }

    return javaStackLibrary;

}));