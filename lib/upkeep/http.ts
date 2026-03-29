import { NextResponse } from "next/server";

export function ok<T>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function created<T>(body: T) {
  return NextResponse.json(body, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message,
        details
      }
    },
    { status: 400 }
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: { message } }, { status: 404 });
}

export function methodNotAllowed(method: string, allowed: string[]) {
  return NextResponse.json(
    { error: { message: `Method ${method} not allowed`, allowed } },
    {
      status: 405,
      headers: {
        Allow: allowed.join(", ")
      }
    }
  );
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

