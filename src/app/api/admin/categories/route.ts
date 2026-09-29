import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return Response.json({
      categories,
    });
  } catch (error) {
    console.error(
      "ADMIN CATEGORIES ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to load categories.",
      },
      { status: 500 }
    );
  }
}