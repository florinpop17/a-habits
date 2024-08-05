import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import node from '@astrojs/node';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    integrations: [alpinejs(), tailwind({})],
    output: 'server',
    adapter: node({
        mode: 'standalone',
    }),
});
