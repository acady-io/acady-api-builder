import {ApiRoute} from "../dto/api-route";
import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";
import {DevelopmentConverter} from "../converters/development-converter";
import {RouteMatchingHelper} from "../helpers/route-matching-helper";
import {ApiHeaders} from "./api-headers";
import {ExpressConverter} from "../converters/express-converter";

export class ApiBuilder {
    private apiRoutes: ApiRoute[] = [];

    public get(path: string, requestHandler: Function) {
        this.request('GET', path, requestHandler);
    }

    public post(path: string, requestHandler: Function) {
        this.request('POST', path, requestHandler);
    }

    public put(path: string, requestHandler: Function) {
        this.request('POST', path, requestHandler);
    }

    public head(path: string, requestHandler: Function) {
        this.request('POST', path, requestHandler);
    }

    public delete(path: string, requestHandler: Function) {
        this.request('DELETE', path, requestHandler);
    }

    public options(path: string, requestHandler: Function) {
        this.request('OPTIONS', path, requestHandler);
    }

    public patch(path: string, requestHandler: Function) {
        this.request('PATH', path, requestHandler);
    }

    public request(method: string, path: string, requestHandler: Function) {
        this.apiRoutes.push({
            method, path, requestHandler
        })
    }

    public async process(event: any, response: any, eventType: string) {
        let acadyRequest = this.convertRequest(event, eventType);
        let acadyResponse: AcadyApiResponse;

        try {
            let route = this.getMatchingRoute(acadyRequest);
            if (!route)
                throw new Error('No Route found!');

            acadyResponse = await route.requestHandler(acadyRequest);
        } catch (e) {
            acadyResponse = {
                headers: new ApiHeaders([]),
                body: 'Error: ' + e.message,
                status: 500
            };
        }

        this.convertResponse(acadyResponse, response, eventType);
    }

    private convertRequest(event: any, eventType: string): AcadyApiRequest {
        switch (eventType) {
            case "development":
                return DevelopmentConverter.convertRequest(event);
            case "EXPRESS":
                return ExpressConverter.convertRequest(event);
            default:
                throw new Error('EventType ' + eventType + ' not known!');
        }
    }

    private convertResponse(acadyApiResponse: AcadyApiResponse, response: any, eventType: string): any {
        switch (eventType) {
            case "development":
                return DevelopmentConverter.convertResponse(acadyApiResponse, response);
            case "EXPRESS":
                return ExpressConverter.convertResponse(acadyApiResponse, response);
            default:
                throw new Error('EventType ' + eventType + ' not known!');
        }
    }


    private getMatchingRoute(apiRequest: AcadyApiRequest): ApiRoute|undefined {
        for (let apiRoute of this.apiRoutes) {
            if (RouteMatchingHelper.match(apiRoute, apiRequest))
                return apiRoute;
        }

        return;
    }
}
