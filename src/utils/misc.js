import { exec } from "child_process";
import { v4 } from 'uuid'

function execPromise(command) {
  return new Promise(function(resolve, reject) {
    exec(command, (error, stdout, stderr) => {

      const err = error || stderr;

      if (err) {
        reject(err);
        return;
      }

      resolve(stdout.trim());
    });
  });
}

function generateUUID() {
  return v4()
}

export {
  execPromise,
  generateUUID,
}
