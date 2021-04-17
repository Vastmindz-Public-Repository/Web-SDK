// import {
//   ERROR_MODULE_INITIALIZATION,
//   ERROR_MODULE_NOT_INITIALIZED,
//   ERROR_WEBCAM_INITIALIZATION,
// } from "@/consts/errors"
// import { RPPGErrorInterface } from "./RPPGError.types"

// class RPPGError implements RPPGErrorInterface {
//   throwErrorModuleInitialization(error?: Error) {
//     console.log(ERROR_MODULE_INITIALIZATION, error)
//     throw Error(ERROR_MODULE_INITIALIZATION)
//   }
// }

function throwError(type: string, error?: Error) {
  console.log(type, error)
  throw Error(type)
}

export default throwError
