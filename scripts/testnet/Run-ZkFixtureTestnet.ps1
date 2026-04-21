param(
    [string]$EnvFile = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\trustleaf.testnet.env",
    [string]$ManifestPath = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\out\trustleaf-testnet-manifest.json",
    [string]$FixturePath = "D:\00 CODEX - OPENIA\bisHealth\zk\fixtures\soroban-zk-fixture.json",
    [switch]$SkipIssue,
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

function Invoke-TrustLeafContract {
    param(
        [string]$ContractId,
        [string]$SourceAccount,
        [string]$RpcUrl,
        [string]$NetworkPassphrase,
        [string[]]$OperationArgs,
        [switch]$DryRunMode
    )

    $args = @(
        "contract", "invoke",
        "--id", $ContractId,
        "--source-account", $SourceAccount,
        "--rpc-url", $RpcUrl,
        "--network-passphrase", $NetworkPassphrase,
        "--send=yes",
        "--"
    ) + $OperationArgs

    Invoke-StellarCommand -CommandArgs $args -DryRunMode:$DryRunMode
}

$envMap = Import-TrustLeafEnv -Path $EnvFile
if (-not (Test-Path -LiteralPath $ManifestPath)) {
    throw "Manifest not found: $ManifestPath"
}
if (-not (Test-Path -LiteralPath $FixturePath)) {
    throw "Fixture not found: $FixturePath"
}

$manifest = Get-Content -LiteralPath $ManifestPath | ConvertFrom-Json
$fixture = Get-Content -LiteralPath $FixturePath | ConvertFrom-Json

$rpcUrl = $manifest.network.rpcUrl
$networkPassphrase = $manifest.network.networkPassphrase
$zkMedicalId = $manifest.contracts.zkMedical.contractId

$doctorAlias = $envMap["TRUST_LEAF_DOCTOR_SOURCE"]
$dispAlias = $envMap["TRUST_LEAF_DISPENSARY_SOURCE"]

if ([string]::IsNullOrWhiteSpace($doctorAlias)) {
    $doctorAlias = "trustleaf-doctor"
}
if ([string]::IsNullOrWhiteSpace($dispAlias)) {
    $dispAlias = "trustleaf-dispensary"
}

$doctor = $envMap["TRUST_LEAF_DOCTOR_ADDRESS"]
$disp = $envMap["TRUST_LEAF_DISPENSARY_ADDRESS"]

if (-not $doctor) {
    throw "Missing TRUST_LEAF_DOCTOR_ADDRESS in env file"
}
if (-not $disp) {
    throw "Missing TRUST_LEAF_DISPENSARY_ADDRESS in env file"
}

if (-not $SkipIssue) {
    Invoke-TrustLeafContract -ContractId $zkMedicalId -SourceAccount $doctorAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
        "issue_prescription",
        "--doctor", $doctor,
        "--commitment", "$($fixture.commitment)",
        "--patient_nullifier", "$($fixture.patientNullifier)",
        "--policy_hash", "$($fixture.policyHash)"
    )
}

Invoke-TrustLeafContract -ContractId $zkMedicalId -SourceAccount $dispAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "verify_and_consume",
    "--caller", $disp,
    "--commitment", "$($fixture.commitment)",
    "--proof", "$($fixture.proofHex)",
    "--public_inputs_hash", "$($fixture.publicInputsHash)",
    "--current_day", "$($fixture.currentDay)"
)

Write-Host ""
Write-Host "Trust Leaf fixture ZK flow completed."
Write-Host "Fixture commitment: $($fixture.commitment)"
Write-Host "Current day: $($fixture.currentDay)"
