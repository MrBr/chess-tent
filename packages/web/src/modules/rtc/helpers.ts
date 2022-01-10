export const buildServers = (serverURLs?: string[]) => {
  if (!serverURLs) return;

  const urls = serverURLs.map(serverURL => ({ urls: serverURL }));

  return urls;
};

export const createMessage = <T>(type: string, payload: T) => ({
  type,
  payload,
});

export const createPayload = (
  roomKey: string,
  socketID: string,
  message = null,
) => ({
  roomKey,
  socketID,
  message,
});
