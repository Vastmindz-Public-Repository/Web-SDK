## [1.2.6](https://github.com/Vastmindz-Public-Repository/Web-SDK/tree/v1.2.6) (2022-11-13)

> Description

### New Features
* add rr to HRV metrics
* add pause method to the socket instance

## [1.2.5](https://github.com/Vastmindz-Public-Repository/Web-SDK/tree/v1.2.5) (2022-10-25)

> Description

### New Features
* add config param skipSocketWhenBadFaceConditions
* add config param skipSocketWhenBadLightConditions
* make width, height, useFrontCamera of camera instance public
* make rppgCamera, rppgSocket, rppgTracker instances public

### Changes
* decrease throttle for face orient and size events

## [1.2.4](https://github.com/Vastmindz-Public-Repository/Web-SDK/tree/v1.2.4) (2022-10-19)

> Description

### Bug Fixes
* Issue with face orient and face size events for server version

## [1.2.3](https://github.com/Vastmindz-Public-Repository/Web-SDK/tree/v1.2.3) (2022-10-11)

> Description

### New Features
* Event onFaceOrientWarning
* Event onFaceSizeWarning
* Event onInterferenceWarning
* Event onUnstableConditions
* React example

### Bug Fixes
* Calculation result with zero value rewrites calculated result
