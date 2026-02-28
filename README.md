# chartscii

> Transform data into stunning terminal charts in seconds.

<div align="center">

[![npm version](https://img.shields.io/npm/v/chartscii-cli.svg)](https://www.npmjs.com/package/chartscii-cli)
[![npm downloads](https://img.shields.io/npm/dm/chartscii-cli.svg)](https://www.npmjs.com/package/chartscii-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

```
JavaScript (68.3%)  ████████████████████████████████████████████
  Markdown (11.8%)  ████████
TypeScript  (5.7%)  ████
       HTML (5.3%)  ███
       YAML (4.7%)  ███
       JSON (0.8%)  █
       Bash (3.3%)  ██
```

## Why chartscii?

**Fast.** Create beautiful charts in one command. No config files, no setup, just data.

**Flexible.** Works with any data source: numbers, CSV, JSON, stdin, or files.

**Beautiful.** Customizable colors, themes, and styling. Looks great in any terminal.

## Installation

```bash
npm install -g chartscii-cli
```

## Quick Start

```bash
# From numbers
chartscii 10 20 30 40 50

# From a file (auto-detected)
chartscii data.csv
chartscii data.json

# From stdin
echo "1 2 3 4 5" | chartscii
seq 1 20 | chartscii

# With options
chartscii 1 2 3 -c green -t "Sales" -o
```

## Examples

### Simple Bar Chart
```bash
chartscii 5 10 15 20 25
```
```
5  ╢████████████████
10 ╢████████████████████████████████
15 ╢████████████████████████████████████████████████
20 ╢████████████████████████████████████████████████████████████████
25 ╢████████████████████████████████████████████████████████████████████████████████
   ╚════════════════════════════════════════════════════════════════════════════════
```

### Vertical Chart
```bash
chartscii 1 2 3 4 5 -e vertical -h 10
```
```
║        █
║        █
║      █ █
║      █ █
║    █ █ █
║    █ █ █
║  █ █ █ █
║  █ █ █ █
║█ █ █ █ █
║█ █ █ █ █
╚═════════
 1 2 3 4 5
```

### From CSV
```bash
chartscii data.csv -o -t "Programming Languages"
```

**data.csv**:
```csv
JavaScript,68
TypeScript,56
Python,43
```

**Output**:
```
Programming Languages
  Python (14.48%)  ██████████████████████████████████████
TypeScript (18.86%)  ██████████████████████████████████████████████████
JavaScript (22.90%)  ████████████████████████████████████████████████████████████
                     ╚════════════════════════════════════════════════════════════
```

### Piped Input
```bash
# From command output
du -sh * | awk '{print $1}' | chartscii -c blue

# From a log file
cat server.log | grep "response_time" | cut -d: -f2 | chartscii -t "Response Times"

# Git stats
git log --author="$(git config user.name)" --format=%ad --date=short | \
  uniq -c | awk '{print $1}' | chartscii -t "My Commits" -c green
```

### With Themes and Colors
```bash
chartscii data.json -k pastel -o -w 100
chartscii 10 20 30 -c "#FF5733" -g "░"
chartscii 1 2 3 4 5 -n  # Naked mode (no borders)
```

## Usage

```bash
chartscii [data...] [options]
```

### Data Sources

- **Direct numbers**: `chartscii 1 2 3 4 5`
- **File path**: `chartscii data.csv` or `chartscii data.json`
- **Explicit file**: `chartscii -f data.json`
- **Stdin**: `echo "1 2 3" | chartscii`

### Input Formats

#### JSON
```json
[10, 20, 30, 40, 50]
```

Or with labels:
```json
[
  {"label": "Jan", "value": 100, "color": "red"},
  {"label": "Feb", "value": 150, "color": "green"}
]
```

#### CSV
```csv
January,100
February,150
March,200
```

Or simple:
```csv
10,20,30,40,50
```

## Options

### Display
- `-t, --title <string>` - Chart title
- `-l, --labels` - Show labels (default: true)
- `-d, --color-labels` - Color labels (default: true)
- `-o, --percentage` - Show percentages

### Layout
- `-e, --orientation <horizontal|vertical>` - Chart orientation
- `-w, --width <number>` - Chart width (default: 80)
- `-h, --height <number>` - Chart height (default: 20)
- `-p, --padding <number>` - Bar padding (default: 1)
- `-b, --bar-size <number>` - Bar thickness

### Styling
- `-c, --color <string>` - Bar color (name, hex, or ANSI)
- `-k, --theme <string>` - Color theme
- `-z, --char <string>` - Bar character (default: █)
- `-g, --fill <string>` - Fill character

### Data
- `-s, --sort` - Sort data (default: true)
- `-r, --reverse` - Reverse order
- `-n, --naked` - No borders

## Real-World Use Cases

### DevOps & Monitoring
```bash
# Disk usage
df -h | awk 'NR>1 {print $5" "$6}' | chartscii -t "Disk Usage"

# Memory usage by process
ps aux | awk '{print $11" "$4}' | head -10 | chartscii -t "Top Memory"

# Network traffic
netstat -i | awk 'NR>2 {print $1" "$5}' | chartscii -c blue
```

### Git Analytics
```bash
# Commits per author
git shortlog -sn | awk '{print $2" "$1}' | chartscii -t "Contributors"

# Files changed
git diff --stat | head -n -1 | chartscii -c green
```

### Data Analysis
```bash
# CSV analysis
cat sales.csv | cut -d, -f2 | chartscii -o -t "Sales Distribution"

# JSON processing
cat api-response.json | jq '.data[].value' | chartscii -e vertical
```

### CI/CD Integration
```bash
# Test coverage
npm test -- --coverage --json | jq '.coverage' | chartscii -t "Coverage"

# Build times
cat build-log.txt | grep "Total time" | cut -d: -f2 | chartscii -t "Build Times"
```

## Advanced Features

### Custom Structure Characters
```bash
chartscii 1 2 3 -x "─" -y "│" -a "┃" -q "└"
```

### Multiple Data Sources
```bash
# Combine files
chartscii data1.csv data2.json
```

### Conditional Styling
```json
[
  {"label": "Pass", "value": 95, "color": "green"},
  {"label": "Warn", "value": 80, "color": "yellow"},
  {"label": "Fail", "value": 60, "color": "red"}
]
```

## Tips & Tricks

### Shell Aliases
```bash
# Add to .bashrc or .zshrc
alias chart="chartscii"
alias vchart="chartscii -e vertical"
alias pchart="chartscii -o"  # with percentages
```

### Watch Mode
```bash
# Real-time monitoring
watch -n 1 "your-command | chartscii -t 'Live Data'"
```

### Combine with Other Tools
```bash
# With fzf for interactive selection
cat data.csv | fzf | chartscii

# With tmux for dashboard
tmux split-window "watch -n 5 'chartscii data.csv'"
```

## Performance

- **Fast startup** - < 100ms
- **Efficient parsing** - Handles large datasets
- **Minimal dependencies** - Small install size
- **Memory efficient** - Streams large files

## Why Terminal Charts?

✅ **Universal** - Works on any system with a terminal
✅ **Scriptable** - Easy to automate and integrate
✅ **SSH-friendly** - Visualize data on remote servers
✅ **CI/CD ready** - Perfect for build pipelines
✅ **No browser needed** - Lightweight and fast
✅ **Git-friendly** - Text-based, version controllable

## API

chartscii-cli is built on [chartscii](https://github.com/tool3/chartscii), a powerful charting library. You can use chartscii programmatically in your Node.js projects:

```javascript
const Chartscii = require('chartscii');

const chart = new Chartscii([1, 2, 3, 4, 5], {
  title: 'My Chart',
  color: 'green'
});

console.log(chart.create());
```

## Contributing

Found a bug? Have a feature request? PRs welcome!

```bash
git clone https://github.com/tool3/chartscii-cli
cd chartscii-cli
npm install
npm run dev
```

## License

MIT © [Tal Hayut](https://github.com/tool3)

---

<div align="center">

**Made with ❤️ for developers who love the terminal**

[⭐ Star on GitHub](https://github.com/tool3/chartscii-cli) • [📦 View on npm](https://www.npmjs.com/package/chartscii-cli) • [🐛 Report Bug](https://github.com/tool3/chartscii-cli/issues)

</div>
