"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPPGMessageType = exports.BloodPressureStatus = exports.StressStatus = exports.StatusCode = void 0;
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
 * RPPGMessageType
 */
var RPPGMessageType;
(function (RPPGMessageType) {
    RPPGMessageType["MEASUREMENT_MEAN_DATA"] = "MEASUREMENT_MEAN_DATA";
    RPPGMessageType["MEASUREMENT_STATUS"] = "MEASUREMENT_STATUS";
    RPPGMessageType["SENDING_RATE_WARNING"] = "SENDING_RATE_WARNING";
    RPPGMessageType["MEASUREMENT_PROGRESS"] = "MEASUREMENT_PROGRESS";
    RPPGMessageType["MEASUREMENT_SIGNAL"] = "MEASUREMENT_SIGNAL";
    RPPGMessageType["MOVING_WARNING"] = "MOVING_WARNING";
    RPPGMessageType["BLOOD_PRESSURE"] = "BLOOD_PRESSURE";
    RPPGMessageType["SIGNAL_QUALITY"] = "SIGNAL_QUALITY";
    RPPGMessageType["INTERFERENCE_WARNING"] = "INTERFERENCE_WARNING";
    RPPGMessageType["UNSTABLE_CONDITIONS_WARNING"] = "UNSTABLE_CONDITIONS_WARNING";
    RPPGMessageType["STRESS_INDEX"] = "STRESS_INDEX";
    RPPGMessageType["HRV_METRICS"] = "HRV_METRICS";
    RPPGMessageType["ACCESS_TOKEN"] = "ACCESS_TOKEN";
    RPPGMessageType["AFIB_RISK"] = "AFIB_RISK";
})(RPPGMessageType = exports.RPPGMessageType || (exports.RPPGMessageType = {}));
//# sourceMappingURL=RPPGEvents.types.js.map