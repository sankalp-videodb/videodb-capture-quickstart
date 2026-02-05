const { execFileSync } = require('child_process');
const path = require('path');

/**
 * electron-builder afterSign hook.
 * Codesigns the embedded screen-audio-recorder binary so it shares Memo.app's identity.
 */
exports.default = async function afterSign(context) {
  if (process.platform !== 'darwin') {
    return;
  }

  const { appOutDir } = context;
  const identity = process.env.CODESIGN_IDENTITY || 'Apple Development: sumitkumarx86@gmail.com (5365X9Y4L8)';

  const appPath = path.join(appOutDir, 'Async Recorder.app');
  const recorderPath = path.join(appPath, 'Contents', 'MacOS', 'recorder-sdk');

  execFileSync('codesign', [
    '--force',
    '--timestamp',
    '--options', 'runtime',
    '--sign', identity,
    recorderPath,
  ], { stdio: 'inherit' });
};
