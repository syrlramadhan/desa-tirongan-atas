import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { noKK: { contains: search } },
        { kepalaKeluarga: { contains: search } },
        { alamat: { contains: search } },
      ];
    }

    const [keluarga, total] = await Promise.all([
      prisma.keluarga.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          dusun: true,
          _count: {
            select: { anggota: true },
          },
        },
      }),
      prisma.keluarga.count({ where }),
    ]);

    // Get stats
    const [totalAll, totalAnggota] = await Promise.all([
      prisma.keluarga.count(),
      prisma.penduduk.count(),
    ]);

    return NextResponse.json({
      keluarga,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalAll,
        totalAnggota,
      },
    });
  } catch (error) {
    console.error("Error fetching keluarga:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data keluarga" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const existingKeluarga = await prisma.keluarga.findUnique({
      where: { noKK: body.noKK },
    });

    if (existingKeluarga) {
      return NextResponse.json(
        { error: "No KK sudah terdaftar" },
        { status: 400 }
      );
    }

    const keluarga = await prisma.keluarga.create({
      data: {
        noKK: body.noKK,
        kepalaKeluarga: body.kepalaKeluarga,
        alamat: body.alamat,
        rt: body.rt,
        rw: body.rw,
        dusunId: body.dusunId,
        kodePos: body.kodePos,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `Data keluarga baru ditambahkan - ${body.kepalaKeluarga}`,
        entityType: "keluarga",
        entityId: keluarga.id,
      },
    });

    return NextResponse.json({ data: keluarga }, { status: 201 });
  } catch (error) {
    console.error("Error creating keluarga:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data keluarga" },
      { status: 500 }
    );
  }
}
