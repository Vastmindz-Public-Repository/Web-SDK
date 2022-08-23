"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable no-underscore-dangle */
var api_1 = require("./consts/api");
var errors_1 = require("./consts/errors");
var rppg_1 = (0, tslib_1.__importDefault)(require("./module/rppg"));
var RPPGEvents_types_1 = require("./RPPGEvents.types");
var STATUS = {
    ALL_VITALS_CALCULATED: 0,
    NO_FACE: 1,
    FACELOST: 2,
    ANALYZING: 3,
    REACLIBRATING: 4,
    BRIGHT_LIGHT_DETECTED: 5,
    NOISE_DETECTED: 6,
    WRONG_INPUTS: 7, //!< wrong inputs
};
var STATUSES = [
    { code: 'SUCCESS', message: 'Success' },
    { code: 'NO_FACE', message: 'No face detected' },
    { code: 'FACE_LOST', message: 'Face was lost' },
    { code: 'CALIBRATING', message: 'Calibrating' },
    { code: 'RECALIBRATING', message: 'Recalibrating' },
    { code: 'BRIGHT_LIGHT_ISSUE', message: 'Bright light detected' },
    { code: 'NOISE_DURING_EXECUTION', message: 'Interference detected' },
    { code: 'UNKNOWN', message: 'Wrong inputs' },
];
var BP_STATUS = (_a = {},
    _a[-1] = 'NO_DATA',
    _a[0] = 'NORMAL',
    _a[1] = 'ELEVATED',
    _a[2] = 'HYP_S1',
    _a[3] = 'HYP_S2',
    _a[4] = 'HYP_CRISIS',
    _a);
