import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import users from './users.json';

const userDefinition = protoLoader.loadSync(
  path.resolve(process.cwd(), 'node_modules/@htdangkhoa/ms-grpc-proto/proto/users.proto'),
  {
    keepCase: true,
    longs: true,
    enums: true,
    arrays: true,
  },
);

const userProto = grpc.loadPackageDefinition(userDefinition);

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  getAll(_, callback) {
    return callback(null, { users });
  },
  getById({ request }, callback) {
    const user = users.find((u) => u.id === request.id);

    if (!user) return callback(new Error('User not found.'), null);

    return callback(null, { user });
  },
});

server.bindAsync('0.0.0.0:30001', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) throw error;

  console.log('Port:', port);
  server.start();
});
