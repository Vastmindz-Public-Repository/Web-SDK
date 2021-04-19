# RPPG

[Documentation](https://websdk1.blob.core.windows.net/sdk/docs/index.html)

[Documentation RPPG class](https://websdk1.blob.core.windows.net/sdk/docs/RPPG.html)

[Live demo](https://websdk1.blob.core.windows.net/sdk/example/index.html)

[Source code of examples](https://bitbucket.org/ggevgg/sdk/src/master/src/example/)


## Build

#### Cloning repository:

```
$ git clone https://ggevgg@bitbucket.org/ggevgg/sdk.git/wiki
$ cd sdk
```

#### Install dependencies
```
$ npm install
```

#### Build for usage with module structure

```
$ npm run build
```

Here's an example of some Javscript code:
```javascript
import RPPG from 'dist/RPPG'
const rppgInstance = new RPPG({
  config
})
```

#### Build for usage with browser script

```
$ npm run build:browser
```

Here's an example of some HTML code:
```html
<script src="dist/rppg.min.js">
<script>
const rppgInstance = new rppg({
  config
})
</script>
```

#### Build documentation

```
$ npm run build:docs
```

## Usage example

```javascript
import RPPG from './dist/lib/RPPG'
...
const rppgInstance = new RPPG({
  onFrame: (data) => {
    console.log('frame data:', data)
    // will print frame data:
    // {
    //   averageFps,
    //   instantFps,
    //   rppgTrackerData,
    //   timestamp
    // }

    console.log('face coordinates data:', data.face)
    // will print array of face data:
    // [x, y, width, height]
  },

  onMeasurementMeanData: (data) => {
    console.log('MeasurementMeanData:', data)
    // will print MeasurementMeanData:
    // {
    //   "bpm": 74,
    //   "rr": 154,
    //   "oxygen": 99,
    //   "stressStatus": "NORMAL",
    //   "bloodPressureStatus": "NORMAL"
    // }
  }

  onMeasurementProgress: (data) => {
    console.log('MeasurementProgress:', data)
    // will print MeasurementProgress data:
    // {
    //   "progressPercent": 55,
    // }
  }
})
await rppgInstance.initCamera({
  width: 640,
  height: 480,
  videoElement: document.querySelector('video'),
  canvasElement: document.querySelector('canvas'),
  onSuccess: ({
    width,
    height,
  }) => {
    console.log('obtained values of width and height', width, height)
  },
})
await rppgInstance.initTracker()
await rppgInstance.initSocket({
  authToken: this.authToken,
})
rppgInstance.start()
...
```