var STRESS_STATUS = (_b = {},
    _b[-1] = 'NO_DATA',
    _b[0] = 'LOW',
    _b[1] = 'NORMAL',
    _b[2] = 'ELEVATED',
    _b[3] = 'VERY_HIGH',
    _b);
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
        this.unstableTimeout = null;
        this.unstableTimeoutLimit = 15000;
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
    RPPGTracker.prototype.processFrame = function (data, timestamp) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var eyeBlinkStatus, imageQualityFlags, status, signal, ecg, bloodPressureStatus, snr, stress, stressStatus, progressPercent, hrv, mean, measurementProgressData, measurementSignalData, hrvMetricsData, measurementStressData, signalQualityData, measurementMeanData, measurementStatusData, bloodPressureData, bgr1d, landmarks, face;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (!this.module) {
                    throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
                }
                if (this.uint8Array) {
                    this.uint8Array.set(data);
                }
                if (this.config.serverless) {
                    this.module._track(this.inputBuf, this.width, this.height, timestamp);
                }
                else {
                    this.module._process_landmarks(this.inputBuf, this.width, this.height, timestamp);
                }
                eyeBlinkStatus = this.getEyeBlinkStatus();
                imageQualityFlags = this.getImageQualityFlags();
                status = this.getStatus();
                signal = this.getSignal(256);
                ecg = this.getECG(256);
                bloodPressureStatus = this.getBPStatus();
                snr = this.getMeanSNR();
                stress = this.getStress();
                stressStatus = this.getStressStatus();
                progressPercent = this.getProgress();
                hrv = this.getHRVFeatures();
                mean = this.getMean_BPM_RR_SpO2();
                if (this.config.serverless && this.config.onEvent) {
                    measurementProgressData = {
                        progressPercent: progressPercent,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_PROGRESS, measurementProgressData);
                    measurementSignalData = {
                        signal: signal,
                        ecg: ecg,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_SIGNAL, measurementSignalData);
                    hrvMetricsData = hrv;
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.HRV_METRICS, hrvMetricsData);
                    measurementStressData = {
                        stress: stress,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.STRESS_INDEX, measurementStressData);
                    signalQualityData = {
                        snr: snr,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.SIGNAL_QUALITY, signalQualityData);
                    measurementMeanData = {
                        bpm: Math.round(mean.bpm_mean),
                        rr: Math.round(mean.rr_mean),
                        oxygen: Math.round(mean.oxygen_mean),
                        stressStatus: stressStatus,
                        bloodPressureStatus: bloodPressureStatus,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_MEAN_DATA, measurementMeanData);
                    measurementStatusData = {
                        statusCode: STATUSES[status].code,
                        statusMessage: STATUSES[status].message,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_STATUS, measurementStatusData);
                    bloodPressureData = {
                        systolic: 0,
                        diastolic: 0,
                    };
                    this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.BLOOD_PRESSURE, bloodPressureData);
                    if (status === STATUS.NOISE_DETECTED) {
                        this.config.onEvent(RPPGEvents_types_1.RPPGMessageType.UNSTABLE_CONDITIONS_WARNING, {});
                        this.unstableTimeout = this.unstableTimeout ||
                            setTimeout(this.config.onEvent.bind(this, RPPGEvents_types_1.RPPGMessageType.INTERFERENCE_WARNING, {}), this.unstableTimeoutLimit);
                    }
                    else {
                        this.unstableTimeout && clearTimeout(this.unstableTimeout);
                        this.unstableTimeout = null;
                    }
                }
                bgr1d = this.getBgr1d();
                landmarks = this.getLastLandmarks();
                face = this.getFace();
                return [2 /*return*/, {
                        eyeBlinkStatus: eyeBlinkStatus,
                        imageQualityFlags: imageQualityFlags,
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
     * getImageQualityFlags
     * @returns {ImageQualityFlags}
     */
    RPPGTracker.prototype.getImageQualityFlags = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var imageQualityFlagsByte = this.module.getImageQualityFlags();
        return {
            brightColorFlag: Boolean(imageQualityFlagsByte & (1 << 0)),
            illumChangeFlag: Boolean(imageQualityFlagsByte & (1 << 1)),
            noiseFlag: Boolean(imageQualityFlagsByte & (1 << 2)),
            sharpFlag: Boolean(imageQualityFlagsByte & (1 << 3)),
            faceSizeFlag: Boolean(imageQualityFlagsByte & (1 << 4)),
            faceOrientFlag: Boolean(imageQualityFlagsByte & (1 << 5)),
        };
    };
    /**
     * getEyeBlinkStatus
     * @returns {boolean}
     */
    RPPGTracker.prototype.getEyeBlinkStatus = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getEyeBlinkStatus(this.config.maxTimeBetweenBlinksSeconds || 20, this.config.detectionThreshold || 1);
    };
    /**
     * getHRVFeatures
     * @returns {number[]}
     */
    RPPGTracker.prototype.getHRVFeatures = function () {
        var _a, _b, _c;
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var hrv = this.module.getHRVFeatures();
        var hrvObj = {
            ibi: (_a = hrv.get(0)) !== null && _a !== void 0 ? _a : -1,
            rmssd: (_b = hrv.get(1)) !== null && _b !== void 0 ? _b : -1,
            sdnn: (_c = hrv.get(2)) !== null && _c !== void 0 ? _c : -1,
        };
        return hrvObj;
    };
    /**
     * getMean_BPM_RR_SpO2
     * @returns {number[]}
     */
    RPPGTracker.prototype.getMean_BPM_RR_SpO2 = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var signal = this.module.getMean_BPM_RR_SpO2();
        return {
            bpm_mean: signal.get(0),
            rr_mean: signal.get(1),
            oxygen_mean: signal.get(2),
        };
    };
    /**
     * getSignal
     * @returns {number[]}
     */
    RPPGTracker.prototype.getSignal = function (size, zoom) {
        if (size === void 0) { size = 128; }
        if (zoom === void 0) { zoom = 128; }
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var signal = this.module.getSignal(size);
        var signalArr = [];
        for (var i = 0; i < signal.size(); i++) {
            signalArr.push(signal.get(i) * zoom);
        }
        return signalArr;
    };
    /**
     * getECG
     * @returns {number[]}
     */
    RPPGTracker.prototype.getECG = function (size, zoom) {
        if (size === void 0) { size = 128; }
        if (zoom === void 0) { zoom = 128; }
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var ECG = this.module.getECG(size);
        var ECGArr = [];
        for (var i = 0; i < ECG.size(); i++) {
            ECGArr.push(ECG.get(i) * zoom);
        }
        return ECGArr;
    };
    /**
     * getPeaksIndexes
     * @returns {number[]}
     */
    RPPGTracker.prototype.getPeaksIndexes = function (size) {
        if (size === void 0) { size = 128; }
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        var peackIndexes = this.module.getPeaksIndexes(size);
        var peackIndexesArr = [];
        for (var i = 0; i < peackIndexes.size(); i++) {
            peackIndexesArr.push(peackIndexes.get(i));
        }
        return peackIndexesArr;
    };
    /**
     * getBPStatus
     * @returns {string}
     */
    RPPGTracker.prototype.getBPStatus = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        // @ts-ignore
        return BP_STATUS[this.getBP()];
    };
    /**
     * getBP
     * @returns {number}
     */
    RPPGTracker.prototype.getBP = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getBP();
    };
    /**
     * getBPM
     * @returns {number}
     */
    RPPGTracker.prototype.getBPM = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getBPM();
    };
    /**
     * getSNR
     * @returns {number}
     */
    RPPGTracker.prototype.getSNR = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getSNR();
    };
    /**
     * getMeanSNR
     * @returns {number}
     */
    RPPGTracker.prototype.getMeanSNR = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getMeanSNR();
    };
    /**
     * getStatus
     * @returns {number}
     */
    RPPGTracker.prototype.getStatus = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getStatus();
    };
    /**
     * getRR
     * @returns {number}
     */
    RPPGTracker.prototype.getRR = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getRR();
    };
    /**
     * getSPO
     * @returns {number}
     */
    RPPGTracker.prototype.getSPO = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getSpO2();
    };
    /**
     * getStressStatus
     * @returns {number}
     */
    RPPGTracker.prototype.getStressStatus = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        // @ts-ignore
        return STRESS_STATUS[this.module.getStressStatus()];
    };
    /**
     * getStress
     * @returns {numbe}
     */
    RPPGTracker.prototype.getStress = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return this.module.getStress();
    };
    /**
     * getProgress
     * @returns {number}
     */
    RPPGTracker.prototype.getProgress = function () {
        if (!this.module) {
            throw Error(errors_1.ERROR_MODULE_NOT_INITIALIZED);
        }
        return Math.round(this.module.getProgress() * 100);
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