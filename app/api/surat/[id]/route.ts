import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surat = await prisma.surat.findUnique({
      where: { id: parseInt(id) },
      include: {
        penduduk: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!surat) {
      return NextResponse.json(
        { error: "Surat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: surat });
  } catch (error) {
    console.error("Error fetching surat:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data surat" },
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

    const surat = await prisma.surat.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
        keterangan: body.keterangan,
        dataJson: body.dataJson ? JSON.stringify(body.dataJson) : undefined,
      },
      include: {
        penduduk: {
          select: { nama: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE",
        description: `Status surat diperbarui - ${surat.penduduk.nama} (${body.status})`,
        entityType: "surat",
        entityId: surat.id,
      },
    });

    return NextResponse.json({ data: surat });
  } catch (error) {
    console.error("Error updating surat:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui surat" },
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
    const surat = await prisma.surat.delete({
      where: { id: parseInt(id) },
    });

    await prisma.activityLog.create({
      data: {
        action: "DELETE",
        description: `Surat dihapus - ${surat.nomorSurat}`,
        entityType: "surat",
        entityId: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Surat berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting surat:", error);
    return NextResponse.json(
      { error: "Gagal menghapus surat" },
      { status: 500 }
    );
  }
}
