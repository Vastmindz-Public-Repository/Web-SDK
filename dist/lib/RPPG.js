"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RPPGCamera_1 = (0, tslib_1.__importDefault)(require("./RPPGCamera"));
var RPPGSocket_1 = (0, tslib_1.__importDefault)(require("./RPPGSocket"));
var RPPGTracker_1 = (0, tslib_1.__importDefault)(require("./RPPGTracker"));
var events_1 = require("./consts/events");
/**
 * Class RPPG
 * @example
 * const rppgInstance = window.rppgInstance = new rppg({
 *   onFrame: (data) => console.log('onFrame', data),
 *   onMeasurementProgress: (data) => console.log('onMeasurementProgress', data),
 *   onMeasurementMeanData: (data) => console.log('onMeasurementMeanData', data),
 * })
 * await rppgInstance.initCamera({
 *   width: 640,
 *   height: 480,
 *   videoElement: videoElement,
 *   canvasElement: canvasElement,
 * })
 * await rppgInstance.initTracker({
 *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk/',
 * })
 * await this.rppgInstance.initSocket({
 *   url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
 *   authToken: 'token',
 *   onConnect: () => console.log('Socket connection established'),
 *   onClose: (event) => console.log('Socket connection closed', event),
 *   onError: (event) => console.log('Socket connection error', event),
 * })
 * this.rppgInstance.start()
 */
