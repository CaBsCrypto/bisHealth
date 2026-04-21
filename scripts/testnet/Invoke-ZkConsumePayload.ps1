param(
    [string]$PayloadPath,
    [string]$PayloadBase64,
    [string]$SourceAlias = "bob",
    [string]$Caller,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Read-TrustLeafPayload {
    param(
        [string]$Path,
        [string]$Base64
    )

    if ($Path) {
        if (-not (Test-Path -LiteralPath $Path)) {
            throw "Payload file not found: $Path"
        }

        return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
    }

    if ($Base64) {
        $json = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Base64))
        return $json | ConvertFrom-Json
    }

    throw "Provide either -PayloadPath or -PayloadBase64."
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

$payload = Read-TrustLeafPayload -Path $PayloadPath -Base64 $PayloadBase64

if (-not $payload.contractId) {
    throw "Payload is missing contractId."
}
if (-not $payload.rpcUrl) {
    throw "Payload is missing rpcUrl."
}
if (-not $payload.networkPassphrase) {
    throw "Payload is missing networkPassphrase."
}

$effectiveCaller = if ($Caller) { $Caller } elseif ($payload.caller) { $payload.caller } else { $null }
if (-not $effectiveCaller) {
    throw "Provide -Caller or include caller in the payload."
}

$args = @(
    "contract", "invoke",
    "--id", "$($payload.contractId)",
    "--source-account", $SourceAlias,
    "--rpc-url", "$($payload.rpcUrl)",
    "--network-passphrase", "$($payload.networkPassphrase)",
    "--send=yes",
    "--",
    "verify_and_consume",
    "--caller", "$effectiveCaller",
    "--commitment", "$($payload.commitment)",
    "--proof", "$($payload.proof)",
    "--public_inputs_hash", "$($payload.publicInputsHash)",
    "--current_day", "$($payload.currentDay)"
)

Invoke-StellarCommand -CommandArgs $args -DryRunMode:$DryRun

Write-Host ""
Write-Host "Trust Leaf consume payload invoked."
Write-Host "Contract: $($payload.contractId)"
Write-Host "Commitment: $($payload.commitment)"
Write-Host "Current day: $($payload.currentDay)"
