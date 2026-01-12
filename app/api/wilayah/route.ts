import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Get all wilayah (dusun, rw, rt)
export async function GET() {
  try {
    const dusunList = await prisma.dusun.findMany({
      include: {
        rwList: {
          include: {
            rtList: true,
          },
        },
        _count: {
          select: { keluarga: true },
        },
      },
      orderBy: { nama: "asc" },
    });

    // Get total penduduk and keluarga
    const [totalPenduduk, totalKeluarga] = await Promise.all([
      prisma.penduduk.count(),
      prisma.keluarga.count(),
    ]);

    // Calculate stats
    const stats = {
      totalDusun: dusunList.length,
      totalRW: dusunList.reduce((acc, d) => acc + d.rwList.length, 0),
      totalRT: dusunList.reduce((acc, d) => acc + d.rwList.reduce((acc2, rw) => acc2 + rw.rtList.length, 0), 0),
      totalKeluarga,
      totalPenduduk,
    };

    // Transform to match frontend expected structure
    const dusun = dusunList.map(d => ({
      ...d,
      rws: d.rwList.map(rw => ({
        ...rw,
        rts: rw.rtList,
      })),
    }));

    return NextResponse.json({ dusun, stats });
  } catch (error) {
    console.error("Error fetching wilayah:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data wilayah" },
      { status: 500 }
    );
  }
}
