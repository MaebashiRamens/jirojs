# Nix Troubleshooting

## Common Issues

### `nix develop` is slow on first run

First run downloads all packages. Subsequent runs use cache.

```bash
# Check what will be downloaded
nix develop --dry-run
```

### Infinite recursion in .nix files

**Causes:**

- Using `rec { }` with circular references
- Missing `mkIf` for conditional config

**Fix:**

```nix
# Always use let...in instead of rec
let
  a = 1;
in {
  inherit a;
  b = a + 2;
}
```

### Node.js / pnpm not found after shell exit

Tools are only available inside the Nix dev shell:

```bash
# Re-enter shell
nix develop

# Or use direnv for automatic activation
echo "use flake" > .envrc
direnv allow
```

### treefmt / biome not formatting correctly

treefmt is provided by the Nix devShell. Ensure you're inside the shell:

```bash
# Inside nix develop or direnv
treefmt          # Format all files
nix fmt          # Also works (outside devShell too)
```

If biome config is not picked up, check that `biome.json` exists at project root.

### `nix flake check` fails after editing .nix files

Common causes:

1. **Syntax error**: Check with `nix flake check --show-trace`
2. **Formatting**: Run `treefmt` then retry
3. **Stale lock file**: Run `nix flake update` if inputs changed

## Debug Commands

```bash
# Show detailed traces
nix flake check --show-trace

# Force re-evaluate (bypass cache)
nix develop --refresh

# Show flake structure
nix flake show

# Update specific input
nix flake lock --update-input treefmt-nix

# Update all inputs
nix flake update

# Garbage collect old derivations
nix-collect-garbage -d
```

## Validation Checklist

```bash
# After any .nix file edit
nix flake check

# After any .ts/.js edit
pnpm test                          # Run vitest
pnpm lint                          # Type-check with tsc --noEmit

# Before commits
treefmt                            # Format all files
nix flake check                    # Verify Nix + formatting

# After adding/removing packages
pnpm install
nix flake check

# Full validation
nix flake check --show-trace       # Detailed Nix check
nix develop --command echo "OK"    # Verify shell evaluates
```
