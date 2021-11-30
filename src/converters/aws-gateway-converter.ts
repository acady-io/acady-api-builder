import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";
import {ApiHeaders} from "../core/api-headers";
import {URLSearchParams} from "url";

export class AwsGatewayConverter {
    public static TYPE = "AWS_GATEWAY_HTTP";

    public static convertRequest(event: any): AcadyApiRequest {
        const request = new AcadyApiRequest();
        if (event.version === "1.0") {
            request.method = event.httpMethod;
            request.pathName = '/' + event.pathParameters.proxy;
            request.headers = new ApiHeaders();
            request.queryParams = event.queryStringParameters;
            if (event.multiValueHeaders)
                Object.keys(event.multiValueHeaders).forEach(key => {
                    const values: string[] = event.multiValueHeaders[key];
                    for (let value of values) {
                        request.headers.append(key.toLowerCase(), value);
                    }
                });
            request.endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

            const urlSearchParams = new URLSearchParams();
            if (event.multiValueQueryStringParameters)
                Object.keys(event.multiValueQueryStringParameters).forEach(key => {
                    const values: string[] = event.multiValueQueryStringParameters[key];
                    for (let value of values) {
                        urlSearchParams.append(key, value);
                    }
                });

            request.fullUrl = request.endpoint + request.pathName;
            if (urlSearchParams.toString().length > 0)
                request.fullUrl += '?' + urlSearchParams.toString();

            // console.log(request);
        } else if (event.version === "2.0") {
            request.method = event.requestContext.http.method;
            request.pathName = '/' + event.pathParameters.proxy;
            request.headers = new ApiHeaders();
            request.queryParams = event.queryStringParameters;
            Object.keys(event.headers).forEach(key => {
                request.headers.append(key.toLowerCase(), event.headers[key]);
            });
            request.endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
            request.fullUrl = request.endpoint + request.pathName;
            if (event.rawQueryString.length > 0)
                request.fullUrl += '?' + event.rawQueryString;

            // console.log(request);
        }

        if (event.body) {
            let body = event.body;
            if (request.headers.getValue('content-type').startsWith('application/json')) {
                body = JSON.parse(body);
            }

            request.body = body;
            request.rawBody = event.body;
        }


        return request;
    }

    public static convertResponse(acadyApiResponse: AcadyApiResponse, response: any): any {
        response.statusCode = acadyApiResponse.status;
        response.multiValueHeaders = {};
        for (let apiHeader of acadyApiResponse.headers.entries()) {
            const key = apiHeader.key;
            const value = apiHeader.value;

            if (!response.multiValueHeaders[key])
                response.multiValueHeaders[key] = [];

            response.multiValueHeaders[key].push(value);
        }
        response.body = acadyApiResponse.body;

        if (acadyApiResponse.isBase64Encoded === true) {
            response.isBase64Encoded = true;
        }
    }

}
