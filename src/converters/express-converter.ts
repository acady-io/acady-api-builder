import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";
import {ApiHeaders} from "../core/api-headers";
import {URL} from "url";

export class ExpressConverter {

    public static convertRequest(event: any): AcadyApiRequest {

        const protocol = event.protocol;
        const hostname = event.get('host');
        const fullUrl = protocol + '://' + hostname + event.originalUrl;
        const url = new URL(fullUrl);
        const headers = new ApiHeaders();

        Object.keys(event.headers).forEach(key => {
            let value = event.headers[key];
            headers.append(key, value);
        });

        return {
            method: event.method,
            hostname: event.hostname,
            headers: headers,
            pathName: url.pathname,
            queryParams: url.searchParams,
            body: event.body,
            routePath: null,
            pathParams: null,
            endpoint: null,
            fullUrl: fullUrl
        };
    }

    public static convertResponse(acadyApiResponse: AcadyApiResponse, response: any): any {

        response.status(acadyApiResponse.status);
        for (let header of acadyApiResponse.headers.entries()) {
            console.log("Add Header " + header.key);
            response.append(header.key, header.value);
        }
        response.send(acadyApiResponse.body);
    }
}
