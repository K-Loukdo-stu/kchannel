import { HttpService } from "@nestjs/axios";
import { get } from "http";
import { catchError, firstValueFrom } from "rxjs";

// create enum type for urls
export enum httpRequestUrls {
    KTALK = `http://ktalk-clusterip-srv:3000`,
    KAUTH = `http://kauth-clusterip-srv:3001`
}

// create a ts type for following function parameters
type RequestParams = {
    url: string,
    data: any,
    req: any,
    httpService: HttpService,
}

// create return type for following function
type HttpRequestAdapter = {
    get: () => Promise<any>,
    post: () => Promise<any>
}

export const httpRequestAdapter = (params: RequestParams): HttpRequestAdapter => {
    const { url, data, req, httpService } = params;
    const forwardHeaders = req.headers;
    const customConfig = { headers: { cookie: forwardHeaders['cookie'] } };
    return {
        get: async () => {
            const res = await firstValueFrom(
                httpService.get<any>(url, customConfig
                ).pipe(catchError((error: any) => { throw error.response?.data })),
            );
            return res?.data;
        },
        post: async () => {
            const res = await firstValueFrom(
                httpService.post<any>(url, data, customConfig
                ).pipe(catchError((error: any) => { throw error.response?.data })),
            );
            return res?.data;
        }
    }
}