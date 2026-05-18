const STORE_URL = "https://jsonblob.com/api/jsonBlob/019de51c-4b92-7fa8-9163-85a0114aa79b";

function normalizeSharedState(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    participants: Array.isArray(source.participants) ? source.participants : [],
    adminPasswordHashV2: source.adminPasswordHashV2 || source.adminPasswordHash || "",
    announcement: source.announcement || null,
    deletedParticipantIds: Array.isArray(source.deletedParticipantIds)
      ? source.deletedParticipantIds
      : [],
    allowEmptyParticipants: Boolean(source.allowEmptyParticipants),
  };
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method === "GET") {
    const storeResponse = await fetch(STORE_URL, {
      headers: { Accept: "application/json" },
    });

    if (!storeResponse.ok) {
      response.status(502).json({ error: "Не удалось загрузить общую доску." });
      return;
    }

    response.status(200).json(normalizeSharedState(await storeResponse.json()));
    return;
  }

  if (request.method === "PUT" || request.method === "POST") {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const data = normalizeSharedState(body);
    const currentResponse = await fetch(STORE_URL, {
      headers: { Accept: "application/json" },
    });
    const currentData = currentResponse.ok
      ? normalizeSharedState(await currentResponse.json())
      : { participants: [], adminPasswordHashV2: "", announcement: null, deletedParticipantIds: [] };
    const deletedIds = new Set([
      ...currentData.deletedParticipantIds,
      ...data.deletedParticipantIds,
    ]);

    data.deletedParticipantIds = [...deletedIds];
    data.participants = data.participants.filter(
      (participant) =>
        !deletedIds.has(participant.id) &&
        !deletedIds.has(String(participant.name || "").toLowerCase()),
    );

    if (!data.allowEmptyParticipants && data.participants.length === 0 && currentData.participants.length > 0) {
      data.participants = currentData.participants.filter(
        (participant) =>
          !deletedIds.has(participant.id) &&
          !deletedIds.has(String(participant.name || "").toLowerCase()),
      );
    }

    const storeResponse = await fetch(STORE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!storeResponse.ok) {
      response.status(502).json({ error: "Не удалось сохранить общую доску." });
      return;
    }

    response.status(200).json(normalizeSharedState(await storeResponse.json()));
    return;
  }

  response.setHeader("Allow", "GET, PUT, POST, OPTIONS");
  response.status(405).json({ error: "Метод не поддерживается." });
};
