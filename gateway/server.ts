import Fastify from 'fastify';
import axios from 'axios';

const fastify = Fastify({ logger: true });

fastify.all('/auth/*', async (request, reply) => {
  try {
    const path = request.raw.url?.replace('/auth', '');
    const url = `http://auth-service:3001${path}`; // Use the service name defined in Docker Compose
    const response = await axios({
      method: request.method,
      url,
      headers: request.headers,
      data: request.body,
    });
    reply.send(response.data);
  } catch (error: any) {
    reply.code(error.response?.status || 500).send(error.response?.data || { error: error.message });
  }
});

fastify.all('/profile/*', async (request, reply) => {
  try {
    const path = request.raw.url?.replace('/profile', '');
    const url = `http://management-service:3002${path}`;
    const response = await axios({
      method: request.method,
      url,
      headers: request.headers,
      data: request.body,
    });
    reply.send(response.data);
  } catch (error: any) {
    reply.code(error.response?.status || 500).send(error.response?.data || { error: error.message });
  }
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`API Gateway listening at ${address}`);
});
