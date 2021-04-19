"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Class RPPGCamera
 * @example
 * const rppgCameraInstance = new RPPGCamera()
 */
var RPPGCamera = /** @class */ (function () {
    /**
     * @param {RPPGCameraConfig} config Config passed to RPPGCamera
     */
    function RPPGCamera(config) {
        this.width = 0;
        this.height = 0;
        this.config = config;
        this.videoElement = config.videoElement || document.createElement('video');
        this.canvasElement = config.canvasElement || document.createElement('canvas');
        this.ctx = this.canvasElement.getContext('2d');
        this.stream = null;
    }
    /**
     * Init RPPG Camera instance
     *
     * ### Usage with regular javascript
     *
     * ```javascript
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
     * ```
     *
     * @returns {Promise<RPPGCameraInit>} Returns actual parameters of camera
     *
     */
    RPPGCamera.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.getWebcamStream()];
                    case 1:
                        _a.stream = _b.sent();
                        this.videoElement.srcObject = this.stream;
                        return [4 /*yield*/, this.videoElement.play()];
                    case 2:
                        _b.sent();
                        this.width = this.videoElement.videoWidth;
                        this.height = this.videoElement.videoHeight;
                        this.canvasElement.width = this.width;
                        this.canvasElement.height = this.height;
                        this.onSuccess({
                            stream: this.stream,
                            width: this.width,
                            height: this.height,
                        });
                        return [2 /*return*/, {
                                stream: this.stream,
                                width: this.width,
                                height: this.height,
                            }];
                    case 3:
                        error_1 = _b.sent();
                        console.log('Error initializing webcam', error_1);
                        this.onError(error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RPPGCamera.prototype.getWebcamStream = function () {
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: {
                    ideal: this.config.width || 640,
                },
                height: {
                    ideal: this.config.height || 480,
                },
            },
        });
    };
    RPPGCamera.prototype.getFrame = function () {
        if (!this.ctx || !this.videoElement || this.width === 0) {
            return null;
        }
        this.ctx.drawImage(this.videoElement, 0, 0, this.width, this.height);
        var data = this.ctx.getImageData(0, 0, this.width, this.height).data;
        return {
            data: data,
            width: this.width,
            height: this.height,
        };
    };
    RPPGCamera.prototype.close = function () {
        if (this.stream) {
            this.stream.getTracks().forEach(function (track) { return track.stop(); });
        }
    };
    RPPGCamera.prototype.onError = function (event) {
        var onError = this.config.onError;
        if (typeof onError === 'function') {
            onError(event);
        }
    };
    RPPGCamera.prototype.onSuccess = function (event) {
        var onSuccess = this.config.onSuccess;
        if (typeof onSuccess === 'function') {
            onSuccess(event);
        }
    };
    return RPPGCamera;
}());
exports.default = RPPGCamera;
//# sourceMappingURL=RPPGCamera.js.map