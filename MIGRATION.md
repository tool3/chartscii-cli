# Migration Guide

## v3 → v4

Version 4.0.0 brings significant improvements and simplifications to chartscii-cli.

### Breaking Changes

#### 1. No More `create` Command

The `create` command has been removed for a simpler, more intuitive interface.

**Before (v3):**
```bash
chartscii create 1 2 3 4 5
chartscii create -f data.json
chartscii create $(seq 1 20)
```

**After (v4):**
```bash
chartscii 1 2 3 4 5
chartscii data.json
chartscii $(seq 1 20)
```
### New Features

#### Automatic File Detection

Files are now automatically detected - no need for the `-f` flag:

```bash
# All of these work
chartscii data.json
chartscii data.csv
chartscii -f data.json  # Still works
```

#### Enhanced CSV Support

Better CSV parsing with multiple format support:

```csv
# Label,Value format
JavaScript,68
TypeScript,56

# Simple values
10,20,30,40,50

# One per line
10
20
30
```

#### Improved Defaults

- Auto-sorting enabled by default
- Better terminal-friendly width (80 chars)
- Colored labels by default
- Optimized padding (1 char)

### Migration Steps

1. **Update package**:
   ```bash
   npm update -g chartscii-cli
   ```

2. **Update scripts**: Remove `create` from all scripts:
   ```bash
   # Find all uses in your scripts
   grep -r "chartscii create" .

   # Replace with
   sed -i 's/chartscii create/chartscii/g' your-script.sh
   ```

3. **Update CI/CD**: If you use chartscii in CI/CD pipelines:
   ```yaml
   # Before
   - run: chartscii create data.json

   # After
   - run: chartscii data.json
   ```

4. **Check shell aliases**: Update any aliases in `.bashrc`, `.zshrc`, etc.:
   ```bash
   # Before
   alias chart="chartscii create"

   # After
   alias chart="chartscii"
   ```

### What Stays the Same

✅ All flags and options remain unchanged
✅ Input formats (JSON, CSV, numbers) work identically
✅ Output format is the same
✅ Piping and stdin work as before
✅ All styling options preserved

### Examples Comparison

| v3 | v4 |
|----|-----|
| `chartscii create 1 2 3` | `chartscii 1 2 3` |
| `chartscii create -f data.json` | `chartscii data.json` or `chartscii -f data.json` |
| `echo "1 2 3" \| chartscii create` | `echo "1 2 3" \| chartscii` |
| `chartscii create -R ~/project` | _Removed_ |

### Need Help?

- 📖 [Full Documentation](https://github.com/tool3/chartscii-cli#readme)
- 🐛 [Report Issues](https://github.com/tool3/chartscii-cli/issues)
- 💬 [Discussions](https://github.com/tool3/chartscii-cli/discussions)



npx ts-node src/cli.ts $(seq 1 5) --animate -c "gradient(pink,cyan)" --fill -G auto | npx ts-node ../dvd/src/cli.ts --loop-style reverse --loop-pause 1000 --watermark "made with dvd"