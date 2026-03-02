# Stacked Chart Format Support

chartscii CLI supports stacked bar charts in multiple formats:

## JSON Format

### Array notation
```json
[
  {
    "label": "Q1",
    "value": [100, 50, 30]
  }
]
```

### Per-segment objects (with colors)
```json
[
  {
    "label": "Q1",
    "value": [
      { "value": 100, "color": "blue" },
      { "value": 50 },
      { "value": 30, "color": "yellow" }
    ]
  }
]
```

### Per-bar color arrays
```json
[
  {
    "label": "Q1",
    "value": [100, 50, 30],
    "color": ["red", "green", "blue"]
  }
]
```

## CSV Format

### Array notation
```csv
JavaScript,[68, 21, 23]
TypeScript,56
```

### Pipe-separated
```csv
JavaScript,68|21|23
TypeScript,56
```

### Space-separated in quotes
```csv
JavaScript,"68 21 23"
TypeScript,56
```

### Multiple columns
```csv
JavaScript,68,21,23
TypeScript,56
```

## Plain Text Format

### Pipe-separated (label first)
```
JavaScript 68|21|23
TypeScript 56
```

### Pipe-separated (value first)
```
100|50|30 JavaScript
56 TypeScript
```

### Array notation
```
JavaScript [68, 21, 23]
TypeScript 56
```

## Usage Examples

```bash
# From JSON file
chartscii stacked.json -I red green blue

# From CSV file
chartscii data.csv -I red green blue

# From piped text
echo "Frontend 100|50|30" | chartscii -I red green blue

# With stack labels
chartscii data.csv -I red green blue -J "API" "UI" "Tests"

# With value labels on segments
chartscii data.csv -I red green blue -K
```

## Color Priority

Colors are applied in this priority order:

1. **Per-segment colors** (highest) - Using object format
2. **Per-bar color arrays** - Using `"color": ["red", "blue"]`
3. **Global stackColors** (lowest) - Using `-I` CLI option

Segments without specific colors fall back to the next level.
