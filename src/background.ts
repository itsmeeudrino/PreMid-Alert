import { gql, request } from "graphql-request";

const presence = gql`
  {
    presences {
      metadata {
        service
        url
      }
    }
  }
`;

export type Presence = {
  metadata: { service: string; url: string[] | string };
};

export type Response = { presences: Array<Presence> };

chrome.runtime.onInstalled.addListener(() => {
  request("https://api.premid.app/v3", presence).then((res) => {
    let value = res as Response;

    let presences: Record<string, string> = {};

    for (const pres of value.presences) {
      const urls =
        typeof pres.metadata.url == "string"
          ? [pres.metadata.url]
          : pres.metadata.url;

      for (const url of urls) presences[url] = pres.metadata.service;
    }

    chrome.storage.local.set(presences);
  });
});
