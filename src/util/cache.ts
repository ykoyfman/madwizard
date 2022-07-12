/*
 * Copyright 2022 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { join } from "path"
import envPaths from "env-paths"

import { MadWizardOptions } from "../fe/index.js"

/** @return the filepath in which all persistent caches are stored */
export function cachePath() {
  return envPaths("madwizard").cache
}

/** @return the filepath in which all persistent data are stored */
export function dataPath() {
  return envPaths("madwizard").data
}

/** @return the filepath in which persistent profiles are stored */
export async function profilesPath(options: MadWizardOptions, mkdir = false) {
  const filepath = join(options.profilesPath || process.env.MWPROFILES_PATH || dataPath(), "profiles")
  if (mkdir) {
    const mkdirp = await import("mkdirp").then((_) => _.default)
    await mkdirp(filepath)
  }
  return filepath
}

export async function copyChoices(dstFilepath: string, options: MadWizardOptions, profile = "default") {
  const copyFile = await import("fs").then((_) => _.copyFile)
  const srcFilepath = join(await profilesPath(options, true), profile)

  return new Promise<void>((resolve, reject) => {
    copyFile(srcFilepath, dstFilepath, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
