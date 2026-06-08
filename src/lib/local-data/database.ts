import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { getLocalDatabasePath } from './config';

let database: Database.Database | null = null;

export function getDatabase() {
  if (database) return database;

  const databasePath = getLocalDatabasePath();
  mkdirSync(path.dirname(databasePath), { recursive: true });

  database = new Database(databasePath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  database.exec(`
    create table if not exists canvases (
      id text primary key,
      name text not null,
      nodes_json text not null,
      edges_json text not null,
      viewport_json text,
      created_at integer not null,
      updated_at integer not null
    );

    create index if not exists canvases_updated_at_idx
      on canvases (updated_at desc);

    create table if not exists assets (
      id text primary key,
      canvas_id text,
      original_name text not null,
      kind text not null,
      relative_path text not null,
      url text not null,
      mime_type text not null,
      size integer not null,
      width integer,
      height integer,
      model text,
      prompt text,
      created_at integer not null
    );

    create index if not exists assets_created_at_idx
      on assets (created_at desc);

    create index if not exists assets_canvas_id_idx
      on assets (canvas_id);
  `);

  return database;
}

