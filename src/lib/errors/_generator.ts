import { ApolloError } from "apollo-server-express";

export const Err = ({
  code,
  message,
  messageKo,
  originError,
}: {
  code: string;
  message: string;
  messageKo: string;
  originError?: Error;
}) => new ApolloError(message, code, { code, message, messageKo, originError });
