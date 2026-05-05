<div align="center">

# chartscii-cli

`chartscii data.csv -c auto`

![csv](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/csv.svg?raw=true)

### Beautiful ASCII charts straight from your shell.

Pipe any data — numbers, CSV, JSON, `du`, `git log`, anything — and get a beautiful chart. Multiple chart types, no config files, no setup.

[![npm](https://img.shields.io/badge/npm-v10-blue)](https://www.npmjs.com/package/chartscii-cli)
[![npm downloads](https://img.shields.io/npm/dm/chartscii)](https://www.npmjs.com/package/chartscii-cli)
[![license](https://img.shields.io/badge/license-MIT-orange)](./LICENSE)

</div>

---

## What's new

- ✅ **Smart content parsing** — auto-detects JSON, CSV, plain numbers, label+value pairs (in either order).
- ✅ **Auto width & height** — `-w auto` / `-h auto` snaps to your terminal dimensions.
- ✅ **Auto file detection** — pass the path directly (`chartscii data.csv`).
- ✅ **CLI-friendly color shorthand** — `-c "red,green,blue"` for per-series, `-c "0:red,1:green"` for status.
- ✅ **Type-aware defaults** — `--sort` defaults off and `--height` jumps to 10 for non-bar chart types.
- ✅ **Six chart types from one binary** — `bar`, `line`, `step`, `scatter`, `candlestick`, `status`.
- ✅ **Pipe-first design** — works with `du`, `git log`, `ps`, `find`, `wc`, `awk` output.

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Chart types](#chart-types)
  - [Bar](#bar-default)
  - [Line](#line)
  - [Step](#step)
  - [Scatter](#scatter)
  - [Candlestick](#candlestick)
  - [Status](#status)
- [Input formats](#input-formats)
- [Styling](#styling)
- [Stacked bars](#stacked-bars)
- [Animation](#animation)
- [Recipes & shell helpers](#recipes--shell-helpers)
- [Options reference](#options-reference)
- [License](#license)

---

## Installation
Note that bin is registered under `chartscii` if installed.   
If you are using npx you must use the prefix: `npx chartscii-cli`

### Homebrew (macOS/Linux)

```sh
brew install tool3/tap/chartscii
```

### Shell script (macOS/Linux)

```sh
curl -fsSL https://raw.githubusercontent.com/tool3/chartscii-cli/master/scripts/install.sh | bash
```

### npm

```sh
# Use directly with npx (no install needed)
npx chartscii-cli --help

# Or install globally
npm install -g chartscii-cli

# Or add to your project
npm install chartscii-cli -D
```

---

## Quick start

```bash
# from positional numbers
chartscii 10 20 30 40 50

# from a file (auto-detected)
chartscii data.csv
chartscii data.json

# from stdin
echo "1 2 3 4 5" | chartscii
seq 1 20 | chartscii

# from shell pipelines (sizes, columns, anything numeric)
du -sh * | chartscii -c auto
```

That's it — point any data source at `chartscii` and you get a chart.

![json](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/json.svg?raw=true)

---

## Chart types

Switch the renderer with `-Y` / `--type`. Every type shares the core options (`-w`, `-h`, `-t`, `-k`, `-c`, `-n`, …) and adds its own knobs.

| Type | Best for | Key flags |
|---|---|---|
| [`bar`](#bar-default) (default) | rankings, totals, categorical comparisons | `-o`, `-E`, `-I`/`-J`/`-K` (stacked) |
| [`line`](#line) | trends over time, multi-series | `-c "a,b,c"` (per-series), `-g` |
| [`step`](#step) | piecewise-constant state | `-N sharp`/`smooth`, `-O` |
| [`scatter`](#scatter) | sparse points, distributions | `-H`, `-C` |
| [`candlestick`](#candlestick) | OHLC market data | `-c "bull,bear"`, `-b` |
| [`status`](#status) | dashboards, health grids | `-c "key:color,..."`, `-g` |

### Bar (default)

```bash
chartscii examples/example.json -k pastel
```

![bar](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/json.svg?raw=true)

Vertical orientation with a gradient fill:

```bash
seq 1 12 | chartscii -o vertical -c "gradient(cyan,purple)" -f "░" -G auto -w auto
```

![vertical-gradient](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/vertical-reverse-gradient.svg?raw=true)

### Line

Smooth 45° polyline through your data. Single- or multi-series.

```bash
echo "20 35 28 50 65 45 70 60 85 75 90 80" | \
  chartscii -Y line -c "gradient(cyan,purple)" -t "Monthly Trend" -w 80
```

![line](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/line.svg?raw=true)

**Multi-series** — pipe a JSON `InputData[][]` (one inner array per data point, one entry per series) and split colors on commas. Add `-g` for a legend, `-U` to label the entries:

```bash
chartscii series.json -Y line \
  -c "red,green,blue" \
  -g -B top -M right -U Q1 Q2 Q3 \
  -w 100
```

![line-multi](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/line-multi.svg?raw=true)

### Step

Right-angle transitions for state that's piecewise-constant between samples. `-N smooth` rounds the corners with `╭╮╰╯`.

```bash
echo "10 25 25 40 30 30 55 50 70 65" | \
  chartscii -Y step -N smooth -O -c "gradient(orange,pink)" -t "Step Smooth" -w 80
```

![step](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/step.svg?raw=true)

### Scatter

Markers only — no connecting line. `-c auto` cycles the palette per point; `-H` overrides the marker char.

```bash
echo "12 45 28 65 30 80 55 22 70 90 35 50 60 18" | \
  chartscii -Y scatter -c auto -H "◈" -t "Distribution" -w 80
```

![scatter](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/scatter.svg?raw=true)

### Candlestick

OHLC bars with bullish/bearish coloring. Each input point's `value` is `[open, high, low, close]` — feed them as a JSON array. `-c "bull,bear"` sets the two colors; doji (`open == close`) candles render as `─`.

```bash
chartscii btc-month.json -Y candlestick \
  -c "green,red" \
  -t "BTC/USD — 30d" -w 160 -h 22 -b 2 -d 2
```

![candlestick](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/candlestick.svg?raw=true)

### Status

A grid of colored cells — perfect for dashboards, host health, build matrices. Each cell's `value` is a status key (number or string) looked up in the `-c` map.

```bash
chartscii fleet.json -Y status \
  -c "0:red,1:green,2:yellow,3:blue" \
  -g -B top -M right -U down ok warning maint \
  -t "Fleet Status" -w 100 -b 4
```

![status](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/status.svg?raw=true)

For **row mode** (one labelled row per host, cells along the x-axis), give each input point a `value: number[]` instead of a single key.

---

## Input formats

`chartscii` auto-detects what it's looking at. No `--format` flag needed.

### Plain numbers

```bash
chartscii 1 2 3 4 5
echo "10 20 30" | chartscii
seq 1 100 | chartscii
```

### Label + value

Both orderings work — chartscii figures it out.

```bash
echo -e "Item1 10\nItem2 20\nItem3 30" | chartscii   # label first
echo -e "10 Item1\n20 Item2\n30 Item3" | chartscii   # number first
```

### Size suffixes

`K`, `M`, `G`, `T` are converted automatically. Means `du -sh` Just Works™.

```bash
du -sh * | chartscii -c auto -k pastel
```

![file-count](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/file-count.svg?raw=true)

### Mixed strings

Numbers are extracted from any text — `$1,500`, `Price: 99.99`, `12.99$`.

```bash
cat sales.txt | chartscii -c auto
```

![sales](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/sales.svg?raw=true)

### CSV

```csv
JavaScript,68
TypeScript,56
Python,43
```

Stacked values support multiple notations:

```csv
JavaScript,[68, 21, 23]
TypeScript,56|11|10
Python,"43 10 5"
Go,32,8,4
```

```bash
chartscii examples/example-stacked.csv -c auto -p -k sport
```

![stacked-csv](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/stacked-csv.svg?raw=true)

### JSON

```json
[10, 20, 30, 40, 50]
```

Or with labels and per-bar overrides:

```json
[
  { "label": "Jan", "value": 100, "color": "blue" },
  { "label": "Feb", "value": 150 }
]
```

For **multi-series** line / step / scatter, use `InputData[][]` — one inner array per data point, one entry per series:

```json
[
  [{"label":"Jan","value":10}, {"label":"Jan","value":20}, {"label":"Jan","value":5}],
  [{"label":"Feb","value":15}, {"label":"Feb","value":12}, {"label":"Feb","value":8}]
]
```

For **candlestick**, value is `[open, high, low, close]`:

```json
[
  [42100, 42850, 41800, 42600],
  [42600, 43200, 42400, 43050]
]
```

---

## Styling

### Colors

`-c` / `--color` accepts a lot of shapes — chartscii infers from context:

| Form | Example | Used by |
|---|---|---|
| Named / hex / ANSI | `-c green`, `-c "#ff8800"`, `-c 196` | any |
| `auto` | `-c auto` | any (cycles palette) |
| Gradient string | `-c "gradient(red,yellow,green)"` | any |
| Gradient with direction / reverse | `-c "gradient(cyan,pink:vertical:reverse)"` | any |
| Comma list (per-series) | `-c "red,green,blue"` | line / step / scatter |
| Comma pair (bull/bear) | `-c "green,red"` | candlestick |
| Status map | `-c "0:red,1:green,2:yellow"` | status |

```bash
chartscii 1 2 3 4 5 6 7 8 9 10 -c "gradient(red,yellow,green)" -t "Gradient"
```

![gradient-theme](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/gradient-theme.svg?raw=true)

Combine with `-G auto` to gradient-fill the empty space too:

```bash
seq 1 12 | chartscii -o vertical -c "gradient(purple,cyan)" -f "░" -G auto -w auto
```

![direction](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/direction.svg?raw=true)

### Themes

```bash
chartscii --list-themes
```

> default · pastel · lush · standard · beach · nature · neon · spring · pinkish · crayons · sunset · rufus · summer · autumn · mint · vintage · sport · rainbow · pool · champagne

```bash
chartscii examples/example.csv -c auto -p --no-sort -k beach
```

![beach-theme](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/csv.svg?raw=true)

### Fills, structure, alignment

```bash
# opt-in fill character (▒ by default, custom if a value is given)
chartscii 10 20 30 -f "░" -G blue

# bar alignment (horizontal: top/center/bottom/justify)
chartscii 10 20 30 -E center -h 10

# vertical alignment (left/center/right/justify)
chartscii 10 20 30 -o vertical -E center -w 60

# strip the box characters
chartscii 1 2 3 -n -c red

# customize the box characters
chartscii 1 2 3 -x "─" -y "│" -a "┃" -q "└"
```

### Value labels

```bash
# show the raw value next to each bar
chartscii 100 250 500 -v

# with a currency prefix and three decimals
chartscii 1.234 5.678 9.012 -v -P '€' -V 3

# percentage labels, naturally
chartscii data.csv -p
```

![value-labels](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/gradient-value-labels.svg?raw=true)

### Custom label format

`-L` / `--label-format` and `-F` / `--value-label-format` accept a template string:

| Placeholder | Where | Description |
|---|---|---|
| `{label}` | `-L` | The row label (with percentage if `-p` is on) |
| `{value}` | `-F` | The value — for stacked bars, all segment values joined with `\|` |
| `{value:N}` | `-F` | The N-th segment value (0-indexed). Out-of-range → empty |

```bash
# wrap labels in brackets, suffix values with €
chartscii data.csv -L "[{label}]" -F "{value}€"

# stacked: control each segment individually
echo -e "Q1 100|50|30\nQ2 120|60|40" | chartscii -K -F '{value:0}↑{value:1}↓{value:2}' -I red green blue
```

---

## Stacked bars

Three input formats, one renderer. Auto colors kick in if you don't pass `-I`.

```bash
echo -e "Q1 100|50|30\nQ2 120|60|40\nQ3 90|70|50" | \
  chartscii -I red green blue -J Frontend Backend DevOps -K
```

JSON form with per-segment color overrides:

```bash
chartscii examples/example-stacked-color-overrides.json -I marine pink purple -k pastel
```

![stacked-override](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/stacked-override.svg?raw=true)

---

## Animation

Add `-e` to any chart to animate it. Bar charts grow from zero; line / step / scatter / candlestick / status reveal left-to-right.

```bash
seq 1 30 | chartscii -e -X easeOut -W 1500
```

![animated](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/animated.svg?raw=true)

| Flag | Default | Description |
|---|---|---|
| `-e` / `--animate` | `false` | Turn animation on |
| `-W` / `--animate-duration` | `1000` | Total duration in ms |
| `-Z` / `--animate-fps` | `60` | Frames per second |
| `-X` / `--animate-easing` | `easeOut` | `linear`, `easeIn`, `easeOut`, `easeInOut` |
| `-Q` / `--animate-step` | — | Step size 0–1 (overrides FPS when set) |

---

## Recipes & shell helpers

A handful of pipelines worth keeping around. Drop these into your `.bashrc` / `.zshrc`:

```bash
# Bigger directories first, full terminal width
alias dirsize='du -sh */ | sort -rh | chartscii -w auto -c auto -t "Directory Sizes"'

# Code churn over the last 10 commits — green = additions, red = deletions
alias churn='git log --pretty=format:"%h" --numstat -10 | \
  awk "NF==3 {plus+=\$1; minus+=\$2} NF==1 {if(h) print h\" \"plus\"|\"minus; h=\$1; plus=0; minus=0} END {print h\" \"plus\"|\"minus}" | \
  chartscii -k pastel -I green red -c auto --no-sort'

# Files-by-extension across the repo
alias filetypes='find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | \
  sed "s/.*\.//" | sort | uniq -c | sort -nr | head -10 | \
  chartscii -c "gradient(cyan,magenta)" -v'

# Memory hogs — top 5 processes by RSS
alias topmem='ps aux | sort -rn -k 6 | head -5 | \
  awk "{rss=\$6/1024; split(\$11,a,\"/\"); name=a[length(a)]; sub(/^-/,\"\",name); printf \"%s %d\n\", name, rss}" | \
  chartscii -c "gradient(green,red)" -k beach -v'

# Quick bar / vertical / percentage variants
alias chart='chartscii'
alias vchart='chartscii -o vertical'
alias pchart='chartscii -p'
alias autochart='chartscii -c auto'
```

A few showstoppers worth running once:

```bash
# Code churn — instant signal on whether a stretch was building or refactoring
git log --pretty=format:"%h" --numstat -10 | \
awk 'NF==3 {plus+=$1; minus+=$2} NF==1 {if(h) print h" "plus"|"minus; h=$1; plus=0; minus=0} END {print h" "plus"|"minus}' | \
chartscii -J -k pastel -I green red -c auto --no-sort
```

![code-churn](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/code-churn.svg?raw=true)

```bash
# Repo file distribution
find . -type f -not -path '*/.*' -not -path './node_modules/*' | \
sed 's/.*\.//' | sort | uniq -c | sort -nr | head -n 10 | \
chartscii -c "gradient(cyan,magenta)" -v
```

![file-distro](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/file-distro.svg?raw=true)

```bash
# File sizes from `ls -lh`
ls -lh | awk '{print $9" "$5}' | chartscii -c auto
```

![file-size](https://github.com/tool3/chartscii-cli/blob/master/examples/svgs/file-size.svg?raw=true)

### Live dashboards with `watch`

```bash
watch -n 5 "du -sh */ | chartscii -c auto -t 'Directory Sizes'"
watch -n 1 "find . -name '*.ts' | wc -l | chartscii -t 'TS Files'"
```

---

## Options reference

### Chart type

| Short | Long | Default | Description |
|---|---|---|---|
| `-Y` | `--type` | `bar` | `bar`, `line`, `step`, `scatter`, `candlestick`, `status` |
| `-N` | `--variant` | `sharp` | Step corner style: `sharp` or `smooth` |
| `-O` | `--points` | `false` | Draw a marker at each point on step charts |
| `-H` | `--point-char` | `●` | Override the marker character |
| `-R` | `--rich-labels` | `true` | Enable styl3 decorators (`*bold*`, `%italic%`, `!underline!`, `@invert@`) |
| `-g` | `--legend` | `false` | Show a legend (multi-series line/step/scatter, candlestick, status) |
| `-B` | `--legend-position` | `top` | `top` or `bottom` |
| `-M` | `--legend-align` | `left` | `left`, `center`, `right` |
| `-U` | `--legend-values` | — | Legend entry labels (space-separated) |

### Display

| Short | Long | Default | Description |
|---|---|---|---|
| `-t` | `--title` | — | Chart title |
| `-T` | `--title-color` | — | Title color (or `gradient` to match the chart gradient) |
| `-A` | `--title-align` | `left` | `left`, `center`, `right` |
| `-D` | `--title-padding` | — | CSS-style padding: `n`, `v,h`, or `top,right,bottom,left` |
| `-l` | `--labels` | `true` | Display labels |
| `-C` | `--color-labels` | `true` | Color the labels |
| `-p` | `--percentage` | `false` | Display percentages |
| `-v` | `--value-labels` | `false` | Show values on bars |
| `-P` | `--value-labels-prefix` | — | Prefix (e.g. `$`, `€`) |
| `-V` | `--value-labels-floating-point` | `2` | Decimal places |
| `-L` | `--label-format` | — | Template with `{label}` placeholder |
| `-F` | `--value-label-format` | — | Template with `{value}` (or `{value:N}` for stacked segments) |

### Layout

| Short | Long | Default | Description |
|---|---|---|---|
| `-o` | `--orientation` | `horizontal` | `horizontal` or `vertical` |
| `-w` | `--width` | `80` | Number, or `auto` for terminal width |
| `-h` | `--height` | `1` (bar) / `10` (other) | Number, or `auto` for terminal height |
| `-b` | `--bar-size` | — | Bar / candle / status-cell thickness |
| `-d` | `--padding` | `1` | Space between bars / cells |
| `-E` | `--align-bars` | — | `top`/`center`/`bottom`/`justify` (horizontal) or `left`/`center`/`right`/`justify` (vertical) |

### Styling

| Short | Long | Default | Description |
|---|---|---|---|
| `-c` | `--color` | — | See the [Colors](#colors) table for accepted forms |
| `-k` | `--theme` | — | Theme name (run `--list-themes` for the list) |
| `-z` | `--char` | `█` | Character used for bars |
| `-f` | `--fill` | — | Opt-in fill character (`▒` if flag alone, custom if value) |
| `-G` | `--fill-color` | — | Fill color, or `auto` to match the chart gradient |
| `-S` | `--scale` | `auto` | `auto`, `relative`, `relative-zero`, or fixed number |

### Structure

| Short | Long | Default | Description |
|---|---|---|---|
| `-n` | `--naked` | `false` | Hide structure characters |
| `-x` | `--structure-x` | `═` | Horizontal axis character |
| `-y` | `--structure-y` | `╢` | Y-axis character |
| `-a` | `--structure-axis` | `║` | Vertical axis character |
| `-q` | `--structure-bottom-left` | `╚` | Bottom-left corner character |

### Data

| Short | Long | Default | Description |
|---|---|---|---|
| `-s` | `--sort` | `true` for bar / `false` otherwise | Sort data |
| `-r` | `--reverse` | `false` | Reverse the order |

### Stacked bars

| Short | Long | Default | Description |
|---|---|---|---|
| `-I` | `--stack-colors` | — | Per-segment colors (space-separated) |
| `-J` | `--stack-labels` | — | Per-segment labels |
| `-K` | `--stack-value-labels` | `false` | Show segment values on bars (auto-enables `-v`) |

### Animation

| Short | Long | Default | Description |
|---|---|---|---|
| `-e` | `--animate` | `false` | Turn animation on |
| `-W` | `--animate-duration` | `1000` | Duration in ms |
| `-Z` | `--animate-fps` | `60` | Frames per second |
| `-X` | `--animate-easing` | `easeOut` | `linear`, `easeIn`, `easeOut`, `easeInOut` |
| `-Q` | `--animate-step` | — | Step size 0–1 (overrides FPS when set) |

### Utility

| Short | Long | Default | Description |
|---|---|---|---|
| `-m` | `--list-themes` | `false` | Print all available themes |
| `-?` | `--help` | — | Show help |
|  | `--version` | — | Show version |

---

## Notes

- **Width on horizontal charts** is exact: `-w 80` produces output that fits in 80 columns, gutters and structure included.
- **Width on vertical charts** is approximate — for precise control, set `-b` (bar thickness) and `-d 0` (no padding) explicitly.
- **`--sort` defaults to off for non-bar chart types**, since they're already ordered along the x-axis (time series, OHLC, host roster). Pass `-s` to opt in.

Built on [chartscii](https://github.com/tool3/chartscii) — see that repo for the programmatic API.

## License

MIT © [Tal Hayut](https://github.com/tool3)
