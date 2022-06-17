import { ExpressConverter } from '../../src/converters/express-converter';
import { ApiBuilder } from '../../src/core/api-builder';
import { ApiHeaders } from '../../src/core/api-headers';
import { AcadyApiRequest } from '../../src/dto/acady-api-request';

describe('Api Builder Middleware', () => {
  const apiBuilder = new ApiBuilder();

  apiBuilder.any('/', (apiRequest: AcadyApiRequest) => {});

  apiBuilder.get('/123', (apiRequest: AcadyApiRequest) => {
    // Comment the return statement to get
    // Error: No one routes returned response

    return {
      status: 200,
      headers: new ApiHeaders(),
      body: { message: 'GET /123 200' },
    };
  });

  it('should run all-middleware and return response', () => {
    const event = {
      protocol: 'http',
      originalUrl: '/123',
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
      hostname: 'localhost',
      body: {
        message: 'Hello World',
      },
      get(key: string) {
        if (key === 'host') {
          return 'localhost';
        }
      },
    };

    const response = {
      status() {},
      append() {},
      send(body: any) {
        console.log('response body', body);
      },
    };

    const eventType = ExpressConverter.TYPE;

    apiBuilder.process(event, response, eventType);
  });
});
