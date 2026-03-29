import type { StoreSnapshot } from "./types";

const now = "2026-03-29T12:00:00.000Z";

export function createSeedSnapshot(): StoreSnapshot {
  const machineId = "machine_haas_vf2";
  const manualId = "manual_haas_vf2_operator";
  const logId = "log_e32_encoder_cable";

  return {
    machines: [
      {
        id: machineId,
        shopId: "shop_demo_upkeep",
        manufacturer: "Haas",
        model: "VF-2",
        nickname: "Line 1 VF-2",
        serialNumber: "VF2-203411",
        status: "active",
        tags: ["CNC", "vertical-mill", "demo"],
        notes: "Primary demo machine for alarm E32 troubleshooting.",
        manualIds: [manualId],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "machine_mazak_qt200",
        shopId: "shop_demo_upkeep",
        manufacturer: "Mazak",
        model: "QT-200",
        nickname: "Turning Cell",
        serialNumber: "QT200-88910",
        status: "maintenance",
        tags: ["CNC", "lathe"],
        notes: "Secondary machine for selector testing.",
        manualIds: [],
        createdAt: now,
        updatedAt: now
      }
    ],
    manuals: [
      {
        id: manualId,
        machineId,
        title: "Haas VF-2 Operator Manual",
        filename: "haas-vf2-operator-manual.pdf",
        sourceUrl: "https://example.com/haas-vf2-operator-manual.pdf",
        pages: 412,
        status: "indexed",
        chunkCount: 3,
        createdAt: now,
        indexedAt: now,
        notes: "Seeded manual content for E32 alarm demo."
      }
    ],
    chunks: [
      {
        id: "chunk_e32_1",
        manualId,
        chunkIndex: 0,
        pageNumber: 214,
        content:
          "Alarm E32 indicates spindle encoder feedback mismatch. Power down, inspect the encoder cable at the spindle head and control cabinet, reseat both connectors, then clear the alarm and retest at low spindle speed.",
        partNumbers: ["spindle encoder cable assembly", "encoder connector pins"],
        createdAt: now
      },
      {
        id: "chunk_e32_2",
        manualId,
        chunkIndex: 1,
        pageNumber: 215,
        content:
          "If E32 persists after reseating connectors, replace the spindle encoder cable assembly and inspect the ferrite clamp and cable routing for pinch points or abrasion.",
        partNumbers: ["spindle encoder cable assembly", "ferrite clamp"],
        createdAt: now
      },
      {
        id: "chunk_e32_3",
        manualId,
        chunkIndex: 2,
        pageNumber: 216,
        content:
          "Recommended parts: spindle encoder cable assembly, ferrite clamp, and nylon cable ties. Log the fix so the next shutdown can be resolved faster.",
        partNumbers: ["spindle encoder cable assembly", "ferrite clamp", "nylon cable ties"],
        createdAt: now
      }
    ],
    logs: [
      {
        id: logId,
        machineId,
        issue: "Alarm E32 on Haas VF-2",
        resolution:
          "Reseated spindle encoder connectors, replaced the cable assembly, and cleared the alarm after a low-speed spindle test.",
        partNumbers: ["spindle encoder cable assembly", "ferrite clamp"],
        sourceManualIds: [manualId],
        createdAt: "2026-03-18T15:22:00.000Z",
        createdBy: "demo-user"
      }
    ],
    counters: {
      machine: 2,
      manual: 1,
      chunk: 3,
      log: 1
    }
  };
}

