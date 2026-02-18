import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { Logger } from "./logger";

// Initialize client lazily or only in production to avoid credential errors in local dev
let client: SecretsManagerClient | null = null;

function getClient() {
    if (client) return client;

    // In development, we might not want to initialize the client at all if we don't have credentials
    // But if we do need it (e.g. testing AWS connectivity), we can initialize it here.
    // For now, let's assume we ONLY use AWS in non-development or if explicitly configured.
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    client = new SecretsManagerClient(region ? { region } : {});
    return client;
}

export async function getSecret(secretName: string): Promise<string | undefined> {
    // 1. Try local environment variables first (Always priority in local dev)
    const envValue = process.env[secretName];
    if (envValue) {
        if (process.env.NODE_ENV === "development") {
            Logger.info(`Using local env for secret: ${secretName}`);
        }
        return envValue;
    }

    // 2. If in development and not found in env, do NOT attempt AWS connection
    //    unless we have some other flag indicating we want to test AWS.
    //    This prevents "CredentialsProviderError" when running without AWS setup.
    if (process.env.NODE_ENV === "development") {
        Logger.warn(`Secret ${secretName} not found in local env. Skipping AWS Secrets Manager in development mode.`);
        return undefined;
    }

    // 3. Attempt AWS Secrets Manager (Production / Staging)
    try {
        const secretsClient = getClient();
        const response = await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT",
            })
        );

        if (response.SecretString) {
            return response.SecretString;
        }

        Logger.warn(`Secret ${secretName} retrieved from AWS but has no string value`);
        return undefined;

    } catch (error) {
        Logger.error(`Failed to retrieve secret ${secretName} from AWS: ${error}`);
        return undefined;
    }
}
