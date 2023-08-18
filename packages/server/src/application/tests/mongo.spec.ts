import mongoose from 'mongoose';
import {
  GenericContainer,
  Network,
  StartedNetwork,
  StartedTestContainer,
  Wait,
} from 'testcontainers';
import * as process from 'process';

describe('Sample Test', () => {
  let network: StartedNetwork;
  let container: StartedTestContainer;

  const dbName = process.env.DB_NAME;

  beforeAll(async () => {
    network = await new Network().start();
    container = await new GenericContainer('mongo:4.4.23')
      .withExposedPorts(27017)
      .withNetwork(network)
      .withLogConsumer(s => {
        if (!process.env.TEST_VERBOSE_LOGGING) {
          return;
        }
        s.on('data', line => console.log(line))
          .on('err', line => console.error(line))
          .on('end', () => console.log('Stream closed'));
      })
      .withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
      .withStartupTimeout(1000 * 60 * 5)
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(27017);

    await mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await container?.stop();
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });
});
