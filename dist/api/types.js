"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRAPH_DEVICE_DEFAULT = exports.GRAPH_DEVICE = exports.GRAPH_TIMESPAN_DEFAULT = exports.GRAPH_TIMESPAN = void 0;
var GRAPH_TIMESPAN;
(function (GRAPH_TIMESPAN) {
    GRAPH_TIMESPAN["DAY"] = "day";
    GRAPH_TIMESPAN["MONTH"] = "month";
    GRAPH_TIMESPAN["YEAR"] = "month";
    GRAPH_TIMESPAN["WEEK"] = "week";
})(GRAPH_TIMESPAN || (exports.GRAPH_TIMESPAN = GRAPH_TIMESPAN = {}));
exports.GRAPH_TIMESPAN_DEFAULT = GRAPH_TIMESPAN.MONTH;
var GRAPH_DEVICE;
(function (GRAPH_DEVICE) {
    GRAPH_DEVICE["PV"] = "pv";
    GRAPH_DEVICE["LOAD"] = "load";
    GRAPH_DEVICE["BATT"] = "batt";
})(GRAPH_DEVICE || (exports.GRAPH_DEVICE = GRAPH_DEVICE = {}));
exports.GRAPH_DEVICE_DEFAULT = GRAPH_DEVICE.PV;
//# sourceMappingURL=types.js.map