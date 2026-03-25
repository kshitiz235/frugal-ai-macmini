# Guide: Agentic Workflows with Qwen-Agent

> **Stack:** [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** [Agentic Frameworks](../components/frameworks/agentic-frameworks.md)
> **Time:** 20 minutes

Build an AI agent that can call tools, run code, and execute multi-step workflows — all running locally on your Mac Mini.

## Prerequisites

- Stack setup complete: [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
- Ollama running and verified (`ollama ps` shows the model)
- Python 3.11+ installed

## Steps

### 1. Create a virtual environment

```bash
python3 -m venv ~/.venv/qwen-agent
source ~/.venv/qwen-agent/bin/activate  # On Windows: .venv\qwen-agent\Scripts\activate
```

### 2. Install Qwen-Agent

```bash
pip install qwen-agent[gui,rag,code_interpreter,mcp]
```

### 3. Create the agent script

Create a file `agent.py` with the following content:

```python
import pprint
from qwen_agent.agents import Assistant
from qwen_agent.llm import get_chat_model
from qwen_agent.tools import BaseTool

llm_cfg = {
    'model': 'qwen3.5-dev',
    'model_server': 'http://localhost:11434/v1',
    'api_key': '',
    'generate_cfg': {
        'top_p': 0.8
    }
}

agent = Assistant(
    llm=get_chat_model(llm_cfg),
    function_list=['python']
)

system_instruction = '''After receiving the user's request, you should:
1. Break down the task into steps
2. Use tools to execute each step
3. Return the final result to the user
You can write and execute Python code to help with calculations and data processing.'''

messages = []

while True:
    user_input = input('Your request (or "quit"): ')
    if user_input.lower() in ['quit', 'exit', 'q']:
        break
    messages.append({'role': 'user', 'content': user_input})
    response = agent.run(messages)
    pprint.pprint(response)
    messages.extend(response)
```

### 4. Test the agent

Run the agent:

```bash
python agent.py
```

Try a simple request:

```
Your request (or "quit"): What is 15 * 23 + 7? Show your work.
```

Expected: The agent will use the python tool to calculate and return the result.

## Verify

| Check | Expected |
|-------|----------|
| Agent starts without errors | Yes |
| Tool call executes | Python code runs via tool |
| Result returned | Correct calculation |
| Memory (Ollama + Python) | ~7–8 GB total |

## Next steps

Try more complex tasks:

- File operations: "Read the file at ~/Documents/notes.txt and summarize it"
- Multi-step reasoning: "What is the square root of 144, then cube that number?"
- Code generation: "Write a Python function to check if a number is prime"

## Troubleshooting

- **`Connection refused` at localhost:11434** — Ensure Ollama is running: `ollama serve`. The agent needs the Ollama API at port 11434.
- **`Model not found`** — Verify model name matches your Modelfile: `ollama list`. Use the exact tag (e.g., `qwen3.5-dev`).
- **Slow responses** — Check memory pressure. Close other apps. Qwen3.5 with thinking enabled needs more headroom.
- **Tool not called** — Qwen3.5 in non-thinking mode is more reliable for direct tool calls. Disable thinking if needed: add `'enable_thinking': False` to `generate_cfg`.

## Stop / restart

Press `Ctrl+C` to stop the agent. Reactivate the environment and run again:

```bash
source ~/.venv/qwen-agent/bin/activate
python agent.py
```
