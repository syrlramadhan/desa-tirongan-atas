import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Parallel queries for dashboard stats
    const [
      totalPenduduk,
      pendudukLakiLaki,
      pendudukPerempuan,
      totalKeluarga,
      totalDusun,
      totalRW,
      totalRT,
      suratBulanIni,
      suratSelesai,
      suratPending,
      suratByJenis,
      recentActivities,
      profilDesa,
    ] = await Promise.all([
      prisma.penduduk.count(),
      prisma.penduduk.count({ where: { jenisKelamin: "L" } }),
      prisma.penduduk.count({ where: { jenisKelamin: "P" } }),
      prisma.keluarga.count(),
      prisma.dusun.count(),
      prisma.rW.count(),
      prisma.rT.count(),
      prisma.surat.count({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.surat.count({
        where: {
          status: "selesai",
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.surat.count({
        where: {
          status: "pending",
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.surat.groupBy({
        by: ["jenisSurat"],
        _count: { id: true },
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
      prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.profilDesa.findFirst(),
    ]);

    // Get new penduduk this month
    const pendudukBulanIni = await prisma.penduduk.count({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    return NextResponse.json({
      penduduk: {
        total: totalPenduduk,
        lakiLaki: pendudukLakiLaki,
        perempuan: pendudukPerempuan,
        pertumbuhanBulanIni: pendudukBulanIni,
      },
      keluarga: {
        total: totalKeluarga,
      },
      wilayah: {
        dusun: totalDusun,
        rw: totalRW,
        rt: totalRT,
      },
      surat: {
        totalBulanIni: suratBulanIni,
        selesai: suratSelesai,
        pending: suratPending,
        proses: suratBulanIni - suratSelesai - suratPending,
        byJenis: suratByJenis.map((s: { jenisSurat: string; _count: { id: number } }) => ({
          jenis: s.jenisSurat,
          count: s._count.id,
        })),
      },
      recentActivities: recentActivities.map((a: { id: number; action: string; description: string; entityType: string | null; createdAt: Date }) => ({
        id: a.id,
        action: a.action,
        description: a.description,
        entityType: a.entityType,
        createdAt: a.createdAt,
      })),
      profilDesa,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
