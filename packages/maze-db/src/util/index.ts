import * as fs from 'node:fs';
import * as path from 'node:path';


export const findMoonrepoRoot = (startDir: string = process.cwd()): string => {
    let dir: string = startDir;

    while (dir !== path.parse(dir).root) {
        const moonConfigPath: string = path.join(dir, 'README.md');
        if (fs.existsSync(moonConfigPath)) {
            return dir;
        }
        dir = path.dirname(dir);
    }

    throw new Error('Moonrepo root not found. Make sure moon.yml exists.');
}