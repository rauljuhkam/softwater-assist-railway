# Available local development runtime

Node.js already exists. Do not install another runtime or scan the entire disk.

Verified through the task terminal on 22 October 2026: Node v24.19.0 and pnpm 11.25.0 both execute successfully.

- Node executable: `C:\Users\Raul\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
- Node package directory: `C:\Users\Raul\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`
- pnpm launcher: `C:\Users\Raul\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`

For development command execution, prepend the Node executable directory to this process's PATH or invoke its full path. Keep project dependencies and all source files inside this project directory.

Use pnpm; this bundle does not require npm-cli.js. Complete the implementation plan from these established paths rather than performing more environment discovery.
