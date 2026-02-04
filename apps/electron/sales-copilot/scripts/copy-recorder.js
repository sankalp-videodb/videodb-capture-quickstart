const fs = require('fs');
const path = require('path');

exports.default = async function afterPack(context) {
  const appOutDir = context.appOutDir;
  const entries = await fs.promises.readdir(appOutDir);
  const appBundleName = entries.find((name) => name.endsWith('.app'));
  if (!appBundleName) {
    throw new Error(`No .app bundle found in ${appOutDir}`);
  }
  const appBundlePath = path.join(appOutDir, appBundleName);
  const serviceBinarySource = path.join(context.projectDir, 'resources', 'service-core');
  const serviceBinaryTarget = path.join(appBundlePath, 'Contents', 'MacOS', 'service-core');
  const bridgeLibSource = path.join(context.projectDir, 'resources', 'libservicebridge.dylib');
  const bridgeLibTarget = path.join(appBundlePath, 'Contents', 'MacOS', 'libservicebridge.dylib');
  const manageScriptSource = path.join(context.projectDir, 'resources', 'manage-service.sh');
  const manageScriptTarget = path.join(appBundlePath, 'Contents', 'Resources', 'manage-service.sh');
  const logsDirSource = path.join(context.projectDir, 'resources', 'logs');
  const logsDirTarget = path.join(appBundlePath, 'Contents', 'Resources', 'logs');

  if (!fs.existsSync(serviceBinarySource)) {
    throw new Error(`Service binary missing at ${serviceBinarySource}`);
  }

  await fs.promises.mkdir(path.dirname(serviceBinaryTarget), { recursive: true });
  await fs.promises.copyFile(serviceBinarySource, serviceBinaryTarget);
  await fs.promises.chmod(serviceBinaryTarget, 0o755);

  if (fs.existsSync(bridgeLibSource)) {
    await fs.promises.mkdir(path.dirname(bridgeLibTarget), { recursive: true });
    await fs.promises.copyFile(bridgeLibSource, bridgeLibTarget);
    await fs.promises.chmod(bridgeLibTarget, 0o755);
  }

  if (fs.existsSync(manageScriptSource)) {
    await fs.promises.mkdir(path.dirname(manageScriptTarget), { recursive: true });
    await fs.promises.copyFile(manageScriptSource, manageScriptTarget);
    await fs.promises.chmod(manageScriptTarget, 0o755);
  }

  if (fs.existsSync(logsDirSource)) {
    await fs.promises.mkdir(logsDirTarget, { recursive: true });
    const logEntries = await fs.promises.readdir(logsDirSource);
    for (const entry of logEntries) {
      const src = path.join(logsDirSource, entry);
      const dest = path.join(logsDirTarget, entry);
      await fs.promises.copyFile(src, dest);
    }
  }
};
