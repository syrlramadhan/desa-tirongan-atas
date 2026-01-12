"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

interface ProfilDesa {
  id: number;
  namaDesa: string;
  kodeDesa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  alamat: string;
  telepon: string | null;
  email: string | null;
  website: string | null;
  namaKepalaDesa: string | null;
  nipKepalaDesa: string | null;
}

export default function ProfilDesaPage() {
  const [profil, setProfil] = useState<ProfilDesa | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profil-desa");
      const data = await response.json();
      setProfil(data);
    } catch (error) {
      console.error("Error fetching profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profil) return;

    try {
      setSaving(true);
      const response = await fetch("/api/profil-desa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profil),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil desa berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan profil desa' });
      }
    } catch (error) {
      console.error("Error saving profil:", error);
      setMessage({ type: 'error', text: 'Gagal menyimpan profil desa' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChange = (field: keyof ProfilDesa, value: string) => {
    if (!profil) return;
    setProfil({ ...profil, [field]: value });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 lg:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-500">Settings</span>
        <span>›</span>
        <span className="text-gray-900">Profil Desa</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="p-2 lg:p-3 bg-blue-500 rounded-lg">
          <BuildingOfficeIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Profil Desa</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 lg:p-6">
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="w-20 h-20 lg:w-24 lg:h-24 relative border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo Desa"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Ganti Logo
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG maksimal 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Desa</label>
            <input
              type="text"
              value={profil?.namaDesa || ''}
              onChange={(e) => handleChange('namaDesa', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Desa</label>
            <input
              type="text"
              value={profil?.kodeDesa || ''}
              onChange={(e) => handleChange('kodeDesa', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
            <input
              type="text"
              value={profil?.kecamatan || ''}
              onChange={(e) => handleChange('kecamatan', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kabupaten</label>
            <input
              type="text"
              value={profil?.kabupaten || ''}
              onChange={(e) => handleChange('kabupaten', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi</label>
            <input
              type="text"
              value={profil?.provinsi || ''}
              onChange={(e) => handleChange('provinsi', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pos</label>
            <input
              type="text"
              value={profil?.kodePos || ''}
              onChange={(e) => handleChange('kodePos', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kantor Desa</label>
            <textarea
              rows={3}
              value={profil?.alamat || ''}
              onChange={(e) => handleChange('alamat', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kepala Desa</label>
            <input
              type="text"
              value={profil?.namaKepalaDesa || ''}
              onChange={(e) => handleChange('namaKepalaDesa', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIP Kepala Desa</label>
            <input
              type="text"
              value={profil?.nipKepalaDesa || ''}
              onChange={(e) => handleChange('nipKepalaDesa', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
            <input
              type="text"
              value={profil?.telepon || ''}
              onChange={(e) => handleChange('telepon', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profil?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
