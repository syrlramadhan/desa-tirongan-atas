import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Juni Prayitno S.IP",
      role: "admin",
      email: "admin@desatironganatas.id",
      phone: "081234567890",
    },
  });

  const kepalaDesaUser = await prisma.user.upsert({
    where: { username: "kepaladesa" },
    update: {},
    create: {
      username: "kepaladesa",
      password: await bcrypt.hash("kepala123", 10),
      name: "Ahmad Sulaiman",
      role: "kepala_desa",
      email: "kepaladesa@desatironganatas.id",
    },
  });

  const operatorUser = await prisma.user.upsert({
    where: { username: "operator" },
    update: {},
    create: {
      username: "operator",
      password: await bcrypt.hash("operator123", 10),
      name: "Siti Rahayu",
      role: "operator",
      email: "operator@desatironganatas.id",
    },
  });

  console.log("✅ Users created");

  // Create Profil Desa
  const profilDesa = await prisma.profilDesa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      namaDesa: "Tirongan Atas",
      kodeDesa: "7201010101",
      kecamatan: "Bungku Utara",
      kabupaten: "Morowali Utara",
      provinsi: "Sulawesi Tengah",
      kodePos: "94974",
      alamat: "Jl. Poros Desa Tirongan Atas, Kecamatan Bungku Utara",
      telepon: "0465-123456",
      email: "desa@tironganatas.desa.id",
      kepalaDesaNama: "Ahmad Sulaiman",
      kepalaDesaNip: "19800101200001001",
    },
  });

  console.log("✅ Profil Desa created");

  // Create Dusun
  const dusunData = [
    { nama: "Dusun 1 - Tirongan", kode: "001" },
    { nama: "Dusun 2 - Bungku", kode: "002" },
    { nama: "Dusun 3 - Morowali", kode: "003" },
    { nama: "Dusun 4 - Sulawesi", kode: "004" },
  ];

  for (const dusun of dusunData) {
    const createdDusun = await prisma.dusun.create({
      data: dusun,
    });

    // Create RW for each Dusun
    for (let rwNum = 1; rwNum <= 2; rwNum++) {
      const createdRW = await prisma.rW.create({
        data: {
          nama: `RW ${String(rwNum).padStart(2, "0")}`,
          nomor: String(rwNum).padStart(2, "0"),
          dusunId: createdDusun.id,
        },
      });

      // Create RT for each RW
      for (let rtNum = 1; rtNum <= 2; rtNum++) {
        await prisma.rT.create({
          data: {
            nama: `RT ${String(rtNum).padStart(2, "0")}`,
            nomor: String(rtNum).padStart(2, "0"),
            rwId: createdRW.id,
          },
        });
      }
    }
  }

  console.log("✅ Wilayah (Dusun, RW, RT) created");

  // Create sample Keluarga
  const dusun1 = await prisma.dusun.findFirst({ where: { kode: "001" } });
  
  const keluargaData = [
    { noKK: "7201010101000001", kepalaKeluarga: "Ahmad Sudirman", alamat: "Jl. Merdeka No. 1", rt: "01", rw: "01" },
    { noKK: "7201010101000002", kepalaKeluarga: "Budi Santoso", alamat: "Jl. Merdeka No. 2", rt: "01", rw: "01" },
    { noKK: "7201010101000003", kepalaKeluarga: "Candra Wijaya", alamat: "Jl. Merdeka No. 3", rt: "02", rw: "01" },
    { noKK: "7201010101000004", kepalaKeluarga: "Dedi Prasetyo", alamat: "Jl. Merdeka No. 4", rt: "02", rw: "01" },
    { noKK: "7201010101000005", kepalaKeluarga: "Eko Purnomo", alamat: "Jl. Merdeka No. 5", rt: "01", rw: "02" },
  ];

  const createdKeluarga = [];
  for (const kk of keluargaData) {
    const created = await prisma.keluarga.create({
      data: {
        ...kk,
        dusunId: dusun1?.id,
      },
    });
    createdKeluarga.push(created);
  }

  console.log("✅ Keluarga created");

  // Create sample Penduduk
  const pendudukData = [
    { nik: "7201010101000001", nama: "Ahmad Sudirman", tempatLahir: "Morowali", tanggalLahir: new Date("1980-05-15"), jenisKelamin: "L", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "Petani", pendidikan: "SMA", statusKeluarga: "kepala_keluarga" },
    { nik: "7201010101000002", nama: "Siti Aminah", tempatLahir: "Morowali", tanggalLahir: new Date("1985-08-20"), jenisKelamin: "P", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMA", statusKeluarga: "istri" },
    { nik: "7201010101000003", nama: "Rizki Pratama", tempatLahir: "Morowali", tanggalLahir: new Date("2005-03-10"), jenisKelamin: "L", agama: "Islam", statusPerkawinan: "Belum Kawin", pekerjaan: "Pelajar", pendidikan: "SMA", statusKeluarga: "anak" },
    { nik: "7201010101000004", nama: "Budi Santoso", tempatLahir: "Palu", tanggalLahir: new Date("1978-12-01"), jenisKelamin: "L", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "S1", statusKeluarga: "kepala_keluarga" },
    { nik: "7201010101000005", nama: "Dewi Lestari", tempatLahir: "Palu", tanggalLahir: new Date("1982-06-25"), jenisKelamin: "P", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "Guru", pendidikan: "S1", statusKeluarga: "istri" },
    { nik: "7201010101000006", nama: "Candra Wijaya", tempatLahir: "Morowali", tanggalLahir: new Date("1975-01-30"), jenisKelamin: "L", agama: "Kristen", statusPerkawinan: "Kawin", pekerjaan: "Nelayan", pendidikan: "SMP", statusKeluarga: "kepala_keluarga" },
    { nik: "7201010101000007", nama: "Maria Wijaya", tempatLahir: "Morowali", tanggalLahir: new Date("1980-04-15"), jenisKelamin: "P", agama: "Kristen", statusPerkawinan: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMP", statusKeluarga: "istri" },
    { nik: "7201010101000008", nama: "Dedi Prasetyo", tempatLahir: "Jakarta", tanggalLahir: new Date("1990-09-05"), jenisKelamin: "L", agama: "Islam", statusPerkawinan: "Belum Kawin", pekerjaan: "Karyawan Swasta", pendidikan: "S1", statusKeluarga: "kepala_keluarga" },
    { nik: "7201010101000009", nama: "Eko Purnomo", tempatLahir: "Surabaya", tanggalLahir: new Date("1988-11-20"), jenisKelamin: "L", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "PNS", pendidikan: "S1", statusKeluarga: "kepala_keluarga" },
    { nik: "7201010101000010", nama: "Fitri Handayani", tempatLahir: "Surabaya", tanggalLahir: new Date("1990-02-14"), jenisKelamin: "P", agama: "Islam", statusPerkawinan: "Kawin", pekerjaan: "Dokter", pendidikan: "S2", statusKeluarga: "istri" },
  ];

  for (let i = 0; i < pendudukData.length; i++) {
    const keluargaIndex = Math.floor(i / 2);
    await prisma.penduduk.create({
      data: {
        ...pendudukData[i],
        keluargaId: createdKeluarga[keluargaIndex]?.id,
        alamat: createdKeluarga[keluargaIndex]?.alamat,
        rt: createdKeluarga[keluargaIndex]?.rt,
        rw: createdKeluarga[keluargaIndex]?.rw,
      },
    });
  }

  console.log("✅ Penduduk created");

  // Create sample Surat
  const penduduk1 = await prisma.penduduk.findFirst({ where: { nik: "7201010101000001" } });
  const penduduk2 = await prisma.penduduk.findFirst({ where: { nik: "7201010101000004" } });
  const penduduk3 = await prisma.penduduk.findFirst({ where: { nik: "7201010101000003" } });

  const suratData = [
    { nomorSurat: "001/SKU/I/2026", jenisSurat: "sku", kategori: "keterangan", perihal: "Surat Keterangan Usaha", status: "selesai", pendudukId: penduduk1!.id },
    { nomorSurat: "002/SKD/I/2026", jenisSurat: "domisili", kategori: "keterangan", perihal: "Surat Keterangan Domisili", status: "selesai", pendudukId: penduduk2!.id },
    { nomorSurat: "003/SKTM/I/2026", jenisSurat: "tidak-mampu", kategori: "keterangan", perihal: "Surat Keterangan Tidak Mampu", status: "proses", pendudukId: penduduk1!.id },
    { nomorSurat: "004/SKCK/I/2026", jenisSurat: "skck", kategori: "pengantar", perihal: "Surat Pengantar SKCK", status: "selesai", pendudukId: penduduk3!.id },
    { nomorSurat: "005/SKU/I/2026", jenisSurat: "sku", kategori: "keterangan", perihal: "Surat Keterangan Usaha", status: "pending", pendudukId: penduduk2!.id },
  ];

  for (const surat of suratData) {
    await prisma.surat.create({
      data: {
        ...surat,
        createdById: adminUser.id,
      },
    });
  }

  console.log("✅ Surat created");

  // Create Activity Logs
  const activityData = [
    { action: "CREATE", description: "Surat Keterangan Usaha - Ahmad Sudirman", entityType: "surat", userId: adminUser.id },
    { action: "CREATE", description: "Surat Keterangan Domisili - Budi Santoso", entityType: "surat", userId: adminUser.id },
    { action: "CREATE", description: "Data penduduk baru ditambahkan - Rizki Pratama", entityType: "penduduk", userId: adminUser.id },
    { action: "UPDATE", description: "Surat Pengantar SKCK - Rizki Pratama", entityType: "surat", userId: adminUser.id },
    { action: "CREATE", description: "Surat Keterangan Tidak Mampu - Ahmad Sudirman", entityType: "surat", userId: adminUser.id },
  ];

  for (const activity of activityData) {
    await prisma.activityLog.create({
      data: activity,
    });
  }

  console.log("✅ Activity Logs created");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
