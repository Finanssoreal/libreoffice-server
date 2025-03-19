import { exec } from "child_process"
import { promisify } from "util"

const exec = promisify(exec)

async function execPromise(command, opts) {
  const { stdout, stderr } = await exec(command, opts)

  return { stdout, stderr }
}

export { execPromise }
