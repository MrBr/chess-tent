import mongoose from 'mongoose';
import { GenericContainer, Network, StartedNetwork, StartedTestContainer, Wait } from 'testcontainers';
import * as process from 'process';

describe('Sample Test', () => {

  let network: StartedNetwork;
  let container: StartedTestContainer;

  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017"
  const dbName = process.env.DB_URL || "chessTent"

  beforeAll(async () => {
    network = await new Network().start()
    container = await new GenericContainer('mongo:4.4.23')
      .withExposedPorts(27017)
      .withNetwork(network)
      .withLogConsumer((s) => console.log(s))
      .withWaitStrategy(Wait.forLogMessage('waiting for connections on port 27017'))
      .withStartupTimeout(1000 * 60 * 5)
      .start();


    await mongoose.connect(`${dbUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await container?.stop();
  })

  it('should pass', () => {
    expect(true).toBe(true);
  });

});