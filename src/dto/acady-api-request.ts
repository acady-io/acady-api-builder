import { URLSearchParams } from "url";
import {ApiHeaders} from "../core/api-headers";

export class AcadyApiRequest {
    headers!: ApiHeaders;
    method!: string;
    hostname!: string;
    pathName!: string;
    routePath!: string;
    endpoint!: string;
    queryParams!: URLSearchParams;
    pathParams!: Map<string, string>;
    body: any;
    fullUrl: string;
}
