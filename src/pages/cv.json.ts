import type { APIRoute } from 'astro';
import cv from '@cv';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(cv, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
