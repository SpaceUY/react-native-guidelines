# Cursor Rules

Cursor is designed to assist you in writing code, but it may occasionally make mistakes. To minimize errors, it's important to provide it with context and behavior rules.
**Context** is derived from project files and documentation, while **behavior** is defined by cursor rules.

These rules help the AI Agent understand the project's implementation, libraries, and custom coding patterns. For instance, if you're using a custom hook, you can specify a rule for how the AI Agent should utilize that hook. Similarly, if you're using React Query with specific types and API base properties, you can instruct it to always take those into account when creating a new query or implementing on a component.

## Implementations

A doc with .mdc extension is needed inside `.cursor/rules` folder for the agent to use. The project can have as many docs as needed, and the agent will use them based on doc rules (such as file extension, file name, file path, etc), or library relevant to the current task.
For detailed implementations and understanding of the functionality, please refer to the following links:

- [Cursor Docs](https://docs.cursor.com/context/rules-for-ai)
- [Community Rules](https://cursor.directory/)
