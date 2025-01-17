import { z } from 'zod';

export default function errorHandler(error: any) {
  let message = error.message || "Internal server error";
  let status = error.status || "500";

  if (error instanceof z.ZodError) {
    message = error.issues[0].message;
    status = 400;
  }

  return Response.json(
    {
      message: message,
    },
    {
      status: status,
    }
  );
}
