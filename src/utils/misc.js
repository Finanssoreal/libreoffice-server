import { exec } from "child_process"
import { promisify } from "util"

const exec_await = promisify(exec)

async function execPromise(command, opts) {
  const { stdout, stderr } = await exec_await(command, opts)

  return { stdout, stderr }
}

export { execPromise }
