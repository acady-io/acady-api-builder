import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";
import {ApiHeaders} from "../core/api-headers";

export class AwsGatewayConverter {
    public static TYPE = "AWS_GATEWAY_HTTP";

    public static convertRequest(event: any): AcadyApiRequest {
        const request = new AcadyApiRequest();
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

        console.log(request);

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
    }

}
