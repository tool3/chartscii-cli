# chartscii cli
 [![Build Status](https://travis-ci.org/tool3/chartscii-cli.svg?branch=master)](https://travis-ci.org/tool3/chartscii-cli)  ![lint](https://github.com/tool3/chartscii-cli/workflows/lint/badge.svg)   
a companion cli for `chartscii`

# install
```bash
npm i chartscii-cli -g
```

# npx
```bash
npx chartscii-cli create $(jot -r 10 1000 2000) -w 300
```
```text
1303 ╢█████████████████████████░░░░░░░░░░░░░
1751 ╢█████████████████████████████████░░░░░
1404 ╢██████████████████████████░░░░░░░░░░░░
1896 ╢████████████████████████████████████░░
1452 ╢███████████████████████████░░░░░░░░░░░
1658 ╢███████████████████████████████░░░░░░░
1988 ╢█████████████████████████████████████░
1993 ╢██████████████████████████████████████
1118 ╢█████████████████████░░░░░░░░░░░░░░░░░
1344 ╢█████████████████████████░░░░░░░░░░░░░
     ╚══════════════════════════════════════
```


# usage
see available chart options in [`chartscii`](https://github.com/tool3/chartscii#chart-options)

# example
```bash
chartscii create --ff example.json -l 'Weekly coding stats' -f -p -w 65 -n
```

```text
Weekly coding stats                   
       Bash (3.3%)  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       JSON (0.8%)  █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       YAML (4.7%)  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
       HTML (5.3%)  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 TypeScript (5.7%)  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  Markdown (11.8%)  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
JavaScript (68.3%)  ████████████████████████████████████████████
```
