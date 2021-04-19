"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.BloodPressureStatus = exports.StressStatus = exports.RPPGSocketOnMessageType = void 0;
/**
 * RPPGSocketOnMessageType
 */
var RPPGSocketOnMessageType;
(function (RPPGSocketOnMessageType) {
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["MEASUREMENT_MEAN_DATA"] = 0] = "MEASUREMENT_MEAN_DATA";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["MEASUREMENT_STATUS"] = 1] = "MEASUREMENT_STATUS";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["SENDING_RATE_WARNING"] = 2] = "SENDING_RATE_WARNING";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["MEASUREMENT_PROGRESS"] = 3] = "MEASUREMENT_PROGRESS";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["MEASUREMENT_SIGNAL"] = 4] = "MEASUREMENT_SIGNAL";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["MOVING_WARNING"] = 5] = "MOVING_WARNING";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["BLOOD_PRESSURE"] = 6] = "BLOOD_PRESSURE";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["SIGNAL_QUALITY"] = 7] = "SIGNAL_QUALITY";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["INTERFERENCE_WARNING"] = 8] = "INTERFERENCE_WARNING";
    RPPGSocketOnMessageType[RPPGSocketOnMessageType["UNSTABLE_CONDITIONS_WARNING"] = 9] = "UNSTABLE_CONDITIONS_WARNING";
})(RPPGSocketOnMessageType = exports.RPPGSocketOnMessageType || (exports.RPPGSocketOnMessageType = {}));
/**
 * StressStatus
 */
var StressStatus;
(function (StressStatus) {
    StressStatus[StressStatus["NO_DATA"] = 0] = "NO_DATA";
    StressStatus[StressStatus["LOW"] = 1] = "LOW";
    StressStatus[StressStatus["NORMAL"] = 2] = "NORMAL";
    StressStatus[StressStatus["ELEVATED"] = 3] = "ELEVATED";
    StressStatus[StressStatus["VERY_HIGH"] = 4] = "VERY_HIGH";
    StressStatus[StressStatus["UNKNOWN"] = 5] = "UNKNOWN";
})(StressStatus = exports.StressStatus || (exports.StressStatus = {}));
/**
 * BloodPressureStatus
 */
var BloodPressureStatus;
(function (BloodPressureStatus) {
    BloodPressureStatus[BloodPressureStatus["NO_DATA"] = 0] = "NO_DATA";
    BloodPressureStatus[BloodPressureStatus["NORMAL"] = 1] = "NORMAL";
    BloodPressureStatus[BloodPressureStatus["ELEVATED"] = 2] = "ELEVATED";
    BloodPressureStatus[BloodPressureStatus["HYP_S1"] = 3] = "HYP_S1";
    BloodPressureStatus[BloodPressureStatus["HYP_S2"] = 4] = "HYP_S2";
    BloodPressureStatus[BloodPressureStatus["HYP_CRISIS"] = 5] = "HYP_CRISIS";
    BloodPressureStatus[BloodPressureStatus["UNKNOWN"] = 6] = "UNKNOWN";
})(BloodPressureStatus = exports.BloodPressureStatus || (exports.BloodPressureStatus = {}));
/**
 * StatusCode
 */
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 0] = "SUCCESS";
    StatusCode[StatusCode["NO_FACE"] = 1] = "NO_FACE";
    StatusCode[StatusCode["FACE_LOST"] = 2] = "FACE_LOST";
    StatusCode[StatusCode["CALIBRATING"] = 3] = "CALIBRATING";
    StatusCode[StatusCode["RECALIBRATING"] = 4] = "RECALIBRATING";
    StatusCode[StatusCode["BRIGHT_LIGHT_ISSUE"] = 5] = "BRIGHT_LIGHT_ISSUE";
    StatusCode[StatusCode["NOISE_DURING_EXECUTION"] = 6] = "NOISE_DURING_EXECUTION";
    StatusCode[StatusCode["UNKNOWN"] = 7] = "UNKNOWN";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
//# sourceMappingURL=RPPGSocket.types.js.map