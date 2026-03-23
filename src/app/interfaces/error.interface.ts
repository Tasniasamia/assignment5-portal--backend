export interface TErrorSources {
    path: string | any;
    message: string;
}

export interface TErrorResponse {
    statusCode?: number;
    success: boolean;
    message: string;
    errorSources: TErrorSources[];
    error?: unknown;
}