import { ApiRoute } from '../dto/api-route';
import { AcadyApiRequest } from '../dto/acady-api-request';
import { AcadyApiResponse } from '../dto/acady-api-response';
import { RouteMatchingHelper } from '../helpers/route-matching-helper';
import { ApiHeaders } from './api-headers';
import { ExpressConverter } from '../converters/express-converter';
import { AwsGatewayConverter } from '../converters/aws-gateway-converter';

export class ApiBuilder {
  private apiRoutes: ApiRoute[] = [];

  public any(path: string, requestHandler: Function) {
    this.request('ANY', path, requestHandler);
  }

  public get(path: string, requestHandler: Function) {
    this.request('GET', path, requestHandler);
  }

  public post(path: string, requestHandler: Function) {
    this.request('POST', path, requestHandler);
  }

  public put(path: string, requestHandler: Function) {
    this.request('PUT', path, requestHandler);
  }

  public head(path: string, requestHandler: Function) {
    this.request('HEAD', path, requestHandler);
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
      method,
      path,
      requestHandler,
    });
  }

  public async processAcadyRequest(acadyRequest: AcadyApiRequest) {
    let acadyResponse: AcadyApiResponse;

    try {
      let routes = this.getBestMatchingRoutes(acadyRequest);

      if (!routes.length) {
        acadyResponse = {
          headers: new ApiHeaders([]),
          body: 'Error: Route not found',
          status: 404,
        };
      } else {
        for (const route of routes) {
          const result = await route.requestHandler(acadyRequest);
          if (result) {
            acadyResponse = result;
            break;
          }
        }

        if (!acadyResponse) {
          acadyResponse = {
            headers: new ApiHeaders([]),
            body: 'Error: No one routes returned response',
            status: 500,
          };
        }
      }
    } catch (e) {
      console.log(e);
      acadyResponse = {
        headers: new ApiHeaders([]),
        body: 'Error: ' + e.message,
        status: 500,
      };
    }

    return acadyResponse;
  }

  public async process(event: any, response: any, eventType: string) {
    let acadyResponse: AcadyApiResponse;

    try {
      let acadyRequest = this.convertRequest(event, eventType);
      acadyResponse = await this.processAcadyRequest(acadyRequest);
    } catch (e) {
      console.log(e);
      acadyResponse = {
        headers: new ApiHeaders([]),
        body: 'Error: ' + e.message,
        status: 500,
      };
    }

    this.convertResponse(acadyResponse, response, eventType);
  }

  private convertRequest(event: any, eventType: string): AcadyApiRequest {
    switch (eventType) {
      case ExpressConverter.TYPE:
        return ExpressConverter.convertRequest(event);
      case AwsGatewayConverter.TYPE:
        return AwsGatewayConverter.convertRequest(event);
      default:
        throw new Error('EventType ' + eventType + ' not known!');
    }
  }

  private convertResponse(
    acadyApiResponse: AcadyApiResponse,
    response: any,
    eventType: string
  ): any {
    switch (eventType) {
      case ExpressConverter.TYPE:
        return ExpressConverter.convertResponse(acadyApiResponse, response);
      case AwsGatewayConverter.TYPE:
        return AwsGatewayConverter.convertResponse(acadyApiResponse, response);
      default:
        throw new Error('EventType ' + eventType + ' not known!');
    }
  }

  private getBestMatchingRoutes(apiRequest: AcadyApiRequest) {
    return this.apiRoutes.filter((apiRoute) =>
      RouteMatchingHelper.match(apiRoute, apiRequest)
    );
  }
}
