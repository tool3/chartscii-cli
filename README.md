# chartscii cli
 [![Build Status](https://travis-ci.org/tool3/chartscii-cli.svg?branch=master)](https://travis-ci.org/tool3/chartscii-cli)  ![lint](https://github.com/tool3/chartscii-cli/workflows/lint/badge.svg)   
a companion cli for `chartscii`

# install
```bash
npm i chartscii-cli -g
```

# usage
see available chart options in [`chartscii`](https://github.com/tool3/chartscii#chart-options)

# example
```bash
chartscii create --ff example.json -l 'Weekly coding stats' -f -p -w 65
```

```text
Weekly coding stats                   
       Bash (3.3%) ╢██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       JSON (0.8%) ╢█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       YAML (4.7%) ╢███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       HTML (5.3%) ╢███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 TypeScript (5.7%) ╢████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  Markdown (11.8%) ╢████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
JavaScript (68.3%) ╢████████████████████████████████████████████
                   ╚════════════════════════════════════════════
```