import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('coffee.db');

// Initialize the database with the coffee_beans table
db.exec(`
  CREATE TABLE IF NOT EXISTS coffee_beans (
    id TEXT PRIMARY KEY,
    roaster TEXT NOT NULL,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    roastLevel TEXT NOT NULL,
    notes TEXT NOT NULL,
    rank INTEGER NOT NULL,
    gramsIn REAL NOT NULL,
    mlOut REAL NOT NULL,
    brewTime INTEGER NOT NULL,
    temperature INTEGER NOT NULL,
    price REAL NOT NULL,
    weight INTEGER NOT NULL,
    orderAgain INTEGER NOT NULL,
    grindSize INTEGER NOT NULL
  )
`);

export default db;