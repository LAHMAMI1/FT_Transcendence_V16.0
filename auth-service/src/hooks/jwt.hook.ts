import { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  }
  catch (error) {
    reply.send({ message: "Unauthorized" });
  }
}