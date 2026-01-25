"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const suratTypes: Record<string, { title: string; fields: { name: string; label: string; type: string; options?: string[] }[] }> = {
  "sku": {
    title: "Surat Keterangan Usaha (SKU)",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "jenisUsaha", label: "Jenis Usaha", type: "text" },
      { name: "namaUsaha", label: "Nama Usaha", type: "text" },
      { name: "alamatUsaha", label: "Alamat Usaha", type: "textarea" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "domisili": {
    title: "Surat Keterangan Domisili",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat Domisili", type: "textarea" },
      { name: "rt", label: "RT", type: "text" },
      { name: "rw", label: "RW", type: "text" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "penghasilan": {
    title: "Surat Keterangan Penghasilan",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "penghasilan", label: "Penghasilan per Bulan (Rp)", type: "number" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "tidak-mampu": {
    title: "Surat Keterangan Tidak Mampu",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "namaOrangTua", label: "Nama Orang Tua", type: "text" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "kehilangan": {
    title: "Surat Keterangan Kehilangan",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "barangHilang", label: "Barang yang Hilang", type: "text" },
      { name: "tempatKehilangan", label: "Tempat Kehilangan", type: "text" },
      { name: "waktuKehilangan", label: "Waktu Kehilangan", type: "datetime-local" },
      { name: "keterangan", label: "Keterangan Tambahan", type: "textarea" },
    ]
  },
  "belum-pernah": {
    title: "Surat Keterangan Belum Pernah Menikah",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "beda-nama": {
    title: "Surat Keterangan Beda Nama",
    fields: [
      { name: "namaKTP", label: "Nama sesuai KTP", type: "text" },
      { name: "namaIjazah", label: "Nama sesuai Ijazah/Dokumen Lain", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "alasan", label: "Alasan Perbedaan Nama", type: "textarea" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
  "pindah-sementara": {
    title: "Surat Keterangan Pindah Sementara",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "alamatAsal", label: "Alamat Asal", type: "textarea" },
      { name: "alamatTujuan", label: "Alamat Tujuan", type: "textarea" },
      { name: "alasanPindah", label: "Alasan Pindah", type: "textarea" },
      { name: "lamaWaktu", label: "Lama Waktu (bulan)", type: "number" },
    ]
  },
  "izin-keramaian": {
    title: "Surat Keterangan Izin Keramaian",
    fields: [
      { name: "namaPemohon", label: "Nama Pemohon", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "namaAcara", label: "Nama Acara", type: "text" },
      { name: "tempatAcara", label: "Tempat Acara", type: "text" },
      { name: "tanggalAcara", label: "Tanggal Acara", type: "date" },
      { name: "waktuMulai", label: "Waktu Mulai", type: "time" },
      { name: "waktuSelesai", label: "Waktu Selesai", type: "time" },
      { name: "jumlahTamu", label: "Perkiraan Jumlah Tamu", type: "number" },
    ]
  },
};

export default function SuratKeteranganFormPage() {
  const params = useParams();
  const jenisSurat = params.jenis as string;
  const suratConfig = suratTypes[jenisSurat];
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!suratConfig) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Jenis surat tidak ditemukan</p>
          <Link href="/dashboard/pelayanan/surat-desa" className="text-blue-600 hover:underline mt-4 inline-block">
            Kembali ke Layanan Surat Desa
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-lg mx-auto">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h2>
          <p className="text-gray-600 mb-6">
            {suratConfig.title} berhasil dibuat dan siap untuk dicetak.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <PrinterIcon className="w-5 h-5" />
              Cetak Surat
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <DocumentArrowDownIcon className="w-5 h-5" />
              Unduh PDF
            </button>
          </div>
          <Link 
            href="/dashboard/pelayanan/surat-desa" 
            className="text-blue-600 hover:underline mt-6 inline-block"
          >
            Buat Surat Lainnya
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <Link href="/dashboard/pelayanan" className="hover:text-blue-600">Pelayanan</Link>
        <span>›</span>
        <Link href="/dashboard/pelayanan/surat-desa" className="hover:text-blue-600">Surat Desa</Link>
        <span>›</span>
        <span className="text-gray-900">{suratConfig.title}</span>
      </div>

      {/* Back Button */}
      <Link 
        href="/dashboard/pelayanan/surat-desa"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Kembali
      </Link>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{suratConfig.title}</h1>
          <p className="text-sm text-gray-600 mt-1">Isi formulir di bawah ini untuk membuat surat</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suratConfig.fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={3}
                    required
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Pilih {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buat Surat
            </button>
            <button
              type="button"
              onClick={() => setFormData({})}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
