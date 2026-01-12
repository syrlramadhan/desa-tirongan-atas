"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  KeyIcon,
  LockClosedIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function KeamananPage() {
  return (
    <div className="p-4 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 lg:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-500">Settings</span>
        <span>›</span>
        <span className="text-gray-900">Keamanan</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="p-2 lg:p-3 bg-red-500 rounded-lg">
          <ShieldCheckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Pengaturan Keamanan</h1>
      </div>

      {/* Settings */}
      <div className="space-y-4 lg:space-y-6">
        {/* Password Settings */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <KeyIcon className="w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ganti Password</h2>
          </div>
          
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Ubah Password
            </button>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Sesi Login</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
              <div>
                <div className="font-medium text-gray-900 text-sm lg:text-base">Batas Waktu Sesi</div>
                <div className="text-xs lg:text-sm text-gray-500">Logout otomatis setelah tidak aktif</div>
              </div>
              <select className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" defaultValue="60">
                <option value="15">15 menit</option>
                <option value="30">30 menit</option>
                <option value="60">1 jam</option>
                <option value="120">2 jam</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
              <div>
                <div className="font-medium text-gray-900 text-sm lg:text-base">Ingat Perangkat Ini</div>
                <div className="text-xs lg:text-sm text-gray-500">Jangan minta login ulang pada perangkat ini</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Two Factor Auth */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <LockClosedIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Autentikasi Dua Faktor</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            <div>
              <div className="font-medium text-gray-900 text-sm lg:text-base">Aktifkan 2FA</div>
              <div className="text-xs lg:text-sm text-gray-500">Tambah lapisan keamanan dengan verifikasi kode OTP</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
