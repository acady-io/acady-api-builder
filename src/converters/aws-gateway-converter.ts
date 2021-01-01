import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";
import {ApiHeaders} from "../core/api-headers";

export class AwsGatewayConverter {

    public static convertRequest(event: any): AcadyApiRequest {
        console.log(JSON.stringify(event));

        const request = new AcadyApiRequest();
        request.method = event.method;
        request.pathName = event.rawPath;
        request.headers = new ApiHeaders();
        Object.keys(event.headers).forEach(key => {
            request.headers.append(key.toLowerCase(), event.headers[key]);
        });

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
