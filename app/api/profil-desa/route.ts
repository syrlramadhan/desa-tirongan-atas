import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const profilDesa = await prisma.profilDesa.findFirst();

    if (!profilDesa) {
      return NextResponse.json(
        { error: "Profil desa tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: profilDesa });
  } catch (error) {
    console.error("Error fetching profil desa:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil desa" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let profilDesa = await prisma.profilDesa.findFirst();

    if (profilDesa) {
      profilDesa = await prisma.profilDesa.update({
        where: { id: profilDesa.id },
        data: {
          namaDesa: body.namaDesa,
          kodeDesa: body.kodeDesa,
          kecamatan: body.kecamatan,
          kabupaten: body.kabupaten,
          provinsi: body.provinsi,
          kodePos: body.kodePos,
          alamat: body.alamat,
          telepon: body.telepon,
          email: body.email,
          website: body.website,
          kepalaDesaNama: body.kepalaDesaNama,
          kepalaDesaNip: body.kepalaDesaNip,
        },
      });
    } else {
      profilDesa = await prisma.profilDesa.create({
        data: {
          namaDesa: body.namaDesa,
          kodeDesa: body.kodeDesa,
          kecamatan: body.kecamatan,
          kabupaten: body.kabupaten,
          provinsi: body.provinsi,
          kodePos: body.kodePos,
          alamat: body.alamat,
          telepon: body.telepon,
          email: body.email,
          website: body.website,
          kepalaDesaNama: body.kepalaDesaNama,
          kepalaDesaNip: body.kepalaDesaNip,
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        description: "Profil desa diperbarui",
        entityType: "profil_desa",
        entityId: profilDesa.id,
      },
    });

    return NextResponse.json({ data: profilDesa });
  } catch (error) {
    console.error("Error updating profil desa:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil desa" },
      { status: 500 }
    );
  }
}
