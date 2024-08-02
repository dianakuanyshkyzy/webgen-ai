import prisma from "@/lib/db";

export async function GET(request: Request) {
  const queryParameters = request.url.split("?")[1];
  const id = new URLSearchParams(queryParameters).get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id parameter" }), {
      status: 400,
    });
  }
  const wishData = await prisma.wish.findUnique({
    where: {
      id: id,
    },
  });
  if (wishData) {
    return new Response(JSON.stringify(wishData), {
      status: 200,
    });
  }
  return new Response(JSON.stringify({ error: "Wish not found" }), {
    status: 404,
  });
}
