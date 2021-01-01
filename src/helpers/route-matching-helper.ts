import {ApiRoute} from "../dto/api-route";
import {AcadyApiRequest} from "../dto/acady-api-request";

export class RouteMatchingHelper {

    public static match(apiRoute: ApiRoute, apiRequest: AcadyApiRequest) {
        if (apiRoute.method !== 'ANY') {
            if (apiRoute.method !== apiRequest.method) {
                console.log("Method mismatch");
                return false;
            }
        }

        const routePathParts = apiRoute.path.split('/');
        const requestPathParts = apiRequest.pathName.split('/');

        console.log("RoutePathParts:", routePathParts);
        console.log("RequestPathParts:", requestPathParts);

        const pathParams = new Map<string, string>();

        for (let i = 1; i < routePathParts.length; i++) {
            let routePathPart: string = routePathParts[i];
            let requestPathPart: string = decodeURIComponent(requestPathParts[i]);

            if (routePathPart.startsWith(':')) {
                pathParams.set(routePathPart.substr(1), requestPathPart);
            } else if (!requestPathPart.startsWith(routePathPart)) {
                return false;
            }
        }

        apiRequest.pathParams = pathParams;
        apiRequest.routePath = apiRoute.path;

        return true;
    }
}
