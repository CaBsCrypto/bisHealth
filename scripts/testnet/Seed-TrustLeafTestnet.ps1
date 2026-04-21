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

$manifest = Get-Content -LiteralPath $ManifestPath | ConvertFrom-Json

$rpcUrl = $manifest.network.rpcUrl
$networkPassphrase = $manifest.network.networkPassphrase
$traceabilityId = $manifest.contracts.traceability.contractId
$zkMedicalId = $manifest.contracts.zkMedical.contractId

$cultivatorAlias = $envMap["TRUST_LEAF_CULTIVATOR_SOURCE"]
$labAlias = $envMap["TRUST_LEAF_LAB_SOURCE"]
$doctorAlias = $envMap["TRUST_LEAF_DOCTOR_SOURCE"]
$dispAlias = $envMap["TRUST_LEAF_DISPENSARY_SOURCE"]

if ([string]::IsNullOrWhiteSpace($cultivatorAlias)) {
    $cultivatorAlias = "trustleaf-cultivator"
}
if ([string]::IsNullOrWhiteSpace($labAlias)) {
    $labAlias = "trustleaf-lab"
}
if ([string]::IsNullOrWhiteSpace($doctorAlias)) {
    $doctorAlias = "trustleaf-doctor"
}
if ([string]::IsNullOrWhiteSpace($dispAlias)) {
    $dispAlias = "trustleaf-dispensary"
}

$cultivator = $envMap["TRUST_LEAF_CULTIVATOR_ADDRESS"]
$lab = $envMap["TRUST_LEAF_LAB_ADDRESS"]
$doctor = $envMap["TRUST_LEAF_DOCTOR_ADDRESS"]
$disp = $envMap["TRUST_LEAF_DISPENSARY_ADDRESS"]

$batchId = "746c2d62617463682d3030320000000000000000000000000000000000000000"
$metadataHash = "1111111111111111111111111111111111111111111111111111111111111111"
$harvestHash = "2222222222222222222222222222222222222222222222222222222222222222"
$labReportHash = "3333333333333333333333333333333333333333333333333333333333333333"
$releaseHash = "4444444444444444444444444444444444444444444444444444444444444444"

$commitment = "24d4feaf493cdfe101111ba812f3f61a9ca8234fd5aea944bb7c4849f7f682ff"
$nullifier = "21e8368b948d8f641f9e97ae1c314235deb1c3d595874787be47ef3119510abc"
$policyHash = "031124e45f92c16a6fdaa1a452aee204989fd69bd851f55dce30503093c7b9de"

Invoke-TrustLeafContract -ContractId $traceabilityId -SourceAccount $cultivatorAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "create_batch",
    "--cultivator", $cultivator,
    "--batch_id", $batchId,
    "--metadata_hash", $metadataHash
)

Invoke-TrustLeafContract -ContractId $traceabilityId -SourceAccount $cultivatorAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "assign_lab",
    "--cultivator", $cultivator,
    "--batch_id", $batchId,
    "--lab", $lab
)

Invoke-TrustLeafContract -ContractId $traceabilityId -SourceAccount $cultivatorAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "append_event",
    "--actor", $cultivator,
    "--batch_id", $batchId,
    "--event_type", "HARVESTED",
    "--document_hash", $harvestHash
)

Invoke-TrustLeafContract -ContractId $traceabilityId -SourceAccount $labAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "append_event",
    "--actor", $lab,
    "--batch_id", $batchId,
    "--event_type", "LAB_VERIFIED",
    "--document_hash", $labReportHash
)

Invoke-TrustLeafContract -ContractId $traceabilityId -SourceAccount $labAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "update_status",
    "--actor", $lab,
    "--batch_id", $batchId,
    "--status", "Released",
    "--document_hash", $releaseHash
)

Invoke-TrustLeafContract -ContractId $zkMedicalId -SourceAccount $doctorAlias -RpcUrl $rpcUrl -NetworkPassphrase $networkPassphrase -DryRunMode:$DryRun -OperationArgs @(
    "issue_prescription",
    "--doctor", $doctor,
    "--commitment", $commitment,
    "--patient_nullifier", $nullifier,
    "--policy_hash", $policyHash
)

Write-Host ""
Write-Host "Trust Leaf testnet seed flow completed."
Write-Host "Batch id: $batchId"
Write-Host "Prescription commitment: $commitment"
