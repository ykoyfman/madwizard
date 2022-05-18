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

import Debug from "debug"

import { ChoiceState } from "../choices"
import { CompileOptions, Graph, sequence } from "."

import hoistSubTasks from "./hoistSubTasks"
import propagateTitles from "./propagateTitles"
import collapseValidated from "./collapseValidated"
import collapseMadeChoices from "./collapseMadeChoices"
import deadCodeElimination from "./deadCodeElimination"

export default async function optimize(graph: Graph, choices: ChoiceState, options?: CompileOptions) {
  const debug = Debug("madwizard/timing/graph:optimize")
  debug("start")

  try {
    return (
      propagateTitles(
        deadCodeElimination(
          await collapseValidated(deadCodeElimination(collapseMadeChoices(hoistSubTasks(graph), choices)), options)
        )
      ) || sequence([])
    )
  } finally {
    debug("complete")
  }
}
