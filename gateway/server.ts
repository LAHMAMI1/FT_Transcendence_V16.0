import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';

const fastify = Fastify({ logger: true });

// Auth Service Proxy
fastify.register(httpProxy, {
  prefix: '/auth',
  upstream: 'http://auth-service:3001',
  rewritePrefix: '/auth'
});

// Management Service Proxy
fastify.register(httpProxy, {
  prefix: '/profile',
  upstream: 'http://management-service:3002',
  rewritePrefix: ''
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`API Gateway listening at ${address}`);
});
