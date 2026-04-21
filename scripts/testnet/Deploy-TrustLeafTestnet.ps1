param(
    [string]$EnvFile = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\trustleaf.testnet.env",
    [string]$OutDir = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\out",
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$ArtifactsDir = Join-Path $OutDir "artifacts"
$ManifestPath = Join-Path $OutDir "trustleaf-testnet-manifest.json"

$Contracts = @(
    @{
        Key = "rbac"
        Package = "trust_leaf_rbac"
        Wasm = "trust_leaf_rbac.wasm"
        AliasEnv = "TRUST_LEAF_RBAC_ALIAS"
        DefaultAlias = "trustleaf-rbac"
    },
    @{
        Key = "traceability"
        Package = "trust_leaf_traceability"
        Wasm = "trust_leaf_traceability.wasm"
        AliasEnv = "TRUST_LEAF_TRACEABILITY_ALIAS"
        DefaultAlias = "trustleaf-traceability"
    },
    @{
        Key = "zkMedical"
        Package = "trust_leaf_zk_medical"
        Wasm = "trust_leaf_zk_medical.wasm"
        AliasEnv = "TRUST_LEAF_ZK_MEDICAL_ALIAS"
        DefaultAlias = "trustleaf-zk-medical"
    }
)

function Import-TrustLeafEnv {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Env file not found: $Path"
    }

    $values = @{}
    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith("#")) {
            continue
        }

        $pair = $trimmed -split "=", 2
        if ($pair.Count -ne 2) {
            continue
        }

        $name = $pair[0].Trim()
        $value = $pair[1].Trim()
        $values[$name] = $value
    }

    return $values
}

function Require-EnvValue {
    param(
        [hashtable]$EnvMap,
        [string]$Name
    )

    $value = $EnvMap[$Name]
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "Missing required env value: $Name"
    }

    return $value
}

function Invoke-StellarText {
    param(
        [string[]]$CommandArgs,
        [switch]$DryRunMode
    )

    $commandText = "stellar " + ($CommandArgs -join " ")
    if ($DryRunMode) {
        Write-Host "[dry-run] $commandText"
        return "dry-run"
    }

    $output = & stellar @CommandArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: $commandText"
    }

    if ($output -is [System.Array]) {
        return ($output | Select-Object -Last 1).Trim()
    }

    return "$output".Trim()
}

$envMap = Import-TrustLeafEnv -Path $EnvFile
$rpcUrl = Require-EnvValue -EnvMap $envMap -Name "STELLAR_RPC_URL"
$networkPassphrase = Require-EnvValue -EnvMap $envMap -Name "STELLAR_NETWORK_PASSPHRASE"
$source = Require-EnvValue -EnvMap $envMap -Name "TRUST_LEAF_SOURCE"
$inclusionFee = $envMap["TRUST_LEAF_INCLUSION_FEE"]
if ([string]::IsNullOrWhiteSpace($inclusionFee)) {
    $inclusionFee = "10000"
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
New-Item -ItemType Directory -Force -Path $ArtifactsDir | Out-Null

if (-not $SkipBuild) {
    foreach ($contract in $Contracts) {
        $buildArgs = @(
            "contract", "build",
            "--manifest-path", (Join-Path $RepoRoot "Cargo.toml"),
            "--package", $contract.Package,
            "--out-dir", $ArtifactsDir
        )
        Invoke-StellarText -CommandArgs $buildArgs -DryRunMode:$DryRun | Out-Null
    }
}

$manifestContracts = [ordered]@{}

foreach ($contract in $Contracts) {
    $alias = $envMap[$contract.AliasEnv]
    if ([string]::IsNullOrWhiteSpace($alias)) {
        $alias = $contract.DefaultAlias
    }

    $wasmPath = Join-Path $ArtifactsDir $contract.Wasm
    if (-not $DryRun -and -not (Test-Path -LiteralPath $wasmPath)) {
        throw "Built wasm not found: $wasmPath"
    }

    $uploadArgs = @(
        "-q",
        "contract", "upload",
        "--wasm", $wasmPath,
        "--source-account", $source,
        "--rpc-url", $rpcUrl,
        "--network-passphrase", $networkPassphrase,
        "--inclusion-fee", $inclusionFee
    )
    $wasmHash = Invoke-StellarText -CommandArgs $uploadArgs -DryRunMode:$DryRun

    $deployArgs = @(
        "-q",
        "contract", "deploy",
        "--wasm-hash", $wasmHash,
        "--source-account", $source,
        "--rpc-url", $rpcUrl,
        "--network-passphrase", $networkPassphrase,
        "--inclusion-fee", $inclusionFee,
        "--alias", $alias
    )
    $contractId = Invoke-StellarText -CommandArgs $deployArgs -DryRunMode:$DryRun

    $manifestContracts[$contract.Key] = [ordered]@{
        package = $contract.Package
        alias = $alias
        wasm = $wasmPath
        wasmHash = $wasmHash
        contractId = $contractId
    }
}

$manifest = [ordered]@{
    generatedAt = (Get-Date).ToString("o")
    network = [ordered]@{
        rpcUrl = $rpcUrl
        networkPassphrase = $networkPassphrase
    }
    source = $source
    contracts = $manifestContracts
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ManifestPath

Write-Host ""
Write-Host "Trust Leaf testnet manifest written to:"
Write-Host $ManifestPath
