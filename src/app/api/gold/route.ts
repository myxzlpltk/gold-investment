import PegadaianService from "@/services/pegadaian.service";
import TreasuryService from "@/services/treasury.service";

const pegadaianService = new PegadaianService();
const treasuryService = new TreasuryService();

export async function GET() {
  try {
    const [pegadaian, treasury] = await Promise.all([
      pegadaianService.getPrice(),
      treasuryService.getPrice(),
    ]);

    return Response.json({
      status: true,
      data: { pegadaian, treasury },
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
