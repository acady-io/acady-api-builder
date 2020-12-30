import {DummyService} from "../src/services/dummy-service";


test('DummyService.echo', () => {
    const input = 'Hello echo!';
    const output = DummyService.echo(input);

    expect(output).toBe(input);
});
