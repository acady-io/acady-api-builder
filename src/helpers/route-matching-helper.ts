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
        const requestPathParts = apiRequest.routePath.split('/');

        const pathParams = new Map<string, string>();

        for (let i = 1; i <= routePathParts.length; i++) {
            let routePathPart: string = routePathParts[i];
            let requestPathPart: string = decodeURIComponent(requestPathParts[i]);

            if (routePathPart.startsWith(':')) {
                pathParams.set(routePathPart.substr(1), requestPathPart);
            } else if (routePathPart !== requestPathPart) {
                return false;
            }
        }

        apiRequest.pathParams = pathParams;

        return true;
    }
}
