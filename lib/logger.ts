export class Logger {
    static mask(message: string): string {
        const sensitivePatterns = [
            /(["]?password["]?)\s*[:=]\s*(?:(["'])(.*?)\2|([^"'\s]+))/gi,
            /(["]?token["]?)\s*[:=]\s*(?:(["'])(.*?)\2|([^"'\s]+))/gi,
            /(["]?secret["]?)\s*[:=]\s*(?:(["'])(.*?)\2|([^"'\s]+))/gi,
            /(["]?key["]?)\s*[:=]\s*(?:(["'])(.*?)\2|([^"'\s]+))/gi,
            /(["]?email["]?)\s*[:=]\s*(?:(["'])(.*?)\2|([^"'\s]+))/gi,
        ];

        let maskedMessage = message;
        sensitivePatterns.forEach((pattern) => {
            maskedMessage = maskedMessage.replace(pattern, (match, key, quote, quotedValue, unquotedValue) => {
                const valueToMask = quote ? quotedValue : unquotedValue;
                if (valueToMask) {
                    return match.replace(valueToMask, '****');
                }
                return match;
            });
        });

        return maskedMessage;
    }

    private static safeStringify(value: any): string {
        if (typeof value === 'string') {
            return value;
        }
        try {
            const result = JSON.stringify(value);
            return typeof result === 'string' ? result : String(value);
        } catch (error) {
            return '[Circular or Non-Serializable Object]';
        }
    }

    static log(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        const sanitizedParams = optionalParams.map(param => Logger.mask(Logger.safeStringify(param)));
        console.log(Logger.mask(message), ...sanitizedParams);
    }

    static error(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        const sanitizedParams = optionalParams.map(param => Logger.mask(Logger.safeStringify(param)));
        console.error(Logger.mask(message), ...sanitizedParams);
    }

    static warn(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        const sanitizedParams = optionalParams.map(param => Logger.mask(Logger.safeStringify(param)));
        console.warn(Logger.mask(message), ...sanitizedParams);
    }

    static info(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        const sanitizedParams = optionalParams.map(param => Logger.mask(Logger.safeStringify(param)));
        console.info(Logger.mask(message), ...sanitizedParams);
    }
}
