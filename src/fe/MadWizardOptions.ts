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

export interface MadWizardOptions {
  /** Shorten output of long or multi-line code blocks. */
  narrow?: boolean

  /** Selectively enable/disable optimizations */
  optimize?:
    | boolean
    | {
        /**
         * Should we optimize away choices against known a priori
         * truths, e.g. user's platform?
         */
        aprioris?: boolean

        /**
         * Should we optimize away subgraphs of the plan known to be
         * valid (using the `validate` attributes given by the
         * source)?
         */
        validate?: boolean
      }

  /**
   * Path to an mkdocs.yml config. This may be used to assist in
   * finding snippet content when parsing markdown.
   */
  mkdocs?: string
}