var RPPG = /** @class */ (function () {
    /**
     * @param {RPPGConfig} config Config passed to RPPG
     */
    function RPPG(config) {
        if (config === void 0) { config = {}; }
        this.rppgCamera = null;
        this.rppgTracker = null;
        this.rppgSocket = null;
        this.width = 0;
        this.height = 0;
        this.frameNumber = 0;
        this.averageFps = 0;
        this.timestamp = 0;
        this.startTimeStamp = 0;
        this.instantFps = 0;
        this.config = config;
        this.version = '0.0.0';
        this.processing = false;
        // TODO verify config
    }
    RPPG.prototype.init = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, rppgTrackerConfig, rppgSocketConfig, rppgCameraConfig, error_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.config, rppgTrackerConfig = _a.rppgTrackerConfig, rppgSocketConfig = _a.rppgSocketConfig, rppgCameraConfig = _a.rppgCameraConfig;
                        if (!rppgTrackerConfig || !rppgSocketConfig || !rppgCameraConfig) {
                            console.log('Error initializing - incorrect configuration');
                            // TODO
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.initCamera(rppgCameraConfig)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.initTracker(rppgTrackerConfig)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.initSocket(rppgSocketConfig)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.log('Error initializing RPPG', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize RPPG Tracker instance
     * @param {RPPGTrackerConfig} rppgTrackerConfig
     * @return {Promise<void>}
     * @example
     * const rppgInstance = new RPPG()
     * await rppgInstance.initTracker({
     *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk/',
     * })
     */
    RPPG.prototype.initTracker = function (rppgTrackerConfig) {
        if (rppgTrackerConfig === void 0) { rppgTrackerConfig = {}; }
        if (this.rppgTracker) {
            // TODO
            console.log('Error initializing - rppgTracker is already initialized');
            return Promise.reject();
        }
        if (!this.width) {
            console.log('Error initializing - rppgCamera should be initialized before initTracker');
            return Promise.reject();
        }
        this.rppgTracker = new RPPGTracker_1.default((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rppgTrackerConfig), { width: this.width, height: this.height }));
        return this.rppgTracker.init();
    };
    /**
     * Initialize RPPG Socket instance
     * @param {RPPGSocketConfig} rppgSocketConfig Socket configuration
     * @return {Promise<Event>}
     * @example
     * const rppgInstance = new RPPG()
     *   await this.rppgInstance.initSocket({
     *     url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
     *     authToken: 'token',
     *     onConnect: () => console.log('Socket connection established'),
     *     onClose: (event) => console.log('Socket connection closed', event),
     *     onError: (event) => console.log('Socket connection error', event),
     *   })
     *
     */
    RPPG.prototype.initSocket = function (rppgSocketConfig) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.rppgSocket) return [3 /*break*/, 2];
                        console.log('Re-inititialize socket connection');
                        this.processing = false;
                        return [4 /*yield*/, this.rppgSocket.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.rppgSocket = new RPPGSocket_1.default((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rppgSocketConfig), { onEvent: this.onEvent.bind(this) }));
                        return [2 /*return*/, this.rppgSocket.init()];
                }
            });
        });
    };
    /**
     * Initialize RPPG Camera instance
     * @param {RPPGCameraConfig} rppgCameraConfig
     * @return {Promise<void>}
     * @example
     * const rppgInstance = new RPPG()
     * const {
     *   width,
     *   height,
     *   stream
     * } = await rppgInstance.initCamera({
     *   width: 640,
     *   height: 480,
     *   videoElement: document.querySelector('video'),
     *   canvasElement: document.querySelector('canvas'),
     *   onSuccess: data => console.log('Initializing camera success', data),
     *   onError: error => console.error('Error initializing camera', error)
     * })
     *
     */
    RPPG.prototype.initCamera = function (rppgCameraConfig) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, width, height;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.rppgCamera) {
                            // TODO
                            console.log('Error initializing - rppgCamera is already initialized');
                            return [2 /*return*/];
                        }
                        this.rppgCamera = new RPPGCamera_1.default(rppgCameraConfig);
                        return [4 /*yield*/, this.rppgCamera.init()];
                    case 1:
                        _a = _b.sent(), width = _a.width, height = _a.height;
                        this.width = width;
                        this.height = height;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Close camera stream
     * @return {void}
     */
    RPPG.prototype.closeCamera = function () {
        if (this.rppgCamera) {
            this.rppgCamera.close();
        }
    };
    /**
     * Switch web camera
     * @return {void}
     */
    RPPG.prototype.switchCamera = function (useFrontCamera) {
        if (this.rppgCamera) {
            return this.rppgCamera.switchCamera(useFrontCamera);
        }
        return Promise.resolve();
    };
    /**
     * Start tracking
     * @return {void}
     */
    RPPG.prototype.start = function () {
        this.processing = true;
        this.frameNumber = 0;
        this.averageFps = 0;
        this.timestamp = 0;
        this.startTimeStamp = new Date().getTime();
        this.capture();
    };
    /**
     * Stop tracking
     * @return {void}
     */
    RPPG.prototype.stop = function () {
        this.processing = false;
    };
    RPPG.prototype.capture = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var timestamp, frame, rppgTrackerData;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.processing) {
                            requestAnimationFrame(this.capture.bind(this));
                        }
                        if (this.width === 0 || !this.rppgCamera || !this.rppgTracker || !this.rppgSocket) {
                            // TODO error
                            return [2 /*return*/];
                        }
                        timestamp = new Date().getTime();
                        this.instantFps = +(1000 / (timestamp - this.timestamp)).toFixed(2);
                        this.timestamp = timestamp;
                        frame = this.rppgCamera.getFrame();
                        if (!frame) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.rppgTracker.processLandmarksImage(frame.data)];
                    case 1:
                        rppgTrackerData = _a.sent();
                        if (!this.config.skipSocketWhenNoFace ||
                            (rppgTrackerData.status !== 1 && rppgTrackerData.status !== 2)) {
                            this.rppgSocket.send({
                                bgrSignal: rppgTrackerData.bgr1d,
                                timestamp: timestamp,
                            });
                        }
                        this.onFrame({
                            rppgTrackerData: rppgTrackerData,
                            instantFps: this.instantFps,
                            averageFps: this.averageFps,
                            timestamp: this.timestamp,
                        });
                        this.frameNumber++;
                        // eslint-disable-next-line max-len
                        this.averageFps = +((1000 * this.frameNumber) / (this.timestamp - this.startTimeStamp)).toFixed(2);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Describe your function
     * @param {RPPGOnFrame} data
     * @return {void}
     * @example
     * const rppgInstance = new rppg({
     *   onFrame: (data) => console.log('onFrame', data),
     * })
     */
    RPPG.prototype.onFrame = function (data) {
        if (typeof this.config.onFrame === 'function') {
            this.config.onFrame(data);
        }
    };
    RPPG.prototype.onEvent = function (eventType, event) {
        // TODO optimize
        // @ts-ignore
        var func = this.config[events_1.EVENTS[eventType]];
        if (func && typeof func === 'function') {
            func(event);
        }
    };
    return RPPG;
}());
exports.default = RPPG;
//# sourceMappingURL=RPPG.js.map