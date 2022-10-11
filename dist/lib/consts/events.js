"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_NOTIFICATION_INTERVAL = exports.EVENTS = void 0;
var RPPGEvents_types_1 = require("../RPPGEvents.types");
exports.EVENTS = (_a = {},
    _a[RPPGEvents_types_1.RPPGMessageType.ACCESS_TOKEN] = 'accessToken',
    _a[RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_MEAN_DATA] = 'onMeasurementMeanData',
    _a[RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_STATUS] = 'onMeasurementStatus',
    _a[RPPGEvents_types_1.RPPGMessageType.SENDING_RATE_WARNING] = 'onSendingRateWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_PROGRESS] = 'onMeasurementProgress',
    _a[RPPGEvents_types_1.RPPGMessageType.MEASUREMENT_SIGNAL] = 'onMeasurementSignal',
    _a[RPPGEvents_types_1.RPPGMessageType.MOVING_WARNING] = 'onMovingWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.BLOOD_PRESSURE] = 'onBloodPressure',
    _a[RPPGEvents_types_1.RPPGMessageType.UNSTABLE_CONDITIONS_WARNING] = 'onUnstableConditionsWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.INTERFERENCE_WARNING] = 'onInterferenceWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.FACE_ORIENT_WARNING] = 'onFaceOrientWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.FACE_SIZE_WARNING] = 'onFaceSizeWarning',
    _a[RPPGEvents_types_1.RPPGMessageType.SIGNAL_QUALITY] = 'onSignalQuality',
    _a[RPPGEvents_types_1.RPPGMessageType.HRV_METRICS] = 'onHrvMetrics',
    _a[RPPGEvents_types_1.RPPGMessageType.STRESS_INDEX] = 'onStressIndex',
    _a[RPPGEvents_types_1.RPPGMessageType.AFIB_RISK] = 'onAfibRisk',
    _a);
exports.EVENT_NOTIFICATION_INTERVAL = 5000;
//# sourceMappingURL=events.js.map