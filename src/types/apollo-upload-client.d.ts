declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink } from "@apollo/client/core";

  export interface UploadLinkOptions {
    uri?: string;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
    fetch?: typeof fetch;
  }

  export default class UploadHttpLink extends ApolloLink {
    constructor(options?: UploadLinkOptions);
  }
}
