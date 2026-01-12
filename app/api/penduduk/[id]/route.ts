import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const penduduk = await prisma.penduduk.findUnique({
      where: { id: parseInt(id) },
      include: {
        keluarga: true,
        suratList: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!penduduk) {
      return NextResponse.json(
        { error: "Penduduk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: penduduk });
  } catch (error) {
    console.error("Error fetching penduduk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penduduk" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const penduduk = await prisma.penduduk.update({
      where: { id: parseInt(id) },
      data: {
        nama: body.nama,
        tempatLahir: body.tempatLahir,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : undefined,
        jenisKelamin: body.jenisKelamin,
        golonganDarah: body.golonganDarah,
        agama: body.agama,
        statusPerkawinan: body.statusPerkawinan,
        pekerjaan: body.pekerjaan,
        pendidikan: body.pendidikan,
        alamat: body.alamat,
        rt: body.rt,
        rw: body.rw,
        keluargaId: body.keluargaId,
        statusKeluarga: body.statusKeluarga,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        description: `Data penduduk diperbarui - ${penduduk.nama}`,
        entityType: "penduduk",
        entityId: penduduk.id,
      },
    });

    return NextResponse.json({ data: penduduk });
  } catch (error) {
    console.error("Error updating penduduk:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data penduduk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const penduduk = await prisma.penduduk.delete({
      where: { id: parseInt(id) },
    });

    await prisma.activityLog.create({
      data: {
        action: "DELETE",
        description: `Data penduduk dihapus - ${penduduk.nama}`,
        entityType: "penduduk",
        entityId: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Penduduk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting penduduk:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data penduduk" },
      { status: 500 }
    );
  }
}
