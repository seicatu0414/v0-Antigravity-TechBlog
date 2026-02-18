export class Logger {
    static mask(message: string): string {
        const sensitivePatterns = [
            /password\s*[:=]\s*["']?([^"'\s]+)["']?/gi,
            /token\s*[:=]\s*["']?([^"'\s]+)["']?/gi,
            /secret\s*[:=]\s*["']?([^"'\s]+)["']?/gi,
            /key\s*[:=]\s*["']?([^"'\s]+)["']?/gi,
            /email\s*[:=]\s*["']?([^"'\s]+)["']?/gi,
        ];

        let maskedMessage = message;
        sensitivePatterns.forEach((pattern) => {
            maskedMessage = maskedMessage.replace(pattern, (match, p1) => {
                return match.replace(p1, '****');
            });
        });

        return maskedMessage;
    }

    static log(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        console.log(Logger.mask(message), ...optionalParams);
    }

    static error(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        console.error(Logger.mask(message), ...optionalParams);
    }

    static warn(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        console.warn(Logger.mask(message), ...optionalParams);
    }

    static info(message: string, ...optionalParams: any[]) {
        // eslint-disable-next-line no-console
        console.info(Logger.mask(message), ...optionalParams);
    }
}
