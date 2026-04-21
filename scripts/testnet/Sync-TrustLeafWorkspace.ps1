param(
    [string]$EnvFile = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\trustleaf.testnet.env",
    [string]$ManifestPath = "D:\00 CODEX - OPENIA\bisHealth\scripts\testnet\out\trustleaf-testnet-manifest.json",
    [string]$WebEnvPath = "D:\00 CODEX - OPENIA\bisHealth\apps\web\.env.local",
    [string]$IndexerEnvPath = "D:\00 CODEX - OPENIA\bisHealth\indexer\.env.local"
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

if (-not (Test-Path -LiteralPath $ManifestPath)) {
    throw "Manifest not found: $ManifestPath"
}

$envMap = Import-TrustLeafEnv -Path $EnvFile
$manifest = Get-Content -LiteralPath $ManifestPath | ConvertFrom-Json

$rpcUrl = $manifest.network.rpcUrl
$networkPassphrase = $manifest.network.networkPassphrase
$sourceAccount = $envMap["TRUST_LEAF_ADMIN_ADDRESS"]
$rbacContractId = $manifest.contracts.rbac.contractId
$traceabilityContractId = $manifest.contracts.traceability.contractId
$zkMedicalContractId = $manifest.contracts.zkMedical.contractId
$rbacWasmHash = $manifest.contracts.rbac.wasmHash
$traceabilityWasmHash = $manifest.contracts.traceability.wasmHash
$zkMedicalWasmHash = $manifest.contracts.zkMedical.wasmHash

$webEnv = @(
    "TRUST_LEAF_ORIGIN=http://localhost:3000"
    "TRUST_LEAF_RP_NAME=Trust Leaf"
    "TRUST_LEAF_RP_ID=localhost"
    "TRUST_LEAF_NETWORK_PASSPHRASE=$networkPassphrase"
    "TRUST_LEAF_STELLAR_RPC_URL=$rpcUrl"
    "TRUST_LEAF_BASE_FEE=1000"
    "TRUST_LEAF_DEPLOYMENT_MANIFEST_PATH=$ManifestPath"
    "TRUST_LEAF_SOURCE_ACCOUNT=$sourceAccount"
    "TRUST_LEAF_RBAC_ALIAS=$($manifest.contracts.rbac.alias)"
    "TRUST_LEAF_RBAC_CONTRACT_ID=$rbacContractId"
    "TRUST_LEAF_RBAC_WASM_HASH=$rbacWasmHash"
    "TRUST_LEAF_TRACEABILITY_ALIAS=$($manifest.contracts.traceability.alias)"
    "TRUST_LEAF_TRACEABILITY_CONTRACT_ID=$traceabilityContractId"
    "TRUST_LEAF_TRACEABILITY_WASM_HASH=$traceabilityWasmHash"
    "TRUST_LEAF_ZK_MEDICAL_ALIAS=$($manifest.contracts.zkMedical.alias)"
    "TRUST_LEAF_ZK_MEDICAL_CONTRACT_ID=$zkMedicalContractId"
    "TRUST_LEAF_ZK_MEDICAL_WASM_HASH=$zkMedicalWasmHash"
) -join "`r`n"

$indexerEnv = @(
    "TRUST_LEAF_RPC_URL=$rpcUrl"
    "TRUST_LEAF_CONTRACT_IDS=$rbacContractId,$traceabilityContractId,$zkMedicalContractId"
    "TRUST_LEAF_CURSOR_FILE=D:\00 CODEX - OPENIA\bisHealth\indexer\.state\trust-leaf-rpc-cursor.json"
    "TRUST_LEAF_MAX_PAGES=3"
    "TRUST_LEAF_PAGE_LIMIT=100"
) -join "`r`n"

Set-Content -LiteralPath $WebEnvPath -Value $webEnv
Set-Content -LiteralPath $IndexerEnvPath -Value $indexerEnv

Write-Host "Workspace synced from live Trust Leaf testnet manifest."
Write-Host "Web env: $WebEnvPath"
Write-Host "Indexer env: $IndexerEnvPath"
