import {ApiRoute} from "../dto/api-route";
import {AcadyApiRequest} from "../dto/acady-api-request";

export class RouteMatchingHelper {

    public static match(apiRoute: ApiRoute, apiRequest: AcadyApiRequest) {
        if (apiRoute.method !== 'ANY') {
            if (apiRoute.method !== apiRequest.method) {
                return false;
            }
        }

        const routePathParts = apiRoute.path.split('/');
        const requestPathParts = apiRequest.pathName.split('/');

        const pathParams = {};

        for (let i = 1; i < routePathParts.length; i++) {
            let routePathPart: string = routePathParts[i];
            let requestPathPart: string = decodeURIComponent(requestPathParts[i]);

            if (routePathPart.startsWith(':')) {
                pathParams[routePathPart.substr(1)] = requestPathPart;
            } else if (!requestPathPart.startsWith(routePathPart)) {
                return false;
            }
        }

        apiRequest.pathParams = pathParams;
        apiRequest.routePath = apiRoute.path;

        return true;
    }
}
