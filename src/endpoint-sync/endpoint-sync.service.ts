import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

interface DiscoveredEndpoint {
  nameOfEndpoint: string;
  module: string;
}

@Injectable()
export class EndpointScannerService implements OnModuleInit {
  private readonly logger = new Logger(EndpointScannerService.name);

  async onModuleInit() {
    await this.scanAndSync();
  }
  // Find all controller files in the src directory
  private findControllerFiles(dir: string): string[] {
    const results: string[] = [];

    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        results.push(...this.findControllerFiles(fullPath));
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.controller.ts') &&
        !entry.name.endsWith('.spec.ts')
      ) {
        results.push(fullPath);
      }
    }

    return results;
  }
  // Parse a controller file to extract endpoints and their modules
  private parseController(filePath: string): DiscoveredEndpoint[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const endpoints: DiscoveredEndpoint[] = [];

    const normalised = filePath.replace(/\\/g, '/');
    const parts = normalised.split('/');
    const module = parts[parts.length - 2];

    const controllerMatch = content.match(
      /@Controller\(\s*['"`]([^'"`]*)['"`]\s*\)/,
    );

    const controllerPrefix = controllerMatch ? '/' + controllerMatch[1] : '';

    const methods = ['Get', 'Post', 'Put', 'Patch', 'Delete'];

    const regex = new RegExp(
      `@(${methods.join('|')})\\(\\s*(?:['"\`]([^'"\`]*)['"\`])?\\s*\\)`,
      'g',
    );

    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const route = match[2] || '';

      // FIXED normalization
      const full = `${controllerPrefix}/${route}`
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');

      endpoints.push({
        nameOfEndpoint: `${method} ${full}`,
        module,
      });
    }

    return endpoints;
  }
  // Scan for endpoints and sync with the database
  private async scanAndSync() {
    const srcPath = path.resolve('./src');
    const controllers = this.findControllerFiles(srcPath);

    const discovered: DiscoveredEndpoint[] = [];

    for (const ctrl of controllers) {
      discovered.push(...this.parseController(ctrl));
    }

    this.logger.log(`Found ${discovered.length} endpoints`);
    console.log('Discovered:', discovered);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    // FIXED: public schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.endpoints (
        id SERIAL PRIMARY KEY,
        "nameOfEndpoint" VARCHAR(255) UNIQUE,
        module VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    const existing = await client.query(
      `SELECT "nameOfEndpoint" FROM public.endpoints`,
    );

    const existingSet = new Set(existing.rows.map((r) => r.nameOfEndpoint));

    console.log('Existing:', existingSet);

    let inserted = 0;

    for (const ep of discovered) {
      if (existingSet.has(ep.nameOfEndpoint)) continue;

      await client.query(
        `INSERT INTO endpoints ("nameOfEndpoint", module)
         VALUES ($1,$2)`,
        [ep.nameOfEndpoint, ep.module],
      );

      inserted++;
      this.logger.log(`Inserted ${ep.nameOfEndpoint}`);
    }

    this.logger.log(`Inserted total: ${inserted}`);

    await client.end();

    this.logger.log('Endpoint sync completed');
  }
}
