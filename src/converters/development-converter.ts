import {AcadyApiRequest} from "../dto/acady-api-request";
import {AcadyApiResponse} from "../dto/acady-api-response";

export class DevelopmentConverter {

    public static convertRequest(event: any): AcadyApiRequest {
        console.log(event);
        return new AcadyApiRequest();
    }

    public static convertResponse(response: AcadyApiResponse): any {
        console.log(response);
    }
}
