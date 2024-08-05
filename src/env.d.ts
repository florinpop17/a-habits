/// <reference types="astro/client" />

interface Window {
    Alpine: import('alpinejs').Alpine;
}

declare namespace App {
    interface Locals {
        user:
            | {
                  email: string | undefined;
                  id: string;
                  credits: number;
                  // role: import("@prisma/client").Role;
                  // proTier: import("@prisma/client").ProTier | null;
              }
            | undefined;
    }
}
