param(
    [string]$EnvFile = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\trustleaf.testnet.env",
    [string]$ManifestPath = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\out\trustleaf-testnet-manifest.json",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

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

        $values[$pair[0].Trim()] = $pair[1].Trim()
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
        return
    }

    & stellar @CommandArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: $commandText"
    }
}

function Resolve-Address {
    param(
        [string]$Value,
        [switch]$DryRunMode
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $null
    }

    if ($Value.StartsWith("G")) {
        return $Value
    }

    if ($DryRunMode) {
        return "GDRYRUNPLACEHOLDERADDRESS0000000000000000000000000000000000000"
    }

    $resolved = & stellar keys public-key $Value
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to resolve Stellar address for: $Value"
    }

    if ($resolved -is [System.Array]) {
        return ($resolved | Select-Object -Last 1).Trim()
    }

    return "$resolved".Trim()
}

$envMap = Import-TrustLeafEnv -Path $EnvFile
$manifest = $null
if (Test-Path -LiteralPath $ManifestPath) {
    $manifest = Get-Content -LiteralPath $ManifestPath | ConvertFrom-Json
} elseif ($DryRun) {
    $manifest = @{
        contracts = @{
            rbac = @{
                contractId = "CDRYRUNRBACCONTRACT000000000000000000000000000000000000000000"
            }
        }
    }
} else {
    throw "Manifest not found: $ManifestPath"
}
$rpcUrl = Require-EnvValue -EnvMap $envMap -Name "STELLAR_RPC_URL"
$networkPassphrase = Require-EnvValue -EnvMap $envMap -Name "STELLAR_NETWORK_PASSPHRASE"
$source = Require-EnvValue -EnvMap $envMap -Name "TRUST_LEAF_SOURCE"
$inclusionFee = $envMap["TRUST_LEAF_INCLUSION_FEE"]
if ([string]::IsNullOrWhiteSpace($inclusionFee)) {
    $inclusionFee = "10000"
}

$rbacContractId = $manifest.contracts.rbac.contractId
if ([string]::IsNullOrWhiteSpace($rbacContractId)) {
    throw "RBAC contract id missing from manifest"
}

$adminAddress = Resolve-Address -Value $envMap["TRUST_LEAF_ADMIN_ADDRESS"] -DryRunMode:$DryRun
if (-not $adminAddress) {
    $adminAddress = Resolve-Address -Value $source -DryRunMode:$DryRun
}
if (-not $adminAddress) {
    throw "TRUST_LEAF_ADMIN_ADDRESS is empty and source could not be resolved to a public key"
}

$baseArgs = @(
    "-q",
    "contract", "invoke",
    "--id", $rbacContractId,
    "--source-account", $source,
    "--rpc-url", $rpcUrl,
    "--network-passphrase", $networkPassphrase,
    "--inclusion-fee", $inclusionFee,
    "--"
)

Invoke-StellarText -CommandArgs ($baseArgs + @("init", "--admin", $adminAddress)) -DryRunMode:$DryRun

$optionalRoleAssignments = @(
    @{ Env = "TRUST_LEAF_DOCTOR_ADDRESS"; Role = "DOCTOR" },
    @{ Env = "TRUST_LEAF_DISPENSARY_ADDRESS"; Role = "DISP" },
    @{ Env = "TRUST_LEAF_LAB_ADDRESS"; Role = "LAB" },
    @{ Env = "TRUST_LEAF_CULTIVATOR_ADDRESS"; Role = "CULT" }
)

foreach ($assignment in $optionalRoleAssignments) {
    $address = Resolve-Address -Value $envMap[$assignment.Env] -DryRunMode:$DryRun
    if (-not $address) {
        continue
    }

    $grantArgs = $baseArgs + @(
        "grant_role",
        "--admin", $adminAddress,
        "--role", $assignment.Role,
        "--account", $address
    )
    Invoke-StellarText -CommandArgs $grantArgs -DryRunMode:$DryRun
}

Write-Host ""
Write-Host "Trust Leaf RBAC initialization flow prepared successfully."
