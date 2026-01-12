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

const pengantarTypes: Record<string, { title: string; fields: { name: string; label: string; type: string; options?: string[] }[] }> = {
  "pengantar-skck": {
    title: "Surat Pengantar SKCK",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "statusPerkawinan", label: "Status Perkawinan", type: "select", options: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "pendidikan", label: "Pendidikan Terakhir", type: "select", options: ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"] },
      { name: "keperluan", label: "Keperluan SKCK", type: "textarea" },
    ]
  },
  "pengantar-ktp": {
    title: "Surat Pengantar KTP-el Baru",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "noKK", label: "Nomor Kartu Keluarga", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "alasan", label: "Alasan Pembuatan KTP Baru", type: "select", options: ["Pertama Kali", "Hilang", "Rusak", "Perubahan Data"] },
      { name: "keterangan", label: "Keterangan Tambahan", type: "textarea" },
    ]
  },
  "pengantar-kk": {
    title: "Surat Pengantar Cetak Ulang KK",
    fields: [
      { name: "namaKepalaKeluarga", label: "Nama Kepala Keluarga", type: "text" },
      { name: "noKK", label: "Nomor Kartu Keluarga", type: "text" },
      { name: "nik", label: "NIK Pemohon", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "jumlahAnggota", label: "Jumlah Anggota Keluarga", type: "number" },
      { name: "alasan", label: "Alasan Cetak Ulang", type: "select", options: ["Hilang", "Rusak", "Perubahan Data", "Penambahan Anggota", "Pengurangan Anggota"] },
      { name: "keterangan", label: "Keterangan Tambahan", type: "textarea" },
    ]
  },
  "pengantar-umum": {
    title: "Surat Pengantar Umum",
    fields: [
      { name: "nama", label: "Nama Lengkap", type: "text" },
      { name: "nik", label: "NIK", type: "text" },
      { name: "tempatLahir", label: "Tempat Lahir", type: "text" },
      { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
      { name: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { name: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"] },
      { name: "pekerjaan", label: "Pekerjaan", type: "text" },
      { name: "alamat", label: "Alamat", type: "textarea" },
      { name: "tujuan", label: "Tujuan Surat", type: "text" },
      { name: "keperluan", label: "Keperluan", type: "textarea" },
    ]
  },
};

export default function SuratPengantarFormPage() {
  const params = useParams();
  const jenisSurat = params.jenis as string;
  const suratConfig = pengantarTypes[jenisSurat];
  
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
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
        <div className="p-6 border-b border-gray-200 bg-green-50">
          <h1 className="text-xl font-bold text-gray-900">{suratConfig.title}</h1>
          <p className="text-sm text-gray-600 mt-1">Isi formulir di bawah ini untuk membuat surat pengantar</p>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Buat Surat Pengantar
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
