"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable no-underscore-dangle */
var api_1 = require("./consts/api");
var errors_1 = require("./consts/errors");
var rppg_1 = (0, tslib_1.__importDefault)(require("./module/rppg"));
/**
 * Class RPPGTracker
 * @example
 * const rppgTrackerInstance = new RPPGTracker()
 */
var RPPGTracker = /** @class */ (function () {
    /**
     * @param {RPPGTrackerConfig} config Config passed to RPPGTracker
     */
    function RPPGTracker(config) {
        if (config === void 0) { config = {}; }
        this.Module = rppg_1.default;
        this.module = null;
        this.deepColor = 4;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.config = config;
        this.bufferSize = this.width * this.height * this.deepColor;
    }
    /**
     * Init RPPG Tracker instance
     * @returns {Promise<void>}
     */
    RPPGTracker.prototype.init = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var moduleOptions, _a, e_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        moduleOptions = this.getModuleOptions();
                        _a = this;
                        return [4 /*yield*/, new this.Module(moduleOptions)];
                    case 1:
                        _a.module = (_b.sent());
                        if (!this.module) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.module.ready];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.module._initTracker()];
                    case 3:
                        _b.sent();
                        this.initMemoryBuffer();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        this.module = null;
                        console.error(errors_1.ERROR_MODULE_INITIALIZATION, e_1);
                        throw Error(errors_1.ERROR_MODULE_INITIALIZATION);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RPPGTracker.prototype.getModuleOptions = function () {
        var _a = this.config.pathToWasmData, pathToWasmData = _a === void 0 ? api_1.PATH_TO_WASM : _a;
        if (!pathToWasmData.endsWith('/')) {
            pathToWasmData += '/';
        }
        return {
            locateFile: function (path) { return pathToWasmData + path; },
        };
    };
    RPPGTracker.prototype.initMemoryBuffer = function () {
        if (!this.module) {
            return;
        }
        this.inputBuf = this.module._malloc(this.bufferSize);
        this.uint8Array = new Uint8ClampedArray(this.module.HEAPU8.buffer, this.inputBuf, this.bufferSize);
    };
    RPPGTracker.prototype.processLandmarksImage = function (data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var status, bgr1d, landmarks, face;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (!this.module) {
                    throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
                }
                if (this.uint8Array) {
                    this.uint8Array.set(data);
                }
                this.module._process_landmarks(this.inputBuf, this.width, this.height);
                status = this.module.getStatus();
                bgr1d = this.getBgr1d();
                landmarks = this.getLastLandmarks();
                face = this.getFace();
                return [2 /*return*/, {
                        status: status,
                        bgr1d: bgr1d,
                        landmarks: landmarks,
                        face: face,
                    }];
            });
        });
    };
    /**
     * getBgr1d
     * @returns {number[]}
     */
    RPPGTracker.prototype.getBgr1d = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var bgr1d = this.module.get_bgr1d();
        var bgr1dArr = [];
        for (var i = 0; i < bgr1d.size(); i++) {
            bgr1dArr.push(bgr1d.get(i));
        }
        return bgr1dArr;
    };
    /**
     * getLastLandmarks
     * @returns {number[]}
     */
    RPPGTracker.prototype.getLastLandmarks = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var landmarks = this.module.getLastLandmarks();
        var landmarksArr = [];
        for (var i = 0; i < landmarks.size(); i++) {
            landmarksArr.push(landmarks.get(i));
        }
        return landmarksArr;
    };
    /**
     * getFace
     * @returns {number[]}
     */
    RPPGTracker.prototype.getFace = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getFace();
    };
    /**
     * getROIs
     * @returns {void[]}
     */
    RPPGTracker.prototype.getROIs = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        // not implemented
    };
    return RPPGTracker;
}());
exports.default = RPPGTracker;
//# sourceMappingURL=RPPGTracker.js.map