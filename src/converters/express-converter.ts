import { AcadyApiRequest } from '../dto/acady-api-request';
import { AcadyApiResponse } from '../dto/acady-api-response';
import { ApiHeaders } from '../core/api-headers';
import { URL } from 'url';

export class ExpressConverter {
  public static TYPE = 'EXPRESS';

  public static convertRequest(event: any): AcadyApiRequest {
    const protocol = event.protocol;
    const hostname = event.get('host');
    const fullUrl = protocol + '://' + hostname + event.originalUrl;
    const url = new URL(fullUrl);
    const headers = new ApiHeaders();
    const endpoint = protocol + '://' + hostname;

    Object.keys(event.headers).forEach((key) => {
      let value = event.headers[key];
      headers.append(key, value);
    });

    const queryParams: any = {};

    for (let key of url.searchParams.keys()) {
      queryParams[key] = url.searchParams.get(key);
    }

    const request: AcadyApiRequest = {
      method: event.method,
      hostname: event.hostname,
      headers: headers,
      pathName: url.pathname,
      queryParams: queryParams,
      routePath: null,
      pathParams: null,
      endpoint: endpoint,
      fullUrl: fullUrl,
      body: undefined,
      rawBody: undefined,
    };

    if (event.body) {
      let body = event.body;
      if (Buffer.isBuffer(body)) body = body.toString('utf8');
      if (
        request.headers
          ?.getValue('content-type')
          ?.startsWith('application/json') &&
        typeof body === 'string'
      ) {
        body = JSON.parse(body);
      }

      request.body = body;
      request.rawBody = event.body;
    }

    return request;
  }

  public static convertResponse(
    acadyApiResponse: AcadyApiResponse,
    response: any
  ): any {
    response.status(acadyApiResponse.status);
    for (let header of acadyApiResponse.headers.entries()) {
      response.append(header.key, header.value);
    }
    response.send(acadyApiResponse.body);
  }
}
