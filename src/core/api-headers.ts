import {ApiHeader} from "../dto/api-header";

export class ApiHeaders {
    private headers: ApiHeader[] = [];

    constructor(headers?: ApiHeader[]) {
        if (headers)
            this.headers = headers;
    }

    public getValue(key: string): string|undefined {
        for (let header of this.headers) {
            if (header.key === key)
                return header.value;
        }
        return;
    }

    public getAllValues(key: string): string[] {
        let values: string[] = [];

        for (let header of this.headers) {
            if (header.key === key)
                values.push(header.value);
        }

        return values;
    }

    public entries() {
        return this.headers;
    }

    public append(key: string, value: string) {
        this.headers.push({
            key, value
        })
    }

    public set(key: string, value: string) {
        this.headers = this.headers.filter(header => header.key !== key);
        this.append(key, value);
    }

}
