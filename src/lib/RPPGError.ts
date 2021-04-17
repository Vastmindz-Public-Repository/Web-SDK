function throwError(type: string, error?: Error): void {
  console.log(type, error)
  throw Error(type)
}

export default throwError
