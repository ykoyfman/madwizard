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

import chalk from "chalk"

import { Guide } from "../guide"
import { parse, wizardify, compile, order } from "../.."
import { prettyPrintUITree, Treeifier, AnsiUI } from "../tree"

export { Guide }

type Task = "tree" | "json" | "guide"

function isValidTask(task: string): task is Task {
  return task === "tree" || task === "json" || task === "guide"
}

function assertExhaustive(value: never, message = "Reached unexpected case in exhaustive switch"): never {
  throw new Error(message)
}

export async function cli<Writer extends (msg: string) => void>(argv: string[], write?: Writer) {
  const task = argv[1]
  const input = argv[2]

  if (!input) {
    console.error(chalk.red("Please provide an input filepath or URI"))
    process.exit(1)
  }

  if (!task) {
    console.error(chalk.red("Please provide a task"))
    process.exit(1)
  } else if (!isValidTask(task)) {
    console.error(chalk.red(`Invalid task: ${task}`))
    process.exit(1)
  }

  const { blocks, choices } = await parse(input)

  switch (task) {
    case "tree": {
      const graph = compile(blocks, choices)
      const tree = new Treeifier(new AnsiUI()).toTree(order(graph))
      prettyPrintUITree(tree, write)
      break
    }

    case "json": {
      const graph = compile(blocks, choices)
      const wizard = wizardify(graph)
      console.log(JSON.stringify(wizard, undefined, 2))
      break
    }

    case "guide":
      await new Guide(blocks, choices).run()
      break

    default:
      // if our switch isn't exhaustive, you will see this typescript error:
      // Argument of type 'string' is not assignable to parameter of type 'never'.
      assertExhaustive(task)
  }
}
