"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  HomeModernIcon,
  MapIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
  penduduk: {
    total: number;
    lakiLaki: number;
    perempuan: number;
    pertumbuhanBulanIni: number;
  };
  keluarga: {
    total: number;
  };
  wilayah: {
    dusun: number;
    rw: number;
    rt: number;
  };
  surat: {
    totalBulanIni: number;
    selesai: number;
    pending: number;
    proses: number;
    byJenis: { jenis: string; count: number }[];
  };
  recentActivities: {
    id: number;
    action: string;
    description: string;
    entityType: string;
    createdAt: string;
  }[];
  profilDesa: {
    namaDesa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
  } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">Gagal memuat data dashboard</p>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Selamat Datang di Sistem Administrasi Desa
        </h1>
        <div className="text-gray-700">
          <p className="text-lg font-semibold text-blue-700">
            Desa {stats.profilDesa?.namaDesa || "Tirongan Atas"}
          </p>
          <p className="text-sm text-gray-600">
            Kecamatan {stats.profilDesa?.kecamatan || "Bungku Utara"}, Kabupaten {stats.profilDesa?.kabupaten || "Morowali Utara"}, Provinsi {stats.profilDesa?.provinsi || "Sulawesi Tengah"}
          </p>
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.penduduk.total.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Total Penduduk</div>
            </div>
            <UsersIcon className="w-12 h-12 text-blue-200" />
          </div>
          <div className="mt-3 flex items-center text-xs text-blue-100">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            +{stats.penduduk.pertumbuhanBulanIni} bulan ini
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.keluarga.total}</div>
              <div className="text-green-100 text-sm">Kepala Keluarga</div>
            </div>
            <HomeModernIcon className="w-12 h-12 text-green-200" />
          </div>
          <div className="mt-3 text-xs text-green-100">
            {stats.keluarga.total} KK terdaftar
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.wilayah.dusun}</div>
              <div className="text-purple-100 text-sm">Dusun</div>
            </div>
            <MapIcon className="w-12 h-12 text-purple-200" />
          </div>
          <div className="mt-3 text-xs text-purple-100">
            {stats.wilayah.rw} RW, {stats.wilayah.rt} RT
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.surat.totalBulanIni}</div>
              <div className="text-orange-100 text-sm">Surat Bulan Ini</div>
            </div>
            <DocumentTextIcon className="w-12 h-12 text-orange-200" />
          </div>
          <div className="mt-3 text-xs text-orange-100">
            {stats.surat.selesai} selesai, {stats.surat.pending} pending
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Data Penduduk Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            Data Penduduk
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Laki-laki</span>
              <span className="font-semibold text-gray-900">{stats.penduduk.lakiLaki} orang</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Perempuan</span>
              <span className="font-semibold text-gray-900">{stats.penduduk.perempuan} orang</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-blue-600">{stats.penduduk.total.toLocaleString()} orang</span>
            </div>
          </div>
          {/* Gender Chart */}
          <div className="mt-4">
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
              <div 
                className="bg-blue-500" 
                style={{ width: `${(stats.penduduk.lakiLaki / stats.penduduk.total) * 100}%` }}
              ></div>
              <div 
                className="bg-pink-500" 
                style={{ width: `${(stats.penduduk.perempuan / stats.penduduk.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Laki-laki ({((stats.penduduk.lakiLaki / stats.penduduk.total) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span> Perempuan ({((stats.penduduk.perempuan / stats.penduduk.total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Pelayanan Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-green-600" />
            Pelayanan Bulan Ini
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Surat Selesai</span>
              <span className="font-semibold text-gray-900">{stats.surat.selesai}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Surat Proses</span>
              <span className="font-semibold text-gray-900">{stats.surat.proses}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Surat Pending</span>
              <span className="font-semibold text-gray-900">{stats.surat.pending}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.surat.totalBulanIni}
              </div>
              <div className="text-sm text-gray-500">Total Surat Bulan Ini</div>
            </div>
          </div>
        </div>

        {/* Surat Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-orange-600" />
            Status Surat
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.surat.selesai}</div>
              <div className="text-xs text-green-600">Selesai</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <ExclamationCircleIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.surat.pending}</div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Jenis Surat</h3>
            <div className="space-y-2">
              {stats.surat.byJenis.slice(0, 3).map((item) => (
                <div key={item.jenis} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{item.jenis.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${stats.surat.totalBulanIni > 0 ? (item.count / stats.surat.totalBulanIni) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-gray-900 font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
            Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.action === "CREATE" ? "bg-green-500" : 
                    activity.action === "UPDATE" ? "bg-blue-500" : "bg-red-500"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.action === "CREATE" ? "bg-green-100 text-green-700" : 
                    activity.action === "UPDATE" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                  }`}>
                    {activity.entityType}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada aktivitas terbaru</p>
            )}
          </div>
        </div>

        {/* Wilayah Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-purple-600" />
            Data Wilayah
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.wilayah.dusun}</div>
              <div className="text-xs text-purple-600">Dusun</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.wilayah.rw}</div>
              <div className="text-xs text-blue-600">RW</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.wilayah.rt}</div>
              <div className="text-xs text-green-600">RT</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Dusun 1 - Tirongan</span>
              <span className="text-xs text-gray-500">2 RW, 4 RT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Dusun 2 - Bungku</span>
              <span className="text-xs text-gray-500">2 RW, 4 RT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Dusun 3 - Morowali</span>
              <span className="text-xs text-gray-500">2 RW, 4 RT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Dusun 4 - Sulawesi</span>
              <span className="text-xs text-gray-500">2 RW, 4 RT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
