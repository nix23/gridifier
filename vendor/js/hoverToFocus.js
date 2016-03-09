$(document).ready(function() {
    !function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.removeHover=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
        'use strict'

        /**
         * It will remove :hover selectors from the rules or the rules completely when
         * all selectors contain :hover.
         *
         * @author Oleg Slobodskoi 2014
         */

        var hoverRegex = /:hover/

        module.exports = function() {
            var sheets = document.styleSheets,
                sheetIndex, ruleIndex, selIndex,
                sheet, rule, rulsLn,
                selectors, selectorText

            if (!('ontouchend' in document) || !sheets || !sheets.length) return

            for (sheetIndex = 0; sheetIndex < sheets.length; ++sheetIndex) {
                sheet = sheets[sheetIndex]
                if (!sheet.cssRules) continue

                rulsLn = sheet.cssRules.length
                for (ruleIndex = 0; ruleIndex < rulsLn; ++ruleIndex) {
                    rule = sheet.cssRules[ruleIndex]

                    if (rule && rule.selectorText && hoverRegex.test(rule.selectorText)) {
                        selectors = rule.selectorText.split(',')
                        selectorText = ''

                        for (selIndex = 0; selIndex < selectors.length; ++selIndex) {
                            if (!hoverRegex.test(selectors[selIndex])) {
                                if (selectorText) selectorText += ','
                                selectorText += selectors[selIndex]
                            }
                        }

                        if (selectorText) {
                            rule.selectorText = selectorText

                            // All selectors contain :hover.
                        } else {
                            //sheet.deleteRule(ruleIndex)
                            rule.selectorText = rule.selectorText.replace(/:hover/g, ":active");
                        }
                    }
                }
            }
        }

    },{}]},{},[1])
    (1)
    });

    removeHover();
});