insert into machines (id, shop_id, manufacturer, model, nickname, serial_number, status, tags, notes, manual_ids, created_at, updated_at)
values
  (
    'machine_haas_vf2',
    'shop_demo_upkeep',
    'Haas',
    'VF-2',
    'Line 1 VF-2',
    'VF2-203411',
    'active',
    array['CNC', 'vertical-mill', 'demo'],
    'Primary demo machine for alarm E32 troubleshooting.',
    array['manual_haas_vf2_operator'],
    '2026-03-29T12:00:00Z',
    '2026-03-29T12:00:00Z'
  ),
  (
    'machine_mazak_qt200',
    'shop_demo_upkeep',
    'Mazak',
    'QT-200',
    'Turning Cell',
    'QT200-88910',
    'maintenance',
    array['CNC', 'lathe'],
    'Secondary machine for selector testing.',
    '{}',
    '2026-03-29T12:00:00Z',
    '2026-03-29T12:00:00Z'
  );

insert into manuals (id, machine_id, title, filename, source_url, pages, status, chunk_count, notes, created_at, indexed_at)
values
  (
    'manual_haas_vf2_operator',
    'machine_haas_vf2',
    'Haas VF-2 Operator Manual',
    'haas-vf2-operator-manual.pdf',
    'https://example.com/haas-vf2-operator-manual.pdf',
    412,
    'indexed',
    3,
    'Seeded manual content for E32 alarm demo.',
    '2026-03-29T12:00:00Z',
    '2026-03-29T12:00:00Z'
  );

insert into manual_chunks (id, manual_id, chunk_index, page_number, content, part_numbers, metadata, created_at)
values
  (
    'chunk_e32_1',
    'manual_haas_vf2_operator',
    0,
    214,
    'Alarm E32 indicates spindle encoder feedback mismatch. Power down, inspect the encoder cable at the spindle head and control cabinet, reseat both connectors, then clear the alarm and retest at low spindle speed.',
    array['spindle encoder cable assembly', 'encoder connector pins'],
    '{}'::jsonb,
    '2026-03-29T12:00:00Z'
  ),
  (
    'chunk_e32_2',
    'manual_haas_vf2_operator',
    1,
    215,
    'If E32 persists after reseating connectors, replace the spindle encoder cable assembly and inspect the ferrite clamp and cable routing for pinch points or abrasion.',
    array['spindle encoder cable assembly', 'ferrite clamp'],
    '{}'::jsonb,
    '2026-03-29T12:00:00Z'
  ),
  (
    'chunk_e32_3',
    'manual_haas_vf2_operator',
    2,
    216,
    'Recommended parts: spindle encoder cable assembly, ferrite clamp, and nylon cable ties. Log the fix so the next shutdown can be resolved faster.',
    array['spindle encoder cable assembly', 'ferrite clamp', 'nylon cable ties'],
    '{}'::jsonb,
    '2026-03-29T12:00:00Z'
  );

insert into maintenance_logs (id, machine_id, issue, resolution, part_numbers, source_manual_ids, created_by, created_at)
values
  (
    'log_e32_encoder_cable',
    'machine_haas_vf2',
    'Alarm E32 on Haas VF-2',
    'Reseated spindle encoder connectors, replaced the cable assembly, and cleared the alarm after a low-speed spindle test.',
    array['spindle encoder cable assembly', 'ferrite clamp'],
    array['manual_haas_vf2_operator'],
    'demo-user',
    '2026-03-18T15:22:00Z'
  );

