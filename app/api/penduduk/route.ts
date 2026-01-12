import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const jenisKelamin = searchParams.get("jenisKelamin") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nik: { contains: search } },
        { alamat: { contains: search } },
      ];
    }

    if (jenisKelamin) {
      where.jenisKelamin = jenisKelamin;
    }

    const [penduduk, total] = await Promise.all([
      prisma.penduduk.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          keluarga: {
            select: {
              noKK: true,
              kepalaKeluarga: true,
            },
          },
        },
      }),
      prisma.penduduk.count({ where }),
    ]);

    // Get stats for all penduduk (not filtered)
    const [totalAll, lakiLaki, perempuan] = await Promise.all([
      prisma.penduduk.count(),
      prisma.penduduk.count({ where: { jenisKelamin: "LAKI_LAKI" } }),
      prisma.penduduk.count({ where: { jenisKelamin: "PEREMPUAN" } }),
    ]);

    return NextResponse.json({
      penduduk,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalAll,
        lakiLaki,
        perempuan,
      },
    });
  } catch (error) {
    console.error("Error fetching penduduk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penduduk" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const existingPenduduk = await prisma.penduduk.findUnique({
      where: { nik: body.nik },
    });

    if (existingPenduduk) {
      return NextResponse.json(
        { error: "NIK sudah terdaftar" },
        { status: 400 }
      );
    }

    const penduduk = await prisma.penduduk.create({
      data: {
        nik: body.nik,
        nama: body.nama,
        tempatLahir: body.tempatLahir,
        tanggalLahir: new Date(body.tanggalLahir),
        jenisKelamin: body.jenisKelamin,
        golonganDarah: body.golonganDarah,
        agama: body.agama,
        statusPerkawinan: body.statusPerkawinan,
        pekerjaan: body.pekerjaan,
        pendidikan: body.pendidikan,
        kewarganegaraan: body.kewarganegaraan || "WNI",
        alamat: body.alamat,
        rt: body.rt,
        rw: body.rw,
        keluargaId: body.keluargaId,
        statusKeluarga: body.statusKeluarga,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `Data penduduk baru ditambahkan - ${body.nama}`,
        entityType: "penduduk",
        entityId: penduduk.id,
      },
    });

    return NextResponse.json({ data: penduduk }, { status: 201 });
  } catch (error) {
    console.error("Error creating penduduk:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data penduduk" },
      { status: 500 }
    );
  }
}
