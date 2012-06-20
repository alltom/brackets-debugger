/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
	'use strict';

	var Inspector	= brackets.getModule("LiveDevelopment/Inspector/Inspector"),
		ScriptAgent	= brackets.getModule("LiveDevelopment/Agents/ScriptAgent");

	var $exports = $(exports);

	var _lastMessage;

    // WebInspector Event: Console.messageAdded
    function _onMessageAdded(res) {
        // res = {message}
        _lastMessage = res.message;
		$exports.trigger("message", _lastMessage);
    }

    // WebInspector Event: Console.messageRepeatCountUpdated
    function _onMessageRepeatCountUpdated(res) {
        // res = {count}
        if (_lastMessage) {
			$exports.trigger("message", _lastMessage);
        }
    }

    // pause the debugger
	function pause() {
		Inspector.Debugger.pause();
	}

	// resume the debugger
	function resume() {
		Inspector.Debugger.resume();
	}

	// step over the current line
	function stepOver() {
		console.log("Step Over");
	}

	// step into the function at the current line
	function stepInto() {
		console.log("Step Into");
	}

	// step out
	function stepOut() {
		console.log("Step Out");
	}

	// toggle a breakpoint
	function toggleBreakpoint(document, line) {
		console.log("Breakpoint in document " + document.url + ":" + line);
		
		var scriptId = _scriptIdForDocument(document);
		
		var debuggerLocation = {
			scriptId: scriptId,
			lineNumber: line,
			columnNumber: 0
		};

		Inspector.Debugger.setBreakpoint(debuggerLocation, function (result) {
			console.log(result.breakpointId);
			console.log(result.actualLocation);
		});
		
		return true;
	}

	function _scriptIdForDocument(document)
	{
		var script = ScriptAgent.scriptForURL(document.url);
		return script.scriptId;
	}

	// evaluate a console command
	function evaluate(command, callback) {
		Inspector.Runtime.evaluate(command, callback);
	}

	// init
	function init() {
		Inspector.on("Console.messageAdded", _onMessageAdded);
		Inspector.on("Console.messageRepeatCountUpdated", _onMessageRepeatCountUpdated);
	}

	// public methods
	exports.init = init;
	exports.pause = pause;
	exports.resume = resume;
	exports.stepOver = stepOver;
	exports.stepInto = stepInto;
	exports.stepOut = stepOut;
	exports.toggleBreakpoint = toggleBreakpoint;
	exports.evaluate = evaluate;
});