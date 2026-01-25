import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

// Create new wilayah (dusun, rw, or rt)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "dusun") {
      const dusun = await prisma.dusun.create({
        data: {
          nama: body.nama,
          kode: body.kode || null,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          description: `Dusun baru ditambahkan - ${body.nama}`,
          entityType: "dusun",
          entityId: dusun.id,
        },
      });

      return NextResponse.json({ data: dusun }, { status: 201 });
    }

    if (type === "rw") {
      const rw = await prisma.rW.create({
        data: {
          nama: body.nama,
          nomor: body.nomor,
          ketua: body.ketua || null,
          dusunId: body.dusunId,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          description: `RW baru ditambahkan - ${body.nama}`,
          entityType: "rw",
          entityId: rw.id,
        },
      });

      return NextResponse.json({ data: rw }, { status: 201 });
    }

    if (type === "rt") {
      const rt = await prisma.rT.create({
        data: {
          nama: body.nama,
          nomor: body.nomor,
          ketua: body.ketua || null,
          rwId: body.rwId,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          description: `RT baru ditambahkan - ${body.nama}`,
          entityType: "rt",
          entityId: rt.id,
        },
      });

      return NextResponse.json({ data: rt }, { status: 201 });
    }

    return NextResponse.json(
      { error: "Tipe wilayah tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating wilayah:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data wilayah" },
      { status: 500 }
    );
  }
}
