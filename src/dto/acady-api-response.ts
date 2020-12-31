import {ApiHeaders} from "../core/api-headers";

export class AcadyApiResponse {
    headers!: ApiHeaders;
    body: any;
    status: number;
}
