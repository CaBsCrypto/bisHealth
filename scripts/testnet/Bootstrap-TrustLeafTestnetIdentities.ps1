param(
    [string]$SourceAlias = "admin",
    [string]$DoctorAlias = "alice",
    [string]$DispensaryAlias = "bob",
    [string]$LabAlias = "lab",
    [string]$CultivatorAlias = "cultivator",
    [switch]$Fund,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$aliases = @(
    @{ Key = "TRUST_LEAF_SOURCE"; Alias = $SourceAlias; Fund = $true },
    @{ Key = "TRUST_LEAF_ADMIN_ADDRESS"; Alias = $SourceAlias; Fund = $false },
    @{ Key = "TRUST_LEAF_DOCTOR_ADDRESS"; Alias = $DoctorAlias; Fund = $true },
    @{ Key = "TRUST_LEAF_DISPENSARY_ADDRESS"; Alias = $DispensaryAlias; Fund = $true },
    @{ Key = "TRUST_LEAF_LAB_ADDRESS"; Alias = $LabAlias; Fund = $true },
    @{ Key = "TRUST_LEAF_CULTIVATOR_ADDRESS"; Alias = $CultivatorAlias; Fund = $true }
)

function Invoke-StellarCommand {
    param(
        [string[]]$CommandArgs,
        [switch]$DryRunMode
    )

    $commandText = "stellar " + ($CommandArgs -join " ")
    if ($DryRunMode) {
        Write-Host "[dry-run] $commandText"
        return
    }

    & stellar @CommandArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: $commandText"
    }
}

function Test-StellarAliasExists {
    param([string]$Alias)

    try {
        & stellar keys public-key $Alias 2>$null | Out-Null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

function Ensure-StellarAlias {
    param(
        [string]$Alias,
        [switch]$DryRunMode
    )

    if ($DryRunMode) {
        Write-Host "[dry-run] ensure alias $Alias"
        return
    }

    if (Test-StellarAliasExists -Alias $Alias) {
        return
    }

    Invoke-StellarCommand -CommandArgs @("keys", "generate", $Alias)
}

function Resolve-StellarAddress {
    param(
        [string]$Alias,
        [switch]$DryRunMode
    )

    if ($DryRunMode) {
        return "GDRYRUN$($Alias.ToUpper())PLACEHOLDER000000000000000000000000000000000000"
    }

    $output = & stellar keys public-key $Alias
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to resolve public key for alias: $Alias"
    }

    if ($output -is [System.Array]) {
        return ($output | Select-Object -Last 1).Trim()
    }

    return "$output".Trim()
}

foreach ($entry in ($aliases | Group-Object Alias | ForEach-Object { $_.Group[0] })) {
    $alias = $entry.Alias
    if ([string]::IsNullOrWhiteSpace($alias)) {
        continue
    }

    Ensure-StellarAlias -Alias $alias -DryRunMode:$DryRun

    if ($Fund -and $entry.Fund) {
        Invoke-StellarCommand -CommandArgs @("keys", "fund", $alias, "--network", "testnet") -DryRunMode:$DryRun
    }
}

$envLines = @(
    "TRUST_LEAF_SOURCE=$SourceAlias"
)

$rendered = [ordered]@{}
$seenAliases = @{}

foreach ($entry in $aliases) {
    $alias = $entry.Alias
    if ([string]::IsNullOrWhiteSpace($alias)) {
        continue
    }

    if (-not $seenAliases.ContainsKey($alias)) {
        $seenAliases[$alias] = Resolve-StellarAddress -Alias $alias -DryRunMode:$DryRun
    }

    $value = if ($entry.Key -eq "TRUST_LEAF_SOURCE") { $alias } else { $seenAliases[$alias] }
    $rendered[$entry.Key] = $value
}

Write-Host ""
Write-Host "Trust Leaf testnet identities are ready."
Write-Host "Paste this block into scripts/testnet/trustleaf.testnet.env:"
Write-Host ""

foreach ($pair in $rendered.GetEnumerator()) {
    Write-Host "$($pair.Key)=$($pair.Value)"
}
