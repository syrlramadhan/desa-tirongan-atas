import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jenisSurat = searchParams.get("jenisSurat") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { nomorSurat: { contains: search } },
        { perihal: { contains: search } },
        { penduduk: { nama: { contains: search } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (jenisSurat) {
      where.jenisSurat = jenisSurat;
    }

    const [surat, total] = await Promise.all([
      prisma.surat.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          penduduk: {
            select: {
              id: true,
              nik: true,
              nama: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.surat.count({ where }),
    ]);

    return NextResponse.json({
      data: surat,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching surat:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data surat" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate nomor surat
    const year = new Date().getFullYear();
    const month = new Date().toLocaleString("default", { month: "short" }).toUpperCase();
    const count = await prisma.surat.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });

    const jenisCode = body.jenisSurat.toUpperCase().substring(0, 3);
    const nomorSurat = `${String(count + 1).padStart(3, "0")}/${jenisCode}/${month}/${year}`;

    const surat = await prisma.surat.create({
      data: {
        nomorSurat,
        jenisSurat: body.jenisSurat,
        kategori: body.kategori,
        perihal: body.perihal,
        status: "pending",
        keterangan: body.keterangan,
        dataJson: body.dataJson ? JSON.stringify(body.dataJson) : null,
        pendudukId: body.pendudukId,
        createdById: body.createdById || 1,
      },
      include: {
        penduduk: {
          select: { nama: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        description: `${body.perihal} - ${surat.penduduk.nama}`,
        entityType: "surat",
        entityId: surat.id,
        userId: body.createdById,
      },
    });

    return NextResponse.json({ data: surat }, { status: 201 });
  } catch (error) {
    console.error("Error creating surat:", error);
    return NextResponse.json(
      { error: "Gagal membuat surat" },
      { status: 500 }
    );
  }
}
