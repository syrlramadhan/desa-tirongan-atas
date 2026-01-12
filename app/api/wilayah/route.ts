import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all wilayah (dusun, rw, rt)
export async function GET() {
  try {
    const dusunList = await prisma.dusun.findMany({
      include: {
        rws: {
          include: {
            rts: {
              include: {
                _count: {
                  select: { keluarga: true },
                },
              },
            },
          },
        },
        _count: {
          select: { keluarga: true, penduduk: true },
        },
      },
      orderBy: { nama: "asc" },
    });

    // Get total penduduk
    const totalPenduduk = await prisma.penduduk.count();

    // Calculate stats
    const stats = {
      totalDusun: dusunList.length,
      totalRW: dusunList.reduce((acc, d) => acc + d.rws.length, 0),
      totalRT: dusunList.reduce((acc, d) => acc + d.rws.reduce((acc2, rw) => acc2 + rw.rts.length, 0), 0),
      totalKeluarga: dusunList.reduce((acc, d) => acc + d._count.keluarga, 0),
      totalPenduduk,
    };

    return NextResponse.json({ dusun: dusunList, stats });
  } catch (error) {
    console.error("Error fetching wilayah:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data wilayah" },
      { status: 500 }
    );
  }
}
